// src/context/WebSocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";
import { API_URL } from "../constants/apiConstants";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const { token } = useAuth();
    const [client, setClient] = useState(null);

    const cleanToken = token?.replace(/^Bearer\s+/i, "").trim();

    useEffect(() => {
        if (!cleanToken) {
            setClient(null);
            return;
        }

        const socket = new SockJS(`${API_URL.replace("/api", "")}/ws?token=${cleanToken}`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { Authorization: `Bearer ${cleanToken}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: () => { },
        });

        stompClient.onConnect = () => {
            console.log("WebSocket ĐÃ KẾT NỐI THÀNH CÔNG!");
            setClient(stompClient);
        };

        stompClient.onStompError = (frame) => console.error("STOMP Error:", frame);
        stompClient.onWebSocketClose = () => setClient(null);

        stompClient.activate();

        return () => stompClient.deactivate();
    }, [cleanToken]);

    return (
        <WebSocketContext.Provider value={{ client }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);