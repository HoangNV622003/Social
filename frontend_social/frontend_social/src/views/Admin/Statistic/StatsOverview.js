// src/pages/admin/components/StatsOverview.jsx
import React from 'react';
import { FiUsers, FiFileText, FiMessageSquare, FiHeart, FiSend } from 'react-icons/fi';

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="stat-card" style={{ borderTop: `5px solid ${color}` }}>
        <div className="stat-icon" style={{ backgroundColor: color + '22', color }}>
            <Icon size={28} />
        </div>
        <div className="stat-info">
            <h3>{value.toLocaleString()}</h3>
            <p>{title}</p>
        </div>
    </div>
);

const StatsOverview = ({ totals }) => {
    const stats = [
        { icon: FiUsers, title: 'Người dùng mới', value: totals.users, color: '#8b5cf6' },
        { icon: FiFileText, title: 'Bài viết', value: totals.posts, color: '#3b82f6' },
        { icon: FiMessageSquare, title: 'Bình luận', value: totals.comments, color: '#10b981' },
        { icon: FiSend, title: 'Tin nhắn', value: totals.messages, color: '#f59e0b' },
        { icon: FiHeart, title: 'Lượt thích', value: totals.likes, color: '#ef4444' },
    ];

    return (
        <div className="stats-grid">
            {stats.map((stat, i) => (
                <StatCard key={i} {...stat} />
            ))}
        </div>
    );
};

export default StatsOverview;