// src/components/chat/ChatOptionsPopup.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatOptionsPopup.css';

const ChatOptionsPopup = ({ chat, opponent, onClose, onUpdateGroup }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        if (chat.type === 'PRIVATE' && opponent.id) {
            navigate(`/profile/${opponent.id}`);
        }
        onClose();
    };

    const handleDeleteChat = () => {
        // TODO: Xóa đoạn chat
        alert('Tính năng xóa đoạn chat đang phát triển');
        onClose();
    };

    const handleUpdateGroup = () => {
        onUpdateGroup?.();
        onClose();
    };

    return (
        <div className="chat-options-overlay" onClick={onClose}>
            <div className="chat-options-popup" onClick={e => e.stopPropagation()}>
                {chat.type === 'PRIVATE' ? (
                    <>
                        <button onClick={handleViewProfile} className="option-item">
                            Xem trang cá nhân
                        </button>
                        <button onClick={handleDeleteChat} className="option-item danger">
                            Xóa đoạn chat
                        </button>
                    </>
                ) : (
                    <button onClick={handleUpdateGroup} className="option-item">
                        Cập nhật phòng chat
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatOptionsPopup;