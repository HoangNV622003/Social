// src/components/User/UserItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../../../component/UserAvatar/UserAvatar';
import './UserItem.css';

const UserItem = ({ user, currentUserId }) => {
    const navigate = useNavigate();

    const { id, username, image } = user;

    const handleClick = () => {
        if (id === currentUserId) return; // Không chuyển hướng nếu là chính mình
        navigate(`/profile/${id}`);
    };

    return (
        <div className="user-item-card" onClick={handleClick}>
            <div className="user-item-avatar">
                <UserAvatar
                    username={username}
                    image={image}
                    size="medium"
                />
            </div>

            <div className="user-item-info">
                <h3 className="user-item-name">{username || 'Người dùng'}</h3>
            </div>

            <div className="user-item-action">
                <button className="view-profile-btn">
                    Xem trang cá nhân
                </button>
            </div>
        </div>
    );
};

export default UserItem;