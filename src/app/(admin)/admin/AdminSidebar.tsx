"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  LayoutGrid, Book, ListTree, Users, 
  ShieldCheck, PlayCircle, X, ChevronRight, 
  LogOut, Menu, Loader2
} from 'lucide-react';
import { logout } from "@/app/actions/auth"; // সার্ভার অ্যাকশন ইমপোর্ট

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
  { name: 'Manage Books', href: '/admin/books', icon: Book },
  { name: 'Manage Genres', href: '/admin/genres', icon: ListTree },
  { name: 'Manage Users', href: '/admin/users', icon: Users },
  { name: 'Moderate Reviews', href: '/admin/reviews', icon: ShieldCheck },
  { name: 'Manage Tutorials', href: '/admin/tutorials', icon: PlayCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const response = await axios.get('/api/v1/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Navbar এর মতো সরাসরি Logout লজিক
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userData");
      await logout(); // সার্ভার থেকে কুকি ডিলিট করবে
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") return;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* 📱 Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a1410] border-b border-white/5 z-[90] flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#ec7f13] p-1.5 rounded-lg">
            <Book size={18} className="text-white" />
          </div>
          <span className="font-bold text-sm text-white">BookWorm Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl bg-white/5 text-[#ec7f13] border border-[#ec7f13]/20"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar aside */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#0d1a12] border-r border-white/5 flex flex-col z-[101] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="bg-[#ec7f13] p-2 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              <Book size={22} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white block">BookWorm</span>
              <p className="text-[10px] font-black text-[#ec7f13] uppercase tracking-widest">Authority</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-gray-500"><X size={20} /></button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name} href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group ${isActive ? 'bg-[#ec7f13] text-white shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? 'text-white' : 'group-hover:text-[#ec7f13] transition-colors'} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer: Logout Button (Fixed like Navbar) */}
        <div className="p-6 bg-black/20 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#ec7f13]">
              <img src={user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || "Admin User"}</p>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{user?.role || "Authority"}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Logout Admin</span>
                <LogOut size={16} />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}