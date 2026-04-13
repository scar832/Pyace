import React from 'react';
import { Send, MoreHorizontal } from 'lucide-react';
import './RecentChats.css';

const RecentChats = ({ chats }) => {
    return (
        <div className="widget chats-widget-modern">
            <div className="widget-header">
                <h3>Recent Chats</h3>
                <button className="icon-btn"><MoreHorizontal size={18} /></button>
            </div>
            <div className="chats-list-modern">
                {chats.map((chat, idx) => (
                    <div key={idx} className="chat-item-modern">
                        <div className="chat-avatar-wrapper">
                            {chat.avatarUrl ? (
                                <img src={chat.avatarUrl} alt={chat.name} className="chat-avatar-image" />
                            ) : (
                                <div className="chat-avatar-placeholder">
                                    {chat.name.charAt(0)}
                                </div>
                            )}
                            <div className={`chat-status-indicator ${chat.status}`}></div>
                        </div>
                        <div className="chat-content-modern">
                            <div className="chat-header-row">
                                <h4 className="chat-name">{chat.name}</h4>
                                {chat.time && <span className="chat-time">{chat.time}</span>}
                            </div>
                            <p className="chat-last-msg">{chat.lastMsg}</p>
                        </div>
                        <button className="chat-action-btn">
                            <Send size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentChats;
