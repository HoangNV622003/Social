// src/components/common/ConfirmDeletePopup.jsx
import React from 'react';
import './ConfirmDeletePopup.css'; // sẽ tạo dưới đây

const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm, title = "Xác nhận", message = "Bạn có chắc chắn muốn thực hiện hành động này?", confirmText = "Xóa", cancelText = "Hủy" }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-delete-overlay" onClick={onClose}>
            <div className="confirm-delete-popup" onClick={e => e.stopPropagation()}>
                <div className="confirm-delete-header">
                    <h3>{title}</h3>
                </div>
                <div className="confirm-delete-body">
                    <p>{message}</p>
                </div>
                <div className="confirm-delete-footer">
                    <button onClick={onClose} className="btn-cancel">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className="btn-confirm-danger">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeletePopup;