// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';
import { markAllAsRead } from '../../apis/NotificationService'; // Chỉ còn lại markAllAsRead
import { toast } from 'react-toastify';
import UserAvatar from '../UserAvatar/UserAvatar';
import { GoHome } from "react-icons/go";
import { FiMessageSquare } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { useNotificationWebSocket } from '../../hooks/useNotificationWebSocket'; // ← Real-time 100%

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" width="48" height="48">
    <path fill="#0866ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Số thông báo chưa đọc
  const dropdownRef = useRef(null);

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "ROLE_ADMIN";
  const username = user?.username || user?.fullName || 'User';

  // === REAL-TIME: CẬP NHẬT CHẤM ĐỎ NGAY LẬP TỨC ===
  const handleNewNotification = useCallback((newNoti) => {
    // Chỉ tăng nếu thông báo là UNREAD (backend gửi đúng status)
    if (newNoti.status === 'UNREAD' || newNoti.status === undefined) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // DÙNG WEBSOCKET THUẦN TÚY – KHÔNG CẦN POLLING NỮA!
  useNotificationWebSocket(handleNewNotification);

  // Khi mở trang /noti → đánh dấu đã đọc → reset về 0
  const handleNotiClick = async () => {
    if (unreadCount > 0) {
      try {
        await markAllAsRead(token);
        setUnreadCount(0); // Reset ngay lập tức
        toast.success('Đã đánh dấu tất cả là đã đọc');
      } catch {
        toast.error('Lỗi cập nhật thông báo');
      }
    }
    navigate('/noti');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <header className="blockchat-navbar-2025-main">
      <div className="blockchat-navbar-2025-inner">
        <Link to="/Blockchat" className="blockchat-navbar-2025-logo">
          <LogoIcon />
          <span className="blockchat-navbar-2025-brand-text">BlockChat</span>
        </Link>

        <nav className="blockchat-navbar-2025-center">
          <Link to="/Blockchat" className={`blockchat-navbar-2025-item ${isActive('/Blockchat') ? 'blockchat-navbar-2025-active' : ''}`}>
            <GoHome />
          </Link>
          <Link to="/messages" className={`blockchat-navbar-2025-item ${isActive('/messages') ? 'blockchat-navbar-2025-active' : ''}`}>
            <FiMessageSquare />
          </Link>

          {/* CHẤM ĐỎ CẬP NHẬT REAL-TIME 100% */}
          <button
            onClick={handleNotiClick}
            className={`blockchat-navbar-2025-item ${isActive('/noti') ? 'blockchat-navbar-2025-active' : ''}`}
            style={{ position: 'relative' }}
          >
            <IoIosNotificationsOutline size={26} />
            {unreadCount > 0 && (
              <span className="blockchat-navbar-2025-noti-dot">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <Link to="/search_page" className={`blockchat-navbar-2025-item ${isActive('/search_page') ? 'blockchat-navbar-2025-active' : ''}`}>
            <IoSearchOutline />
          </Link>
        </nav>

        <div className="blockchat-navbar-2025-user-section" ref={dropdownRef}>
          <button
            className="blockchat-navbar-2025-user-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="blockchat-navbar-2025-user-avatar">
              {user ? (
                <UserAvatar username={username} image={user.image || null} size="small" />
              ) : (
                <div className="skeleton-avatar">
                  {(username[0]?.toUpperCase() || 'U')}
                </div>
              )}
            </div>
            <span className="blockchat-navbar-2025-username">{username}</span>
            <svg className={`blockchat-navbar-2025-arrow ${showDropdown ? 'blockchat-navbar-2025-arrow-up' : ''}`} viewBox="0 0 24 24" width="20" height="20">
              <path d="M7 10l5 5 5-5z" fill="currentColor" />
            </svg>
          </button>

          {showDropdown && (
            <div className="blockchat-navbar-2025-dropdown">
              <Link to={`/profile/${user?.id}`} className="blockchat-navbar-2025-dropdown-item">Hồ sơ cá nhân</Link>
              <Link to="/Edit_profile" className="blockchat-navbar-2025-dropdown-item">Chỉnh sửa hồ sơ</Link>
              {isAdmin && <Link to="/manage_user" className="blockchat-navbar-2025-dropdown-item blockchat-navbar-2025-admin">Quản trị hệ thống</Link>}
              <div className="blockchat-navbar-2025-divider"></div>
              <div onClick={handleLogout} className="blockchat-navbar-2025-dropdown-item blockchat-navbar-2025-logout">Đăng xuất</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;