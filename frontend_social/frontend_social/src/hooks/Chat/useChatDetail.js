// src/hooks/useChatDetail.js
import { useState, useEffect } from 'react';
import { getChatDetail } from '../../apis/ChatService';
import { getChatDisplayInfo } from '../../utils/CommonUtils';
import { toast } from 'react-toastify';

export const useChatDetail = (chatId, token, currentUserId) => {
    const [fullChatData, setFullChatData] = useState(null);
    const [opponent, setOpponent] = useState({
        displayName: '...',
        displayImage: null,
        id: null
    });
    const [loading, setLoading] = useState(false);

    const loadChatDetail = async () => {
        if (!chatId || !token) return;

        setLoading(true);
        try {
            const res = await getChatDetail(chatId, 0, 30, token);
            const data = res.data;

            setFullChatData(data);

            const info = getChatDisplayInfo(data, currentUserId);
            setOpponent({
                displayName: info.displayName,
                displayImage: info.displayImage,
                id: info.opponentId
            });

            // TRẢ VỀ tin nhắn để ChatDetail dùng luôn (nếu muốn)
            return data.messages?.content || [];
        } catch (err) {
            toast.error('Không thể tải thông tin cuộc trò chuyện');
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChatDetail();
    }, [chatId, token, currentUserId]);

    return {
        fullChatData,
        opponent,
        loading,
        reload: loadChatDetail  // ← gọi lại khi cập nhật nhóm
    };
}