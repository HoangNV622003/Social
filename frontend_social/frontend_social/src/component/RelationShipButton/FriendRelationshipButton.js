// src/components/RelationShipButton/FriendRelationshipButton.jsx
import React from "react";
import { toast } from "react-toastify";
import { mapRelationshipObject } from "../../utils/MapRelationshipUtils";
import {
    cancelFriendRequest,
    acceptFriendRequest,
    unfriend,
    addFriendRequest
} from "../../apis/FriendService";
import { createPrivateChat } from "../../apis/ChatService";
import "./FriendRelationshipButton.css";

export default function FriendRelationshipButton({
    relationship,
    profileId,
    token,
    onActionSuccess // Callback từ ProfilePage để cập nhật lại relationship
}) {
    const a = mapRelationshipObject(relationship);

    // Không hiển thị nếu là chính mình hoặc không xác định
    if (!a || a.key === "SELF") return null;

    const handleRelationshipClick = async () => {
        try {
            let message = "";

            switch (a.key) {
                case "SENT_REQUEST":
                    await cancelFriendRequest(profileId, token);
                    message = "Đã hủy lời mời kết bạn";
                    break;

                case "RECEIVED_REQUEST":
                    await acceptFriendRequest(profileId, token);
                    message = "Đã chấp nhận kết bạn!";
                    break;

                case "FRIEND":
                    await unfriend(profileId, token);
                    message = "Đã xóa bạn bè";
                    break;

                case "STRANGER":
                    await addFriendRequest(profileId, token);
                    message = "Đã gửi lời mời kết bạn";
                    break;

                default:
                    return;
            }

            toast.success(message);
            if (onActionSuccess) onActionSuccess(); // Cập nhật lại relationship

        } catch (error) {
            console.error("Friend action failed:", error);
            toast.error("Thao tác thất bại, vui lòng thử lại");
        }
    };

    const handleSendMessage = async () => {
        try {
            const payload = { userId: profileId };
            const res = await createPrivateChat(payload, token);

            if (window.openMiniChat && res.data) {
                window.openMiniChat(res.data);
                toast.success("Đã mở cuộc trò chuyện");
            } else {
                toast.info("Đang mở tin nhắn...");
            }
        } catch (error) {
            console.error("Create chat failed:", error);
            toast.error("Không thể mở tin nhắn lúc này");
        }
    };

    return (
        <div className="friend-button-container">
            <button
                className={`relation-btn ${a.key === "FRIEND" ? "unfriend" : ""}`}
                onClick={handleRelationshipClick}
            >
                {a.label}
            </button>

            <button
                className="message-btn"
                onClick={handleSendMessage}
            >
                Nhắn tin
            </button>
        </div>
    );
}