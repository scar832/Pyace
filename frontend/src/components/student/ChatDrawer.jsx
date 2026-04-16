import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';
import '../../Styles/chatDrawer.css';

const ChatDrawer = ({ isOpen, onClose, chatContext, mockMessages }) => {
  const [inputValue, setInputValue] = useState('');

  // Prevent clicks inside the drawer from bubbling to the overlay
  const handleDrawerClick = (e) => {
    e.stopPropagation();
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    // In a real app, this would append to messages
    console.log('Sending message:', inputValue, 'to', chatContext?.name || chatContext);
    setInputValue('');
  };

  // Determine chat title
  const getChatTitle = () => {
    if (!chatContext) return 'Chat';
    if (typeof chatContext === 'string') return chatContext;
    return chatContext.name;
  };

  return (
    <>
      <div 
        className={`chat-drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      <div className={`chat-drawer ${isOpen ? 'open' : ''}`} onClick={handleDrawerClick}>
        
        {/* Header */}
        <div className="chat-drawer-header">
          <div className="chat-header-info">
            <div className="chat-header-avatar">
              {typeof chatContext === 'object' && chatContext?.name ? (
                chatContext.name.substring(0, 1)
              ) : (
                <User size={18} />
              )}
            </div>
            <h3 className="chat-header-title">{getChatTitle()}</h3>
          </div>
          <button className="chat-close-btn" onClick={onClose} aria-label="Close Chat">
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <div className="chat-drawer-messages">
          {mockMessages && mockMessages.length > 0 ? (
            mockMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-bubble-wrapper ${msg.isSent ? 'sent' : 'received'}`}
              >
                <div className="chat-bubble">
                  {msg.text}
                </div>
                <span className="chat-time">{msg.time}</span>
              </div>
            ))
          ) : (
            <div className="chat-empty-state">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="chat-drawer-input-area">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Type your message..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className={`chat-send-btn ${inputValue.trim() ? 'active' : ''}`} 
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </>
  );
};

export default ChatDrawer;
