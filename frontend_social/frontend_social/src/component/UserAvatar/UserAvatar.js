// src/components/UserAvatar.jsx
import React from 'react';
import './UserAvatar.css';

const UserAvatar = ({ username = "", image = null, size = "medium", showOnline = false }) => {
    const firstLetter = username?.[0]?.toUpperCase() || "?";

    // Kiểm tra có ảnh hợp lệ không
    const hasValidImage = image && typeof image === "string" && image.trim() !== "";

    return (
        <div className={`user-avatar ${size === "large" ? "large" : size === "small" ? "small" : "medium"} ${showOnline ? "online" : ""}`}>
            {/* Ảnh thật từ base64 */}
            {hasValidImage && (
                <img
                    src={image}
                    alt={username}
                    className="avatar-image"
                    onError={(e) => {
                        // Nếu ảnh lỗi → ẩn ảnh, hiện chữ cái
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                    }}
                />
            )}

            {/* Chữ cái đầu – fallback khi không có ảnh hoặc ảnh lỗi */}
            <span
                className="avatar-letter"
                style={{ display: hasValidImage ? "none" : "flex" }}
            >
                {firstLetter}
            </span>

        </div>
    );
};

export default UserAvatar;