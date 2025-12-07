// src/pages/SearchPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { searchAll } from '../../apis/SearchService';
import PostList from '../Post/PostList';
import Navbar from '../Navbar/Navbar';
import { FiSearch, FiX, FiUsers, FiFileText } from 'react-icons/fi';
import './SearchPage.scss';
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
    <div className="sp-page">
      <Navbar />

      <div className="sp-wrapper">
        <div className="sp-header">
          <div className="sp-input-wrapper">
            <FiSearch className="sp-input-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng, bài viết, hashtag..."
              value={keyword || ''}                          // thêm dòng này
              onChange={(e) => setKeyword(e.target.value ?? '')}  // thêm ?? ''
              autoFocus
              className="search-input" // hoặc sp-input
            />
            {keyword && (
              <button onClick={clearSearch} className="sp-clear-btn">
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className="sp-content">
          {/* Loading */}
          {loading && (
            <div className="sp-state">
              <div className="sp-spinner"></div>
              <p>Đang tìm kiếm...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && hasSearched && results.users.length === 0 && results.posts.length === 0 && (
            <div className="sp-state">
              <div className="sp-state-icon"><FiSearch /></div>
              <h3>Không tìm thấy kết quả</h3>
              <p>Thử dùng từ khóa khác hoặc kiểm tra chính tả nhé!</p>
            </div>
          )}

          {/* Results */}
          {!loading && hasSearched && (results.users.length > 0 || results.posts.length > 0) && (
            <div className="sp-results">

              {results.users.length > 0 && (
                <section className="sp-result-block">
                  <div className="sp-result-header">
                    <FiUsers />
                    <h2>Người dùng ({results.users.length})</h2>
                  </div>
                  <div className="sp-users-container">
                    <UserList users={results.users} currentUserId={currentUser?.id} title={null} />
                  </div>
                </section>
              )}

              {results.posts.length > 0 && (
                <section className="sp-result-block">
                  <div className="sp-result-header">
                    <FiFileText />
                    <h2>Bài viết ({results.posts.length})</h2>
                  </div>
                  <div className="sp-posts-container">
                    <PostList posts={results.posts} />
                  </div>
                </section>
              )}

            </div>
          )}

          {/* Welcome */}
          {!hasSearched && !loading && (
            <div className="sp-state">
              <div className="sp-state-icon"><FiSearch /></div>
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