/**
 * RAG Retrieval System
 * Implements keyword-based retrieval from the 190-entry knowledge base
 */

// Load and parse the knowledge base
function loadKnowledgeBase(knowledgeJsonl) {
  const lines = knowledgeJsonl.trim().split('\n');
  return lines.map(line => JSON.parse(line));
}

/**
 * Extract keywords from a question
 * Removes common stop words and returns meaningful terms
 */
function extractKeywords(question) {
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for',
    'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on',
    'that', 'the', 'to', 'was', 'will', 'with', 'what', 'when',
    'where', 'who', 'how', 'does', 'did', 'can', 'could', 'would',
    'should', 'about', 'me', 'tell', 'you', 'your', 'my', 'i'
  ]);

  return question
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Calculate relevance score for an entry
 */
function scoreEntry(entry, keywords, question) {
  let score = 0;
  const lowerQuestion = question.toLowerCase();

  // Check content for keyword matches
  const content = entry.content || entry.answer || '';
  const lowerContent = content.toLowerCase();

  keywords.forEach(keyword => {
    // Exact match in content (higher weight)
    if (lowerContent.includes(keyword)) {
      score += 3;
    }

    // Match in topic
    if (entry.topic && entry.topic.toLowerCase().includes(keyword)) {
      score += 2;
    }

    // Match in tags
    if (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(keyword))) {
      score += 1;
    }

    // Match in title (for narratives/technical)
    if (entry.title && entry.title.toLowerCase().includes(keyword)) {
      score += 2;
    }
  });

  // Bonus for qa_pair type if it's a direct question
  if (entry.type === 'qa_pair') {
    const questionMatch = entry.question && entry.question.toLowerCase();
    keywords.forEach(kw => {
      if (questionMatch && questionMatch.includes(kw)) {
        score += 5; // High bonus for matching questions
      }
    });
  }

  // Bonus for verified confidence
  if (entry.confidence === 'verified') {
    score += 1;
  }

  return score;
}

/**
 * Retrieve relevant entries from the knowledge base
 *
 * @param {string} question - The user's question
 * @param {Array} knowledgeBase - Parsed knowledge base entries
 * @param {number} topN - Number of entries to return (default: 5)
 * @returns {Array} Top N most relevant entries
 */
function retrieveEntries(question, knowledgeBase, topN = 5) {
  const keywords = extractKeywords(question);

  // If no meaningful keywords, return general overview entries
  if (keywords.length === 0) {
    return knowledgeBase
      .filter(e => e.type === 'narrative' && e.topic === 'about')
      .slice(0, topN);
  }

  // Score all entries
  const scoredEntries = knowledgeBase.map(entry => ({
    entry,
    score: scoreEntry(entry, keywords, question)
  }));

  // Filter out zero-score entries and sort by score
  const relevantEntries = scoredEntries
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Return top N entries
  return relevantEntries.slice(0, topN).map(item => item.entry);
}

/**
 * Format retrieved entries for AI context injection
 */
function formatEntriesForContext(entries) {
  return entries.map((entry, index) => {
    let formatted = `[Entry ${index + 1}]\n`;
    formatted += `Type: ${entry.type}\n`;
    formatted += `Topic: ${entry.topic}\n`;

    if (entry.title) {
      formatted += `Title: ${entry.title}\n`;
    }

    if (entry.type === 'qa_pair') {
      formatted += `Question: ${entry.question}\n`;
      formatted += `Answer: ${entry.answer}\n`;
    } else {
      formatted += `Content: ${entry.content}\n`;
    }

    formatted += `Confidence: ${entry.confidence}\n`;
    formatted += `Tags: ${entry.tags.join(', ')}\n`;

    return formatted;
  }).join('\n---\n\n');
}

module.exports = {
  loadKnowledgeBase,
  extractKeywords,
  retrieveEntries,
  formatEntriesForContext
};
