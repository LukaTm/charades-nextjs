"use client";

import { SessionProvider } from "next-auth/react";

type Props = {
    children: React.ReactNode;
};

// Session WRAPPER  |  Client side components nested access currect user
export default function AuthProvider({ children }: Props) {
    return <SessionProvider>{children}</SessionProvider>;
}
