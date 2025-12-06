// src/components/Popup/DeleteConfirmPopup.js
import React, { useState } from 'react';
import { deletePost } from '../../apis/PostService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './DeleteConfirmPopup.css';

const DeleteConfirmPopup = ({ postId, onClose, onSuccess }) => {
    const { token } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!token) {
            toast.error('Phiên đăng nhập hết hạn');
            onClose();
            return;
        }

        setIsDeleting(true);
        try {
            await deletePost(postId, token);
            toast.success('Xóa bài viết thành công!');
            onSuccess?.(postId); // Gọi callback để PostList xóa khỏi UI
            onClose();
        } catch (error) {
            const message = error.response?.data?.message || 'Xóa bài viết thất bại';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="delete-confirm-overlay" onClick={onClose}>
            <div className="delete-confirm-popup" onClick={(e) => e.stopPropagation()}>
                <div className="delete-confirm-content">
                    <h3>Xóa bài viết</h3>
                    <p>Bạn có chắc chắn muốn xóa bài viết này?<br />Hành động này không thể hoàn tác.</p>
                </div>

                <div className="delete-confirm-actions">
                    <button
                        className="btn-cancel"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Hủy
                    </button>
                    <button
                        className="btn-delete"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmPopup;