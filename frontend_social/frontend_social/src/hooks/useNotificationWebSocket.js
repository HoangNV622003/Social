// src/hooks/useNotificationWebSocket.js
import { useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import WS from '../constants/WSConstants';

export const useNotificationWebSocket = (onNewNotification) => {
    const { client } = useWebSocket();
    const { user } = useAuth();
    const subscriptionRef = useRef(null);

    useEffect(() => {
        if (!client?.connected || !user?.id) return;

        // Hủy đăng ký cũ (khi user thay đổi hoặc reconnect)
        subscriptionRef.current?.unsubscribe();
        console.log("huy dang ky cu thanh cong")
        // ĐÚNG TOPIC PHẢI LÀ: /topic/notifications/{userId}

        const subscription = client.subscribe(WS.TOPIC.NOTIFICATIONS(user.id), (message) => {
            console.log("dang ky moi thanh cong")
            try {
                console.log("nhan thong bao")
                const noti = JSON.parse(message.body);
                console.log("noti", noti)
                if (!noti?.id) return;

                // Không cần lọc receiverId nữa → vì topic đã đúng người rồi!
                onNewNotification(noti);

                // Toast đẹp như Zalo/FB
                toast.info(noti.message || 'Bạn có thông báo mới', {
                    position: 'top-right',
                    autoClose: 5000,
                    toastId: `noti-${noti.id}`,
                });

            } catch (err) {
                console.error('Lỗi parse thông báo:', err);
            }
        });

        subscriptionRef.current = subscription;

        // Dọn dẹp khi rời trang hoặc user logout
        return () => {
            subscriptionRef.current?.unsubscribe();
        };

    }, [client?.connected, user?.id, onNewNotification]);
};