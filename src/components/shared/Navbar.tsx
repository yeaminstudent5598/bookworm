"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Loader2, BookOpen, Home, Search, Library, User, PlayCircle } from "lucide-react";
import Image from "next/image";
import { logout } from "@/app/actions/auth";
import { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // ইউজার প্রোফাইল ডেটা ফেচ করা (নাম ও ছবি নিশ্চিত করার জন্য)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get("/api/v1/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setUserData(res.data.data);
        }
      } catch (err) {
        console.error("Navbar profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      await logout();
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") return;
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Browse", href: "/books", icon: Search },
    { name: "Library", href: "/my-library", icon: Library },
    { name: "Tutorials", href: "/tutorials", icon: PlayCircle },
  ];

  return (
    <>
      {/* --- DESKTOP TOP NAVBAR --- */}
      <nav className="bg-[#0a1410] text-white py-4 px-4 md:px-12 flex items-center justify-between border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-[#ec7f13] p-1.5 rounded-md text-white group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold font-serif tracking-tight hidden sm:block">BookWorm</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[11px] font-bold uppercase tracking-widest transition-all hover:text-[#ec7f13] ${
                pathname === link.href ? "text-[#ec7f13]" : "text-gray-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Actions (Desktop) */}
        <div className="flex items-center gap-4 border-l border-white/10 pl-4">
          <Link href="/profile" className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#ec7f13] hover:scale-105 transition-transform">
            <Image 
              src={userData?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
              alt="Profile" 
              width={36} 
              height={36} 
              unoptimized
              className="object-cover"
            />
          </Link>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-400 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>Logout</span>
                <LogOut size={18} />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#161109] border-t border-white/5 px-6 py-3 flex items-center justify-between z-[100] rounded-t-[24px] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <link.icon 
              size={22} 
              className={`transition-colors ${pathname === link.href ? "text-[#ec7f13]" : "text-gray-500"}`} 
            />
            <span className={`text-[10px] font-bold tracking-tight ${pathname === link.href ? "text-[#ec7f13]" : "text-gray-500"}`}>
              {link.name}
            </span>
          </Link>
        ))}
        <Link href="/profile" className="flex flex-col items-center gap-1 min-w-[60px]">
          <User 
            size={22} 
            className={`transition-colors ${pathname === '/profile' ? "text-[#ec7f13]" : "text-gray-500"}`} 
          />
          <span className={`text-[10px] font-bold tracking-tight ${pathname === '/profile' ? "text-[#ec7f13]" : "text-gray-500"}`}>
            Profile
          </span>
        </Link>
      </div>
    </>
  );
};

export default Navbar;