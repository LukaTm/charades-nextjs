"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const currentURLPathname = window.location.pathname;
    // useEffect(() => {
    //     if (currentURLPathname === "/") {
    //         router.push("https://final-charades.vercel.app/main");
    //     }
    // }, []);
}
