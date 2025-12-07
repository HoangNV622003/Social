// src/hooks/useMessageWebSocket.js
import { useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import WS from '../constants/WSConstants';

export const useMessageWebSocket = (chatId, onMessageReceived) => {
    const { client } = useWebSocket();
    const subscriptionRef = useRef(null);
    const onMessageReceivedRef = useRef(onMessageReceived);

    // Giữ callback mới nhất (rất quan trọng!)
    useEffect(() => {
        onMessageReceivedRef.current = onMessageReceived;
    }, [onMessageReceived]);

    const sendMessage = (payload) => {
        if (!chatId || !client?.connected) return;
        client.publish({
            destination: WS.APP.SEND_MESSAGE(Number(chatId)),
            body: JSON.stringify({
                content: payload.content,
                senderId: Number(payload.senderId),
            }),
        });
    };

    useEffect(() => {
        if (!client?.connected || !chatId) return;

        // Hủy subscription cũ nếu đổi phòng
        subscriptionRef.current?.unsubscribe();

        const topic = WS.TOPIC.CHAT_ROOM(chatId);

        const subscription = client.subscribe(topic, (message) => {
            try {
                const data = JSON.parse(message.body);
                if (data.id) {
                    // DÙNG REF ĐỂ LUÔN GỌI ĐƯỢC CALLBACK MỚI NHẤT
                    onMessageReceivedRef.current?.(data);
                }
            } catch (err) {
                console.error('Parse WS message error:', err);
            }
        });

        subscriptionRef.current = subscription;

        return () => {
            subscription.unsubscribe();
        };
    }, [client?.connected, chatId]); // THÊM chatId VÀO ĐÂY – QUAN TRỌNG NHẤT!

    return { sendMessage };
};