/**
 * Tests for RAG Retrieval System
 */

const { retrieveEntries, extractKeywords, formatEntriesForContext } = require('../src/rag-retrieval');
const { getKnowledgeBase } = require('../src/knowledge-data');

const knowledgeBase = getKnowledgeBase();

console.log('=== RAG Retrieval System Tests ===\n');
console.log(`Knowledge base loaded: ${knowledgeBase.length} entries\n`);

// Test 1: Extract keywords
console.log('Test 1: Keyword Extraction');
const testQuestions = [
  "What has Mike worked on?",
  "Tell me about the AI Memory System",
  "How does Mike help companies with process optimization?",
  "What are the 7 Pillars of Resilient Tomorrow?",
  "Is Mike a good fit for my startup?"
];

testQuestions.forEach(q => {
  const keywords = extractKeywords(q);
  console.log(`Q: "${q}"`);
  console.log(`Keywords: [${keywords.join(', ')}]\n`);
});

// Test 2: Retrieve entries
console.log('\n=== Test 2: Entry Retrieval ===\n');

const sampleQueries = [
  "Tell me about Mike's AI implementation experience",
  "What has Mike worked on?",
  "Tell me about the AI Memory System",
  "What are the 7 Pillars of Resilient Tomorrow?",
  "How does Mike help companies with process optimization?"
];

sampleQueries.forEach(query => {
  console.log(`\n--- Query: "${query}" ---`);
  const entries = retrieveEntries(query, knowledgeBase, 5);
  console.log(`Retrieved ${entries.length} entries:\n`);

  entries.forEach((entry, idx) => {
    console.log(`${idx + 1}. [${entry.type}] ${entry.topic}`);
    if (entry.title) console.log(`   Title: ${entry.title}`);
    if (entry.question) console.log(`   Q: ${entry.question}`);
    const contentPreview = (entry.content || entry.answer || '').substring(0, 100);
    console.log(`   Content: ${contentPreview}...`);
    console.log(`   Tags: ${entry.tags.join(', ')}`);
    console.log('');
  });
});

// Test 3: Format for context
console.log('\n=== Test 3: Context Formatting ===\n');
const testQuery = "What is the AI Memory System?";
const testEntries = retrieveEntries(testQuery, knowledgeBase, 3);
const formattedContext = formatEntriesForContext(testEntries);
console.log('Formatted context for AI:\n');
console.log(formattedContext.substring(0, 500) + '...\n');

// Test 4: Edge cases
console.log('\n=== Test 4: Edge Cases ===\n');

// Empty query
const emptyKeywords = extractKeywords("");
console.log(`Empty query keywords: [${emptyKeywords.join(', ')}]`);

// Non-matching query
const noMatch = retrieveEntries("What is Mike's favorite color?", knowledgeBase, 5);
console.log(`Non-matching query retrieved: ${noMatch.length} entries`);

if (noMatch.length > 0) {
  console.log('Entries returned for non-match:');
  noMatch.forEach((e, i) => console.log(`  ${i+1}. ${e.type} - ${e.topic}`));
}

console.log('\n=== All Tests Complete ===');
