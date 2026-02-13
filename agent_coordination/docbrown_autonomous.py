#!/usr/bin/env python3
"""
Doc Brown - Autonomous HTML Assembler

Runs continuously, listening for HTML conversion tasks via NATS.
When a task arrives, automatically converts PAGE_SPEC to semantic HTML.

TRUE AUTONOMY - No human input required!
"""

import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient
import asyncio
import re
import os
from pathlib import Path
from datetime import datetime

class HTMLConverter:
    """
    Converts PAGE_SPEC format to clean semantic HTML.

    Scientific precision - mechanical translation only.
    """

    def __init__(self, page_spec_content: str, image_urls: dict = None):
        self.spec_content = page_spec_content
        self.image_urls = image_urls or {}

    def convert(self) -> str:
        """
        Main conversion method.

        Returns clean semantic HTML ready for Ghost Admin API.
        """
        # Parse PAGE_SPEC sections
        sections = self._parse_spec()

        # Convert each section to HTML
        html_parts = []
        for section in sections:
            html = self._convert_section(section)
            if html:
                html_parts.append(html)

        # Join with blank lines for readability
        return "\n\n".join(html_parts)

    def _parse_spec(self) -> list:
        """
        Parse PAGE_SPEC into structured sections.

        Returns list of section dictionaries.
        """
        sections = []

        # Split by "## Section" headers
        section_pattern = r'##\s+Section\s+\d+:([^\n]+)'
        parts = re.split(section_pattern, self.spec_content)

        # Process pairs (heading, content)
        for i in range(1, len(parts), 2):
            if i + 1 < len(parts):
                section_title = parts[i].strip()
                section_content = parts[i + 1].strip()

                sections.append({
                    'title': section_title,
                    'content': section_content,
                    'raw': section_content
                })

        return sections

    def _convert_section(self, section: dict) -> str:
        """
        Convert a single section to HTML.

        Uses pattern matching to identify section type and convert appropriately.
        """
        content = section['content']

        # Check for section type indicators
        if 'hero' in section['title'].lower() or 'introduction' in content.lower():
            return self._convert_hero(content)
        elif 'image' in content.lower() and 'src=' in content.lower():
            return self._convert_image(content)
        elif 'list' in content.lower() or '- **' in content:
            return self._convert_list_section(content)
        else:
            # Default: heading + paragraphs
            return self._convert_text_section(section['title'], content)

    def _convert_hero(self, content: str) -> str:
        """Convert hero section: heading + tagline + optional image."""
        lines = content.strip().split('\n')
        html_parts = []

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Heading
            if line.startswith('**Heading:**'):
                heading = line.replace('**Heading:**', '').strip()
                html_parts.append(f'<h1>{heading}</h1>')

            # Tagline/body text
            elif line.startswith('**Tagline:**') or line.startswith('**Body:**'):
                text = re.sub(r'\*\*[^:]+:\*\*', '', line).strip()
                if text:
                    html_parts.append(f'<p>{text}</p>')

            # Image
            elif 'src=' in line:
                img_html = self._extract_image(line)
                if img_html:
                    html_parts.append(img_html)

        return '\n\n'.join(html_parts)

    def _convert_text_section(self, title: str, content: str) -> str:
        """Convert standard text section: H2 heading + paragraphs."""
        html_parts = []

        # Add section heading
        if title:
            clean_title = title.strip()
            html_parts.append(f'<h2>{clean_title}</h2>')

        # Convert body paragraphs
        paragraphs = content.split('\n\n')
        for para in paragraphs:
            para = para.strip()
            if para and not para.startswith('**') and 'src=' not in para:
                # Clean up markdown formatting
                para = para.replace('**', '')
                html_parts.append(f'<p>{para}</p>')

        return '\n\n'.join(html_parts)

    def _convert_list_section(self, content: str) -> str:
        """Convert section with bullet list."""
        html_parts = []
        lines = content.split('\n')

        in_list = False
        list_items = []

        for line in lines:
            line = line.strip()

            # List item
            if line.startswith('- **') or line.startswith('  - **'):
                if not in_list:
                    in_list = True
                    list_items = []

                # Extract list item content
                item = re.sub(r'^-\s*', '', line)
                item = item.replace('**', '<strong>').replace('**', '</strong>')

                # Fix bold tags if unbalanced
                if item.count('<strong>') != item.count('</strong>'):
                    item = item.replace('<strong>', '').replace('</strong>', '')

                list_items.append(f'  <li>{item}</li>')

            # End of list
            elif in_list and not line.startswith('-'):
                if list_items:
                    html_parts.append('<ul>\n' + '\n'.join(list_items) + '\n</ul>')
                    list_items = []
                in_list = False

                if line and not line.startswith('**'):
                    html_parts.append(f'<p>{line}</p>')

        # Close any open list
        if list_items:
            html_parts.append('<ul>\n' + '\n'.join(list_items) + '\n</ul>')

        return '\n\n'.join(html_parts)

    def _convert_image(self, content: str) -> str:
        """Extract and convert image reference to <img> tag."""
        # Look for src="..." and alt="..." patterns
        src_match = re.search(r'src=["\'](https?://[^"\']+)["\']', content)
        alt_match = re.search(r'alt=["\'](.*?)["\']', content)

        if src_match:
            src = src_match.group(1)
            alt = alt_match.group(1) if alt_match else "Image"
            return f'<img src="{src}" alt="{alt}" />'

        return ''

    def _extract_image(self, line: str) -> str:
        """Extract image HTML from a line."""
        return self._convert_image(line)


