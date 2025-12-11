// src/components/FriendRequestItem/FriendRequestItem.jsx
import React from 'react';
import { FiUserCheck, FiUserX, FiClock } from 'react-icons/fi';
import UserAvatar from '../../component/UserAvatar/UserAvatar';
import './FriendRequestItem.css';
import { useNavigate } from 'react-router-dom';
const FriendRequestItem = ({ request, onAccept, onDecline, formatTime }) => {
    const navigate = useNavigate();
    const { id, userId, name, image, dateCreated } = request;

    return (
        <div className="friend-request-item">
            <div className="friend-request-avatar" onClick={() => navigate(`/profile/${userId}`)}>
                <UserAvatar username={name} image={image} size="large" showOnline={false} />
            </div>

            <div className="friend-request-info">
                <h3 className="friend-request-name">{name}</h3>
                <p className="friend-request-time">
                    <FiClock size={14} />
                    {formatTime(dateCreated)}
                </p>
            </div>

            <div className="friend-request-actions">
                <button
                    onClick={() => onAccept(id, userId)}
                    className="friend-request-btn accept"
                    title="Chấp nhận kết bạn"
                >
                    <FiUserCheck size={18} />
                    <span>Chấp nhận</span>
                </button>

                <button
                    onClick={() => onDecline(id)}
                    className="friend-request-btn decline"
                    title="Từ chối lời mời"
                >
                    <FiUserX size={18} />
                    <span>Xóa</span>
                </button>
            </div>
        </div>
    );
};

export default FriendRequestItem;