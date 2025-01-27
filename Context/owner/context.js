"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
    // Load initial selected content from sessionStorage, if available
    const storedContent = typeof window !== "undefined" ? sessionStorage.getItem("selectedContent") : null;
    const [selectedContent, setSelectedContent] = useState(storedContent || "Home");

    // Sync selectedContent with sessionStorage whenever it changes
    useEffect(() => {
        if (selectedContent) {
            sessionStorage.setItem("selectedContent", selectedContent);
        }
    }, [selectedContent]);

    return (
        <ContentContext.Provider value={{ selectedContent, setSelectedContent }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => useContext(ContentContext);
