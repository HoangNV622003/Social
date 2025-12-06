// src/hooks/useNotificationWebSocket.js
import { useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import WS from '../constants/WSConstants';

export const useChatWebSocket = (onNewChat) => {
    const { client } = useWebSocket();
    const { user } = useAuth();
    const subscriptionRef = useRef(null);

    useEffect(() => {
        if (!client?.connected || !user?.id) return;

        subscriptionRef.current?.unsubscribe();
        console.log("dang ky")
        const subscription = client.subscribe(WS.TOPIC.NEW_CHAT(user.id), (message) => {
            console.log("hello")
            try {
                const noti = JSON.parse(message.body);
                console.log("resposne" + noti)
                if (!noti?.chatId) return;

                onNewChat(noti);

                // Toast đẹp như Zalo/FB
                toast.info(noti.message || 'Bạn đã được thêm vào nhóm', {
                    position: 'top-right',
                    autoClose: 5000,
                    toastId: `noti-${noti.chatId}`,
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

    }, [client?.connected, user?.id, onNewChat]);
};