import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getNotifications,
  markAllNotificationsAsRead
} from "../../apis/NotificationService";
import { toast } from "react-toastify";
import newimg from '../../assets/images/new.png';
import './Noti.css';

function Noti() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);

  const navigate = useNavigate();
  const { token, user } = useAuth();
  const observer = useRef();
  const username_main = user?.username || '';

  // === Tải danh sách thông báo ===
  const fetchNotifications = async (pageNum = 0, reset = false) => {
    if (isLoading || !hasMore || !token) return;

    setIsLoading(true);
    try {
      const res = await getNotifications(token, pageNum, 10);
      const data = res.data || [];

      if (reset) {
        setNotifications(data);
      } else {
        setNotifications(prev => [...prev, ...data]);
      }

      // Cập nhật số lượng chưa đọc
      const unreadCount = data.filter(n => n.status === "UNREAD").length +
        notifications.filter(n => n.status === "UNREAD").length;
      setTotalUnread(unreadCount);

      if (data.length < 10) setHasMore(false);
    } catch (err) {
      console.error("Lỗi tải thông báo:", err);
      toast.error("Không thể tải thông báo");
    } finally {
      setIsLoading(false);
    }
  };

  // === Load trang đầu khi mount ===
  useEffect(() => {
    if (token) {
      fetchNotifications(0, true);
    }
  }, [token]);

  // === Infinite scroll với IntersectionObserver ===
  const lastNotiRef = useRef();
  useEffect(() => {
    if (isLoading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        setPage(prev => prev + 1);
      }
    });

    if (lastNotiRef.current) observer.current.observe(lastNotiRef.current);

    return () => observer.current?.disconnect();
  }, [isLoading, hasMore, notifications]);

  // === Load thêm khi page thay đổi ===
  useEffect(() => {
    if (page > 0) {
      fetchNotifications(page);
    }
  }, [page]);

  // === Đánh dấu tất cả là đã đọc (khi vào trang) ===
  useEffect(() => {
    if (totalUnread > 0 && token) {
      const markRead = async () => {
        try {
          await markAllNotificationsAsRead(token);
          setNotifications(prev => prev.map(n => ({ ...n, status: "READ" })));
          setTotalUnread(0);
          toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
        } catch (err) {
          console.error("Lỗi đánh dấu đã đọc:", err);
        }
      };
      markRead();
    }
  }, [totalUnread, token]);

  // === Xử lý click thông báo ===
  const handleNotiClick = (noti) => {
    if (noti.type === "ADD_FRIEND" || noti.type === "LIKE_COMMENT_SHARE") {
      navigate(`/profile_view/${noti.sender_username}`);
    } else if (noti.type === "MESSAGE") {
      navigate('/messages');
    }
  };

  const getNotiTypeText = (type) => {
    switch (type) {
      case "LIKE_COMMENT_SHARE": return "Tương tác";
      case "ADD_FRIEND": return "Kết bạn";
      case "MESSAGE": return "Tin nhắn";
      default: return "Thông báo";
    }
  };

  const getNotiColor = (type) => {
    switch (type) {
      case "LIKE_COMMENT_SHARE": return "#0866ff";
      case "ADD_FRIEND": return "#16a34a";
      case "MESSAGE": return "#7c3aed";
      default: return "#64748b";
    }
  };

  return (
    <div className="blockchat-noti-2025-page">
      <Navbar />

      <div className="blockchat-noti-2025-container">
        <header className="blockchat-noti-2025-header">
          <h1>Thông báo</h1>
          <p>
            {totalUnread > 0
              ? `Bạn có ${totalUnread} thông báo mới`
              : "Không có thông báo mới"}
          </p>
        </header>

        <div className="blockchat-noti-2025-list">

          {/* Danh sách thông báo */}
          {notifications.map((noti, index) => (
            <div
              key={noti.id || index}
              ref={index === notifications.length - 1 ? lastNotiRef : null}
              className={`blockchat-noti-2025-item ${noti.status === "UNREAD" ? "unread" : ""}`}
              onClick={() => handleNotiClick(noti)}
              style={{ cursor: "pointer" }}
            >
              <div className="noti-avatar">
                {noti.sender_username[0].toUpperCase()}
              </div>

              <div className="noti-content">
                <p className="noti-message">
                  <strong>{noti.sender_username}</strong> {noti.contentnoti}
                </p>
                <span className="noti-time">
                  {new Date(noti.timestamp).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="noti-right">
                {noti.status === "UNREAD" && (
                  <img src={newimg} alt="Mới" className="noti-new-badge" />
                )}
                <span
                  className="noti-type-badge"
                  style={{
                    backgroundColor: getNotiColor(noti.type) + "20",
                    color: getNotiColor(noti.type)
                  }}
                >
                  {getNotiTypeText(noti.type)}
                </span>
              </div>
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="blockchat-noti-2025-loader">
              <div className="spinner"></div>
              <p>Đang tải thêm thông báo...</p>
            </div>
          )}

          {/* Hết dữ liệu */}
          {!hasMore && notifications.length > 0 && (
            <div className="blockchat-noti-2025-end">
              <p>Đã hiển thị tất cả thông báo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Noti;