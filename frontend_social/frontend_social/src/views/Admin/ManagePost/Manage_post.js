// src/pages/admin/Manage_post.jsx
import React, { useState, useEffect } from 'react';
import './Manage_post.css';
import { useAuth } from '../../../context/AuthContext';
import { getAllReports } from '../../../apis/ReportedPostService';
import { toast } from 'react-toastify';
import Manage_web from '../Manage_web';
import ReportTable from './ReportTable';
import Pagination from './Pagination';
import Lightbox from './Lightbox';
import ConfirmModal from './ConfirmModal';
import EmptyState from './EmptyState';

const ManagePost = () => {
    const { token } = useAuth();
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});

    const fetchReports = async () => {
        if (!token) return;
        try {
            const res = await getAllReports(token, page, 5);
            setReports(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            toast.error('Không thể tải báo cáo');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [page, token]);

    const openConfirm = (type, id, onConfirm) => {
        setConfirmConfig({
            type,
            id,
            onConfirm,
            title: type === 'delete' ? 'Xóa bài viết vĩnh viễn?' : 'Bỏ qua báo cáo này?',
            message:
                type === 'delete'
                    ? 'Bài viết sẽ bị xóa hoàn toàn và không thể khôi phục.'
                    : 'Báo cáo sẽ được đánh dấu là đã xử lý.',
        });
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
        setConfirmConfig({});
    };

    return (
        <div className="mp-layout">
            <Manage_web />
            <div className="mp-container">
                <h1>Quản lý bài viết bị báo cáo</h1>
                {loading ? (
                    <div className="mp-loading">Đang tải báo cáo...</div>
                ) : reports.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <ReportTable
                            reports={reports}
                            onDelete={(postId) =>
                                openConfirm('delete', postId, () => { })
                            }
                            onIgnore={(reportId) =>
                                openConfirm('ignore', reportId, () => { })
                            }
                            onImageClick={(img) => {
                                setLightboxImage(img);
                                setLightboxOpen(true);
                            }}
                            setReports={setReports}
                        />
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
            <Lightbox
                isOpen={lightboxOpen}
                image={lightboxImage}
                onClose={() => setLightboxOpen(false)}
            />
            <ConfirmModal
                isOpen={confirmOpen}
                config={confirmConfig}
                onClose={closeConfirm}
                onSuccess={fetchReports}
            />
        </div>
    );
};

export default ManagePost;