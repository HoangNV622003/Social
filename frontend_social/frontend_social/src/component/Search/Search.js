// src/components/search/SearchPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { showAlert } from '../notice/notice';
import { useAuth } from '../../context/AuthContext'; // Lấy token chuẩn như UserPost
import './Search.css';

// DÙNG ĐÚNG 2 SERVICE CỦA BẠN
import { searchUsers } from '../../apis/SearchService';         // Service tìm kiếm
import {
  addFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest
} from '../../apis/FriendService';                          // Service kết bạn

const SearchPage = () => {
  const { token } = useAuth(); // Chuẩn dự án của bạn
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const size = 10; // Bạn có thể đổi thành 7 nếu muốn giống Manage_user

  // Gọi API tìm kiếm bằng service của bạn
  const fetchResults = useCallback(async (searchKeyword = keyword, pageNum = page) => {
    if (!searchKeyword.trim() || !token) {
      setResults([]);
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const response = await searchUsers(searchKeyword.trim(), token, pageNum, size);

      const newData = response.data.content || [];

      if (pageNum === 0) {
        setResults(newData);
      } else {
        setResults(prev => [...prev, ...newData]);
      }

      setHasMore(response.hasMore);
      setPage(pageNum);

    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      showAlert("Không thể tìm kiếm người dùng. Vui lòng thử lại!", "error");
      setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [keyword, page, token]);

  // Debounce tìm kiếm khi gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchResults(keyword, 0);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, fetchResults]);

  // Load thêm khi scroll
  useEffect(() => {
    if (page > 0) {
      fetchResults(keyword, page);
    }
  }, [page]);

  // Reset trang khi đổi từ khóa
  useEffect(() => {
    setPage(0);
  }, [keyword]);

  // === XỬ LÝ KẾT BẠN ===
  const handleAddFriend = async (e, username) => {
    e.stopPropagation();
    try {
      await addFriendRequest(username, token);
      showAlert("Đã gửi lời mời kết bạn!", "success");
      setResults(prev => prev.map(u =>
        u.username === username ? { ...u, friendRequestReceiver: true } : u
      ));
    } catch (err) {
      showAlert(err.response?.data?.message || "Gửi lời mời thất bại");
    }
  };

  const handleAcceptFriend = async (e, username) => {
    e.stopPropagation();
    try {
      await acceptFriendRequest(username, token);
      showAlert("Đã chấp nhận kết bạn!", "success");
      setResults(prev => prev.map(u =>
        u.username === username
          ? { ...u, friend: true, friendPending: false, friendRequestReceiver: false }
          : u
      ));
    } catch (err) {
      showAlert("Chấp nhận thất bại", "error");
    }
  };

  const handleCancelFriend = async (e, username) => {
    e.stopPropagation();
    try {
      await cancelFriendRequest(username, token);
      showAlert("Đã hủy lời mời", "info");
      setResults(prev => prev.map(u =>
        u.username === username ? { ...u, friendRequestReceiver: false } : u
      ));
    } catch (err) {
      showAlert("Hủy thất bại", "error");
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile_view/${username}`);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 150 && !loading && hasMore && keyword.trim()) {
      setPage(prev => prev + 1);
    }
  };

  // Nếu chưa đăng nhập
  if (!token) {
    return (
      <div className="fb-search-page">
        <Navbar />
        <div className="text-center py-5">
          <p>Vui lòng đăng nhập để tìm kiếm bạn bè</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-search-page">
      <Navbar />
      <div className="fb-search-container">
        <div className="fb-search-card">
          <h2 className="text-center mb-4">Tìm kiếm bạn bè</h2>

          <input
            type="text"
            placeholder="Nhập tên người dùng hoặc email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="fb-search-input form-control"
            autoFocus
          />

          <div className="fb-search-results" onScroll={handleScroll}>
            {/* Loading lần đầu */}
            {loading && page === 0 && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tìm...</span>
                </div>
                <p className="mt-3">Đang tìm kiếm...</p>
              </div>
            )}

            {/* Chưa nhập từ khóa */}
            {!keyword.trim() && !loading && (
              <div className="text-center py-5 text-muted">
                <p>Nhập từ khóa để tìm bạn bè</p>
              </div>
            )}

            {/* Không có kết quả */}
            {keyword.trim() && results.length === 0 && !loading && (
              <div className="text-center py-5 text-muted">
                <p>Không tìm thấy người dùng nào với "<strong>{keyword}</strong>"</p>
              </div>
            )}

            {/* Danh sách người dùng */}
            {results.length > 0 && (
              <div className="fb-search-list">
                {results.map((user) => (
                  <div
                    key={user.username}
                    className="fb-search-item d-flex justify-content-between align-items-center p-3 border-bottom"
                    onClick={() => handleUserClick(user.username)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="fb-search-avatar">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h5 className="mb-0">{user.username}</h5>
                        <small className="text-muted">{user.email}</small>
                      </div>
                    </div>

                    <div onClick={e => e.stopPropagation()}>
                      {user.friend ? (
                        <button className="btn btn-success btn-sm" disabled>Đã là bạn bè</button>
                      ) : user.friendPending && !user.friendRequestReceiver ? (
                        <button className="btn btn-info btn-sm" onClick={(e) => handleAcceptFriend(e, user.username)}>
                          Chấp nhận
                        </button>
                      ) : user.friendRequestReceiver ? (
                        <div className="btn-group">
                          <button className="btn btn-outline-secondary btn-sm" disabled>Đã gửi</button>
                          <button className="btn btn-outline-danger btn-sm" onClick={(e) => handleCancelFriend(e, user.username)}>
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={(e) => handleAddFriend(e, user.username)}>
                          Thêm bạn bè
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading thêm */}
            {loading && page > 0 && (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;