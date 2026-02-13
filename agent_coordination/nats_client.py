"""NATS JetStream client for agent coordination."""

import json
import asyncio
from typing import Optional, AsyncIterator
from datetime import datetime
from nats.aio.client import Client as NATS
from nats.js.api import StreamConfig
from nats.js import JetStreamContext
import logging

from models import Task, Message, TaskStatus, ChannelType

logger = logging.getLogger(__name__)


class NATSCoordinationClient:
    """NATS JetStream client for agent coordination and task queue."""

    STREAM_NAME = "MJ_ONLINE_WORK"
    SUBJECT_PREFIX = "mjwork"

    def __init__(self, nats_url: str = "nats://localhost:4222"):
        self.nats_url = nats_url
        self.nc: Optional[NATS] = None
        self.js: Optional[JetStreamContext] = None

    async def connect(self):
        """Connect to NATS server."""
        try:
            self.nc = NATS()
            await self.nc.connect(self.nats_url)
            self.js = self.nc.jetstream()
            logger.info("Connected to NATS server")

            # Verify stream exists
            try:
                await self.js.stream_info(self.STREAM_NAME)
                logger.info(f"Stream {self.STREAM_NAME} verified")
            except Exception as e:
                logger.error(f"Stream {self.STREAM_NAME} not found: {e}")
                raise

        except Exception as e:
            logger.error(f"Failed to connect to NATS: {e}")
            raise

    async def disconnect(self):
        """Disconnect from NATS server."""
        if self.nc:
            await self.nc.close()
            logger.info("Disconnected from NATS")

    def _get_subject(self, channel: str) -> str:
        """Get NATS subject for a channel."""
        return f"{self.SUBJECT_PREFIX}.{channel}"

    async def publish_task(self, task: Task) -> dict:
        """Publish a task to the tasks subject (single subject architecture)."""
        if not self.js:
            raise RuntimeError("Not connected to NATS")

        # FIX #1: Publish ALL task updates to single subject regardless of status
        # This allows deduplicator to see all versions of a task
        subject = self._get_subject("tasks")

        # Prepare task payload
        payload = task.model_dump(mode='json')
        payload['created_at'] = task.created_at.isoformat()
        if task.claimed_at:
            payload['claimed_at'] = task.claimed_at.isoformat()
        if task.completed_at:
            payload['completed_at'] = task.completed_at.isoformat()

        # Publish to JetStream
        ack = await self.js.publish(
            subject,
            json.dumps(payload).encode()
        )

        logger.info(f"Published task {task.task_id} (status={task.status}) to {subject} (seq: {ack.seq})")

        return {
            "sequence": ack.seq,
            "stream": ack.stream,
            "timestamp": task.created_at
        }

    async def publish_message(self, message: Message) -> dict:
        """Publish a message to a channel."""
        if not self.js:
            raise RuntimeError("Not connected to NATS")

        subject = self._get_subject(message.channel)

        # Prepare message payload
        payload = {
            "agent_id": message.agent_id,
            "channel": message.channel,
            "content": message.content,
            "timestamp": message.timestamp.isoformat()
        }

        # Publish to JetStream
        ack = await self.js.publish(
            subject,
            json.dumps(payload).encode()
        )

        logger.info(f"Published message to {subject} (seq: {ack.seq})")

        return {
            "sequence": ack.seq,
            "stream": ack.stream,
            "timestamp": message.timestamp
        }

    async def get_tasks(
        self,
        status: Optional[TaskStatus] = None,
        limit: int = 100
    ) -> list[Task]:
        """Get tasks from the queue (fetches all, filters by status in memory)."""
        if not self.js:
            raise RuntimeError("Not connected to NATS")

        tasks = []

        # FIX #1: Fetch from BOTH new single subject AND old status-based subjects
        # This ensures backward compatibility during migration period
        # New messages go to "mjwork.tasks", old messages are on "mjwork.tasks.{status}"
        # Note: We need to query BOTH "tasks" and "tasks.*" separately since "tasks.>" doesn't match "tasks"
        # We'll fetch from both and combine them

        async def fetch_from_subject(subject_pattern: str) -> list[Task]:
            """Helper to fetch tasks from a subject."""
            subject_tasks = []
            try:
                psub = await self.js.pull_subscribe(
                    subject_pattern,
                    durable=None,
                    stream=self.STREAM_NAME
                )

                try:
                    # Fetch ALL tasks in batches
                    batch_size = 500
                    max_messages = 10000  # Safety limit
                    total_fetched = 0

                    while total_fetched < max_messages:
                        try:
                            batch = await psub.fetch(batch_size, timeout=2)
                            if not batch:
                                break

                            for msg in batch:
                                try:
                                    data = json.loads(msg.data.decode())
                                    # Parse datetime strings
                                    data['created_at'] = datetime.fromisoformat(data['created_at'])
                                    if data.get('claimed_at'):
                                        data['claimed_at'] = datetime.fromisoformat(data['claimed_at'])
                                    if data.get('completed_at'):
                                        data['completed_at'] = datetime.fromisoformat(data['completed_at'])

                                    subject_tasks.append(Task(**data))
                                    await msg.ack()
                                except Exception as e:
                                    logger.error(f"Error parsing task: {e}")
                                    continue

                            total_fetched += len(batch)

                            if len(batch) < batch_size:
                                break

                        except TimeoutError:
                            break

                except TimeoutError:
                    pass
                finally:
                    await psub.unsubscribe()

            except Exception as e:
                logger.error(f"Error fetching from {subject_pattern}: {e}")
                # Don't raise - continue with other subjects

            return subject_tasks

        try:
            # Fetch from NEW single subject (mjwork.tasks)
            new_tasks = await fetch_from_subject(self._get_subject("tasks"))
            tasks.extend(new_tasks)
            logger.info(f"Fetched {len(new_tasks)} tasks from new subject (mjwork.tasks)")

            # Fetch from OLD status-based subjects (mjwork.tasks.*)
            old_tasks = await fetch_from_subject(self._get_subject("tasks.>"))
            tasks.extend(old_tasks)
            logger.info(f"Fetched {len(old_tasks)} tasks from old subjects (mjwork.tasks.*)")

        except Exception as e:
            logger.error(f"Error fetching tasks: {e}")
            raise

        # Filter by status if requested (after fetching all)
        # The deduplicator in server.py will handle removing duplicate task_ids
        # and we filter by status here in memory after seeing all versions
        if status:
            tasks = [task for task in tasks if task.status == status]

        logger.info(f"Fetched {len(tasks)} tasks from tasks.> (status filter: {status or 'all'})")

        return tasks

    async def get_messages(
        self,
        channel: ChannelType,
        limit: int = 100
    ) -> list[Message]:
        """Get messages from a channel (returns MOST RECENT messages, not oldest)."""
        if not self.js:
            raise RuntimeError("Not connected to NATS")

        messages = []
        subject = self._get_subject(channel)

        try:
            psub = await self.js.pull_subscribe(
                subject,
                durable=None,
                stream=self.STREAM_NAME
            )

            try:
                # FIX #2: Fetch ALL messages (not just first 100) to get recent ones
                # Old code: fetched = await psub.fetch(limit, timeout=2)
                # This only got the FIRST 100 messages (oldest), not LAST 100 (newest)

                # Fetch all messages in batches
                batch_size = 500
                max_messages = 10000  # Safety limit
                total_fetched = 0

                while total_fetched < max_messages:
                    try:
                        batch = await psub.fetch(batch_size, timeout=2)
                        if not batch:
                            break

                        for msg in batch:
                            try:
                                data = json.loads(msg.data.decode())
                                data['timestamp'] = datetime.fromisoformat(data['timestamp'])
                                messages.append(Message(**data))
                                await msg.ack()
                            except Exception as e:
                                logger.error(f"Error parsing message: {e}")
                                continue

                        total_fetched += len(batch)

                        # If we got fewer than requested, we've reached the end
                        if len(batch) < batch_size:
                            break

                    except TimeoutError:
                        # No more messages
                        break

                # Return LAST N messages (most recent), not first N (oldest)
                messages = messages[-limit:]

            except TimeoutError:
                pass
            finally:
                await psub.unsubscribe()

        except Exception as e:
            logger.error(f"Error fetching messages from {channel}: {e}")
            raise

        logger.info(f"Returning {len(messages)} most recent messages from {channel}")

        return messages

    async def stream_tasks(self, status: Optional[TaskStatus] = None) -> AsyncIterator[Task]:
        """Stream tasks in real-time (from single tasks subject)."""
        if not self.js:
            raise RuntimeError("Not connected to NATS")

        # Use single "tasks" subject (matches publish_task fix)
        subject = self._get_subject("tasks")

        sub = await self.js.subscribe(subject)

        try:
            async for msg in sub.messages:
                try:
                    data = json.loads(msg.data.decode())
                    data['created_at'] = datetime.fromisoformat(data['created_at'])
                    if data.get('claimed_at'):
                        data['claimed_at'] = datetime.fromisoformat(data['claimed_at'])
                    if data.get('completed_at'):
                        data['completed_at'] = datetime.fromisoformat(data['completed_at'])

                    # Filter by status if requested (in memory, after seeing all)
                    task = Task(**data)
                    if status is None or task.status == status:
                        yield task
                    await msg.ack()
                except Exception as e:
                    logger.error(f"Error parsing streamed task: {e}")
                    continue
        finally:
            await sub.unsubscribe()

    async def stream_messages(self, channel: ChannelType) -> AsyncIterator[Message]:
        """Stream messages in real-time from a channel."""
        if not self.js:
            raise RuntimeError("Not connected to NATS")

        subject = self._get_subject(channel)
        sub = await self.js.subscribe(subject)

        try:
            async for msg in sub.messages:
                try:
                    data = json.loads(msg.data.decode())
                    data['timestamp'] = datetime.fromisoformat(data['timestamp'])
                    yield Message(**data)
                    await msg.ack()
                except Exception as e:
                    logger.error(f"Error parsing streamed message: {e}")
                    continue
        finally:
            await sub.unsubscribe()
