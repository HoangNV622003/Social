// src/hooks/useMessageWebSocket.js
import { useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import WS from '../constants/WSConstants';

export const useMessageWebSocket = (chatId, onMessageReceived) => {
    const { client } = useWebSocket();
    const subscriptionRef = useRef(null);

    const sendMessage = (payload) => {
        if (!chatId || !client?.connected) return;
        console.log("Sending message via WebSocket:", payload);
        client.publish({
            destination: WS.APP.SEND_MESSAGE(Number(chatId)),
            body: JSON.stringify({
                content: payload.content,
                senderId: Number(payload.senderId), // hoặc lấy từ context
            }),
        });
    };

    useEffect(() => {
        if (!client?.connected || !chatId || !onMessageReceived) return;

        subscriptionRef.current?.unsubscribe();

        const topic = WS.TOPIC.CHAT_ROOM(chatId);

        const subscription = client.subscribe(topic, (message) => {
            try {
                const data = JSON.parse(message.body);

                // CHỈ NHẬN TIN NHẮN THẬT (có id) → thêm luôn
                if (data.id) {
                    onMessageReceived(data);
                }
                // BỎ QUA hoàn toàn tin tạm (không có id)

            } catch (err) {
                console.error('Parse WS message error:', err);
            }
        });

        subscriptionRef.current = subscription;

        return () => subscription.unsubscribe();
    }, [client?.connected, chatId, onMessageReceived]);

    return { sendMessage };
};