// src/components/group/FriendSearchItem.jsx
import React from 'react';
import './FriendSearchItem.css';

const FriendSearchItem = ({ friend, isSelected, onSelect }) => {
    return (
        <div
            className={`fsi-item ${isSelected ? 'selected' : ''}`}
            onClick={isSelected ? null : onSelect}
        >
            <img
                src={friend.image || '/default-avatar.png'}
                alt={friend.username}
                className="fsi-avatar"
            />
            <span className="fsi-name">{friend.username}</span>
            {isSelected && <span className="fsi-check">✓ Đã chọn</span>}
        </div>
    );
};

export default FriendSearchItem;