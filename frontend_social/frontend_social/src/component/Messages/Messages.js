import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import ChatBox from './ChatBox';
import timeAgo from '../../Ago';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getAllChats, deleteChat } from '../../apis/ChatService'; // Dùng service
import './Messages.css';

// === SVG Icons (giữ nguyên, rất đẹp) ===
const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const EmptyIcon = () => (
  <svg viewBox="0 0 24 24" width="90" height="90" fill="#9ca3af">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
);

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  const { token } = useAuth();

  // === Responsive ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === Lấy danh sách cuộc trò chuyện ===
  const fetchConversations = async () => {
    console.log(token);

    if (!token) {
      setError('Bạn chưa đăng nhập');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAllChats(token);
      const data = response.data;

      // Sắp xếp theo tin nhắn mới nhất
      const sorted = data.sort((a, b) =>
        new Date(b.lastMessageTimestamp || 0) - new Date(a.lastMessageTimestamp || 0)
      );

      setConversations(sorted);
    } catch (err) {
      console.error('Lỗi tải tin nhắn:', err);
      const msg = err.response?.data?.message || 'Không thể tải danh sách tin nhắn';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [token]);

  // === Xóa cuộc trò chuyện ===
  const deleteConversation = async (chatId) => {
    if (!window.confirm('Xóa toàn bộ cuộc trò chuyện này?')) return;

    try {
      await deleteChat(chatId, token);
      toast.success('Đã xóa cuộc trò chuyện');
      setConversations(prev => prev.filter(c => c.chatId !== chatId));
      if (selectedChat?.chatId === chatId) setSelectedChat(null);
    } catch (err) {
      toast.error('Xóa thất bại');
      console.error(err);
    }
  };

  return (
    <div className="messages-app">
      <Navbar />

      <div className="messages-layout">
        {/* SIDEBAR - Danh sách người chat */}
        <aside className={`messages-sidebar ${selectedChat && isMobile ? 'hide' : 'show'}`}>
          <div className="sidebar-header">
            <h1>Tin nhắn</h1>
          </div>

          {loading && (
            <div className="loading text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          )}

          {error && <div className="error text-center py-5 text-danger">{error}</div>}

          {!loading && !error && conversations.length === 0 && (
            <div className="empty-conversations">
              <EmptyIcon />
              <h3>Chưa có tin nhắn</h3>
              <p>Hãy bắt đầu trò chuyện với bạn bè!</p>
            </div>
          )}

          <div className="conversations-scroll">
            {conversations.map(conv => {
              const unread = conv.unreadCount > 0;
              const active = selectedChat?.chatId === conv.chatId;

              return (
                <div
                  key={conv.chatId}
                  className={`conversation-card ${active ? 'active' : ''} ${unread ? 'unread' : ''}`}
                  onClick={() => setSelectedChat(conv)}
                >
                  <div className="user-avatar-large">
                    <span>{conv.username[0].toUpperCase()}</span>
                    {unread && <span className="unread-badge">{conv.unreadCount > 99 ? '99+' : conv.unreadCount}</span>}
                  </div>

                  <div className="conversation-info">
                    <h3 className="username">{conv.username}</h3>
                    <p className="last-message-preview">
                      {conv.lastMessageContent || 'Chưa có tin nhắn'}
                    </p>
                    <div className="meta">
                      {conv.lastMessageTimestamp && (
                        <span className="time-ago">{timeAgo(conv.lastMessageTimestamp)}</span>
                      )}
                    </div>
                  </div>

                  <button
                    className="delete-conversation"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.chatId);
                    }}
                    title="Xóa cuộc trò chuyện"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CHAT AREA - Hiển thị tin nhắn */}
        <main className={`chat-area ${!selectedChat && isMobile ? 'hide' : 'show'}`}>
          {selectedChat ? (
            <>
              {isMobile && (
                <div className="mobile-chat-header">
                  <button onClick={() => setSelectedChat(null)} className="back-button">
                    <BackIcon />
                  </button>
                  <div className="chat-header-info">
                    <div className="avatar-small">
                      {selectedChat.username[0].toUpperCase()}
                    </div>
                    <h3>{selectedChat.username}</h3>
                  </div>
                </div>
              )}
              <ChatBox user={selectedChat} onClose={() => setSelectedChat(null)} />
            </>
          ) : (
            <div className="no-selection">
              <EmptyIcon />
              <h2>Chọn một cuộc trò chuyện</h2>
              <p>Chọn tin nhắn bên trái để bắt đầu</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Messages;