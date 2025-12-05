// src/pages/admin/ManageUser.jsx
import React, { useState, useEffect, memo } from "react";
import { useAuth } from '../../../context/AuthContext';
import { searchUsers } from '../../../apis/SearchService';
import Manage_web from "../Manage_web";
import UserSearch from './UserSearch';
import UserList from './UserList';
import './ManageUser.css';
import { toast } from "react-toastify";

const PAGE_SIZE = 20;

const ManageUser = () => {
  const { token } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = async (searchTerm, pageNum, reset = false) => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await searchUsers(searchTerm.trim(), token, pageNum, PAGE_SIZE);
      const data = res.data;

      const newUsers = data.content || [];

      setUsers(prev => reset ? newUsers : [...prev, ...newUsers]);
      setHasMore(!data.last);
      setTotalPages(data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      toast.error("Có lỗi khi tải danh sách")
      setUsers([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm với debounce (từ UserSearch)
  const handleSearch = (value) => {
    setKeyword(value);
    setPage(0);
    loadUsers(value, 0, true);
  };

  // Load trang tiếp theo
  const loadMore = () => {
    if (hasMore && !loading) {
      loadUsers(keyword, page + 1, false);
    }
  };

  // Load lần đầu
  useEffect(() => {
    if (token) loadUsers("", 0, true);
  }, [token]);

  return (
    <div className="main">
      <Manage_web />

      <div className="manage-user-page">
        <h1>Quản lý người dùng</h1>

        <UserSearch
          value={keyword}
          onSearch={handleSearch}
          placeholder="Tìm kiếm theo username hoặc email..."
        />

        <UserList
          users={users}
          loading={loading}
          hasMore={hasMore}
          page={page}
          totalPages={totalPages}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
};

export default memo(ManageUser);