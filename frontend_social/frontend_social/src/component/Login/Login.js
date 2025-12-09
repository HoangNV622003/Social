// src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../apis/AuthService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import backgroundImage from '../../assets/images/backgr.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.warn('Vui lòng nhập email hoặc username và mật khẩu');
            return;
        }

        setLoading(true);

        try {
            const res = await authenticateUser({ email: email.trim(), password });

            if (res.status === 200) {
                const { accessToken, user } = res.data;
                login(accessToken, user);
                toast.success('Đăng nhập thành công!');
                navigate('/Blockchat', { replace: true });
            }
        } catch (err) {
            let msg = 'Đăng nhập thất bại';

            if (err.response?.status === 401) msg = 'Email hoặc mật khẩu không đúng';
            else if (err.response?.status === 403) msg = 'Tài khoản đã bị khóa';
            else if (err.response?.data?.errorDescription) msg = err.response.data.errorDescription;
            else msg = err.response.data.errorDescription
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-box">
                <div className="login-header">
                    <h1>Block Chat</h1>
                    <p>Đăng nhập để tiếp tục</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-field">
                        <label>Email hoặc username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email hoặc username"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <div className="input-field">
                        <label>Mật khẩu</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ít nhất 6 ký tự"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="show-hide-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? 'Ẩn' : 'Hiện'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading || !email || !password}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>

                    <div className="login-footer">
                        Chưa có tài khoản?{' '}
                        <a href="/signup">Đăng ký miễn phí</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;