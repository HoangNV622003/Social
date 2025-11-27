// src/pages/admin/Manage_Progress.jsx
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import './Manage_progress.css';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { getPostStats, getInteractionStats, getMessageStats, getUsersByAddressStats } from '../../../apis/ChartService';
import Manage_web from "../Manage_web";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Manage_Progress = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [charts, setCharts] = useState({});

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [post, int, addr, msg] = await Promise.all([
          getPostStats(token),
          getInteractionStats(token),
          getUsersByAddressStats(token),
          getMessageStats(token)
        ]);

        setCharts({
          post: { labels: Object.keys(post.data || {}), data: Object.values(post.data || {}) },
          interaction: { labels: int.data.data?.map(i => `${i.month}/${i.year}`), likes: int.data.data?.map(i => i.like_count), comments: int.data.data?.map(i => i.comment_count) },
          address: { labels: addr.data.data?.map(a => a.address), counts: addr.data.data?.map(a => a.user_count) },
          message: { labels: msg.data.data?.map(m => `${m.month}/${m.year}`), counts: msg.data.data?.map(m => m.message_count) }
        });
      } catch { toast.error("Không tải được thống kê"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [token]);

  const options = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, font: { size: 18 } } } };

  return (
    <div className="main">
      <Manage_web />
      <div className="progress-page">
        <h1>Thống kê hệ thống</h1>
        {loading ? <div className="loading">Đang tải biểu đồ...</div> : (
          <div className="charts-grid">
            <div className="chart-box"><Bar data={{ labels: charts.post?.labels, datasets: [{ label: 'Bài viết', data: charts.post?.data, backgroundColor: '#1877f2' }] }} options={{ ...options, plugins: { ...options.plugins, title: { text: 'Bài viết theo tháng' } } }} /></div>
            <div className="chart-box"><Bar data={{ labels: charts.interaction?.labels, datasets: [{ label: 'Like', data: charts.interaction?.likes }, { label: 'Comment', data: charts.interaction?.comments }] }} options={{ ...options, plugins: { ...options.plugins, title: { text: 'Tương tác' } } }} /></div>
            <div className="chart-box"><Bar data={{ labels: charts.address?.labels, datasets: [{ label: 'Người dùng', data: charts.address?.counts, backgroundColor: '#ffce56' }] }} options={{ ...options, plugins: { ...options.plugins, title: { text: 'Người dùng theo tỉnh' } } }} /></div>
            <div className="chart-box"><Line data={{ labels: charts.message?.labels, datasets: [{ label: 'Tin nhắn', data: charts.message?.counts, borderColor: '#4bc0c0' }] }} options={{ ...options, plugins: { ...options.plugins, title: { text: 'Tin nhắn theo tháng' } } }} /></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Manage_Progress;