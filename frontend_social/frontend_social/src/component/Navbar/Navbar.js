// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';
import { markAllAsRead } from '../../apis/NotificationService';
import { toast } from 'react-toastify';
import UserAvatar from '../UserAvatar/UserAvatar';
import { GoHome } from "react-icons/go";
import { FiMessageSquare } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";

// THÊM 2 DÒNG NÀY – SIÊU QUAN TRỌNG
import { useNotificationWebSocket } from '../../hooks/useNotificationWebSocket';
import { useUnreadChatCount } from '../../context/ChatRealtimeContext';
import { HiOutlineUsers } from "react-icons/hi2";

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" width="48" height="48">
    <path fill="#0866ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadNotiCount, setUnreadNotiCount] = useState(0); // thông báo hệ thống
  const dropdownRef = useRef(null);

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // LẤY SỐ TIN NHẮN CHƯA ĐỌC TỪ CONTEXT (real-time)
  const { unreadCount: unreadChatCount } = useUnreadChatCount();

  const isAdmin = user?.role === "ROLE_ADMIN";
  const username = user?.username || user?.fullName || 'User';

  // === REAL-TIME THÔNG BÁO HỆ THỐNG ===
  const handleNewNotification = (newNoti) => {
    if (newNoti.status === 'UNREAD' || newNoti.status === undefined) {
      setUnreadNotiCount(prev => prev + 1);
    }
  };
  useNotificationWebSocket(handleNewNotification);

  // Đánh dấu đã đọc thông báo hệ thống
  const handleNotiClick = async () => {
    if (unreadNotiCount > 0) {
      try {
        await markAllAsRead(token);
        setUnreadNotiCount(0);
        toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
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
            <GoHome size={26} />
          </Link>

          {/* ICON TIN NHẮN + CHẤM ĐỎ REAL-TIME */}
          <Link
            to="/messages"
            className={`blockchat-navbar-2025-item ${isActive('/messages') ? 'blockchat-navbar-2025-active' : ''}`}
            style={{ position: 'relative' }}
          >
            <FiMessageSquare size={26} strokeWidth={2} />
            {unreadChatCount > 0 && (
              <span className="blockchat-navbar-2025-noti-dot">
                {unreadChatCount > 99 ? '99+' : unreadChatCount}
              </span>
            )}
          </Link>

          {/* ICON THÔNG BÁO HỆ THỐNG */}
          <button
            onClick={handleNotiClick}
            className={`blockchat-navbar-2025-item ${isActive('/noti') ? 'blockchat-navbar-2025-active' : ''}`}
            style={{ position: 'relative' }}
          >
            <IoIosNotificationsOutline size={30} strokeWidth={10} />
            {unreadNotiCount > 0 && (
              <span className="blockchat-navbar-2025-noti-dot">
                {unreadNotiCount > 99 ? '99+' : unreadNotiCount}
              </span>
            )}
          </button>

          <Link to="/friend_page" className={`blockchat-navbar-2025-item ${isActive('/friend_page') ? 'blockchat-navbar-2025-active' : ''}`}>
            <HiOutlineUsers size={26} />
          </Link>
          <Link to="/search_page" className={`blockchat-navbar-2025-item ${isActive('/search_page') ? 'blockchat-navbar-2025-active' : ''}`}>
            <IoSearchOutline size={26} />
          </Link>
        </nav>

        <div className="blockchat-navbar-2025-user-section" ref={dropdownRef}>
          <button className="blockchat-navbar-2025-user-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="blockchat-navbar-2025-user-avatar">
              {user ? (
                <UserAvatar username={username} image={user.image || null} size="small" />
              ) : (
                <div className="skeleton-avatar">U</div>
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