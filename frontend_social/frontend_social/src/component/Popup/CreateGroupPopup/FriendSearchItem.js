// src/components/group/FriendSearchItem.jsx
import React from 'react';
import './FriendSearchItem.css';
import UserAvatar from '../../UserAvatar/UserAvatar';

const FriendSearchItem = ({ friend, isSelected, onSelect }) => {
    return (
        <div
            className={`fsi-item ${isSelected ? 'selected' : ''}`}
            onClick={isSelected ? null : onSelect}
        >
            <UserAvatar
                username={friend.username}
                image={friend.image}
                size='small'
            />
            <span className="fsi-name">{friend.username}</span>
            {isSelected && <span className="fsi-check">✓ Đã chọn</span>}
        </div>
    );
};

export default FriendSearchItem;