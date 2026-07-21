import React, { useState } from 'react';
import { sendChatMessage } from '../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            <div className="message-content">Typing...</div>
          </div>
        )}
      </div>
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          className="message-input"
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()} className="send-button">
          Send
        </button>
      </form>
      <style jsx>{`
        .chat-interface {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          height: 80vh;
          display: flex;
          flex-direction: column;
        }
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 20px;
          background-color: #f9f9f9;
        }
        .message {
          margin-bottom: 15px;
          padding: 10px;
          border-radius: 8px;
          max-width: 70%;
        }
        .message.user {
          background-color: #007bff;
          color: white;
          margin-left: auto;
          text-align: right;
        }
        .message.bot {
          background-color: #e9ecef;
          color: #333;
        }
        .message.loading {
          opacity: 0.7;
          font-style: italic;
        }
        .message-content {
          margin-bottom: 5px;
        }
        .message-timestamp {
          font-size: 0.8em;
          opacity: 0.7;
        }
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .input-form {
          display: flex;
          gap: 10px;
        }
        .message-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        .message-input:disabled {
          opacity: 0.6;
        }
        .send-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .send-button:hover:not(:disabled) {
          background-color: #0056b3;
        }
        @media (max-width: 768px) {
          .chat-interface {
            padding: 10px;
            height: 90vh;
          }
          .message {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;