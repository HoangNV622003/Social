import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';
import { getUnreadNotifications, markAllNotificationsAsRead } from '../../apis/NotificationService';
import { toast } from 'react-toastify';

// === SVG Icons (giữ nguyên, rất đẹp) ===
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" /></svg>
);
const MessageIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor" /></svg>
);
const NotificationIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    <path d="M15.5 14h-.79l-.28-.27a6.47 6.47 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.47 6.47 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor" />
  </svg>
);
const LogoIcon = () => (
  <svg viewBox="0 0 24 24" width="48" height="48">
    <path fill="#0866ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const isAdmin = user?.admin;
  const username = user?.username || user?.fullName || 'User';

  // === Lấy số lượng thông báo chưa đọc ===
  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await getUnreadNotifications(token);
      const count = res.data.length;
      setUnreadCount(count);
      setHasNewNotification(count > 0);
    } catch (err) {
      console.error('Lỗi lấy thông báo:', err);
    }
  };

  // === Gọi API mỗi 15s & khi mount ===
  useEffect(() => {
    if (token) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000); // 15 giây
      return () => clearInterval(interval);
    }
  }, [token]);

  // === Click vào chuông: đánh dấu tất cả đã đọc + chuyển trang ===
  const handleNotiClick = async () => {
    if (hasNewNotification) {
      try {
        await markAllNotificationsAsRead(token);
        setHasNewNotification(false);
        setUnreadCount(0);
        toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
      } catch (err) {
        toast.error('Lỗi khi đánh dấu đã đọc');
      }
    }
    navigate('/noti');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  }
  // === Đóng dropdown khi click ngoài ===
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

        {/* Logo */}
        <Link to="/Blockchat" className="blockchat-navbar-2025-logo">
          <LogoIcon />
          <span className="blockchat-navbar-2025-brand-text">BlockChat</span>
        </Link>

        {/* Thanh icon giữa */}
        <nav className="blockchat-navbar-2025-center">
          <Link to="/Blockchat" className={`blockchat-navbar-2025-item ${isActive('/Blockchat') ? 'blockchat-navbar-2025-active' : ''}`}>
            <HomeIcon />
          </Link>

          <Link to="/messages" className={`blockchat-navbar-2025-item ${isActive('/messages') ? 'blockchat-navbar-2025-active' : ''}`}>
            <MessageIcon />
          </Link>

          <button
            onClick={handleNotiClick}
            className={`blockchat-navbar-2025-item ${isActive('/noti') ? 'blockchat-navbar-2025-active' : ''}`}
          >
            <NotificationIcon />
            {unreadCount > 0 && (
              <span className="blockchat-navbar-2025-noti-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <Link to="/search_page" className={`blockchat-navbar-2025-item ${isActive('/search_page') ? 'blockchat-navbar-2025-active' : ''}`}>
            <SearchIcon />
          </Link>
        </nav>

        {/* User dropdown */}
        <div className="blockchat-navbar-2025-user-section" ref={dropdownRef}>
          <button
            className="blockchat-navbar-2025-user-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="blockchat-navbar-2025-user-avatar">
              {username[0]?.toUpperCase() || 'U'}
            </div>
            <span className="blockchat-navbar-2025-username">{username}</span>
            <svg className={`blockchat-navbar-2025-arrow ${showDropdown ? 'blockchat-navbar-2025-arrow-up' : ''}`} viewBox="0 0 24 24" width="20" height="20">
              <path d="M7 10l5 5 5-5z" fill="currentColor" />
            </svg>
          </button>

          {showDropdown && (
            <div className="blockchat-navbar-2025-dropdown">
              <Link to="/profile" className="blockchat-navbar-2025-dropdown-item">Hồ sơ cá nhân</Link>
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