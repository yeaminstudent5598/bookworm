"use client";

import React, { useState } from 'react';
import { Search, Settings } from 'lucide-react';
import Link from 'next/link';

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5 sticky top-0 bg-[#0a1410]/80 backdrop-blur-md z-30">
      
      {/* Search Bar - Hidden on mobile */}
      <div className="flex-1 max-w-md lg:max-w-lg hidden sm:block">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" 
            size={18} 
          />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 sm:py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#ec7f13]/30 focus:ring-2 focus:ring-[#ec7f13]/10 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Mobile Search Button */}
        <button 
          className="sm:hidden w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Settings - Linked to /admin/profile */}
        <Link 
          href="/admin/profile"
          className="flex w-10 h-10 rounded-lg bg-white/5 items-center justify-center hover:bg-[#ec7f13]/20 hover:text-[#ec7f13] transition-all group"
          aria-label="Account Settings"
          title="Change Password & Admin Settings"
        >
          <Settings size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>
      </div>
    </header>
  );
}