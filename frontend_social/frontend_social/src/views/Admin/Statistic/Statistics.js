// src/pages/admin/Statistics.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getStatistic } from '../../../apis/ChartService';
import { toast } from 'react-toastify';

import StatsOverview from './StatsOverview';
import MonthlyChart from './MonthlyChart';
import YearSelector from './YearSelector';
import LoadingSkeleton from './LoadingSkeleton';
import Manage_web from '../Manage_web';
import './Statistics.css';

const Statistics = () => {
    const { token } = useAuth();
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async (selectedYear) => {
        setLoading(true);
        try {
            const res = await getStatistic(token, selectedYear);
            console.log(res)
            setData(res.data);
        } catch (err) {
            toast.error('Không thể tải dữ liệu thống kê');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats(year);
    }, [year]);

    // Tính tổng từng loại trong năm
    const totals = data
        ? {
            users: data.users.reduce((sum, m) => sum + m.total, 0),
            posts: data.posts.reduce((sum, m) => sum + m.total, 0),
            comments: data.comments.reduce((sum, m) => sum + m.total, 0),
            messages: data.messages.reduce((sum, m) => sum + m.total, 0),
            likes: data.likes.reduce((sum, m) => sum + m.total, 0),
        }
        : { users: 0, posts: 0, comments: 0, messages: 0, likes: 0 };

    return (
        <div className="stats-layout">
            <Manage_web />

            <div className="stats-container">
                <h1 className="stats-title">Thống kê hoạt động theo tháng - {year}</h1>

                <YearSelector year={year} onChange={setYear} />

                {loading ? (
                    <LoadingSkeleton />
                ) : (
                    <>
                        <StatsOverview totals={totals} />

                        <MonthlyChart data={data} year={year} />
                    </>
                )}
            </div>
        </div>
    );
};

export default Statistics;