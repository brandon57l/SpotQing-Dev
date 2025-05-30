
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface ChatViewProps {
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isChatInitialized: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  inputValue,
  isLoading,
  error,
  onInputChange,
  onSendMessage,
  isChatInitialized,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const getProcessedHtml = (text: string) => {
    // Configure marked to add breaks for newlines
    const dirty = marked.parse(text, { breaks: true, gfm: true }) as string;
    return DOMPurify.sanitize(dirty);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50"> {/* Ensure it takes full height of its container */}
      <div className="flex-grow p-3 space-y-3 overflow-y-auto bg-gray-100">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow ${
                msg.sender === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              } ${msg.sender === 'ai' ? 'chat-ai-content' : ''}`}
            >
              {msg.sender === 'ai' ? (
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: getProcessedHtml(msg.text) }} />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              )}
              {msg.isStreaming && <span className="inline-block w-2 h-2 ml-1 bg-gray-500 rounded-full animate-pulse"></span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-2 text-xs text-red-700 bg-red-100 border-t border-red-200">
          {error}
        </div>
      )}

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && onSendMessage()}
            placeholder={isLoading ? "AI is thinking..." : (isChatInitialized ? "Ask about Japan..." : "Initializing chat...")}
            className="flex-grow p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
            disabled={isLoading || !isChatInitialized}
            aria-label="Chat message input"
          />
          <button
            onClick={onSendMessage}
            disabled={isLoading || !inputValue.trim() || !isChatInitialized}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 text-sm"
            aria-label="Send chat message"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;