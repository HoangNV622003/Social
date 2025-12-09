// src/components/Post/CreatePostModal.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../apis/PostService';
import { toast } from 'react-toastify';
import UserAvatar from '../UserAvatar/UserAvatar';
import './CreatePostModal.css';

const MAX_IMAGES = 10; // Giới hạn số ảnh tối đa

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const { token, user: currentUser } = useAuth();
    const [content, setContent] = useState('');
    const [imageFiles, setImageFiles] = useState([]);        // Mảng các file
    const [imagePreviews, setImagePreviews] = useState([]);  // Mảng các URL preview
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // Giới hạn tổng số ảnh (cũ + mới)
        if (imageFiles.length + files.length > MAX_IMAGES) {
            toast.warn(`Chỉ được đăng tối đa ${MAX_IMAGES} ảnh!`);
            return;
        }

        const newFiles = [];
        const newPreviews = [];

        files.forEach((file) => {
            if (file.type.startsWith('image/')) {
                newFiles.push(file);

                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews((prev) => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            }
        });

        setImageFiles((prev) => [...prev, ...newFiles]);

        // Reset input để có thể chọn lại cùng file
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!content.trim() && imageFiles.length === 0) {
            toast.error('Vui lòng nhập nội dung hoặc chọn ảnh');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('content', content.trim());

            // Append tất cả ảnh với cùng key "file" (backend sẽ xử lý mảng)
            imageFiles.forEach((file) => {
                formData.append('files', file);
            });

            await createPost(token, formData);
            toast.success('Đăng bài thành công!');

            // Reset form
            setContent('');
            setImageFiles([]);
            setImagePreviews([]);
            onClose();

            if (onPostCreated) onPostCreated();
        } catch (err) {
            toast.error('Đăng bài thất bại');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-overlay" onClick={onClose}>
            <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Tạo bài viết</h2>
                    <button className="close-btn" onClick={onClose} disabled={loading}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-user">
                        <UserAvatar
                            username={currentUser?.username}
                            image={currentUser?.image}
                            size="medium"
                        />
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

                    {/* Preview nhiều ảnh */}
                    {imagePreviews.length > 0 && (
                        <div className="images-preview-grid">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="image-preview-item">
                                    <img src={preview} alt={`Preview ${index + 1}`} />
                                    <button
                                        className="remove-image-btn"
                                        onClick={() => removeImage(index)}
                                        disabled={loading}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="add-photo-section">
                        <label className="add-photo-btn">
                            Thêm ảnh ({imageFiles.length}/{MAX_IMAGES})
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                disabled={loading}
                            />
                        </label>
                    </div>

                    <div className="modal-footer">
                        <button
                            className={`submit-btn ${(!content.trim() && imageFiles.length === 0) || loading
                                ? 'disabled'
                                : ''
                                }`}
                            onClick={handleSubmit}
                            disabled={(!content.trim() && imageFiles.length === 0) || loading}
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