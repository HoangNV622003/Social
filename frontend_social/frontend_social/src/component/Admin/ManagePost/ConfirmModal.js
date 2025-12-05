import React from 'react';
import { deletePost } from '../../../apis/PostService';
import { ignoreReport } from '../../../apis/ReportedPostService';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import "./ConfirmModal.css"
const ConfirmModal = ({ isOpen, config, onClose, onSuccess }) => {
    const { token } = useAuth();

    if (!isOpen) return null;

    const handleConfirm = async () => {
        try {
            if (config.type === 'delete') {
                console.log("configid", config)
                await deletePost(config.id, token);
                toast.success("Đã xóa bài viết!");
            } else {
                await ignoreReport(config.id, token);
                toast.success("Đã bỏ qua báo cáo!");
            }
            onSuccess();
        } catch {
            toast.error("Thao tác thất bại");
        } finally {
            onClose();
        }
    };

    return (
        <div className="confirm-overlay" onClick={onClose}>
            <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                <h3>{config.title}</h3>
                <p>{config.message}</p>
                <div className="confirm-buttons">
                    <button className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button
                        className={config.type === 'delete' ? 'btn-confirm-danger' : 'btn-confirm'}
                        onClick={handleConfirm}
                    >
                        {config.type === 'delete' ? 'Xóa' : 'Bỏ qua'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;