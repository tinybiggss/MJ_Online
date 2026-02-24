/**
 * MJ Chatbot Widget Configuration
 *
 * This file defines all configuration options for the chatbot widget.
 * Users can override these by setting window.MJ_CHATBOT_CONFIG before loading the script.
 */

const DEFAULT_CONFIG = {
  // API Configuration
  apiEndpoint: 'https://mj-chatbot-backend.mejones73.workers.dev/chat',

  // Visual Configuration
  position: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  primaryColor: '#2563eb', // Blue (matches professional theme)
  secondaryColor: '#1e40af', // Darker blue for hover states
  textColor: '#ffffff', // White text on colored backgrounds
  backgroundColor: '#ffffff', // White background for chat window
  userMessageColor: '#2563eb', // User messages (blue)
  botMessageColor: '#f3f4f6', // Bot messages (light gray)

  // Dimensions
  desktopWidth: 400, // px
  desktopHeight: 600, // px
  bubbleSize: 60, // px
  spacing: 20, // px from edge

  // Content Configuration
  greeting: 'Hi! Ask me about Mike\'s experience and projects.',
  placeholder: 'Ask me about Mike\'s work...',

  // Suggested Questions (shown on first open)
  suggestedQuestions: [
    "What has Mike worked on?",
    "Tell me about the AI Memory System",
    "What services does Mike offer?",
    "How does Mike help with process optimization?",
    "Is Mike available for consulting?"
  ],

  // Behavior Configuration
  showSuggestionsOnFirstOpen: true, // Show suggested questions when widget first opens
  closeOnSuggestionClick: false, // Keep widget open after clicking suggestion
  resetConversationOnClose: false, // Keep conversation history when closing widget
  autoFocusInput: true, // Focus input field when widget opens

  // Advanced Options
  showMetadata: false, // Show API response times (debug mode)
  enableSounds: false, // Notification sounds (reserved for future)
  maxMessageLength: 500, // Character limit for user input
  typingIndicatorDelay: 500, // ms before showing typing indicator

  // Rate Limiting Messages
  rateLimitMessage: 'You\'ve reached the message limit. Please try again in {minutes} minute{s}.',
  rateLimitTitle: 'Rate Limit Reached',

  // Error Messages
  errorMessages: {
    network: 'Unable to connect. Please check your internet connection and try again.',
    timeout: 'The request took too long. Please try again.',
    generic: 'Something went wrong. Please try again or contact Mike directly.',
    emptyMessage: 'Please enter a message before sending.'
  },

  // Accessibility
  ariaLabels: {
    openButton: 'Open chat with Mike Jones',
    closeButton: 'Close chat',
    minimizeButton: 'Minimize chat',
    sendButton: 'Send message',
    inputField: 'Type your message',
    messageList: 'Conversation messages',
    suggestionButton: 'Ask: {question}'
  },

  // Performance
  debounceScrollMs: 100, // Debounce auto-scroll
  requestTimeoutMs: 10000, // 10 second timeout for API requests
  maxRetries: 3, // Max retries for failed requests

  // Development
  debug: false // Enable console.log debugging
};

/**
 * Merge user configuration with defaults
 */
function getConfig() {
  const userConfig = window.MJ_CHATBOT_CONFIG || {};
  return { ...DEFAULT_CONFIG, ...userConfig };
}

// Export for use in main widget file
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_CONFIG, getConfig };
}
