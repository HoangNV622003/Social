// src/pages/FriendRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import { acceptFriendRequest, deleteFriendRequest, getFriendRequest } from '../../apis/FriendService'; // bạn tạo 2 API này
import { toast } from 'react-toastify';
import { FiUserCheck, FiUserX, FiClock } from 'react-icons/fi';
import './FriendRequestPage.css'; // hoặc .scss nếu bạn dùng

const FriendRequestsPage = () => {
    const { token, user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Gọi API lấy danh sách lời mời kết bạn (giả sử bạn có API này)
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await getFriendRequest(token)
                const data = res.data;
                setRequests(data.content || []);
            } catch (err) {
                toast.error('Không tải được lời mời kết bạn');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchRequests();
    }, [token]);

    const handleAccept = async (requestId, userId) => {
        try {
            await acceptFriendRequest(requestId, token); // API chấp nhận
            setRequests(prev => prev.filter(r => r.id !== requestId));
            toast.success('Đã chấp nhận kết bạn!');
        } catch (err) {
            toast.error('Lỗi khi chấp nhận');
        }
    };

    const handleDecline = async (requestId) => {
        try {
            await deleteFriendRequest(requestId, token); // API xóa lời mời
            setRequests(prev => prev.filter(r => r.id !== requestId));
            toast.success('Đã từ chối lời mời');
        } catch (err) {
            toast.error('Lỗi khi từ chối');
        }
    };

    // Format thời gian
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="fr-page">
                <Navbar />
                <div className="fr-container">
                    <div className="fr-loading">Đang tải lời mời...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fr-page">
            <Navbar />

            <div className="fr-container">
                <h1 className="fr-title">Lời mời kết bạn ({requests.length})</h1>

                {requests.length === 0 ? (
                    <div className="fr-empty">
                        <FiUserCheck size={64} color="#ccc" />
                        <h3>Chưa có lời mời kết bạn nào</h3>
                        <p>Khi có người gửi lời mời, bạn sẽ thấy ở đây.</p>
                    </div>
                ) : (
                    <div className="fr-grid">
                        {requests.map(req => (
                            <div key={req.id} className="fr-card">
                                <div className="fr-avatar">
                                    {req.image ? (
                                        <img src={req.image} alt={req.name} />
                                    ) : (
                                        <div className="fr-avatar-placeholder">
                                            {req.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="fr-info">
                                    <h3 className="fr-name">{req.name}</h3>
                                    <p className="fr-time">
                                        <FiClock size={14} />
                                        {formatTime(req.dateCreated)}
                                    </p>
                                </div>

                                <div className="fr-actions">
                                    <button
                                        onClick={() => handleAccept(req.id, req.userId)}
                                        className="fr-btn accept"
                                    >
                                        <FiUserCheck size={18} />
                                        Chấp nhận
                                    </button>
                                    <button
                                        onClick={() => handleDecline(req.id)}
                                        className="fr-btn decline"
                                    >
                                        <FiUserX size={18} />
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendRequestsPage;