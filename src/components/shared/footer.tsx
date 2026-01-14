"use client";
import React from 'react';
import Link from 'next/link';
import { BookOpen, Github, Linkedin, Facebook, Heart, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1f1c] text-gray-400 py-12 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* 1. Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-green-500 p-1.5 rounded-lg">
                <BookOpen size={20} className="text-[#0a1f1c]" />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase">BookWorm</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Your personal sanctuary for reading, tracking, and discovering new worlds. Built for those who find peace between the pages.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase text-xs tracking-widest">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-green-500 transition-colors">User Dashboard</Link></li>
              <li><Link href="/books" className="hover:text-green-500 transition-colors">Browse Library</Link></li>
              <li><Link href="/my-library" className="hover:text-green-500 transition-colors">My Shelves</Link></li>
              <li><Link href="/tutorials" className="hover:text-green-500 transition-colors">Tutorials</Link></li>
            </ul>
          </div>

          {/* 3. Community & Support */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase text-xs tracking-widest">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-green-500 transition-colors">FAQs</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition-colors">Reading Tips</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition-colors">Privacy Policy</Link></li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> yeamin@pixelcode.com
              </li>
            </ul>
          </div>

          {/* 4. Social Connect */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase text-xs tracking-widest">Connect With Me</h3>
            <div className="flex gap-4">
              <Link href="https://github.com/Yeamin-Madbor" target="_blank" className="bg-white/5 p-3 rounded-xl hover:bg-green-500 hover:text-[#0a1f1c] transition-all">
                <Github size={20} />
              </Link>
              <Link href="#" target="_blank" className="bg-white/5 p-3 rounded-xl hover:bg-green-500 hover:text-[#0a1f1c] transition-all">
                <Linkedin size={20} />
              </Link>
              <Link href="#" target="_blank" className="bg-white/5 p-3 rounded-xl hover:bg-green-500 hover:text-[#0a1f1c] transition-all">
                <Facebook size={20} />
              </Link>
            </div>
            <p className="text-[11px] italic text-gray-500">
              "A room without books is like a body without a soul." — Cicero
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px]">
          <p>© 2026 BookWorm Project. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> by 
            <span className="text-white font-bold ml-1">Yeamin Madbor</span>
          </p>
        </div>
      </div>
    </footer>
  );
}