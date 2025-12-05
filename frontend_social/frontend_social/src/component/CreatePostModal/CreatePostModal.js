// src/components/Post/CreatePostModal.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../apis/PostService';
import { toast } from 'react-toastify';
import UserAvatar from '../UserAvatar/UserAvatar';
import './CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const { token, user: currentUser } = useAuth();
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!content.trim() && !imageFile) {
            toast.error('Vui lòng nhập nội dung hoặc chọn ảnh');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('content', content.trim());
            if (imageFile) formData.append('file', imageFile);

            await createPost(token, formData);
            toast.success('Đăng bài thành công!');

            // Reset
            setContent('');
            removeImage();
            onClose();

            // GỌI CALLBACK ĐỂ RELOAD BÀI VIẾT (an toàn, không reload trang)
            if (onPostCreated) onPostCreated();

        } catch (err) {
            toast.error('Đăng bài thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-overlay" onClick={onClose}>
            <div className="create-post-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Tạo bài viết</h2>
                    <button className="close-btn" onClick={onClose} disabled={loading}>×</button>
                </div>
                <div className="modal-body">

                    <div className="modal-user">
                        <UserAvatar username={currentUser?.username} image={currentUser?.image} size="medium" />
                        <span className="username">{currentUser?.username || 'Bạn'}</span>
                    </div>

                    <textarea
                        placeholder={`${currentUser?.username || 'Bạn'} ơi, bạn đang nghĩ gì thế?`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="5"
                        disabled={loading}
                        autoFocus
                    />

                    {imagePreview && (
                        <div className="image-preview-container">
                            <img src={imagePreview} alt="Preview" className="image-preview" />
                            <button className="remove-image" onClick={removeImage} disabled={loading}>×</button>
                        </div>
                    )}

                    <div className="add-photo-section">
                        <label className="add-photo-btn">
                            Thêm ảnh
                            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} disabled={loading} />
                        </label>
                    </div>

                    <div className="modal-footer">
                        <button
                            className={`submit-btn ${(!content.trim() && !imageFile) || loading ? 'disabled' : ''}`}
                            onClick={handleSubmit}
                            disabled={(!content.trim() && !imageFile) || loading}
                        >
                            {loading ? 'Đang đăng...' : 'Đăng'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;