// src/pages/SearchPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { searchAll } from '../../apis/SearchService';
import PostList from '../Post/PostList';
import Navbar from '../Navbar/Navbar';
import { FiSearch, FiX, FiUsers, FiFileText } from 'react-icons/fi';
import './SearchPage.css';
import UserList from './User/UserList';

const SearchPage = () => {
  const { token, user: currentUser } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = useCallback(
    debounce(async (term) => {
      const query = term.trim();
      if (!query || !token) {
        setResults({ users: [], posts: [] });
        setHasSearched(false);
        return;
      }

      setLoading(true);
      try {
        const res = await searchAll(query, token);
        setResults({
          users: res.data.users || [],
          posts: res.data.posts || []
        });
        setHasSearched(true);
      } catch (err) {
        console.error('Search error:', err);
        setResults({ users: [], posts: [] });
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }, 500),
    [token]
  );

  useEffect(() => {
    performSearch(keyword);
  }, [keyword, performSearch]);

  const clearSearch = () => {
    setKeyword('');
    setResults({ users: [], posts: [] });
    setHasSearched(false);
  };

  return (
    <div className="search-page">
      <Navbar />

      <div className="search-wrapper">
        <div className="search-header">
          <div className="search-input-wrapper">
            <FiSearch className="search-input-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng, bài viết, hashtag..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
              className="search-input"
            />
            {keyword && (
              <button onClick={clearSearch} className="search-clear-btn">
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className="search-content">
          {/* Loading */}
          {loading && (
            <div className="search-state loading-state">
              <div className="spinner"></div>
              <p>Đang tìm kiếm...</p>
            </div>
          )}

          {/* Không có kết quả */}
          {!loading && hasSearched && results.users.length === 0 && results.posts.length === 0 && (
            <div className="search-state empty-state">
              <div className="empty-icon">
                <FiSearch />
              </div>
              <h3>Không tìm thấy kết quả</h3>
              <p>Thử dùng từ khóa khác hoặc kiểm tra chính tả nhé!</p>
            </div>
          )}

          {/* Kết quả tìm kiếm */}
          {!loading && hasSearched && (results.users.length > 0 || results.posts.length > 0) && (
            <div className="search-results">
              {/* Người dùng */}
              {results.users.length > 0 && (
                <section className="result-block">
                  <div className="result-header">
                    <FiUsers className="result-icon" />
                    <h2>Người dùng ({results.users.length})</h2>
                  </div>
                  <div className="users-grid-container">
                    <UserList
                      users={results.users}
                      currentUserId={currentUser?.id}
                      title={null} // không hiển thị title vì đã có header riêng
                    />
                  </div>
                </section>
              )}

              {/* Bài viết */}
              {results.posts.length > 0 && (
                <section className="result-block">
                  <div className="result-header">
                    <FiFileText className="result-icon" />
                    <h2>Bài viết ({results.posts.length})</h2>
                  </div>
                  <PostList posts={results.posts} />
                </section>
              )}
            </div>
          )}

          {/* Gợi ý ban đầu */}
          {!hasSearched && !loading && (
            <div className="search-state welcome-state">
              <div className="welcome-icon">
                <FiSearch />
              </div>
              <h3>Bắt đầu tìm kiếm ngay</h3>
              <p>Nhập tên người dùng, nội dung bài viết hoặc hashtag...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;