// src/components/chat/ChatBox.jsx ← COPY ĐÈ NGUYÊN FILE NÀY LÀ CHẠY NGON 100%
import React, { useState, useEffect, useRef } from "react";
import timeAgo from "../../Ago";
import { useAuth } from "../../context/AuthContext";
import { getAllMessage } from "../../apis/ChatService";
import { toast } from "react-toastify";
import "./ChatBox.css";

function ChatBox({ user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { token, user: currentUser } = useAuth();
  const cleanToken = token?.replace("Bearer ", "").trim();

  const currentUserId = currentUser.id;

  useEffect(() => {

    const handler = (e) => {
      const msg = e.detail;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };
    window.addEventListener("ws-message", handler);
    return () => window.removeEventListener("ws-message", handler);
  }, []);

  useEffect(() => {
    if (user?.chatId && window.subscribeChatRoom) {
      window.subscribeChatRoom(user.chatId);
    }
    return () => {
      if (user?.chatId && window.unsubscribeChatRoom) {
        window.unsubscribeChatRoom(user.chatId);
      }
    };
  }, [user?.chatId]);

  useEffect(() => {
    if (!user?.chatId || !cleanToken) return;

    const load = async () => {
      try {
        const res = await getAllMessage(user.chatId, 0, 50, cleanToken);
        setMessages(res.data?.content || []);
      } catch (err) {
        toast.error("Không tải được tin nhắn");
      }
    };
    setMessages([]);
    load();
  }, [user?.chatId, cleanToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ĐÂY LÀ CHỖ QUAN TRỌNG: GỬI ĐÚNG FORMAT BACKEND MUỐN
  const sendMessage = () => {

    const content = newMessage.trim();
    // if (!content || !user?.chatId || !currentUserId || !user.id) {
    //   toast.error("Thiếu thông tin nhắn hoặc thông tin người dùng");
    //   return;
    // }

    const payload = {
      senderId: localStorage.getItem("userId"),    // bắt buộc
      receiverId: user.userId,        // BẮT BUỘC PHẢI CÓ – đây là nguyên nhân chết người ban đầu
      content: content,
      type: "TEXT"
    };
    console.log("Gửi payload:", payload);
    const success = window.sendWSMessage?.(user.chatId, payload);

    if (success) {
      // Optimistic UI
      setMessages(prev => [...prev, {
        id: Date.now() * -1,
        senderId: currentUserId,
        receiverId: user.id,
        senderUsername: currentUser?.username,
        receiverUsername: user.username,
        content,
        type: "TEXT",
        timestamp: new Date().toISOString(),
      }]);
      setNewMessage("");
    } else {
      toast.error("Mất kết nối WebSocket. Đang thử lại...");
    }
  };

  return (
    <div className="chatbox-modal" onClick={e => e.stopPropagation()}>
      <div className="chatbox-header">
        <div className="chatbox-user-info">
          <div className="avatar">{user.username?.[0]?.toUpperCase() || "?"}</div>
          <h3>{user.username}</h3>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="chatbox-messages">
        {messages.length === 0 ? (
          <div className="no-messages">Chưa có tin nhắn nào. Bắt đầu thôi!</div>
        ) : (
          messages.map(msg => {
            const isSent = msg.senderId === currentUserId;
            return (
              <div key={msg.id || Math.random()} className={`message ${isSent ? "sent" : "received"}`}>
                <div className="message-content">
                  <p>{msg.content}</p>
                  <span className="timestamp">{timeAgo(msg.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbox-input">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage} disabled={!newMessage.trim()}>
          Gửi
        </button>
      </div>
    </div>
  );
}

export default ChatBox;