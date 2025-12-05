// src/components/Friend/FriendList.jsx
import React from 'react';
import FriendItem from './FriendItem';
import './FriendList.css';

const FriendList = ({ friends, currentUserId }) => {
    if (!friends || friends.length === 0) {
        return (
            <div className="friend-list-empty">
                <p>Chưa có bạn bè nào</p>
            </div>
        );
    }

    return (
        <div className="friend-list">
            {friends.map(friend => (
                <FriendItem
                    key={friend.id}
                    id={friend.id}
                    username={friend.username}
                    image={friend.image}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
};

export default FriendList;