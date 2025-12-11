// src/pages/admin/components/UserList/UserItem.jsx
import React from 'react';
import UserEditPopup from '../../../component/Popup/UserEditPopup/UserEditPopup'; // Đường dẫn đúng
import './UserItem.css';
import { IMAGE_SERVER_URL } from '../../../constants/CommonConstants';

const UserItem = ({ user, onUserUpdated }) => {
    const [isEditOpen, setIsEditOpen] = React.useState(false);

    const avatarUrl = user.image;

    return (
        <>
            <div className="user-card">
                <div className="user-avatar">
                    {avatarUrl ? (
                        <img
                            src={`${IMAGE_SERVER_URL}/${avatarUrl}`}
                            alt={user.username}
                            className="user-avatar-img"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}

                    <div
                        className="avatar-placeholder"
                        style={{ display: avatarUrl ? 'none' : 'flex' }}
                    >
                        {user.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                </div>

                <div className="user-details">
                    <h3 className="user-username">{user.username || 'Ẩn danh'}</h3>
                </div>

                <div className="user-actions">
                    <span className={`role-badge ${user.admin ? 'admin' : 'user'}`}>
                        {user.admin ? 'Admin' : 'User'}
                    </span>
                    <button
                        className="edit-btn"
                        onClick={() => setIsEditOpen(true)}
                    >
                        Chỉnh sửa
                    </button>
                </div>
            </div>

            {isEditOpen && (
                <UserEditPopup
                    userId={user.id}
                    onClose={() => setIsEditOpen(false)}
                    onUpdateSuccess={() => {
                        setIsEditOpen(false);
                        onUserUpdated?.(); // Gọi refresh danh sách
                    }}
                />
            )}
        </>
    );
};

export default React.memo(UserItem);