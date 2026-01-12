"use client";
import { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#fdfaf1]/80 backdrop-blur-md border-b border-[#e5d9c1] sticky top-0 z-50 px-4 py-3 lg:px-8">
      <div className="flex justify-between items-center">
        {/* Mobile Toggle */}
        <button className="lg:hidden text-[#5c4033]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="lg:hidden font-serif font-bold text-xl text-[#5c4033]">BookWorm</div>

        <div className="flex-1 lg:flex hidden">
           <span className="text-[#8b5e3c] font-medium italic">"A room without books is like a body without a soul."</span>
        </div>

        {/* User Profile / Actions */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-bold text-[#5c4033]">Yeamin Madbor</span>
            <span className="text-xs text-[#8b5e3c]">Admin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#e5d9c1] flex items-center justify-center border-2 border-[#5c4033]">
            <User size={20} className="text-[#5c4033]" />
          </div>
          <button className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}