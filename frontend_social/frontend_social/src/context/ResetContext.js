// src/context/ResetContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ResetContext = createContext();

export const ResetProvider = ({ children }) => {
    const [resetTrigger, setResetTrigger] = useState(0);

    const triggerReset = () => {
        setResetTrigger((prev) => prev + 1); // Tăng giá trị để kích hoạt reset
    };

    return (
        <ResetContext.Provider value={{ resetTrigger, triggerReset }}>
            {children}
        </ResetContext.Provider>
    );
};

export const useReset = () => useContext(ResetContext);