async def execute_html_conversion(task: dict, worker: WorkerClient) -> dict:
    """
    Execute HTML conversion work for a given task.

    FULLY AUTOMATED - reads files, converts to HTML, saves output.
    No human input required!
    """
    task_id = task["task_id"]
    task_title = task.get("title", "Untitled")
    task_description = task.get("description", "")

    print(f"\n{'=' * 60}")
    print(f"⚗️  HTML CONVERSION STARTED")
    print(f"{'=' * 60}")
    print(f"Task ID: {task_id}")
    print(f"Title: {task_title}")
    print(f"Description: {task_description[:200]}...")

    try:
        # Update heartbeat
        await worker.heartbeat(
            status="busy",
            current_task=task_id,
            current_task_title=task_title
        )

        # Step 1: Find PAGE_SPEC file
        print(f"\n[1/5] Locating PAGE_SPEC file...")

        # Look for PAGE_SPEC filename in task description
        spec_file = None

        # Check for explicit path in description
        if 'PAGE_SPEC' in task_description or 'page_spec' in task_description.lower():
            # Extract filename
            spec_match = re.search(r'PAGE_SPEC[-_](\w+)\.md', task_description, re.IGNORECASE)
            if spec_match:
                page_name = spec_match.group(1)
                spec_file = f"/Users/michaeljones/Dev/MJ_Online/design/PAGE_SPEC-{page_name}.md"

        # Default to looking in /design folder for PAGE_SPEC-*.md files
        if not spec_file or not os.path.exists(spec_file):
            design_dir = Path("/Users/michaeljones/Dev/MJ_Online/design")
            spec_files = list(design_dir.glob("PAGE_SPEC-*.md"))

            if spec_files:
                # Use most recently modified
                spec_file = str(sorted(spec_files, key=lambda p: p.stat().st_mtime)[-1])
                print(f"   Using most recent PAGE_SPEC: {spec_file}")

        if not spec_file or not os.path.exists(spec_file):
            raise FileNotFoundError("No PAGE_SPEC file found in /design/ folder")

        print(f"   ✅ Found: {spec_file}")

        # Step 2: Read PAGE_SPEC
        print(f"\n[2/5] Reading PAGE_SPEC...")
        with open(spec_file, 'r') as f:
            spec_content = f.read()

        print(f"   ✅ Loaded {len(spec_content)} bytes")

        # Step 3: Check for image URL reference file
        print(f"\n[3/5] Checking for image URLs...")
        image_urls = {}

        image_ref_file = "/Users/michaeljones/Dev/MJ_Online/PHASE-3.0.3-IMAGE-URLS.md"
        if os.path.exists(image_ref_file):
            with open(image_ref_file, 'r') as f:
                img_content = f.read()
                # Extract URLs
                for match in re.finditer(r'- (.*?):\s*(https://[^\s]+)', img_content):
                    key = match.group(1).strip()
                    url = match.group(2).strip()
                    image_urls[key] = url

            print(f"   ✅ Found {len(image_urls)} image URLs")
        else:
            print(f"   ⚠️  No image URL reference file found")

        # Step 4: Convert to HTML
        print(f"\n[4/5] Converting to semantic HTML...")
        converter = HTMLConverter(spec_content, image_urls)
        html_output = converter.convert()

        print(f"   ✅ Generated {len(html_output)} bytes of HTML")

        # Step 5: Save HTML
        print(f"\n[5/5] Saving HTML output...")

        # Extract page name from spec filename
        page_name = Path(spec_file).stem.replace('PAGE_SPEC-', '').lower()
        output_file = f"/Users/michaeljones/Dev/MJ_Online/content-drafts/{page_name}.html"

        with open(output_file, 'w') as f:
            f.write(html_output)

        print(f"   ✅ Saved to: {output_file}")

        # Build success result
        result = {
            "status": "completed",
            "summary": f"Converted {page_name} PAGE_SPEC to semantic HTML",
            "deliverables": [output_file],
            "ready_for_publishing": True,
            "task_id": task_id,
            "completed_by": "Doc Brown (autonomous)",
            "format": "HTML (Ghost will convert to Lexical)",
            "spec_file": spec_file,
            "output_size": len(html_output),
            "timestamp": datetime.now().isoformat()
        }

        print(f"\n{'=' * 60}")
        print(f"✅ CONVERSION COMPLETE")
        print(f"{'=' * 60}")
        print(f"Input: {spec_file}")
        print(f"Output: {output_file}")
        print(f"Size: {len(html_output)} bytes")
        print(f"Ready for publishing: YES")

        return result

    except Exception as e:
        print(f"\n❌ ERROR during conversion: {e}")
        import traceback
        traceback.print_exc()

        raise


