// src/pages/EditProfile/components/AvatarUploader.jsx
import React from 'react';
import { IMAGE_SERVER_URL } from '../../constants/CommonConstants';

const AvatarUploader = ({ avatarUrl, originalAvatar, onAvatarChange, disabled }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            onAvatarChange(file, previewUrl);
        }
    };

    const handleRemove = () => {
        onAvatarChange(null, null); // Sẽ được xử lý trong EditProfile để quay về ảnh gốc
    };

    // Xác định URL thực tế để hiển thị
    const getDisplayUrl = () => {
        if (!avatarUrl) return null;

        // Nếu là ảnh preview (blob: hoặc data:)
        if (typeof avatarUrl === 'string' && (avatarUrl.startsWith('blob:') || avatarUrl.startsWith('data:'))) {
            return avatarUrl;
        }

        // Nếu là đường dẫn từ server → nối với IMAGE_SERVER_URL
        return `${IMAGE_SERVER_URL}${avatarUrl}`;
    };

    const displayUrl = getDisplayUrl();

    return (
        <div className="avatar-uploader">
            <div className="avatar-preview">
                {displayUrl ? (
                    <img src={displayUrl} alt="Avatar" />
                ) : (
                    <div className="avatar-placeholder">
                        <span>Chưa có ảnh</span>
                    </div>
                )}
            </div>

            <div className="avatar-actions">
                <label className="btn-upload">
                    Chọn ảnh mới
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={disabled}
                    />
                </label>

                {/* Chỉ hiện nút Xóa khi đang có preview ảnh mới hoặc có ảnh gốc */}
                {(avatarUrl && avatarUrl !== originalAvatar) && (
                    <button type="button" className="btn-remove" onClick={handleRemove} disabled={disabled}>
                        Xóa tạm thời
                    </button>
                )}
            </div>

            <p className="help-text">JPG, PNG, GIF • Tối đa 5MB</p>
        </div>
    );
};

export default AvatarUploader;