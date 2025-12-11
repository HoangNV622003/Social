import React, {
    useState

    , useEffect, useRef, memo
} from 'react';
import { useMessageWebSocket } from '../../hooks/useMessageWebSocket';
import MessageList from '../../views/ChatPage/MessageList';
import UserAvatar from '../UserAvatar/UserAvatar';
import { AiOutlineSend, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import { getChatDetail } from '../../apis/ChatService';
import { getChatDisplayInfo } from '../../utils/CommonUtils';
import './MiniChat.css';
const MiniChat = ({ chat, currentUserId, onClose }) => {
    const { token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [opponent, setOpponent] = useState({ displayName: 'Đang tải...', displayImage: null });
    const [isMinimized, setIsMinimized] = useState(false);

    // THÊM REF ĐỂ CUỘN
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // Hoặc dùng cách mạnh hơn nếu smooth không mượt:
        // messagesContainerRef.current?.scrollTop = messagesContainerRef.current?.scrollHeight;
    };

    const { sendMessage } = useMessageWebSocket(chat?.id, (newMessage) => {
        setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            const updated = [...prev, newMessage];
            // Cuộn ngay khi nhận tin mới
            setTimeout(scrollToBottom, 100); // đảm bảo DOM đã render
            return updated;
        });
    });

    useEffect(() => {
        if (!chat?.id || !token) return;

        const load = async () => {
            setLoading(true);
            try {
                const res = await getChatDetail(chat.id, 0, 30, token);
                const rawMsgs = res.data.messages?.content || [];
                const msgs = rawMsgs.slice().reverse();
                setMessages(msgs);

                const info = getChatDisplayInfo(res.data, currentUserId);
                setOpponent({
                    displayName: info.displayName,
                    displayImage: info.displayImage
                });

                // Cuộn xuống cuối sau khi load tin nhắn
                setTimeout(scrollToBottom, 150);

            } catch (err) {
                console.error('Load chat detail error:', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [chat?.id, token, currentUserId]);

    // Cuộn khi messages thay đổi (gửi tin, nhận tin, load lần đầu)
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cuộn khi mở lại từ trạng thái minimized
    useEffect(() => {
        if (!isMinimized) {
            setTimeout(scrollToBottom, 100);
        }
    }, [isMinimized]);

    const handleSend = () => {
        if (!input.trim()) return;

        sendMessage({
            content: input.trim(),
            senderId: currentUserId
        });

        setInput('');
        // Cuộn ngay sau khi gửi (optimistic)
        setTimeout(scrollToBottom, 100);
    };

    // ... phần return giữ nguyên, chỉ sửa className và thêm ref

    return (
        <div className={`mini-chat ${isMinimized ? 'minimized' : ''}`}>
            <div className="mini-chat-header" onClick={() => setIsMinimized(!isMinimized)}>
                <UserAvatar
                    username={opponent.displayName}
                    image={opponent.displayImage}
                    size="small"
                    fallback={opponent.displayName?.[0]?.toUpperCase() || '?'}
                />
                <span className="mini-chat-title">{opponent.displayName}</span>
                <div className="mini-chat-actions">
                    <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
                        <AiOutlineMinus />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }}>
                        <AiOutlineClose />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* THÊM REF VÀO CONTAINER */}
                    <div
                        className="mini-chat-messages"
                        ref={messagesContainerRef}
                    >
                        {loading ? (
                            <div className="mini-loading">Đang tải tin nhắn...</div>
                        ) : (
                            <>
                                <MessageList
                                    messages={messages}
                                    currentUserId={currentUserId}
                                    chatType={chat.type}
                                    opponent={opponent}
                                />
                                {/* ĐẶT REF Ở CUỐI */}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    <div className="mini-chat-input">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder="Aa..."
                            autoFocus
                        />
                        <button onClick={handleSend} disabled={!input.trim()}>
                            <AiOutlineSend />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default memo(MiniChat);