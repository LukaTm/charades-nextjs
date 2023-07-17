// "use client";

import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "./AuthProvider";

// font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Mēmais šovs",
    description:
        "Ģenerē mēmā šova vārdus, kā arī vari izveidot pats savus vārdus, kuri tiks saglabāti un vienmēr būs pieejami. Izvēlies vieglu, vidēju vai grūtu grūtību.",
};

export default function RootLayout({ children }) {
    return (
        <AuthProvider>
            <html lang="en">
                <body className={inter.className}>{children}</body>
            </html>
        </AuthProvider>
    );
}
