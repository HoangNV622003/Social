// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import {
    getToken,
    removeToken,
    removeUser,
    removeUserId,
    setUserId,
    setCurrentUser,
    getUser,
    clearAuthStorage
} from "./LocalStorageService";
import { getProfile } from "../apis/AuthService";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(getToken() || null);
    const [loading, setLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(!!getToken());

    // Hàm login – nhận token + user từ API login/register
    const login = (newToken, userData) => {
        localStorage.setItem("accessToken", newToken);
        setToken(newToken);
        setUser(userData);
        setCurrentUser(userData); // lưu luôn vào localStorage để dùng khi reload
        setIsLogin(true);

        if (userData?.id) {
            setUserId(userData.id);
        }
    };

    // Hàm logout – dọn sạch hoàn toàn
    const logout = () => {
        // Ngắt WebSocket nếu có
        if (window.webSocketDisconnect && typeof window.webSocketDisconnect === "function") {
            window.webSocketDisconnect();
        }

        clearAuthStorage();
        removeToken();
        removeUser?.();
        removeUserId?.();

        setToken(null);
        setUser(null);
        setIsLogin(false);
    };

    // CHỈ CHẠY 1 LẦN KHI APP KHỞI ĐỘNG – KHÔNG BAO GIỜ LOGOUT KHI RELOAD!
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = getToken();

            // Không có token → kết thúc, không làm gì
            if (!storedToken) {
                setLoading(false);
                return;
            }

            // Có token → coi như đã đăng nhập (token là vua!)
            setToken(storedToken);
            setIsLogin(true);

            // Lấy user từ cache trước (nếu có)
            const cachedUser = getUser();
            if (cachedUser) {
                setUser(cachedUser);
            }

            // Gọi API profile để cập nhật user mới nhất (KHÔNG BẮT BUỘC THÀNH CÔNG!)
            try {
                const response = await getProfile(storedToken);

                // Linh hoạt xử lý mọi kiểu response từ backend
                let freshUser = response?.data;

                if (freshUser) {
                    setUser(freshUser);
                    setCurrentUser(freshUser); // cập nhật cache
                    if (freshUser.id) setUserId(freshUser.id);
                    console.log("Profile loaded:", freshUser.username || freshUser.email);
                }
            } catch (error) {
                // CHỈ LOG – KHÔNG LOGOUT!
                console.warn("Không thể tải profile (mạng chậm/server lỗi), nhưng token vẫn hợp lệ → giữ đăng nhập", error.message || error);

                // Vẫn giữ user cũ nếu có
                if (!cachedUser) {
                    console.info("Không có user cache → hiển thị trạng thái đang tải...");
                }
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []); // Chỉ chạy 1 lần khi mount

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLogin,
            login,
            logout,
            loading,
            setUser // để cập nhật avatar, tên, v.v.
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};