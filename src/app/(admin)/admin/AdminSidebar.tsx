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

interface UserData {
  name: string;
  email: string;
  role: string;
  photo: string;
}

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
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile dynamically
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('/api/v1/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setUser(response.data.data);
          localStorage.setItem('userData', JSON.stringify(response.data.data));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        const cachedUser = localStorage.getItem('userData');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    document.cookie = 'accessToken=; path=/; max-age=0';
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay - Full Screen */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-[280px] sm:w-80 lg:w-64 xl:w-72
          bg-[#0a1410] border-r border-white/5
          flex flex-col z-[101] transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo & Close Button */}
        <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-[#00d84a] p-2 rounded-lg shrink-0">
              <Book size={20} className="text-black" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold">BookWorm</span>
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase">Admin Panel</p>
            </div>
          </Link>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-3 sm:px-4 py-6 space-y-1 overflow-y-auto overscroll-contain">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center justify-between gap-3 px-3 sm:px-4 py-3
                  rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-[#00d84a]/10 text-[#00d84a] border border-[#00d84a]/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="shrink-0" />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} className="shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 sm:p-6 border-t border-white/5 space-y-3 shrink-0">
          {loading ? (
            /* Skeleton Loading */
            <div className="space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-4 bg-white/10 rounded w-24" />
                  <div className="h-3 bg-white/5 rounded w-16" />
                </div>
              </div>
              <div className="h-10 bg-white/5 rounded-lg" />
            </div>
          ) : user ? (
            /* User Data Loaded */
            <>
              <div className="flex items-center gap-3">
                {user.photo ? (
                  <img 
                    src={user.photo} 
                    alt={user.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-[#00d84a]/20 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#00d84a]/20 flex items-center justify-center text-[#00d84a] font-bold text-sm shrink-0">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase truncate">
                    {user.role}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-sm font-medium transition-all"
              >
                <LogOut size={16} className="shrink-0" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            /* Error State */
            <div className="text-center text-gray-500 text-xs py-2">
              Failed to load profile
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Menu Button - Fixed Position */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[99] w-10 h-10 rounded-lg bg-[#0a1410] border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
    </>
  );
}