"use client";

import React, { useState } from 'react';
import { Search, Bell, Settings } from 'lucide-react';

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
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 sm:py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#00d84a]/30 focus:ring-2 focus:ring-[#00d84a]/10 transition-all"
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

        {/* Notifications */}
        <button 
          className="relative w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#00d84a] rounded-full ring-2 ring-[#0a1410]" />
        </button>

        {/* Settings - Hidden on mobile */}
        <button 
          className="hidden sm:flex w-10 h-10 rounded-lg bg-white/5 items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}