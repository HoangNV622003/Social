// src/pages/admin/components/ReportTable.jsx
import React, { useState } from 'react';
import { IMAGE_SERVER_URL } from '../../../constants/CommonConstants';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import './ReportTable.css';
import ImageViewer from '../../../component/ImageViewer/ImageViewer';

const ReportTable = ({ reports, onDelete, onIgnore }) => {
    const [textPopup, setTextPopup] = useState({ open: false, title: '', content: '' });
    const [imagePopup, setImagePopup] = useState({ open: false, urls: [] });

    const openTextPopup = (title, content) => {
        setTextPopup({ open: true, title, content: content || 'Không có nội dung' });
        document.body.style.overflow = 'hidden';
    };

    const openImagePopup = (urls) => {
        setImagePopup({ open: true, urls });
        document.body.style.overflow = 'hidden';
    };

    const closeAllPopups = () => {
        setTextPopup({ open: false, title: '', content: '' });
        setImagePopup({ open: false, urls: [] });
        document.body.style.overflow = 'auto';
    };

    return (
        <>
            {/* Bảng báo cáo */}
            <div className="report-table-container">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Lý do báo cáo</th>
                            <th>Nội dung bài viết</th>
                            <th>Hình ảnh</th>
                            <th>Lựa chọn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((r, index) => (
                            <tr key={r.reportId} className="report-row">
                                <td className="text-center fw-bold text-primary">{index + 1}</td>

                                <td>
                                    <div
                                        className="clickable-cell reason-cell"
                                        onClick={() => openTextPopup('Lý do báo cáo', r.reason)}
                                    >
                                        {r.reason && r.reason.length > 60
                                            ? `${r.reason.substring(0, 57)}...`
                                            : r.reason || 'Không có lý do'}
                                    </div>
                                </td>

                                <td>
                                    <div
                                        className="clickable-cell content-cell"
                                        onClick={() => openTextPopup('Nội dung bài viết', r.postContent)}
                                    >
                                        {r.postContent && r.postContent.length > 80
                                            ? `${r.postContent.substring(0, 77)}...`
                                            : r.postContent || 'Trống'}
                                    </div>
                                </td>

                                <td className="text-center">
                                    {r.postImages && r.postImages.length > 0 ? (
                                        <img
                                            src={`${IMAGE_SERVER_URL}/${r.postImages[0]}`} // dùng ảnh đầu tiên để preview
                                            alt="post"
                                            className="thumbnail-img"
                                            onClick={() => openImagePopup(r.postImages)}
                                        />
                                    ) : (
                                        <span className="no-image">—</span>
                                    )}
                                </td>

                                <td className="action-buttons">
                                    <button className="btn-delete" onClick={() => onDelete(r.postId)}>
                                        Xóa bài
                                    </button>
                                    <button className="btn-ignore" onClick={() => onIgnore(r.reportId)}>
                                        Bỏ qua
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* POPUP VĂN BẢN - giữ nguyên */}
            {textPopup.open && (
                <div className="popup-overlay" onClick={closeAllPopups}>
                    <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
                        <IoIosCloseCircleOutline
                            className="popup-close-icon"
                            onClick={closeAllPopups}
                        />
                        <h2>{textPopup.title}</h2>
                        <div className="popup-content">
                            <p>{textPopup.content}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* POPUP ẢNH - CHỈ SỬA PHẦN NÀY */}
            {imagePopup.open && (
                <div className="popup-overlay" onClick={closeAllPopups}>
                    {/* Wrapper quan trọng nhất – chặn sự kiện click lan lên overlay */}
                    <div
                        className="image-viewer-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Nút X đóng riêng cho ảnh */}
                        <button
                            className="image-viewer-close-btn"
                            onClick={closeAllPopups}
                        >
                            ×
                        </button>

                        {/* ImageViewer hiện tại của bạn – không cần sửa gì cả */}
                        <ImageViewer images={imagePopup.urls} />
                    </div>
                </div>
            )}
        </>
    );
};

export default ReportTable;