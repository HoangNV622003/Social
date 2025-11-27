// src/pages/admin/Manage_user.jsx
import React, { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import "./Manage_user.css";
import { showAlert } from '../../notice/notice';
import { searchUsers } from '../../../apis/SearchService';
import { useAuth } from '../../../context/AuthContext';
import Manage_web from "../Manage_web";

const Manage_user = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);  // Thêm để hiển thị chính xác
  const [hasMore, setHasMore] = useState(true);

  const size = 20;

  const performSearch = useCallback(
    debounce(async (kw, pg, tk) => {
      if (!tk) return;

      setLoading(true);
      try {
        const res = await searchUsers(kw.trim() || "", tk, pg, size);
        const data = res.data; // Lấy data từ response

        const users = data.content || [];

        // Nếu là trang đầu → thay thế, không thì nối thêm
        if (pg === 0) {
          setResults(users);
        } else {
          setResults(prev => [...prev, ...users]);
        }

        // SỬA CHÍNH XÁC: kiểm tra trang cuối
        setHasMore(!data.last);                    // ĐÚNG
        setTotalPages(data.totalPages || 1);       // Hiển thị tổng số trang (tùy chọn)
        setPage(pg);

      } catch (err) {
        showAlert("Không thể tải danh sách người dùng", "error");
        setResults([]);
        setHasMore(false);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  // Gọi khi thay đổi từ khóa, trang, hoặc token
  useEffect(() => {
    if (token) performSearch(keyword, page, token);
  }, [keyword, page, token, performSearch]);

  // Load lần đầu
  useEffect(() => {
    if (token) performSearch("", 0, token);
  }, [token]);

  // Reset về trang 1 khi thay đổi từ khóa
  useEffect(() => {
    setPage(0);
  }, [keyword]);

  return (
    <div className="main">
      <Manage_web />

      <div className="manage-user-page">
        <h1>Quản lý người dùng</h1>

        <input
          type="text"
          placeholder="Tìm kiếm theo username hoặc email..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="search-box"
        />

        {loading && <div className="loading">Đang tải...</div>}

        {!loading && results.length === 0 && (
          <div className="empty">Không có người dùng nào</div>
        )}

        {results.length > 0 && (
          <>
            <div className="user-list">
              {results.map((user) => (
                <div
                  key={user.username}
                  className="user-card"
                  onClick={() => navigate(`/Edit_user/${user.username}`)}
                >
                  <div className="user-info">
                    <strong>{user.username}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="user-status">
                    <span className={`badge ${user.admin ? "admin" : "user"}`}>
                      {user.admin ? "Admin" : "User"}
                    </span>
                    <span className={`badge ${user.enabled ? "active" : "inactive"}`}>
                      {user.enabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* PHÂN TRANG – HIỂN THỊ CHÍNH XÁC */}
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
              >
                Trước
              </button>

              <span>
                Trang {page + 1} / {totalPages}
              </span>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore || loading}
              >
                Sau
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(Manage_user);