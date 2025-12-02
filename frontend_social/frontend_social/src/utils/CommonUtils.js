// src/utils/CommonUtils.js (hoặc nơi bạn định nghĩa)
export const getChatDisplayInfo = (chatData, currentUserId) => {
    if (!chatData || !currentUserId) {
        return { displayName: "Unknown", displayImage: null };
    }

    // Chat riêng tư → lấy người còn lại
    if (chatData.type === "PRIVATE") {
        const otherUser = chatData.members?.find(
            member => member.id !== Number(currentUserId)
        );

        return {
            displayName: otherUser?.username || "Người dùng đã xóa",
            displayImage: otherUser?.image || null
        };
    }

    // Group chat
    return {
        displayName: chatData.name || `Nhóm (${chatData.members?.length || 0} thành viên)`,
        displayImage: chatData.image || null
    };
};