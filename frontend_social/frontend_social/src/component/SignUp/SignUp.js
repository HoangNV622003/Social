import React, { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { toast } from 'react-toastify';
import { createUser } from '../../apis/UserService';
import './SignUp.css';
import backgroundImage from '../../assets/images/backgr.png'; // giữ lại nếu bạn dùng background
import { useNavigate } from 'react-router-dom'; // Thêm cái này
export default function Registration() {
  const navigate = useNavigate(); // Dùng để chuyển trang
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate mật khẩu trùng khớp
    if (formData.password !== formData.confirmPassword) {
      const msg = 'Mật khẩu xác nhận không khớp';
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      await createUser({
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
        // confirmPassword: nếu backend không cần thì bỏ, nếu cần thì giữ lại
      });

      toast.success('Đăng ký tài khoản thành công!');

      // Reset form sau khi đăng ký thành công
      setFormData({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
      setTimeout(() => {
        navigate('/'); // Đảm bảo route này tồn tại trong App.jsx
      }, 1500);
      // Nếu muốn chuyển hướng sau khi đăng ký thành công:
      // navigate('/login'); // nếu dùng react-router

    } catch (err) {
      console.error('Registration error:', err);

      // Lấy thông báo lỗi từ backend (theo đúng format bạn cung cấp)
      const errorMsg =
        err.response?.data?.errorDescription ||
        err.response?.data?.message ||
        'Đăng ký thất bại, vui lòng thử lại!';

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Signup-container" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      <Card sx={{ maxWidth: 700, margin: '30px auto', border: '3px solid #335566' }}>
        <CardContent>
          <Container maxWidth="sm">
            <Box sx={{ mt: 2 }}>
              <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
                Đăng ký tài khoản
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      fullWidth
                      required
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Tên đăng nhập"
                      name="username"
                      fullWidth
                      required
                      value={formData.username}
                      onChange={handleChange}
                      autoComplete="username"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Mật khẩu"
                      name="password"
                      type="password"
                      fullWidth
                      required
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      type="password"
                      fullWidth
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      error={!!error && formData.password !== formData.confirmPassword}
                    />
                  </Grid>

                  {error && (
                    <Grid item xs={12}>
                      <Typography color="error" variant="body2" align="center">
                        {error}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ py: 1.5 }}
                    >
                      {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Container>
        </CardContent>
      </Card>
    </div>
  );
}