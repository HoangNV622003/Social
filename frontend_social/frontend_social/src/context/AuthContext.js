import React, { createContext, useState, useEffect, useContext } from "react";
import {
    getToken,
    removeToken,
    removeUser,
    removeUserId,
    setUserId,
    clearAuthStorage
} from "./LocalStorageService";
import { getUserProfile } from "../apis/UserService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(getToken() || null);
    const [loading, setLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);

    // Hàm login: nhận token + user object từ API
    const login = (newToken, userData) => {
        localStorage.setItem("accessToken", newToken); // KEY_TOKEN bạn có thể bỏ nếu dùng getToken()
        setToken(newToken);
        setUser(userData);
        setIsLogin(true);

        // Lưu userId nếu có (rất hữu ích cho các API khác)
        if (userData?.id) {
            setUserId(userData.id);
        }
    };

    const logout = () => {
        clearAuthStorage()
        removeToken();
        removeUser?.();    // nếu có
        removeUserId?.();  // nếu có
        setToken(null);
        setUser(null);
        setIsLogin(false);
    };

    // Kiểm tra token còn hiệu lực khi reload trang
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = getToken();

            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                // Gọi API profile để xác thực token còn sống + lấy user mới nhất
                const response = await getUserProfile(storedToken);
                const freshUserData = response.data; // hoặc response.data.user tùy backend

                setUser(freshUserData);
                setToken(storedToken);
                setIsLogin(true);

                // Cập nhật lại userId nếu cần
                if (freshUserData?.id) {
                    setUserId(freshUserData.id);
                }
            } catch (error) {
                console.warn("Token không hợp lệ hoặc hết hạn → đăng xuất");
                logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []); // Chỉ chạy 1 lần khi app load

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLogin,
            login,
            logout,
            loading,
            setUser // vẫn để lại nếu cần cập nhật user ở nơi khác (ví dụ: update profile)
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);