import { describe, it, expect } from 'vitest';
import { onRequest } from './_middleware.ts';

// The middleware is the only thing standing between a withdrawn export file and
// a warm zone cache: it answers before the edge does, so a 410 here means the
// page is gone the moment the deploy lands, not when its old s-maxage expires.

const make = (url) => {
  let nextCalled = false;
  const context = {
    request: new Request(url),
    next: async () => {
      nextCalled = true;
      return new Response('asset', { status: 200 });
    },
  };
  return { context, nextCalled: () => nextCalled };
};

describe('removed agent exports', () => {
  const removed = [
    '/agents/kb/kb-pipelines-generator-registry.md',
    '/agents/kb/kb-pipelines-generator-registry-part1.md',
    '/agents/kb/kb-pipelines-generator-registry-part2.md',
    '/agents/kb/kb-pipelines-generator-registry-part3.md',
  ];

  for (const path of removed) {
    it(`answers 410 for ${path}, cache or not`, async () => {
      const { context, nextCalled } = make(`https://mikejones.online${path}`);
      const res = await onRequest(context);
      expect(res.status).toBe(410);
      expect(res.headers.get('Cache-Control')).toContain('s-maxage=60');
      expect(res.headers.get('X-Robots-Tag')).toBe('noindex');
      expect(nextCalled()).toBe(false);
    });
  }

  it('still serves the pages that stayed public', async () => {
    const { context, nextCalled } = make('https://mikejones.online/agents/kb/kb-pipelines-task-system.md');
    const res = await onRequest(context);
    expect(res.status).toBe(200);
    expect(nextCalled()).toBe(true);
  });

  it('keeps the www canonicalization ahead of the removal check', async () => {
    const { context } = make(
      'https://www.mikejones.online/agents/kb/kb-pipelines-generator-registry-part2.md'
    );
    const res = await onRequest(context);
    expect(res.status).toBe(301);
    expect(res.headers.get('Location')).toBe(
      'https://mikejones.online/agents/kb/kb-pipelines-generator-registry-part2.md'
    );
  });
});
