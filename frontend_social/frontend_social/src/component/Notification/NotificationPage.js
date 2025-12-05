// src/pages/NotificationPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationList from './NotificationList';
import { getMyNotifications } from '../../apis/NotificationService';
import { toast } from 'react-toastify';
import { SlOptions } from 'react-icons/sl';
import NotificationOptionsPopup from '../Popup/NotificationOptionsPopup'; // ← mới
import './NotificationPage.css';
import Navbar from '../Navbar/Navbar';

const NotificationPage = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchNotifications = async (pageNum, reset = false) => {
    if (!token || isFetchingRef.current) return;
    isFetchingRef.current = true;
    pageNum === 0 ? setLoading(true) : setLoadingMore(true);

    try {
      const res = await getMyNotifications(token, pageNum, 20);
      const newNotis = res.content || [];
      const isLastPage = res.last === true;

      if (reset) setNotifications(newNotis);
      else setNotifications(prev => [...prev, ...newNotis]);

      setHasMore(!isLastPage);
      pageRef.current = pageNum + 1;
    } catch (err) {
      toast.error('Không tải được thông báo');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (token) {
      pageRef.current = 0;
      isFetchingRef.current = false;
      setNotifications([]);
      setHasMore(true);
      fetchNotifications(0, true);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !hasMore) return;
    const handleScroll = () => {
      if (isFetchingRef.current) return;
      const scrolled = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 300;
      if (scrolled >= threshold) fetchNotifications(pageRef.current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [token, hasMore]);

  // Khi đánh dấu tất cả xong → cập nhật UI
  const handleMarkedAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));
  };

  return (
    <div className="notification-page">
      <Navbar />

      {/* Tiêu đề + nút 3 chấm */}
      <div className="notification-title-wrapper">
        <h2>Thông báo</h2>

        <div className="notification-actions">
          <button
            className="options-btn"
            onClick={() => setShowOptions(prev => !prev)}
          >
            <SlOptions size={20} />
          </button>

          {/* Dùng component riêng */}
          {showOptions && (
            <NotificationOptionsPopup
              onClose={() => setShowOptions(false)}
              onMarkedAllRead={handleMarkedAllRead}
            />
          )}
        </div>
      </div>

      <div className="notification-container">
        <NotificationList notifications={notifications} loading={loading} />

        {!loading && notifications.length === 0 && (
          <div className="empty-notification">
            <p>Bạn chưa có thông báo nào</p>
          </div>
        )}

        {loadingMore && (
          <div className="notification-load-more">
            <div className="spinner small"></div>
            <span>Đang tải thêm...</span>
          </div>
        )}

        {!hasMore && notifications.length > 0 && (
          <div className="notification-end">
            <p>Đã hiển thị tất cả thông báo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;