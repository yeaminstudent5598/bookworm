"use client";

import Link from "next/link"; // ✅ ফিক্সড: next/image এর বদলে next/link হবে
import { usePathname } from "next/navigation";
import { Search, Bell, LogOut, Menu, X, Loader2, BookOpen } from "lucide-react";
import Image from "next/image";
import { logout } from "@/app/actions/auth";
import { useState, useEffect } from "react";
import { verifyToken } from "@/lib/jwt";

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ইউজার ডাটা চেক (Console Log সহ)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded: any = verifyToken(token);
      console.log("👤 Current User Decoded:", decoded); // এরর চেক করার জন্য লগ
      setUser(decoded);
    } else {
      console.log("⚠️ No Token Found in LocalStorage");
    }
  }, []);

  // শুধুমাত্র Reader/User এর জন্য নববার লিংক
  const navLinks = [
    { name: "Home", href: "/dashboard" },
    { name: "Browse", href: "/books" },
    { name: "My Library", href: "/my-library" },
    { name: "Tutorials", href: "/tutorials" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("🚪 Logging out user...");
      localStorage.removeItem("accessToken");
      await logout();
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") return;
      console.error("❌ Logout failed:", error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="bg-[#05140b] text-white py-4 px-4 md:px-8 flex items-center justify-between border-b border-gray-800 sticky top-0 z-50">
        
        {/* লোগো সেকশন */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#22c55e] p-1.5 rounded-md text-[#05140b] group-hover:scale-110 transition-transform">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold hidden sm:block font-serif tracking-tight">BookWorm</span>
        </Link>

        {/* ডাইনামিক ডেস্কটপ লিংক (শুধুমাত্র ইউজার পেজ) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[11px] font-black uppercase tracking-widest transition-colors hover:text-[#22c55e] ${
                pathname === link.href ? "text-[#22c55e]" : "text-gray-500"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* প্রোফাইল ও অ্যাকশন বাটন */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 border-r border-gray-800 pr-4">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#22c55e]/30 bg-gray-900 hidden xs:block">
              <Image 
                src={user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                alt="Profile" 
                width={32} 
                height={32} 
              />
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-gray-500 hover:text-red-500 transition-all disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
          </button>

          {/* মোবাইল মেনু বাটন */}
          <button className="md:hidden text-gray-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* মোবাইল ড্রপডাউন */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#081b0f] border-b border-gray-800 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xs font-black uppercase tracking-widest ${pathname === link.href ? "text-[#22c55e]" : "text-gray-500"}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;