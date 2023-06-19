"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import AuthContext from "../store/context";
import { useRef, useState, useEffect } from "react";
import AuthProvider from "./AuthProvider";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";

// font
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    const defaultLangRef = useRef("eng");
    const router = useRouter();
    const searchParams = useSearchParams();

    const [rerun, setRerun] = useState(false);

    const [lang, setLang] = useState("");
    const SetTheRerun = () => {
        setRerun(!rerun);
    };

    let defaultLang = defaultLangRef.current;

    useEffect(() => {
        const search = searchParams.get("lang");
        setLang(search);
    }, []);

    if (lang) {
        defaultLang = lang;
    }

    return (
        <AuthProvider>
            <AuthContext.Provider
                value={{
                    SetTheRerun,
                    defaultLang,
                    defaultLangRef,
                    rerun,
                    setRerun,
                    lang,
                    setLang,
                }}
            >
                <html lang="en">
                    <body className={inter.className}>{children}</body>
                </html>
            </AuthContext.Provider>
        </AuthProvider>
    );
}
