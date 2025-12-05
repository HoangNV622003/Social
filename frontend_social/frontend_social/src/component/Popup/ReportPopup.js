// src/components/post/ReportPopup.js
import React, { useState } from 'react';
import './ReportPopup.css';
import { reportPost } from '../../apis/ReportedPostService';
import { useAuth } from '../../context/AuthContext'; // hoặc hook lấy token của bạn
import { toast } from 'react-toastify';

const ReportPopup = ({ postId, onClose }) => {
    const { token } = useAuth(); // Lấy token từ context
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            setError('Vui lòng nhập lý do báo cáo');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await reportPost(postId, reason.trim(), token);
            toast.success("Báo cáo bài viết thành công")
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Báo cáo thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-popup-overlay" onClick={onClose}>
            <div className="report-popup" onClick={(e) => e.stopPropagation()}>
                <div className="report-header">
                    <h3>Báo cáo bài viết</h3>
                    <button className="close-btn" onClick={onClose} disabled={loading}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="report-form">
                    <p>Vui lòng cho chúng tôi biết lý do bạn báo cáo bài viết này:</p>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Mô tả chi tiết lý do..."
                        rows="5"
                        required
                        disabled={loading}
                    />

                    {error && <div className="error-text">{error}</div>}

                    <div className="report-actions">
                        <button type="button" onClick={onClose} disabled={loading}>
                            Hủy
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportPopup;