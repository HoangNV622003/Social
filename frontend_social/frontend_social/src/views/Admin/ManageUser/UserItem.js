// src/pages/admin/components/UserList/UserItem.jsx
import React from 'react';
import UserEditPopup from '../../../component/Popup/UserEditPopup/UserEditForm';
import './UserItem.css';
import { IMAGE_SERVER_URL } from '../../../constants/CommonConstants';

const UserItem = ({ user }) => {
    const [isEditOpen, setIsEditOpen] = React.useState(false);

    // Xác định URL ảnh avatar
    const avatarUrl = user.image
    return (
        <>
            <div className="user-card">
                <div className="user-avatar">
                    {avatarUrl ? (
                        <img
                            src={IMAGE_SERVER_URL + "/" + avatarUrl}
                            alt={user.username}
                            className="user-avatar-img"
                            onError={(e) => {
                                // Nếu ảnh lỗi (404, hỏng, v.v.) → fallback về placeholder
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}

                    {/* Placeholder chỉ hiện khi không có ảnh hoặc ảnh lỗi */}
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

            {/* Popup chỉnh sửa */}
            {isEditOpen && (
                <UserEditPopup
                    userId={user.id}
                    onClose={() => setIsEditOpen(false)}
                    onUpdateSuccess={() => {
                        setIsEditOpen(false);
                        // Tùy chọn: reload trang hoặc emit event để refresh danh sách
                        // window.location.reload();
                    }}
                />
            )}
        </>
    );
};

export default React.memo(UserItem);