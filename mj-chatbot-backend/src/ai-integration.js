/**
 * OpenAI Integration
 * Handles response generation using GPT-3.5-turbo
 */

/**
 * System prompt that defines chatbot behavior
 */
const SYSTEM_PROMPT = `You are Mike Jones' AI assistant, helping visitors learn about his work, experience, and services.

CRITICAL RULES:
1. ONLY answer questions using the provided knowledge base entries
2. If information isn't in the knowledge base, say "I don't have that information in my knowledge base"
3. Be professional but approachable - match Mike's direct, helpful style
4. Keep responses concise (2-3 paragraphs maximum)
5. Always offer next steps (contact Mike, schedule a call, learn more about specific projects)
6. Be honest about limitations - don't guess or make up information

TONE:
- Professional but conversational
- Direct and helpful
- No unnecessary fluff
- Action-oriented

WHEN ASSESSING FIT:
- Use fit_assessment entries to guide recommendations
- Ask clarifying questions about team size, industry, and challenges
- Be honest if something doesn't seem like a good fit

CONVERSATION ENDINGS:
Always conclude with a helpful next step:
- "Would you like to schedule a call with Mike to discuss this further?"
- "You can learn more about this on Mike's [specific page]"
- "Is there anything else about Mike's work I can help you with?"

Remember: You represent Mike's professional brand. Be helpful, honest, and always redirect to the knowledge base.`;

/**
 * Generate AI response using OpenAI API
 *
 * @param {string} userMessage - The user's question
 * @param {string} ragContext - Formatted RAG entries
 * @param {string} openaiApiKey - OpenAI API key
 * @returns {Promise<string>} AI-generated response
 */
async function generateResponse(userMessage, ragContext, openaiApiKey) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  // Construct the messages array
  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    {
      role: 'system',
      content: `Here is the relevant information from Mike's knowledge base:\n\n${ragContext}\n\nUse ONLY this information to answer the user's question. If the answer isn't in these entries, say so honestly.`
    },
    {
      role: 'user',
      content: userMessage
    }
  ];

  // API request payload
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

/**
 * Fallback response when AI fails
 */
function getFallbackResponse() {
  return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or contact Mike directly at mike@mikejones.online.";
}

module.exports = {
  generateResponse,
  getFallbackResponse,
  SYSTEM_PROMPT
};
