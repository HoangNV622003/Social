// src/components/UserAvatar.jsx
import React from 'react';
import './UserAvatar.css';
import { IMAGE_SERVER_URL } from '../../constants/CommonConstants';

const UserAvatar = ({ username = "", image = null, size = "medium", showOnline = false }) => {
    const firstLetter = username?.[0]?.toUpperCase() || "?";

    // Kiểm tra có ảnh hợp lệ không
    const hasValidImage = image !== null
    return (
        <div className={`user-avatar ${size === "super-large" ? "super-large" : size === "large" ? "large" : size === "small" ? "small" : "medium"} ${showOnline ? "online" : ""}`}>
            {/* Ảnh thật từ base64 */}
            {hasValidImage && (
                <img
                    src={IMAGE_SERVER_URL + image}
                    className="avatar-image"
                />
            )}

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