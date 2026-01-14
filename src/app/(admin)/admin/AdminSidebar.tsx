"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  LayoutGrid, Book, ListTree, Users, 
  ShieldCheck, PlayCircle, X, ChevronRight, 
  LogOut, Menu
} from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }
        const response = await axios.get('/api/v1/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setUser(response.data.data);
          localStorage.setItem('userData', JSON.stringify(response.data.data));
        }
      } catch (error) {
        const cachedUser = localStorage.getItem('userData');
        if (cachedUser) setUser(JSON.parse(cachedUser));
      } finally { setLoading(false); }
    };
    fetchUserProfile();
  }, [router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = 'accessToken=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <>
      {/* 📱 Mobile Toggle Button - Fixed and Styled */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a1410] border-b border-white/5 z-[90] flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#00d84a] p-1.5 rounded-lg">
            <Book size={18} className="text-black" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">BookWorm Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl bg-white/5 text-[#00d84a] border border-[#00d84a]/20"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-[280px] lg:w-64 xl:w-72
          bg-[#112216] border-r border-white/5
          flex flex-col z-[101] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${sidebarOpen ? 'translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.5)]' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="bg-[#22c55e] p-2.5 rounded-2xl shadow-lg shadow-[#22c55e]/20">
              <Book size={22} className="text-black" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold text-white block">BookWorm</span>
              <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-widest">Authority</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name} href={item.href}
                className={`
                  flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group
                  ${isActive 
                    ? 'bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/10' 
                    : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? 'text-black' : 'group-hover:text-[#22c55e] transition-colors'} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer: User Profile */}
        <div className="p-6 bg-black/20 border-t border-white/5">
          {user && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#22c55e]/30 bg-[#22c55e]/10 flex-shrink-0">
                  {user.photo ? (
                    <img src={user.photo} alt="P" className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full flex items-center justify-center font-bold text-[#22c55e] uppercase">{user.name[0]}</div>}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <LogOut size={14} /> Exit System
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}