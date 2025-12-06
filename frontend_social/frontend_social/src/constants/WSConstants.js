// src/constants/websocket.js
// Đồng bộ 100% với backend Java hiện tại của bạn

const WS = {
    // 1. Nhận tin nhắn realtime trong phòng chat
    // Backend gửi: /topic/chat/123
    // Frontend subscribe: /topic/chat/123
    TOPIC: {
        CHAT_ROOM: (chatId) => `/topic/chat/${chatId}`,
        NOTIFICATIONS: (userId) => `/topic/notifications/${userId}`
    },

    // 2. Nhận thông báo có đoạn chat mới (private hoặc group)
    // Backend gửi đến từng user: /user/123/queue/new-chat
    // Frontend chỉ cần subscribe 1 lần: /user/queue/new-chat
    QUEUE: {
        NEW_CHAT: '/user/queue/new-chat', // dùng chung cho cả chat 1-1 và group (theo code backend bạn)
    },

    // 3. Đường dẫn GỬI tin nhắn lên server (dùng trong client.send hoặc client.publish)
    APP: {
        SEND_MESSAGE: (chatId) => `/app/chat/${chatId}/send-message`,
        CREATE_PRIVATE_CHAT: '/app/chat/create-chat',
        CREATE_GROUP_CHAT: '/app/chat/create-group',
    },
};

// Đóng băng object để tránh bị sửa nhầm
Object.freeze(WS);

export default WS;