import React, { useState, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../Manage_web";
import './Edit_user.css';
import '../../notice/notice.css';
import { showAlert } from '../../notice/notice';

// GHÉP ĐÚNG SERVICE Ở ĐÂY
import { getUserByUsername, updateUserByAdmin } from '../../../apis/ManageService';
import Manage_web from "../Manage_web";

const Edit_user = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin user khi vào trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByUsername(username);
        setUser(data);
        setLoading(false);
      } catch (err) {
        const msg = err.response?.data?.message || "Không thể tải thông tin người dùng";
        setError(msg);
        showAlert(msg, "error");
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await updateUserByAdmin(username, user);

      showAlert("Cập nhật người dùng thành công!", "success");

      setTimeout(() => {
        navigate("/manage_user"); // hoặc route danh sách user của bạn
      }, 1200);

    } catch (err) {
      const msg = err.response?.data?.message || "Cập nhật thất bại";
      setError(msg);
      showAlert(msg, "error");
    }
  };

  if (loading) return <div className="text-center py-5">Đang tải...</div>;
  if (error && !user) return <div className="alert alert-danger mx-4">{error}</div>;

  return (
    <div className="main">
      <Manage_web />
      <div className="main-content p-4">
        <h2 className="mb-4">Chỉnh sửa người dùng:{username}</h2>

        <form onSubmit={handleSubmit}>
          {/* Username - không cho sửa */}
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={user?.username || ""}
              disabled
            />
            <small className="text-muted">Không thể thay đổi username</small>
          </div>

          {/* Email */}
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={user?.email || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Verification Code */}
          <div className="form-group mb-3">
            <label>Mã xác thực</label>
            <input
              type="text"
              className="form-control"
              value={user?.verificationCode || ""}
              disabled
            />
          </div>

          {/* Enabled */}
          <div className="form-check mb-3">
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              className="form-check-input"
              checked={user?.enabled || false}
              onChange={handleChange}
            />
            <label htmlFor="enabled" className="form-check-label ms-2">
              Kích hoạt tài khoản
            </label>
          </div>

          {/* Is Admin */}
          <div className="form-check mb-4">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              className="form-check-input"
              checked={user?.isAdmin || false}
              onChange={handleChange}
            />
            <label htmlFor="isAdmin" className="form-check-label ms-2">
              Quyền Admin
            </label>
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <div>
            <button type="submit" className="btn btn-primary me-3">
              Lưu thay đổi
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(Edit_user);