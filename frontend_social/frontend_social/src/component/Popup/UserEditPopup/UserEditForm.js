// src/pages/admin/components/UserEditPopup/UserEditForm.jsx
import React, { useState, useEffect } from 'react';
import { FiUpload, FiUser, FiMail, FiHome, FiShield } from 'react-icons/fi';
import "./UserEditForm.css";
import { IMAGE_SERVER_URL } from '../../../constants/CommonConstants'; // Thêm dòng này

const UserEditForm = ({ user, onSubmit, onCancel, isSaving }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        address: user?.address || '',
        isAdmin: user?.role === "ROLE_ADMIN" || false,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Tạo URL ảnh gốc từ API (có xử lý / cuối)
    const originalImageUrl = user?.image
        ? `${IMAGE_SERVER_URL}/${user.image}`
        : null;

    // Khi component mount hoặc user thay đổi → đặt lại preview về ảnh gốc
    useEffect(() => {
        setPreview(originalImageUrl);
        setSelectedFile(null); // reset file đã chọn trước đó (nếu mở lại popup)
    }, [user, originalImageUrl]);

    // Xử lý khi người dùng chọn file
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Nếu người dùng bấm "Cancel" trong cửa sổ chọn file → file = undefined
        if (!file) {
            setSelectedFile(null);
            setPreview(originalImageUrl); // quay về ảnh cũ
            return;
        }

        setSelectedFile(file);

        // Tạo preview ảnh mới
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username.trim());
        formDataToSend.append('email', formData.email.trim());
        formDataToSend.append('address', formData.address.trim() || '');
        formDataToSend.append('isAdmin', formData.isAdmin);

        if (selectedFile) {
            formDataToSend.append('file', selectedFile);
        }
        // Không append gì → backend sẽ giữ nguyên ảnh cũ

        onSubmit(formDataToSend);
    };

    return (
        <form onSubmit={handleSubmit} className="ue-form">
            {/* Avatar Section */}
            <div className="ue-avatar-section">
                <div className="ue-avatar-wrapper">
                    <img
                        src={preview} // fallback nếu không có ảnh
                        className="ue-avatar-preview"
                    />
                    <label className="ue-upload-btn">
                        <FiUpload size={18} />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {selectedFile && (
                    <p className="ue-file-name">
                        Đã chọn: {selectedFile.name}
                        <button
                            type="button"
                            className="ue-clear-file"
                            onClick={() => {
                                setSelectedFile(null);
                                setPreview(originalImageUrl);
                                // Reset input file (rất quan trọng để có cái này mới bấm lại được cùng file)
                                document.querySelector('input[type="file"]').value = '';
                            }}
                        >
                            ×
                        </button>
                    </p>
                )}
            </div>

            {/* Các field khác giữ nguyên */}
            <div className="ue-field">
                <label><FiUser /> Tên người dùng</label>
                <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                />
            </div>

            <div className="ue-field">
                <label><FiMail /> Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                />
            </div>

            <div className="ue-field">
                <label><FiHome /> Địa chỉ</label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Không bắt buộc"
                />
            </div>

            <div className="ue-field checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={formData.isAdmin}
                        onChange={e => setFormData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                    />
                    <FiShield /> Quyền Admin
                </label>
            </div>

            <div className="ue-actions">
                <button type="button" className="ue-btn-cancel" onClick={onCancel} disabled={isSaving}>
                    Hủy
                </button>
                <button type="submit" className="ue-btn-save" disabled={isSaving}>
                    {isSaving ? 'Đang lưu...' : 'Cập nhật'}
                </button>
            </div>
        </form>
    );
};

export default UserEditForm;