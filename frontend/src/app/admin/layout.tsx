"use client";

import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const context = useContext(UserContext);
    const router = useRouter();
    const user = context?.user;
    const loading = context?.loading ?? true;

    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== "ADMIN") {
            router.replace("/signin");
        }
    }, [loading, user, router]);

    if (loading || !user || user.role !== "ADMIN") {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f4f4f5] text-[13px] text-[#77777d]">
                Шалгаж байна...
            </main>
        );
    }

    return <>{children}</>;
}
