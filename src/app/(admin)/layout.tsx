"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, Book, ListTree, Users, 
  ShieldCheck, PlayCircle, Search, Bell, Settings 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { name: 'Manage Books', href: '/admin/books', icon: Book },
    { name: 'Manage Genres', href: '/admin/genres', icon: ListTree },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'Moderate Reviews', href: '/admin/reviews', icon: ShieldCheck },
    { name: 'Manage Tutorials', href: '/admin/tutorials', icon: PlayCircle },
  ];

  return (
    <div className="flex min-h-screen bg-[#05140b] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 flex flex-col fixed h-full bg-[#05140b]">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#22c55e] p-1 rounded-md">
              <Book size={20} className="text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">BookWorm</span>
          </Link>
          <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === item.href 
                ? 'bg-[#112216] text-[#22c55e]' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-6 border-t border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center text-[#22c55e] font-bold">JS</div>
          <div>
            <p className="text-sm font-bold">Jane Smith</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Super Admin</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-gray-800 sticky top-0 bg-[#05140b]/80 backdrop-blur-md z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search books, users, or reviews..." 
              className="w-full bg-[#112216] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-600 transition-all"
            />
          </div>
          <div className="flex items-center gap-6 text-gray-400">
            <div className="relative cursor-pointer hover:text-white">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#22c55e] rounded-full"></span>
            </div>
            <Settings size={20} className="cursor-pointer hover:text-white" />
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}