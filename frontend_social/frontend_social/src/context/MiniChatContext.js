// src/context/MiniChatContext.jsx
import React, { createContext, useContext, useState } from 'react';

const MiniChatContext = createContext();

export const useMiniChat = () => useContext(MiniChatContext);

export const MiniChatProvider = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(true); // mặc định bật

    return (
        <MiniChatContext.Provider value={{ isEnabled, setIsEnabled }}>
            {children}
        </MiniChatContext.Provider>
    );
};