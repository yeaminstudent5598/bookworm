"use client";

import React, { useEffect, useState } from 'react';
import { Plus, MoreHorizontal, Loader2, TrendingUp } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================
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

// ============================================================
// AXIOS INSTANCE (From your lib/axios.ts)
// ============================================================
const api = {
  get: async (url: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const response = await fetch(`/api/v1${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  }
};

// ============================================================
// SKELETON COMPONENTS
// ============================================================
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#112216] p-4 sm:p-6 rounded-2xl border border-gray-800 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/50 rounded-xl" />
            <div className="w-12 h-5 bg-gray-800/50 rounded-full" />
          </div>
          <div className="h-3 w-24 bg-gray-800/50 rounded mb-2" />
          <div className="h-8 w-16 bg-gray-800/50 rounded" />
        </div>
      ))}
    </div>
  );
}

function GenreChartSkeleton() {
  return (
    <div className="lg:col-span-5 bg-[#112216] p-4 sm:p-6 rounded-2xl border border-gray-800 animate-pulse">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div className="h-5 w-32 bg-gray-800/50 rounded" />
        <div className="w-8 h-8 bg-gray-800/50 rounded-lg" />
      </div>
      <div className="space-y-4 sm:space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-gray-800/50 rounded" />
              <div className="h-3 w-10 bg-gray-800/50 rounded" />
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gray-700/50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserGrowthSkeleton() {
  return (
    <div className="lg:col-span-7 bg-[#112216] p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-gray-800 animate-pulse">
      <div className="flex justify-between items-start mb-6 sm:mb-10">
        <div>
          <div className="h-5 w-48 bg-gray-800/50 rounded mb-2" />
          <div className="h-3 w-32 bg-gray-800/50 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-800/50 rounded-lg" />
      </div>
      <div className="h-40 sm:h-56 flex items-end justify-between gap-2 px-2 pb-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
            <div 
              className="w-full max-w-[8px] sm:max-w-[12px] lg:max-w-[20px] rounded-t-full bg-gray-800/50"
              style={{ height: `${Math.random() * 60 + 40}%` }}
            />
            <div className="h-2 w-6 bg-gray-800/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden animate-pulse">
      <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-800">
        <div className="h-5 w-32 bg-gray-800/50 rounded" />
        <div className="h-4 w-16 bg-gray-800/50 rounded" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-800 bg-black/10">
            <tr>
              <th className="text-left px-4 sm:px-6 py-3 sm:py-4">
                <div className="h-3 w-16 bg-gray-800/50 rounded" />
              </th>
              <th className="text-left px-4 sm:px-6 py-3 sm:py-4">
                <div className="h-3 w-12 bg-gray-800/50 rounded" />
              </th>
              <th className="text-left px-4 sm:px-6 py-3 sm:py-4">
                <div className="h-3 w-20 bg-gray-800/50 rounded" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-4 sm:px-6 py-4 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800/50 rounded-full flex-shrink-0" />
                    <div className="h-4 w-32 sm:w-48 bg-gray-800/50 rounded" />
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 sm:py-5">
                  <div className="h-6 w-16 bg-gray-800/50 rounded-md" />
                </td>
                <td className="px-4 sm:px-6 py-4 sm:py-5">
                  <div className="h-4 w-24 sm:w-32 bg-gray-800/50 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD STATS COMPONENT
// ============================================================
function DashboardStats({ 
  totalBooks, 
  totalUsers, 
  pendingReviews 
}: { 
  totalBooks: number;
  totalUsers: number;
  pendingReviews: number;
}) {
  const stats = [
    { 
      label: 'Total Books', 
      value: totalBooks, 
      trend: '+12%', 
      icon: '📖',
      showTrend: true 
    },
    { 
      label: 'Total Readers', 
      value: totalUsers, 
      trend: '+5%', 
      icon: '👥',
      showTrend: true 
    },
    { 
      label: 'Pending Reviews', 
      value: pendingReviews, 
      tag: 'Needs Attention', 
      icon: '💬',
      showTrend: false 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="bg-[#112216] p-4 sm:p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-gray-700 transition-all"
        >
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gray-800/50 rounded-xl text-lg sm:text-xl group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            {stat.showTrend && stat.trend && (
              <span className="text-[9px] sm:text-[10px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            )}
            {stat.tag && (
              <span className="text-[9px] sm:text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full animate-pulse">
                {stat.tag}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            {stat.label}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-white">
            {stat.value.toLocaleString()}
          </h3>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// GENRE CHART COMPONENT
// ============================================================
function GenreChart({ genreStats }: { genreStats: Array<{ name: string; percentage: number }> }) {
  return (
    <div className="lg:col-span-5 bg-[#112216] p-4 sm:p-6 rounded-2xl border border-gray-800">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h3 className="font-bold text-white text-sm sm:text-base">Books by Genre</h3>
        <button 
          className="text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {genreStats && genreStats.length > 0 ? (
          genreStats.map((item, idx) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="text-gray-400 truncate pr-2">{item.name}</span>
                <span className="text-white flex-shrink-0">{item.percentage}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#22c55e] transition-all duration-500 ease-out" 
                  style={{ 
                    width: `${item.percentage}%`,
                    opacity: Math.max(0.4, 1 - (idx * 0.15))
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8 text-sm">
            <p>No genre data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// USER GROWTH CHART COMPONENT
// ============================================================
function UserGrowthChart({ userGrowth }: { userGrowth: Array<{ month: string; count: number; percentage: number }> }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="lg:col-span-7 bg-[#112216] p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-[#00d84a]/5 blur-3xl rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-10">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg flex items-center gap-2">
            <TrendingUp size={16} className="text-[#00d84a] sm:w-[18px] sm:h-[18px]" /> Monthly User Growth
          </h3>
          <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Platform Performance</p>
        </div>
        <span className="text-[9px] sm:text-[10px] font-black bg-[#00d84a]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[#00d84a] border border-[#00d84a]/20">
          YEAR {currentYear}
        </span>
      </div>
      
      <div className="h-40 sm:h-48 lg:h-56 flex items-end justify-between gap-1 sm:gap-2 px-1 sm:px-2 pb-2 relative">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
          <div className="w-full h-[1px] bg-white" />
          <div className="w-full h-[1px] bg-white" />
          <div className="w-full h-[1px] bg-white" />
        </div>
        
        {/* Bars */}
        {userGrowth && userGrowth.length > 0 ? (
          userGrowth.map((item) => (
            <div key={item.month} className="flex flex-col items-center gap-2 sm:gap-4 flex-1 group/bar relative">
              {/* Dynamic Bar */}
              <div 
                className="w-full max-w-[8px] sm:max-w-[12px] lg:max-w-[20px] rounded-t-full bg-gradient-to-t from-[#00d84a]/5 to-[#00d84a] transition-all duration-1000 group-hover/bar:to-white group-hover/bar:shadow-[0_0_20px_rgba(0,216,74,0.4)]" 
                style={{ height: `${item.percentage}%` }}
              />
              
              <span className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase group-hover/bar:text-white transition-colors truncate max-w-full">
                {item.month.slice(0, 3)}
              </span>
              
              {/* Professional Tooltip */}
              <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all shadow-2xl pointer-events-none whitespace-nowrap z-10">
                {item.count} Users
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 text-center text-gray-500 text-sm">No data</div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// RECENT ACTIVITY TABLE COMPONENT
// ============================================================
function RecentActivityTable({ activities }: { activities: Array<{ id: string; title: string; status: string; date: string }> }) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden">
      <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-800">
        <h3 className="font-bold text-white text-sm sm:text-base">Recent Activity</h3>
        <button className="text-[#22c55e] text-[10px] sm:text-xs font-bold hover:underline transition-all">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[600px]">
          <thead className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-800 bg-black/10">
            <tr>
              <th className="text-left px-4 sm:px-6 py-3 sm:py-4">Activity</th>
              <th className="text-left px-4 sm:px-6 py-3 sm:py-4">Status</th>
              <th className="text-left px-4 sm:px-6 py-3 sm:py-4">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <tr 
                  key={activity.id} 
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1 sm:p-1.5 bg-[#22c55e]/20 text-[#22c55e] rounded-full flex-shrink-0">
                        <Plus size={12} className="sm:w-[14px] sm:h-[14px]" />
                      </div>
                      <span className="font-medium text-gray-200 text-xs sm:text-sm truncate">
                        {activity.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-5">
                    <span className="bg-[#22c55e]/10 text-[#22c55e] text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-md uppercase whitespace-nowrap inline-block">
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-5 text-gray-400 text-[10px] sm:text-xs whitespace-nowrap">
                    {formatDate(activity.date)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm">
                  No recent activities
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD CLIENT COMPONENT
// ============================================================
export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch main dashboard stats
        const statsRes = await api.get('/admin/stats');
        
        // Fetch user growth data separately
        const growthRes = await api.get('/admin/user-growth');
        
        if (statsRes.success) {
          const dashboardData: DashboardData = {
            totalBooks: statsRes.data.totalBooks || 0,
            totalUsers: statsRes.data.totalUsers || 0,
            pendingReviews: statsRes.data.pendingReviews || 0,
            genreStats: statsRes.data.genreStats || [],
            userGrowth: growthRes.success ? growthRes.data : [],
            recentActivities: statsRes.data.recentActivities || []
          };
          
          setData(dashboardData);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err: any) {
        console.error('Dashboard sync failed:', err);
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 animate-pulse">
          <div>
            <div className="h-8 sm:h-10 w-48 sm:w-64 bg-gray-800/50 rounded mb-2" />
            <div className="h-4 w-56 sm:w-72 bg-gray-800/50 rounded" />
          </div>
          <div className="h-10 w-32 sm:w-40 bg-gray-800/50 rounded-lg" />
        </div>

        <StatsSkeleton />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <GenreChartSkeleton />
          <UserGrowthSkeleton />
        </div>
        
        <RecentActivitySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-red-500 text-center max-w-md">
          <p className="text-lg sm:text-xl font-bold mb-2">Failed to Load Dashboard</p>
          <p className="text-xs sm:text-sm text-gray-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#22c55e] text-black rounded-lg text-xs sm:text-sm font-bold hover:bg-[#1bb054] transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-[60vh] flex items-center justify-center px-4">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-white">
            Good morning, Admin
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Here is what is happening with your library today.
          </p>
        </div>
        <button 
          className="bg-[#22c55e] text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-[#1bb054] transition-all shadow-lg shadow-[#22c55e]/20 w-full sm:w-auto justify-center"
          aria-label="Add new book"
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Add New Book
        </button>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        totalBooks={data.totalBooks}
        totalUsers={data.totalUsers}
        pendingReviews={data.pendingReviews}
      />

      {/* Middle Section: Genre & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <GenreChart genreStats={data.genreStats} />
        <UserGrowthChart userGrowth={data.userGrowth} />
      </div>

      {/* Recent Activity Table */}
      <RecentActivityTable activities={data.recentActivities} />
    </div>
  );
}