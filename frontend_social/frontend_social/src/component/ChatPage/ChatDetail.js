// src/components/chat/ChatDetail.jsx
import { useMessageWebSocket } from '../../hooks/useMessageWebSocket';
import { useChatDetail } from '../../hooks/Chat/useChatDetail'; // ← NEW
import MessageList from './MessageList';
import ChatDetailHeader from './ChatDetailHeader';
import GroupUpdatePopup from '../Popup/CreateGroupPopup/GroupUpdatePopup';
import { AiOutlineSend } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import './ChatDetail.css';
import { useRef, useEffect, useState, memo } from 'react';
const ChatDetail = ({ chat, currentUserId }) => {
    const { token } = useAuth();

    // Quản lý tin nhắn riêng (vì WebSocket cập nhật liên tục)
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // Load thông tin nhóm + opponent + tin nhắn ban đầu
    const { fullChatData, opponent, loading, reload } = useChatDetail(
        chat?.id,
        token,
        currentUserId
    );

    // Khi load lần đầu từ API → set tin nhắn
    useEffect(() => {
        if (fullChatData?.messages?.content) {
            const rawMsgs = fullChatData.messages.content;
            setMessages(rawMsgs.slice().reverse()); // mới nhất ở dưới
        }
    }, [fullChatData]);

    // WebSocket: nhận tin nhắn mới
    const { sendMessage } = useMessageWebSocket(chat?.id, (newMessage) => {
        setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
        });
    });

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage({
            content: input.trim(),
            senderId: currentUserId
        });
        setInput('');
    };

    const [input, setInput] = useState('');
    const [showGroupUpdate, setShowGroupUpdate] = useState(false);

    if (!chat) {
        return <div className="chat-detail-empty">Chọn một cuộc trò chuyện...</div>;
    }

    return (
        <div className="chat-detail">
            <ChatDetailHeader
                chat={chat}
                opponent={opponent}
                onUpdateGroup={() => setShowGroupUpdate(true)}
            />

            {/* Popup cập nhật nhóm */}
            {showGroupUpdate && fullChatData && chat.type === 'GROUP' && (
                <GroupUpdatePopup
                    chat={fullChatData}
                    onClose={() => setShowGroupUpdate(false)}
                    onUpdateSuccess={reload} // ← reload thông tin nhóm + ảnh + tên
                />
            )}

            <div className="chat-messages-container">
                {loading && <div className="chat-loading">Đang tải...</div>}

                <MessageList
                    messages={messages}
                    currentUserId={currentUserId}
                    chatType={chat.type}
                    opponent={opponent}
                />

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="Aa"
                    autoFocus
                />
                <button onClick={handleSend} disabled={!input.trim()}>
                    <AiOutlineSend size={24} />
                </button>
            </div>
        </div>
    );
};

export default memo(ChatDetail);