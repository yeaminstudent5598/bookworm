"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Flame, BookOpen, Trophy, Plus, 
  ChevronRight, Loader2, Star, Users 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const UserDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // এপিআই থেকে ড্যাশবোর্ড ডাটা ফেচ করা
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const res = await axios.get('/api/v1/user/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard data fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // সময়ের ওপর ভিত্তি করে গ্রিটিং সেট করা
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4 bg-[#05140b]">
      <Loader2 className="animate-spin text-[#22c55e]" size={48} />
      <p className="text-gray-500 font-serif italic">Curating your reading space...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05140b] text-white p-6 lg:p-10 flex flex-col lg:flex-row gap-10 animate-in fade-in duration-700">
      
      {/* --- Main Content (Left Side) --- */}
      <div className="flex-1 space-y-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-5xl font-serif font-bold tracking-tight">
              {getGreeting()}, {data?.user?.name || "Elena"}
            </h1>
            <p className="text-gray-500 italic text-lg">"A room without books is like a body without a soul."</p>
          </div>
          <button className="bg-[#f1c40f] text-black px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-[#d4ac0d] transition-all shadow-xl shadow-yellow-500/10">
            <Plus size={18} strokeWidth={3} /> Log Reading
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Day Streak', value: data?.stats?.streak || 0, icon: <Flame size={24}/> },
            { label: 'Pages Read', value: data?.stats?.pagesRead?.toLocaleString() || 0, icon: <BookOpen size={24}/> },
            { label: 'Books Finished', value: data?.stats?.booksFinished || 0, icon: <Trophy size={24}/> },
          ].map((stat, i) => (
            <div key={i} className="bg-[#112216] border border-gray-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center space-y-3 hover:border-[#22c55e]/30 transition-all group">
              <div className="text-gray-600 group-hover:text-[#22c55e] transition-colors">{stat.icon}</div>
              <h3 className="text-4xl font-bold text-[#f1c40f]">{stat.value}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 2026 Challenge Card */}
        <div className="bg-[#112216] border border-gray-800 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
          <div className="flex-1 space-y-6">
             <span className="bg-[#f1c40f]/10 text-[#f1c40f] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2 w-fit">
               <Trophy size={12}/> 2026 Challenge
             </span>
             <h2 className="text-3xl font-bold">You're ahead of schedule!</h2>
             <p className="text-gray-500 leading-relaxed max-w-md">
               You've read {data?.stats?.booksFinished} books so far. To meet your goal of {data?.challenge?.goal || 50} books, you need to read roughly 3 more books this month. Keep it up!
             </p>
             <div className="flex gap-6 pt-2">
               <button className="text-white font-bold border-b-2 border-[#f1c40f] pb-1 text-sm">View Details</button>
               <button className="text-gray-500 font-bold text-sm">Edit Goal</button>
             </div>
          </div>
          
          {/* Circular Progress (Requirement) */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-800" />
              <circle 
                cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" 
                className="text-[#f1c40f]"
                strokeDasharray={502.4}
                strokeDashoffset={502.4 - (502.4 * (data?.stats?.booksFinished || 0)) / (data?.challenge?.goal || 50)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-4xl font-bold">{data?.stats?.booksFinished}</span>
               <span className="text-[10px] text-gray-500 font-black uppercase">of {data?.challenge?.goal || 50}</span>
            </div>
          </div>
        </div>

        {/* Curated For You (Recommendations) */}
        <div className="space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold flex items-center gap-3 font-serif italic">
                <Star className="text-[#f1c40f]" size={20} fill="currentColor"/> Curated For You
              </h3>
              <ChevronRight className="text-gray-600 cursor-pointer hover:text-white" />
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data?.recommendations?.map((book: any) => (
                <div key={book._id} className="space-y-4 group">
                   <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden bg-[#112216] border border-gray-800 group-hover:border-[#f1c40f]/50 transition-all duration-500 shadow-2xl">
                      <Image src={book.coverImage} alt={book.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   <div>
                     <h4 className="font-bold text-sm line-clamp-1 group-hover:text-[#f1c40f] transition-colors">{book.title}</h4>
                     <p className="text-[10px] text-gray-500 font-medium italic">{book.author}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- Sidebar (Social Activity - Right Side) --- */}
      <aside className="w-full lg:w-80 space-y-10">
         <div className="bg-[#112216] border border-gray-800 rounded-[2.5rem] p-8 space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="font-bold text-lg">Social Activity</h3>
               <button className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest">View All</button>
            </div>
            
            <div className="space-y-8 relative">
               {/* Activity Timeline Line */}
               <div className="absolute left-5 top-0 bottom-0 w-[1px] bg-gray-800"></div>
               
               {data?.activities?.map((activity: any, i: number) => (
                 <div key={i} className="flex gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900 overflow-hidden flex-shrink-0">
                       <Image src={activity.userPhoto} alt="User" width={40} height={40} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-xs leading-relaxed">
                         <span className="font-bold text-[#f1c40f]">{activity.userName}</span> {activity.action} <span className="italic text-gray-400">"{activity.target}"</span>
                       </p>
                       <p className="text-[10px] text-gray-600 font-medium">{activity.time}</p>
                       {activity.rating && (
                         <div className="flex text-yellow-500 gap-0.5 pt-1">
                           {[...Array(5)].map((_, idx) => <Star key={idx} size={8} fill={idx < activity.rating ? "currentColor" : "none"} />)}
                         </div>
                       )}
                    </div>
                 </div>
               ))}
            </div>

            <div className="pt-8 border-t border-gray-800 space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Friends Online</h4>
               <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((friend) => (
                    <div key={friend} className="w-10 h-10 rounded-full border-2 border-[#112216] bg-gray-900 overflow-hidden relative">
                       <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend * 5}`} alt="Friend" fill />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-[#112216] bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    +3
                  </div>
               </div>
            </div>
         </div>
      </aside>
    </div>
  );
};

export default UserDashboard;