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
        """Publish a task to the available queue."""
        if not self.js:
            raise RuntimeError("Not connected to NATS")

        subject = self._get_subject(f"tasks.{task.status}")

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

        logger.info(f"Published task {task.task_id} to {subject} (seq: {ack.seq})")

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
        """Get tasks from the queue."""
        if not self.js:
            raise RuntimeError("Not connected to NATS")

        tasks = []

        if status:
            subject = self._get_subject(f"tasks.{status}")
        else:
            subject = self._get_subject("tasks.>")

        try:
            # Create ephemeral consumer
            psub = await self.js.pull_subscribe(
                subject,
                durable=None,
                stream=self.STREAM_NAME
            )

            try:
                fetched = await psub.fetch(limit, timeout=2)

                for msg in fetched:
                    try:
                        data = json.loads(msg.data.decode())
                        # Parse datetime strings
                        data['created_at'] = datetime.fromisoformat(data['created_at'])
                        if data.get('claimed_at'):
                            data['claimed_at'] = datetime.fromisoformat(data['claimed_at'])
                        if data.get('completed_at'):
                            data['completed_at'] = datetime.fromisoformat(data['completed_at'])

                        tasks.append(Task(**data))
                        await msg.ack()
                    except Exception as e:
                        logger.error(f"Error parsing task: {e}")
                        continue

            except TimeoutError:
                # No messages or fewer than requested
                pass
            finally:
                await psub.unsubscribe()

        except Exception as e:
            logger.error(f"Error fetching tasks: {e}")
            raise

        return tasks

    async def get_messages(
        self,
        channel: ChannelType,
        limit: int = 100
    ) -> list[Message]:
        """Get messages from a channel."""
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
                fetched = await psub.fetch(limit, timeout=2)

                for msg in fetched:
                    try:
                        data = json.loads(msg.data.decode())
                        data['timestamp'] = datetime.fromisoformat(data['timestamp'])
                        messages.append(Message(**data))
                        await msg.ack()
                    except Exception as e:
                        logger.error(f"Error parsing message: {e}")
                        continue

            except TimeoutError:
                pass
            finally:
                await psub.unsubscribe()

        except Exception as e:
            logger.error(f"Error fetching messages from {channel}: {e}")
            raise

        return messages

    async def stream_tasks(self, status: Optional[TaskStatus] = None) -> AsyncIterator[Task]:
        """Stream tasks in real-time."""
        if not self.js:
            raise RuntimeError("Not connected to NATS")

        if status:
            subject = self._get_subject(f"tasks.{status}")
        else:
            subject = self._get_subject("tasks.>")

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

                    yield Task(**data)
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
