"use client";
import React from 'react';
import { 
  Search, Bell, Plus, Flame, BookOpen, Clock, 
  TrendingUp, Settings, UserPlus, Info, ChevronRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'framer-motion';

// Mock Data for Charts & Content
const genreData = [
  { name: 'Sci-Fi', value: 45, color: '#22c55e' },
  { name: 'Fantasy', value: 25, color: '#3b82f6' },
  { name: 'History', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 15, color: '#a855f7' },
];

const monthlyPages = [
  { name: 'Jan', pages: 300 }, { name: 'Feb', pages: 450 },
  { name: 'Mar', pages: 500 }, { name: 'Apr', pages: 400 },
  { name: 'May', pages: 650 }, { name: 'Jun', pages: 800 },
];

const communityFeed = [
  { id: 1, name: "Sarah M.", action: "finished reading", book: "The Great Gatsby", time: "2h ago", avatar: "https://i.pravatar.cc/150?u=sarah" },
  { id: 2, name: "Tom K.", action: "added 3 books to", shelf: "Summer Reads", time: "5m ago", avatar: "https://i.pravatar.cc/150?u=tom" },
  { id: 3, name: "Jessica W.", action: "started reading", book: "Atomic Habits", time: "1d ago", avatar: "https://i.pravatar.cc/150?u=jessica" },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-[#0a1f1c] text-white p-4 md:p-6 font-sans">
      
      {/* 1. TOP HEADER */}
      <header className="flex items-center justify-between mb-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
             <div className="bg-green-500 p-1.5 rounded-lg">
                <BookOpen className="text-white" size={24} />
             </div>
             <span className="text-xl font-bold tracking-tight">BookWorm</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-400">
            <button className="hover:text-white transition-colors">My Library</button>
            <button className="hover:text-white transition-colors">Browse</button>
            <button className="hover:text-white transition-colors">Tutorials</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Search size={20} className="text-gray-400 cursor-pointer" />
          <div className="relative">
            <Bell size={20} className="text-gray-400 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full"></span>
          </div>
          <img src="https://i.pravatar.cc/150?u=yeamin" className="w-8 h-8 rounded-full border-2 border-green-500/50" alt="profile" />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* LEFT & CENTER CONTENT (3 Columns) */}
        <div className="xl:col-span-3 space-y-6">
          
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Welcome back, Reader</h1>
            <p className="text-gray-400 text-sm">Here's what's happening in your library today.</p>
          </div>

          {/* Top Row: Challenge & Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Yearly Challenge Card */}
            <div className="md:col-span-1 bg-[#112b27] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
               <div className="relative z-10">
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">2026 Challenge</span>
                  <h2 className="text-2xl font-bold mt-1">12 of 50 Books</h2>
                  <p className="text-xs text-gray-400 mt-1 max-w-[150px]">You're on track! Keep reading to reach your yearly goal.</p>
                  <button className="mt-6 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-[#0a1f1c] font-bold px-4 py-2 rounded-xl text-sm transition-all">
                    <Plus size={16} /> Log Book
                  </button>
               </div>
               {/* Circular Progress */}
               <div className="absolute right-[-20px] top-6 size-32">
                  <svg className="size-full -rotate-90 transform" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="text-white/5" stroke="currentColor" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" className="text-green-500" stroke="currentColor" strokeWidth="3" strokeDasharray="24, 100" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">24%</div>
               </div>
            </div>

            {/* Small Stat Cards */}
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div className="bg-[#112b27] p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                <div className="bg-orange-500/20 p-2 w-fit rounded-lg text-orange-500"><Flame size={20} /></div>
                <div>
                  <p className="text-2xl font-bold">14</p>
                  <p className="text-xs text-gray-400">Day Streak</p>
                </div>
              </div>
              <div className="bg-[#112b27] p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                <div className="bg-blue-500/20 p-2 w-fit rounded-lg text-blue-500"><BookOpen size={20} /></div>
                <div>
                  <p className="text-2xl font-bold">3,420</p>
                  <p className="text-xs text-gray-400">Total Pages</p>
                </div>
              </div>
              <div className="col-span-2 bg-[#112b27] p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-green-500/20 p-2 rounded-lg text-green-500"><Clock size={20} /></div>
                   <div>
                     <p className="text-lg font-bold">45h 20m</p>
                     <p className="text-xs text-gray-400">Reading Time</p>
                   </div>
                </div>
                <ChevronRight className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Middle Row: Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genre Breakdown */}
            <div className="bg-[#112b27] p-6 rounded-3xl border border-white/5">
              <h3 className="font-bold mb-4">Genre Breakdown</h3>
              <div className="h-48 flex items-center">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie data={genreData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {genreData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-1/2 space-y-2 text-xs">
                  {genreData.map(g => (
                    <div key={g.name} className="flex justify-between text-gray-400">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background: g.color}}></span>{g.name}</span>
                      <span>{g.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Pages per Month */}
            <div className="bg-[#112b27] p-6 rounded-3xl border border-white/5">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Pages per Month</h3>
                  <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-green-500 uppercase">Last 6 Months</span>
               </div>
               <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyPages}>
                      <Bar dataKey="pages" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={30} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#112b27', border: 'none', borderRadius: '8px'}} />
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Recommended Section */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Recommended for You</h2>
              <button className="text-xs text-green-500 font-bold hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="group cursor-pointer">
                   <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#112b27] border border-white/5 relative shadow-xl">
                      <img src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&sig=${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                         <button className="bg-green-500 text-[#0a1f1c] text-[10px] font-bold py-1.5 rounded-lg">View Details</button>
                      </div>
                   </div>
                   <div className="mt-2">
                     <p className="text-xs font-bold truncate">Project Hail Mary</p>
                     <p className="text-[10px] text-gray-400">Andy Weir</p>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR (1 Column) */}
        <aside className="xl:col-span-1 space-y-6">
          <div className="bg-[#112b27] h-full rounded-3xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Community</h3>
              <div className="flex gap-2 text-gray-500">
                 <UserPlus size={18} className="cursor-pointer hover:text-white" />
                 <Settings size={18} className="cursor-pointer hover:text-white" />
              </div>
            </div>

            <div className="space-y-6">
              {communityFeed.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.avatar} className="size-10 rounded-full border border-green-500/20" alt="" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs leading-relaxed">
                      <span className="font-bold">{item.name}</span> {item.action} 
                      <span className="text-green-500 italic"> {item.book || item.shelf}</span>
                    </p>
                    {item.id === 1 && (
                       <div className="text-[10px] bg-white/5 p-2 rounded-lg italic text-gray-400 mt-2 line-clamp-1">
                         "A timeless classic, I loved the ending!"
                       </div>
                    )}
                    <p className="text-[10px] text-gray-500 uppercase font-bold">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 bg-green-500/10 hover:bg-green-500/20 text-green-500 font-bold py-3 rounded-2xl text-xs transition-colors">
              Find Friends
            </button>
          </div>
        </aside>

      </main>

      {/* Decorative Bottom Line */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
    </div>
  );
}