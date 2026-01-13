"use client";

import React, { useEffect, useState } from 'react';
import { Plus, MoreHorizontal, Loader2 } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ১. ড্যাশবোর্ড ডাটা ফেচ করা
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/admin/stats');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard Sync Failed");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#22c55e]" size={48} />
      <p className="text-gray-500 animate-pulse font-serif italic">Restoring Library Stats...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Good morning, Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Here is what is happening with your library today.</p>
        </div>
        <button className="bg-[#22c55e] text-black px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#1bb054] transition-all shadow-lg shadow-[#22c55e]/20">
          <Plus size={18} /> Add New Book
        </button>
      </div>

      {/* Stats Cards (Dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Books', value: data?.totalBooks || 0, trend: '+12%', icon: '📖' },
          { label: 'Total Readers', value: data?.totalUsers || 0, trend: '+5%', icon: '👥' },
          { label: 'Pending Reviews', value: data?.pendingReviews || 0, tag: 'Needs Attention', icon: '💬' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#112216] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-gray-800/50 rounded-xl text-xl">{stat.icon}</div>
               {stat.trend && <span className="text-[10px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded-full">{stat.trend}</span>}
               {stat.tag && <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">{stat.tag}</span>}
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-2 text-white">{stat.value.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      {/* Middle Section: Genre & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Books by Genre (Dynamic) */}
        <div className="lg:col-span-5 bg-[#112216] p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-white">Books by Genre</h3>
            <MoreHorizontal size={18} className="text-gray-500 cursor-pointer" />
          </div>
          <div className="space-y-6">
            {data?.genreStats?.map((item: any, idx: number) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-gray-400">{item.name}</span>
                  <span className="text-white">{item.percentage}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-[#22c55e] opacity-${100 - (idx * 20)}`} 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Chart (Dynamic) */}
        <div className="lg:col-span-7 bg-[#112216] p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-white">Monthly User Growth</h3>
            <span className="text-[10px] font-bold bg-gray-800 px-2 py-1 rounded text-gray-400">2026</span>
          </div>
          <div className="h-48 flex items-end justify-between px-4 pb-2 relative">
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                <div className="w-full h-[1px] bg-white"></div>
                <div className="w-full h-[1px] bg-white"></div>
                <div className="w-full h-[1px] bg-white"></div>
             </div>
             {data?.userGrowth?.map((item: any) => (
               <div key={item.month} className="flex flex-col items-center gap-4 flex-1 group relative">
                  <div 
                    className="w-full max-w-[30px] rounded-t-lg bg-gradient-to-t from-[#22c55e]/10 to-[#22c55e]/40 transition-all hover:to-[#22c55e]/80" 
                    style={{ height: `${item.percentage}%` }}
                  ></div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase">{item.month}</span>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table (Dynamic) */}
      <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h3 className="font-bold text-white">Recent Activity</h3>
          <button className="text-[#22c55e] text-xs font-bold hover:underline">View All</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-800 bg-black/10">
            <tr>
              <th className="text-left px-6 py-4">Activity</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {data?.recentActivities?.map((activity: any) => (
              <tr key={activity.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5 flex items-center gap-3">
                   <div className="p-1.5 bg-[#22c55e]/20 text-[#22c55e] rounded-full">
                     <Plus size={14} />
                   </div>
                   <span className="font-medium text-gray-200">{activity.title}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-gray-400 text-xs">
                  {new Date(activity.date).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;