/**
 * Knowledge Base Loader
 * Converts knowledge.jsonl to a JavaScript module for Workers
 */

const fs = require('fs');
const path = require('path');

function generateKnowledgeModule() {
  const jsonlPath = path.join(__dirname, '..', 'knowledge.jsonl');
  const content = fs.readFileSync(jsonlPath, 'utf-8');

  const lines = content.trim().split('\n');
  const entries = lines.map(line => JSON.parse(line));

  return `// Auto-generated knowledge base module (CommonJS)
// Generated at: ${new Date().toISOString()}
// Entries: ${entries.length}

const knowledgeBase = ${JSON.stringify(entries, null, 2)};

function getKnowledgeBase() {
  return knowledgeBase;
}

const stats = {
  totalEntries: ${entries.length},
  types: ${JSON.stringify(getTypeCounts(entries))},
  topics: ${JSON.stringify(getTopicCounts(entries))}
};

module.exports = {
  knowledgeBase,
  getKnowledgeBase,
  stats
};
`;
}

function getTypeCounts(entries) {
  const counts = {};
  entries.forEach(entry => {
    counts[entry.type] = (counts[entry.type] || 0) + 1;
  });
  return counts;
}

function getTopicCounts(entries) {
  const counts = {};
  entries.forEach(entry => {
    counts[entry.topic] = (counts[entry.topic] || 0) + 1;
  });
  return counts;
}

// If run directly, generate the module
if (require.main === module) {
  const output = generateKnowledgeModule();
  const outputPath = path.join(__dirname, 'knowledge-data.js');
  fs.writeFileSync(outputPath, output);
  console.log(`Knowledge base module generated: ${outputPath}`);
}

module.exports = { generateKnowledgeModule };
