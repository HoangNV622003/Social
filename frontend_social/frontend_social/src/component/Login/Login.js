import React, { useState, useEffect } from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../apis/AuthService';
import backgroundImage from '../../assets/images/backgr.png';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');        // Đổi từ username → email
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Gửi đúng tên field: email, không phải username
            const response = await authenticateUser({ email, password });

            if (response.status === 200) {
                const { accessToken, user } = response.data;
                console.log('Login successful:', user);
                login(accessToken, user);
                toast.success('Đăng nhập thành công! Chào mừng trở lại');
                navigate('/Blockchat', { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            let errorMsg = 'Đăng nhập thất bại';

            if (err.response?.status === 401) {
                errorMsg = 'Email hoặc mật khẩu không đúng';
            } else if (err.response?.status === 403) {
                errorMsg = 'Tài khoản đã bị khóa';
            } else if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            }

            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const togglePassword = () => setPasswordVisible(prev => !prev);

    return (
        <div className="login-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <form onSubmit={handleLogin} className="login-form" noValidate>
                <h2 className="text-center mb-4 Title">Welcome to Block Chat</h2>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"  // đổi thành type="email" để validate tốt hơn
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        className="form-control"
                        placeholder="nhập email của bạn"
                        required
                        autoFocus
                        disabled={loading}
                    />
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <div className="input-group">
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="nhập mật khẩu"
                            required
                            minLength="6"
                            disabled={loading}
                        />
                        <span className="input-group-text" onClick={togglePassword} style={{ cursor: 'pointer' }}>
                            <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100 btn-lg"
                    disabled={loading || !email || !password}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Đang đăng nhập...
                        </>
                    ) : (
                        'Đăng nhập'
                    )}
                </button>

                <div className="text-center mt-4">
                    <small className="text-light">
                        Chưa có tài khoản?{' '}
                        <a href="/signup" className="text-decoration-underline text-warning fw-bold">
                            Đăng ký ngay
                        </a>
                    </small>
                </div>
            </form>
        </div>
    );
};

export default Login;