// src/pages/FriendRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../component/Navbar/Navbar';
import FriendRequestItem from './FriendRequestItem';
import { acceptFriendRequest, deleteFriendRequest, getFriendRequest } from '../../apis/FriendService';
import { toast } from 'react-toastify';
import { FiUserCheck } from 'react-icons/fi';
import './FriendRequestPage.css';

const FriendRequestsPage = () => {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!token) return;
            try {
                const res = await getFriendRequest(token);
                setRequests(res.data.content || []);
            } catch (err) {
                toast.error('Không tải được lời mời kết bạn');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [token]);

    const handleAccept = async (requestId, userId) => {
        try {
            await acceptFriendRequest(userId, token);
            setRequests(prev => prev.filter(r => r.id !== requestId));
            toast.success('Đã chấp nhận kết bạn!');
        } catch (err) {
            toast.error('Lỗi khi chấp nhận');
        }
    };

    const handleDecline = async (requestId) => {
        try {
            await deleteFriendRequest(requestId, token);
            setRequests(prev => prev.filter(r => r.id !== requestId));
            toast.success('Đã từ chối lời mời');
        } catch (err) {
            toast.error('Lỗi khi từ chối');
        }
    };

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
                    <div className="fr-loading">Đang tải lời mời kết bạn...</div>
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
                        <FiUserCheck size={80} color="#ccc" />
                        <h3>Chưa có lời mời kết bạn nào</h3>
                        <p>Khi có người gửi lời mời, bạn sẽ thấy ở đây.</p>
                    </div>
                ) : (
                    <div className="fr-list">
                        {requests.map((req) => (
                            <FriendRequestItem
                                key={req.id}
                                request={req}
                                onAccept={handleAccept}
                                onDecline={handleDecline}
                                formatTime={formatTime}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendRequestsPage;