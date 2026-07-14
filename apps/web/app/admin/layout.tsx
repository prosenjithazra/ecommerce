"use client";

import { AdminSidebar } from "./AdminSidebar";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../../components/AppContext";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useApp();
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      if (!isLoginPage) {
        router.push("/admin/login");
      }
      return;
    }

    if (currentUser) {
      setLoading(false);
      if (currentUser.role !== "admin") {
        router.push("/");
      } else if (isLoginPage) {
        router.push("/admin");
      }
      return;
    }

    // Token exists, but currentUser is still null (fetching/loading)
    setLoading(true);

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        // Fetch failed and token was removed, or user logged out
        clearInterval(interval);
        setLoading(false);
        if (!isLoginPage) {
          router.push("/admin/login");
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentUser, pathname, isLoginPage, router]);

  if (loading && !isLoginPage) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F7F4F0] text-[#4A453E]">
        <Loader2 className="w-10 h-10 animate-spin text-[#F9A37E] mb-3" strokeWidth={2.5} />
        <span className="text-xs font-bold tracking-widest uppercase">Loading admin console...</span>
      </div>
    );
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#F7F4F0]">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-[#F7F4F0] overflow-hidden font-sans antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

