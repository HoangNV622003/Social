// src/components/User/UserList.jsx
import React from 'react';
import UserItem from './UserItem';
import './UserList.css';

const UserList = ({ users = [], currentUserId, title }) => {
    if (!users || users.length === 0) {
        return null; // không hiển thị gì nếu không có user (do SearchPage đã có header riêng)
    }

    return (
        <div className="user-grid-list">
            {users.map((user) => (
                <div key={user.id} className="user-grid-item">
                    <UserItem user={user} currentUserId={currentUserId} />
                </div>
            ))}
        </div>
    );
};

export default UserList;