// src/components/Friend/FriendItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FriendItem.css';

const FriendItem = ({ id, username, image, currentUserId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (id === currentUserId) return; // Không chuyển hướng nếu là chính mình
        navigate(`/profile/${id}`);
    };

    const displayAvatar = image ? (
        <img src={image} alt={username} className="friend-avatar-img" />
    ) : (
        <div className="friend-avatar-placeholder">
            {username?.charAt(0).toUpperCase() || '?'}
        </div>
    );

    return (
        <div className="friend-item" onClick={handleClick}>
            <div className="friend-avatar">
                {displayAvatar}
            </div>
            <div className="friend-name">{username || 'Không tên'}</div>
        </div>
    );
};

export default FriendItem;