// src/components/chat/ChatDetailHeader.jsx
import React, { useState } from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import { SlOptions } from 'react-icons/sl';
import ChatOptionsPopup from './ChatOptionsPopup';
import './ChatDetailHeader.css';

const ChatDetailHeader = ({ chat, opponent, onUpdateGroup }) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="chat-detail-header">
            <div className="chat-header-info">
                <UserAvatar
                    username={opponent.displayName}
                    image={opponent.displayImage}
                    size="medium"
                />
                <div className="chat-header-text">
                    <h2>{opponent.displayName}</h2>
                    {chat.type === 'GROUP' && (
                        <span className="group-member-count">
                            {chat.members?.length || 0} thành viên
                        </span>
                    )}
                </div>
            </div>

            <button
                className="chat-options-btn"
                onClick={() => setShowOptions(!showOptions)}
            >
                <SlOptions size={22} />
            </button>

            {showOptions && (
                <ChatOptionsPopup
                    chat={chat}
                    opponent={opponent}
                    onClose={() => setShowOptions(false)}
                    onUpdateGroup={onUpdateGroup}
                />
            )}
        </div>
    );
};

export default ChatDetailHeader;