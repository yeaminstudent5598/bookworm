"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, MoreHorizontal, TrendingUp, 
  BookOpen, Users as UsersIcon, MessageSquare, 
  Activity, ArrowUpRight, Clock, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  totalBooks: number;
  totalUsers: number;
  pendingReviews: number;
  genreStats: Array<{ name: string; percentage: number }>;
  userGrowth: Array<{ month: string; count: number; percentage: number }>;
  recentActivities: Array<{
    id: string;
    title: string;
    status: string;
    date: string;
  }>;
}

export function DashboardClient({ initialData, initialGrowth }: { initialData: any, initialGrowth: any[] }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveReaders = async () => {
      try {
        const response = await fetch('/api/v1/admin/users', {
          method: 'GET',
          cache: 'no-store',
        });

        const usersData = await response.json();
        const activeReaders = usersData.data?.filter((user: any) => user.role === 'user')?.length || 0;

        if (initialData) {
          setData({
            totalBooks: initialData.totalBooks || 0,
            totalUsers: activeReaders,
            pendingReviews: initialData.pendingReviews || 0,
            genreStats: initialData.genreStats || [],
            userGrowth: initialGrowth || [],
            recentActivities: initialData.recentActivities || []
          });
        }
      } catch (error) {
        console.error('Error fetching active readers:', error);
        if (initialData) {
          setData({
            totalBooks: initialData.totalBooks || 0,
            totalUsers: initialData.totalUsers || 0,
            pendingReviews: initialData.pendingReviews || 0,
            genreStats: initialData.genreStats || [],
            userGrowth: initialGrowth || [],
            recentActivities: initialData.recentActivities || []
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActiveReaders();
  }, [initialData, initialGrowth]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in duration-700 pb-10">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
            <p className="text-[#22c55e] text-[10px] font-black uppercase tracking-[0.3em]">Management Console</p>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white tracking-tight leading-tight">
            Greetings, Librarian
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm italic max-w-md">
            Monitoring the pulse of your digital library community and content inventory.
          </p>
        </div>
        <Link 
          href="/admin/books/add"
          className="bg-[#22c55e] text-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-[#1bb054] transition-all shadow-xl shadow-[#22c55e]/10 w-full sm:w-auto justify-center group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Add New Entry
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard label="Cataloged Books" value={data?.totalBooks || 0} icon={<BookOpen size={22}/>} trend="+12%" color="green" />
        <StatCard label="Active Readers" value={data?.totalUsers || 0} icon={<UsersIcon size={22}/>} trend="+5%" color="blue" />
        <StatCard label="Pending Reviews" value={data?.pendingReviews || 0} icon={<MessageSquare size={22}/>} tag="Attention" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5 bg-[#112216] p-6 sm:p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8 h-full">
          <div className="flex justify-between items-center">
             <div className="space-y-1">
                <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                  <Activity size={18} className="text-[#22c55e]"/> Genre Insights
                </h3>
                <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">Library distribution</p>
             </div>
             <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                <MoreHorizontal size={20} />
             </button>
          </div>
          
          <div className="space-y-6">
            {data?.genreStats.map((item, idx) => (
              <div key={idx} className="space-y-3 group">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-400 group-hover:text-white transition-colors">{item.name}</span>
                  <span className="text-[#22c55e]">{item.percentage}%</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#22c55e] transition-all duration-1000 ease-out" 
                    style={{ width: `${item.percentage}%`, opacity: 1 - (idx * 0.12) }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#112216] p-6 sm:p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group h-full">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/5 blur-[100px] rounded-full -mr-32 -mt-32" />
           
           <div className="flex justify-between items-start mb-10">
             <div className="space-y-1">
               <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                 <TrendingUp size={18} className="text-[#22c55e]"/> Membership Velocity
               </h3>
               <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Growth Analytics</p>
             </div>
             <span className="bg-black/40 px-3 py-1.5 rounded-xl text-[9px] font-black text-[#22c55e] border border-white/5 flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full" /> YEAR 2026
             </span>
           </div>
           
           <div className="h-48 sm:h-56 flex items-end justify-between gap-1 sm:gap-2 px-1 relative">
             {data?.userGrowth.map((item, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar relative">
                 <div 
                   className="w-full max-w-[28px] bg-gradient-to-t from-[#22c55e]/10 via-[#22c55e]/40 to-[#22c55e] rounded-t-lg sm:rounded-t-xl transition-all duration-1000 group-hover/bar:to-white group-hover/bar:shadow-[0_0_25px_rgba(34,197,94,0.3)]" 
                   style={{ height: `${item.percentage}%` }} 
                 />
                 <span className="text-[8px] font-black text-gray-600 uppercase group-hover/bar:text-white transition-all">
                    {item.month.slice(0,3)}
                 </span>
                 
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl z-10 hidden sm:block">
                   {item.count} Readers
                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="bg-[#112216] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-[#c19a6b]">
              <Clock size={20} />
            </div>
            <h3 className="text-white font-bold text-base sm:text-lg">Recent Library Activity</h3>
          </div>
          <button className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest hover:underline transition-all">View Full Logs</button>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-black/10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-600 border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Event Description</th>
                <th className="px-8 py-5">Verification Status</th>
                <th className="px-8 py-5 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-6 flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#22c55e]/5 rounded-full flex items-center justify-center text-[#22c55e] border border-[#22c55e]/10 group-hover:bg-[#22c55e] group-hover:text-black transition-all">
                      <Plus size={14}/>
                    </div>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{activity.title}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[#22c55e] bg-[#22c55e]/5 w-fit px-3 py-1 rounded-full border border-[#22c55e]/10">
                      <CheckCircle2 size={10} />
                      <span className="text-[9px] font-black uppercase tracking-tighter">{activity.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right text-[10px] text-gray-500 font-mono">
                    {new Date(activity.date).toLocaleString('en-US', { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend, tag, color }: any) {
  return (
    <div className="bg-[#112216] p-6 sm:p-8 rounded-[2rem] border border-white/5 hover:border-[#22c55e]/30 transition-all shadow-xl group relative overflow-hidden">
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-[#22c55e]/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="p-4 bg-black/40 rounded-2xl text-[#22c55e] group-hover:scale-110 group-hover:bg-[#22c55e] group-hover:text-black transition-all duration-500 shadow-inner">
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black text-[#22c55e] bg-[#22c55e]/10 px-3 py-1 rounded-full border border-[#22c55e]/10">
            <ArrowUpRight size={10} /> {trend}
          </div>
        )}
        {tag && (
          <span className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full animate-pulse border border-orange-500/20 uppercase tracking-widest">
            {tag}
          </span>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] mb-1">{label}</p>
        <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {value.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 p-4 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        <div className="space-y-3"><div className="h-4 w-32 bg-white/5 rounded"/><div className="h-12 w-64 bg-white/5 rounded-xl"/></div>
        <div className="h-14 w-40 bg-white/5 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-[2rem]" />)}
      </div>  
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-80 bg-white/5 rounded-[2rem]" />
        <div className="lg:col-span-7 h-80 bg-white/5 rounded-[2rem]" />
      </div>
    </div>
  );
}