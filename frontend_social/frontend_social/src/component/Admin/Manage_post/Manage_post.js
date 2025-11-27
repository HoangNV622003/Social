// src/pages/admin/Manage_post.jsx
import React, { useState, useEffect } from 'react';
import './Manage_post.css';
import { useAuth } from '../../../context/AuthContext';
import { getAllReports, deleteReportedPost, ignoreReport } from '../../../apis/ReportedPostService';
import { toast } from 'react-toastify';
import Manage_web from '../Manage_web';

const Manage_post = () => {
    const { token } = useAuth();
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState('');

    const fetchReports = async () => {
        if (!token) return;
        try {
            const res = await getAllReports(token, page, 5);
            setReports(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            toast.error("Không thể tải báo cáo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [page, token]);

    const handleDelete = async (postId) => {
        if (!window.confirm("Xóa bài viết này?")) return;
        try {
            await deleteReportedPost(postId, token);
            toast.success("Đã xóa bài viết!");
            setReports(prev => prev.filter(r => r.postId !== postId));
        } catch {
            toast.error("Xóa thất bại");
        }
    };

    const handleIgnore = async (reportId) => {
        if (!window.confirm("Bỏ qua báo cáo này?")) return;
        try {
            await ignoreReport(reportId, token);
            toast.success("Đã bỏ qua!");
            setReports(prev => prev.filter(r => r.reportId !== reportId));
        } catch {
            toast.error("Thất bại");
        }
    };

    // Mở lightbox
    const openLightbox = (imageBase64) => {
        setLightboxImage(`data:image/png;base64,${imageBase64}`);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden'; // Chặn scroll nền
    };

    // Đóng lightbox
    const closeLightbox = () => {
        setLightboxOpen(false);
        setLightboxImage('');
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="main">
            <Manage_web />

            <div className="manage-post-page">
                <h1>Quản lý bài viết bị báo cáo</h1>

                {loading ? (
                    <div className="loading">Đang tải báo cáo...</div>
                ) : reports.length === 0 ? (
                    <div className="empty">Không có báo cáo nào</div>
                ) : (
                    <>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>ID Báo cáo</th>
                                    <th>ID Bài viết</th>
                                    <th>Lý do</th>
                                    <th>Người báo</th>
                                    <th>Nội dung</th>
                                    <th>Ảnh</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map(r => (
                                    <tr key={r.reportId}>
                                        <td>{r.reportId}</td>
                                        <td>{r.postId}</td>
                                        <td>{r.reason}</td>
                                        <td>{r.reportedBy || 'Ẩn danh'}</td>
                                        <td className="content">{r.postContent || 'Trống'}</td>
                                        <td className="image">
                                            {r.postImage ? (
                                                <img
                                                    src={`data:image/png;base64,${r.postImage}`}
                                                    alt="post"
                                                    onClick={() => openLightbox(r.postImage)}
                                                    style={{ cursor: 'zoom-in' }}
                                                />
                                            ) : 'Không có'}
                                        </td>
                                        <td className="actions">
                                            <button className="btn-delete" onClick={() => handleDelete(r.postId)}>
                                                XÓA
                                            </button>
                                            <button className="btn-ignore" onClick={() => handleIgnore(r.reportId)}>
                                                BỎ QUA
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                                Trước
                            </button>
                            <span>Trang {page + 1} / {totalPages}</span>
                            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                                Sau
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* LIGHTBOX – PHÓNG TO ẢNH */}
            {lightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={lightboxImage} alt="Phóng to" className="lightbox-image" />
                        <button className="lightbox-close" onClick={closeLightbox}>
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Manage_post;