/* "use client";

import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthPv = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export const OwnerAuthProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // If the session is not yet loaded, do nothing
        if (status === "loading") return;

        // If there's no session or the role is not 'Owner', redirect
        if (!session || session.user.role !== 'Owner') {
            router.push('/'); // Redirect non-Owner users to home
        }
    }, [session, status, router]);

    if (status === "loading" || !session || session.user.role !== 'Owner') {
        return (
            <div className="min-h-screen min-w-screen z-50 flex justify-center items-center">
                <div>Loading...</div>
            </div>
        );
    }

    return <>{children}</>;
};
 */




