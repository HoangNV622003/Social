// src/pages/admin/components/UserList/UserList.jsx
import React from 'react';
import UserItem from './UserItem';
import './UserList.css';

const UserList = ({
    users,
    loading,
    hasMore,
    page,
    totalPages,
    onLoadMore,
    onUserUpdated // Nhận từ ManageUser
}) => {
    if (loading && users.length === 0) {
        return <div className="user-list-loading">Đang tải người dùng...</div>;
    }

    if (users.length === 0) {
        return <div className="user-list-empty">Không tìm thấy người dùng nào</div>;
    }

    return (
        <div className="user-list-container">
            <div className="user-grid">
                {users.map(user => (
                    <UserItem
                        key={user.id || user.username}
                        user={user}
                        onUserUpdated={onUserUpdated} // Truyền tiếp xuống UserItem
                    />
                ))}
            </div>

            <div className="user-pagination">
                <button
                    onClick={onLoadMore}
                    disabled={loading || !hasMore}
                    className="load-more-btn"
                >
                    {loading ? 'Đang tải...' : hasMore ? 'Tải thêm' : 'Đã tải hết'}
                </button>

                <span className="page-info">
                    Trang {page + 1} / {totalPages}
                </span>
            </div>
        </div>
    );
};

export default React.memo(UserList);