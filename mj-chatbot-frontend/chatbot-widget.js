/**
 * MJ Chatbot Widget - RAG-Powered AI Assistant
 *
 * A lightweight, vanilla JavaScript chatbot widget for MikeJones.online
 * Integrates with Cloudflare Workers backend and 190-entry knowledge base
 *
 * @version 1.0.0
 * @author Mike Jones (with AI assistance)
 * @license MIT
 */

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const CONFIG = {
    apiEndpoint: 'https://mj-chatbot-backend.mejones73.workers.dev/chat',
    position: 'bottom-right',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    bubbleSize: 60,
    spacing: 20,
    desktopWidth: 400,
    desktopHeight: 600,
    greeting: 'Hi! Ask me about Mike\'s experience and projects.',
    placeholder: 'Ask me about Mike\'s work...',
    suggestedQuestions: [
      "What has Mike worked on?",
      "Tell me about the AI Memory System",
      "What services does Mike offer?",
      "How does Mike help with process optimization?",
      "Is Mike available for consulting?"
    ],
    debug: false
  };

  // Allow user override
  if (window.MJ_CHATBOT_CONFIG) {
    Object.assign(CONFIG, window.MJ_CHATBOT_CONFIG);
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function log(...args) {
    if (CONFIG.debug) {
      console.log('[MJ Chatbot]', ...args);
    }
  }

  function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('mj-chatbot-session-id');
    if (!sessionId) {
      sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('mj-chatbot-session-id', sessionId);
      log('Created new session ID:', sessionId);
    }
    return sessionId;
  }

  // ============================================================================
  // STYLES
  // ============================================================================

  function injectStyles() {
    const styleId = 'mj-chatbot-styles';
    if (document.getElementById(styleId)) {
      log('Styles already injected');
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* ===== Reset & Base Styles ===== */
      .mj-chatbot-widget * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      /* ===== Container ===== */
      .mj-chatbot-widget {
        position: fixed;
        ${CONFIG.position.includes('right') ? 'right' : 'left'}: ${CONFIG.spacing}px;
        ${CONFIG.position.includes('bottom') ? 'bottom' : 'top'}: ${CONFIG.spacing}px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
      }

      /* ===== Minimized Bubble ===== */
      .mj-chatbot-bubble {
        width: ${CONFIG.bubbleSize}px;
        height: ${CONFIG.bubbleSize}px;
        border-radius: 50%;
        background: ${CONFIG.primaryColor};
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .mj-chatbot-bubble:hover {
        background: ${CONFIG.secondaryColor};
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        transform: scale(1.05);
      }

      .mj-chatbot-bubble:active {
        transform: scale(0.95);
      }

      .mj-chatbot-bubble:focus {
        outline: 3px solid ${CONFIG.primaryColor};
        outline-offset: 2px;
      }

      /* Bubble Icon (Chat SVG) */
      .mj-chatbot-bubble-icon {
        width: 28px;
        height: 28px;
        fill: white;
      }

      /* Pulse Animation (optional - can be enabled later) */
      @keyframes mj-chatbot-pulse {
        0%, 100% {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 0 ${CONFIG.primaryColor};
        }
        50% {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 8px rgba(37, 99, 235, 0);
        }
      }

      .mj-chatbot-bubble-pulse {
        animation: mj-chatbot-pulse 2s infinite;
      }

      /* ===== Expanded Window ===== */
      .mj-chatbot-window {
        width: ${CONFIG.desktopWidth}px;
        height: ${CONFIG.desktopHeight}px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: mj-chatbot-slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes mj-chatbot-slide-up {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Mobile: Full-screen takeover */
      @media (max-width: 768px) {
        .mj-chatbot-window {
          width: 100vw;
          height: 100vh;
          height: 100dvh; /* Dynamic viewport height for mobile browsers */
          border-radius: 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }

      /* ===== Header ===== */
      .mj-chatbot-header {
        background: ${CONFIG.primaryColor};
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      .mj-chatbot-header-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }

      .mj-chatbot-header-controls {
        display: flex;
        gap: 8px;
      }

      .mj-chatbot-header-button {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      .mj-chatbot-header-button:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .mj-chatbot-header-button:active {
        background: rgba(255, 255, 255, 0.3);
      }

      .mj-chatbot-header-button:focus {
        outline: 2px solid white;
        outline-offset: 2px;
      }

      .mj-chatbot-header-icon {
        width: 20px;
        height: 20px;
        fill: white;
      }

      /* ===== Messages Container ===== */
      .mj-chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f9fafb;
        scroll-behavior: smooth;
      }

      /* Empty state (greeting) */
      .mj-chatbot-greeting {
        text-align: center;
        color: #6b7280;
        padding: 40px 20px;
      }

      .mj-chatbot-greeting-text {
        font-size: 16px;
        margin-bottom: 24px;
      }

      /* ===== Messages ===== */
      .mj-chatbot-message {
        margin-bottom: 16px;
        display: flex;
        animation: mj-chatbot-message-appear 0.3s ease-out;
      }

      @keyframes mj-chatbot-message-appear {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .mj-chatbot-message-user {
        justify-content: flex-end;
      }

      .mj-chatbot-message-bot {
        justify-content: flex-start;
      }

      .mj-chatbot-message-bubble {
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
      }

      .mj-chatbot-message-user .mj-chatbot-message-bubble {
        background: ${CONFIG.primaryColor};
        color: white;
        border-bottom-right-radius: 4px;
      }

      .mj-chatbot-message-bot .mj-chatbot-message-bubble {
        background: white;
        color: #374151;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      /* Typing Indicator */
      .mj-chatbot-typing {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 10px 14px;
        background: white;
        border-radius: 12px;
        border-bottom-left-radius: 4px;
        max-width: 60px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      .mj-chatbot-typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #9ca3af;
        animation: mj-chatbot-typing-bounce 1.4s infinite;
      }

      .mj-chatbot-typing-dot:nth-child(1) {
        animation-delay: 0s;
      }

      .mj-chatbot-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .mj-chatbot-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes mj-chatbot-typing-bounce {
        0%, 60%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-8px);
        }
      }

      /* ===== Suggested Questions ===== */
      .mj-chatbot-suggestions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 16px;
      }

      .mj-chatbot-suggestion {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px 16px;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
        color: #374151;
      }

      .mj-chatbot-suggestion:hover {
        background: #f3f4f6;
        border-color: ${CONFIG.primaryColor};
        color: ${CONFIG.primaryColor};
      }

      .mj-chatbot-suggestion:active {
        transform: scale(0.98);
      }

      .mj-chatbot-suggestion:focus {
        outline: 2px solid ${CONFIG.primaryColor};
        outline-offset: 2px;
      }

      /* ===== Input Area ===== */
      .mj-chatbot-input-container {
        padding: 16px;
        background: white;
        border-top: 1px solid #e5e7eb;
        flex-shrink: 0;
      }

      .mj-chatbot-input-wrapper {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }

      .mj-chatbot-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 14px;
        font-family: inherit;
        resize: none;
        min-height: 44px;
        max-height: 120px;
        line-height: 1.5;
        transition: border-color 0.2s;
      }

      .mj-chatbot-input:focus {
        outline: none;
        border-color: ${CONFIG.primaryColor};
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      .mj-chatbot-input::placeholder {
        color: #9ca3af;
      }

      .mj-chatbot-send-button {
        background: ${CONFIG.primaryColor};
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
        min-width: 60px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mj-chatbot-send-button:hover:not(:disabled) {
        background: ${CONFIG.secondaryColor};
      }

      .mj-chatbot-send-button:active:not(:disabled) {
        transform: scale(0.98);
      }

      .mj-chatbot-send-button:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        opacity: 0.6;
      }

      .mj-chatbot-send-button:focus {
        outline: 2px solid ${CONFIG.primaryColor};
        outline-offset: 2px;
      }

      /* ===== Accessibility ===== */
      .mj-chatbot-visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;

    document.head.appendChild(style);
    log('Styles injected');
  }

  // ============================================================================
  // TEMPLATES
  // ============================================================================

  function createMinimizedBubble() {
    return `
      <button
        class="mj-chatbot-bubble"
        aria-label="Open chat with Mike Jones"
        aria-expanded="false"
        role="button"
        tabindex="0"
      >
        <svg class="mj-chatbot-bubble-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          <circle cx="8" cy="10" r="1.5"/>
          <circle cx="12" cy="10" r="1.5"/>
          <circle cx="16" cy="10" r="1.5"/>
        </svg>
        <span class="mj-chatbot-visually-hidden">Click to open chat</span>
      </button>
    `;
  }

  function createExpandedWindow(messages, isTyping) {
    return `
      <div class="mj-chatbot-window" role="dialog" aria-label="Chat with Mike Jones" aria-modal="true">
        ${createHeader()}
        ${createMessagesContainer(messages, isTyping)}
        ${createInputArea()}
      </div>
    `;
  }

  function createHeader() {
    return `
      <div class="mj-chatbot-header">
        <h2 class="mj-chatbot-header-title">Chat with Mike</h2>
        <div class="mj-chatbot-header-controls">
          <button
            class="mj-chatbot-header-button mj-chatbot-minimize"
            aria-label="Minimize chat"
            title="Minimize"
          >
            <svg class="mj-chatbot-header-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button
            class="mj-chatbot-header-button mj-chatbot-close"
            aria-label="Close chat"
            title="Close"
          >
            <svg class="mj-chatbot-header-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  function createMessagesContainer(messages, isTyping) {
    const hasMessages = messages && messages.length > 0;

    return `
      <div
        class="mj-chatbot-messages"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Conversation messages"
      >
        ${hasMessages
          ? messages.map(msg => createMessage(msg)).join('')
          : createGreeting()
        }
        ${isTyping ? createTypingIndicator() : ''}
      </div>
    `;
  }

  function createGreeting() {
    return `
      <div class="mj-chatbot-greeting">
        <div class="mj-chatbot-greeting-text">${CONFIG.greeting}</div>
        ${createSuggestedQuestions()}
      </div>
    `;
  }

  function createSuggestedQuestions() {
    return `
      <div class="mj-chatbot-suggestions">
        ${CONFIG.suggestedQuestions.map((question, index) => `
          <button
            class="mj-chatbot-suggestion"
            data-question="${escapeHtml(question)}"
            aria-label="Ask: ${escapeHtml(question)}"
          >
            ${escapeHtml(question)}
          </button>
        `).join('')}
      </div>
    `;
  }

  function createMessage(message) {
    const isUser = message.sender === 'user';
    const className = isUser ? 'mj-chatbot-message-user' : 'mj-chatbot-message-bot';

    return `
      <div class="mj-chatbot-message ${className}">
        <div class="mj-chatbot-message-bubble">
          ${escapeHtml(message.text)}
        </div>
      </div>
    `;
  }

  function createTypingIndicator() {
    return `
      <div class="mj-chatbot-message mj-chatbot-message-bot">
        <div class="mj-chatbot-typing" aria-label="Mike is typing">
          <div class="mj-chatbot-typing-dot"></div>
          <div class="mj-chatbot-typing-dot"></div>
          <div class="mj-chatbot-typing-dot"></div>
        </div>
      </div>
    `;
  }

  function createInputArea() {
    return `
      <div class="mj-chatbot-input-container">
        <div class="mj-chatbot-input-wrapper">
          <textarea
            class="mj-chatbot-input"
            placeholder="${CONFIG.placeholder}"
            rows="1"
            aria-label="Type your message"
            maxlength="500"
          ></textarea>
          <button
            class="mj-chatbot-send-button"
            aria-label="Send message"
            disabled
          >
            Send
          </button>
        </div>
      </div>
    `;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const ChatbotWidget = (function() {
    // Private state
    let state = {
      isOpen: false,
      sessionId: getOrCreateSessionId(),
      initialized: false,
      messages: [],
      isTyping: false
    };

    let widgetContainer = null;

    // Private methods
    function setState(updates) {
      const prevState = { ...state };
      state = { ...state, ...updates };
      log('State updated:', updates);

      // Re-render if state changed
      if (JSON.stringify(prevState) !== JSON.stringify(state)) {
        render();
      }
    }

    function addMessage(sender, text) {
      const message = {
        sender, // 'user' or 'bot'
        text,
        timestamp: Date.now()
      };

      setState({
        messages: [...state.messages, message]
      });

      log('Message added:', message);

      // Auto-scroll to bottom
      setTimeout(scrollToBottom, 100);
    }

    function scrollToBottom() {
      const messagesContainer = widgetContainer.querySelector('.mj-chatbot-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    function createContainer() {
      if (widgetContainer) return widgetContainer;

      widgetContainer = document.createElement('div');
      widgetContainer.id = 'mj-chatbot-widget';
      widgetContainer.className = 'mj-chatbot-widget';
      document.body.appendChild(widgetContainer);
      log('Container created');
      return widgetContainer;
    }

    function render() {
      if (!widgetContainer) return;

      const html = state.isOpen
        ? createExpandedWindow(state.messages, state.isTyping)
        : createMinimizedBubble();

      widgetContainer.innerHTML = html;
      attachEventListeners();

      // Auto-focus input when opening (but not when just adding messages)
      if (state.isOpen && state.messages.length === 0) {
        setTimeout(() => {
          const input = widgetContainer.querySelector('.mj-chatbot-input');
          if (input) input.focus();
        }, 100);
      }
    }

    function attachEventListeners() {
      if (state.isOpen) {
        // Expanded window event listeners
        const closeBtn = widgetContainer.querySelector('.mj-chatbot-close');
        const minimizeBtn = widgetContainer.querySelector('.mj-chatbot-minimize');
        const input = widgetContainer.querySelector('.mj-chatbot-input');
        const sendBtn = widgetContainer.querySelector('.mj-chatbot-send-button');
        const suggestions = widgetContainer.querySelectorAll('.mj-chatbot-suggestion');

        if (closeBtn) {
          closeBtn.addEventListener('click', handleClose);
        }

        if (minimizeBtn) {
          minimizeBtn.addEventListener('click', handleClose);
        }

        if (input) {
          input.addEventListener('input', handleInputChange);
          input.addEventListener('keydown', (e) => {
            // Shift+Enter for new line, Enter alone to send
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          });
        }

        if (sendBtn) {
          sendBtn.addEventListener('click', handleSendMessage);
        }

        suggestions.forEach(suggestion => {
          suggestion.addEventListener('click', (e) => {
            const question = e.currentTarget.dataset.question;
            handleSuggestionClick(question);
          });
        });

        // ESC to close
        document.addEventListener('keydown', handleEscapeKey);

      } else {
        // Minimized bubble event listeners
        const bubble = widgetContainer.querySelector('.mj-chatbot-bubble');
        if (bubble) {
          bubble.addEventListener('click', handleOpen);
          bubble.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpen();
            }
          });
        }
      }
    }

    function handleInputChange(e) {
      const input = e.target;
      const sendBtn = widgetContainer.querySelector('.mj-chatbot-send-button');

      // Auto-resize textarea
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';

      // Enable/disable send button
      if (sendBtn) {
        sendBtn.disabled = !input.value.trim();
      }
    }

    function handleSendMessage() {
      const input = widgetContainer.querySelector('.mj-chatbot-input');
      if (!input) return;

      const message = input.value.trim();
      if (!message) return;

      log('Sending message:', message);

      // Add user message to conversation
      addMessage('user', message);

      // Clear input
      input.value = '';
      input.style.height = 'auto';
      const sendBtn = widgetContainer.querySelector('.mj-chatbot-send-button');
      if (sendBtn) sendBtn.disabled = true;

      // Show typing indicator
      setState({ isTyping: true });

      // Simulate bot response (TODO: Replace with actual API call in Task #5)
      setTimeout(() => {
        setState({ isTyping: false });
        addMessage('bot', `Thanks for your message! You asked: "${message}"\n\nAPI integration coming in Task #5. For now, this is a placeholder response.`);
      }, 2000);
    }

    function handleSuggestionClick(question) {
      log('Suggestion clicked:', question);

      // Add user message directly (don't populate input)
      addMessage('user', question);

      // Show typing indicator
      setState({ isTyping: true });

      // Simulate bot response (TODO: Replace with actual API call in Task #5)
      setTimeout(() => {
        setState({ isTyping: false });
        addMessage('bot', `Great question! You asked: "${question}"\n\nAPI integration coming in Task #5. The backend will provide a detailed answer based on the 190-entry knowledge base.`);
      }, 2000);
    }

    function handleEscapeKey(e) {
      if (e.key === 'Escape' && state.isOpen) {
        handleClose();
      }
    }

    function handleOpen() {
      log('Opening widget');
      setState({ isOpen: true });
    }

    function handleClose() {
      log('Closing widget');
      // Remove ESC key listener
      document.removeEventListener('keydown', handleEscapeKey);
      setState({ isOpen: false });
    }

    function init() {
      if (state.initialized) {
        log('Already initialized');
        return;
      }

      log('Initializing chatbot widget', { config: CONFIG });

      injectStyles();
      createContainer();
      render();

      setState({ initialized: true });
      log('Initialization complete');
    }

    // Public API
    return {
      init,
      open: handleOpen,
      close: handleClose,
      getState: () => ({ ...state }),
      // For testing/debugging
      addUserMessage: (text) => addMessage('user', text),
      addBotMessage: (text) => addMessage('bot', text),
      clearMessages: () => setState({ messages: [] }),
      setTyping: (isTyping) => setState({ isTyping })
    };
  })();

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  function initWidget() {
    log('Document ready, initializing widget');
    ChatbotWidget.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  // Expose to window for debugging (can be removed in production)
  if (CONFIG.debug) {
    window.MJ_CHATBOT = ChatbotWidget;
  }

})();
