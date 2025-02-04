"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from '@node_modules/next/navigation';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            setIsLogin(true);
            if (session?.user) {
                setUserName(session.user.lastName || "");
            }
        } else if (status === "unauthenticated") {
            setIsLogin(false);
            setUserName("");
        }
    }, [status, session]);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{
            isLogin,
            userName,
            isDropdownOpen,
            setIsDropdownOpen,
            handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
