// src/pages/admin/Manage_web.jsx
import React, { memo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Manage_web.css';

const Manage_web = () => {
    return (
        <div className="admin-layout">
            {/* SIDEBAR - CHỈ RENDER 1 LẦN */}
            <div className="admin-sidebar">
                <h2>ADMIN PANEL</h2>
                <nav className="admin-nav">
                    <NavLink to="/Manage_user" className="nav-item" end>
                        Quản lý người dùng
                    </NavLink>
                    <NavLink to="/Manage_post" className="nav-item">
                        Quản lý bài viết
                    </NavLink>
                    <NavLink to="/Manage_progress" className="nav-item">
                        Thống kê
                    </NavLink>
                    <NavLink to="/Blockchat" className="nav-item exit">
                        Thoát
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};

export default memo(Manage_web);