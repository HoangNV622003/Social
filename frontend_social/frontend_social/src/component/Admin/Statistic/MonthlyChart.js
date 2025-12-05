// src/pages/admin/components/MonthlyChart.jsx
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';
import {
    FiUsers,
    FiFileText,
    FiMessageSquare,
    FiSend,
    FiHeart
} from 'react-icons/fi';

const MonthlyChart = ({ data }) => {
    // Chuẩn bị dữ liệu 12 tháng đầy đủ
    const chartData = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = i;
        return {
            name: `Tháng ${i + 1}`,
            month: i + 1,
            users: data.users[monthIndex]?.total || 0,
            posts: data.posts[monthIndex]?.total || 0,
            comments: data.comments[monthIndex]?.total || 0,
            messages: data.messages[monthIndex]?.total || 0,
            likes: data.likes[monthIndex]?.total || 0,
        };
    });

    // Màu sắc cố định, dễ phân biệt, đẹp mắt
    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    const LABELS = ['Người dùng mới', 'Bài viết', 'Bình luận', 'Tin nhắn', 'Lượt thích'];
    const ICONS = [FiUsers, FiFileText, FiMessageSquare, FiSend, FiHeart];

    // Hiển thị số trên đầu cột nếu > 0
    const renderLabel = (value) => (value > 0 ? value : '');

    // Tooltip đẹp + rõ ràng
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{label}</p>
                    {payload
                        .filter(p => p.value > 0)
                        .map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                                {entry.name}: <strong>{entry.value.toLocaleString()}</strong>
                            </p>
                        ))}
                </div>
            );
        }
        return null;
    };

    // Legend có icon đẹp
    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <div className="custom-legend">
                {payload.map((entry, index) => {
                    const Icon = ICONS[index];
                    return (
                        <div key={`item-${index}`} className="legend-item">
                            <Icon size={20} color={entry.color} />
                            <span>{entry.value}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="monthly-chart-container">
            <h2>Thống kê hoạt động theo tháng</h2>

            <ResponsiveContainer width="100%" height={520}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="4 8" stroke="#e0e0e0" />

                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 14, fontWeight: 600 }}
                        height={60}
                        angle={-30}
                        textAnchor="end"
                    />

                    <YAxis
                        tick={{ fontSize: 13 }}
                        label={{ value: 'Số lượng', angle: -90, position: 'insideLeft', style: { fontWeight: 600 } }}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                    <Legend content={renderLegend} verticalAlign="top" height={70} />

                    {/* 5 cột riêng biệt */}
                    <Bar dataKey="users" name={LABELS[0]} fill={COLORS[0]} radius={[10, 10, 0, 0]}>
                        <LabelList dataKey="users" position="top" content={renderLabel} />
                    </Bar>
                    <Bar dataKey="posts" name={LABELS[1]} fill={COLORS[1]} radius={[10, 10, 0, 0]}>
                        <LabelList dataKey="posts" position="top" content={renderLabel} />
                    </Bar>
                    <Bar dataKey="comments" name={LABELS[2]} fill={COLORS[2]} radius={[10, 10, 0, 0]}>
                        <LabelList dataKey="comments" position="top" content={renderLabel} />
                    </Bar>
                    <Bar dataKey="messages" name={LABELS[3]} fill={COLORS[3]} radius={[10, 10, 0, 0]}>
                        <LabelList dataKey="messages" position="top" content={renderLabel} />
                    </Bar>
                    <Bar dataKey="likes" name={LABELS[4]} fill={COLORS[4]} radius={[10, 10, 0, 0]}>
                        <LabelList dataKey="likes" position="top" content={renderLabel} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyChart;