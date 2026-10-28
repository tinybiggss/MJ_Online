#!/usr/bin/env node
// E2E check: load the STAGED knowledge-data.js through the live retrieval
// engine and verify retrieval + prompt formatting work, plus a full title dump.
const path = require('path');
const { getKnowledgeBase, stats } = require(path.join(__dirname, '..', 'staging', 'knowledge-data.js'));
const { retrieveEntries, formatEntriesForContext } = require(path.join(__dirname, '..', 'src', 'rag-retrieval.js'));

const kb = getKnowledgeBase();
console.log('=== staged stats ===');
console.log(JSON.stringify(stats));

console.log('\n=== all staged entries (id | topic | title) ===');
for (const e of kb) console.log(`${e.id} | ${e.topic} | ${e.title}`);

const qs = [
  'What consulting services does Mike offer?',
  'Tell me about Resilient Tomorrow',
  'What is the North Star?',
  'How does Mike like to work with collaborators?',
  'What certification did Mike earn recently?',
  'Tell me about Mike\'s Xbox career history',
];
console.log('\n=== retrieval smoke test (top 3 per question) ===');
for (const q of qs) {
  const hits = retrieveEntries(q, kb, 3);
  console.log(`\nQ: ${q}`);
  for (const h of hits) console.log(`   -> [${h.id}] ${h.title}`);
}

console.log('\n=== formatted prompt sample (first question) ===');
const fmt = formatEntriesForContext(retrieveEntries(qs[0], kb, 5));
console.log(fmt.slice(0, 900));

// Zero-keyword fallback check (empty/keywordless query falls back to about/topic)
console.log('\n=== zero-keyword fallback (empty query) ===');
const fallback = retrieveEntries('', kb, 3);
console.log(fallback.map((h) => h.id).join(', ') || '(none)');