async def run_docbrown_autonomous():
    """
    Run Doc Brown in autonomous NATS mode.

    Listens for HTML conversion tasks and processes them automatically.
    """

    async with WorkerClient("Doc-Brown") as worker:
        try:
            # Register with coordination system
            await worker.register(
                description="HTML Assembler - Converts design specs to semantic HTML for Ghost Pro publishing"
            )

            print("=" * 60)
            print("⚗️  DOC BROWN - AUTONOMOUS HTML ASSEMBLER")
            print("=" * 60)
            print("✅ Connected to NATS coordination system")
            print("💓 Heartbeat monitoring active")
            print("🎧 Listening for HTML conversion tasks...")
            print("\nWatching for tasks with types:")
            print("  - html_conversion")
            print("  - content_assembly")
            print("  - mobiledoc_assembly")
            print("\nOr keywords: html, PAGE_SPEC, convert, assembly, semantic")
            print("\n🟢 Great Scott! Ready for FULLY AUTOMATED conversions!")
            print("🤖 No human input required - I'll handle everything!")
            print(f"\nTimestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

            # Send initial heartbeat
            await worker.heartbeat(status="idle", current_task=None)

            # Main work loop
            last_heartbeat = asyncio.get_event_loop().time()

            while True:
                try:
                    # Send heartbeat every 30 seconds
                    now = asyncio.get_event_loop().time()
                    if now - last_heartbeat > 30:
                        await worker.heartbeat(status="idle", current_task=None)
                        last_heartbeat = now

                    # Check for available tasks
                    tasks = await worker.get_available_tasks()

                    # Filter for HTML conversion tasks
                    html_tasks = [
                        task for task in tasks
                        if (
                            task.get('type') in ['html_conversion', 'content_assembly', 'mobiledoc_assembly']
                            or any(
                                keyword in str(task).lower()
                                for keyword in ['html', 'page_spec', 'page-spec', 'convert', 'assembly', 'semantic', 'mobiledoc']
                            )
                        )
                    ]

                    if html_tasks:
                        task = html_tasks[0]  # Take first matching task

                        print(f"\n{'=' * 60}")
                        print(f"📥 NEW TASK RECEIVED")
                        print(f"{'=' * 60}")
                        print(f"Task ID: {task['task_id']}")
                        print(f"Title: {task.get('title', 'Untitled')}")
                        print(f"Type: {task.get('type', 'Unknown')}")
                        print(f"\n⚗️  Claiming task and starting conversion...\n")

                        # Claim the task
                        await worker.claim_task(task['task_id'])
                        await worker.heartbeat(
                            status="busy",
                            current_task=task['task_id'],
                            current_task_title=task.get('title', 'HTML Conversion')
                        )

                        try:
                            # Execute HTML conversion (FULLY AUTOMATED)
                            result = await execute_html_conversion(task, worker)

                            # Report completion
                            await worker.complete_task(task["task_id"], result)

                            # Send coordination message
                            await worker.send_coordination_message(
                                f"✅ Doc Brown completed: {result.get('summary', 'HTML conversion complete')} → {result['deliverables'][0]}"
                            )

                            print(f"\n{'=' * 60}")
                            print(f"📣 TASK COMPLETION REPORTED TO NATS")
                            print(f"{'=' * 60}")
                            print(f"Summary: {result['summary']}")
                            print(f"Deliverables: {', '.join(result['deliverables'])}")
                            print(f"Next agent notified: Alice (for publishing)")
                            print(f"\n🎧 Returning to idle state, listening for next task...\n")

                            # Reset heartbeat
                            await worker.heartbeat(status="idle", current_task=None)
                            last_heartbeat = asyncio.get_event_loop().time()

                        except Exception as e:
                            error_msg = f"HTML conversion failed: {e}"
                            print(f"\n❌ ERROR: {error_msg}")
                            import traceback
                            traceback.print_exc()

                            # Report failure
                            await worker.complete_task(task["task_id"], error=error_msg)
                            await worker.report_error(f"Doc Brown error on task {task['task_id']}: {e}")

                            await worker.heartbeat(status="idle", current_task=None)
                            last_heartbeat = asyncio.get_event_loop().time()

                            print(f"\n🎧 Error reported, back to listening...\n")

                    # Sleep briefly before checking again
                    await asyncio.sleep(5)

                except KeyboardInterrupt:
                    raise
                except Exception as e:
                    print(f"\n⚠️  Error in main loop: {e}")
                    import traceback
                    traceback.print_exc()
                    await asyncio.sleep(10)

        except KeyboardInterrupt:
            print(f"\n\n⚠️  Shutting down Doc Brown (Ctrl+C received)...")
            await worker.heartbeat(status="offline", current_task=None)
            print("✅ Shutdown complete. Great Scott, we're done!\n")
        except Exception as e:
            print(f"\n❌ Fatal error in autonomous mode: {e}")
            import traceback
            traceback.print_exc()
            await worker.heartbeat(status="offline", current_task=None)


if __name__ == "__main__":
    print("\n⚗️  Doc Brown starting in AUTONOMOUS MODE...")
    print("🤖  FULLY AUTOMATED - No human input required!")
    asyncio.run(run_docbrown_autonomous())
