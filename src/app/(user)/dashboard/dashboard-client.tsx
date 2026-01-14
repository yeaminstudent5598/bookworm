// ============================================
// FILE: app/(user)/dashboard/dashboard-client.tsx
// ============================================

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Flame, BookOpen, Trophy, Settings,
  Users, Star, Sparkles, ChevronRight, Info,
  Loader2
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, Tooltip,
  CartesianGrid
} from 'recharts';
import Image from 'next/image';
import Link from 'next/link';
import { DashboardSkeleton } from '@/skeletons';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
}

interface Stats {
  booksFinished: number;
  pagesRead: number;
  streak: number;
  averageRating: number;
}

interface Challenge {
  goal: number;
  year: number;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  reason: string;
}

interface Activity {
  _id: string;
  userName: string;
  userPhoto: string;
  action: 'finished' | 'rated' | 'added';
  target: string;
  rating?: number;
  comment?: string;
  createdAt: string;
}

interface ChartData {
  genres: Array<{ name: string; value: number }>;
  monthly: Array<{ name: string; pages: number }>;
}

interface DashboardData {
  user: User;
  stats: Stats;
  challenge: Challenge;
  recommendations: Book[];
  activities: Activity[];
  charts: ChartData;
}

const CHART_COLORS = ['#22c55e', '#3b82f6', '#f1c40f', '#ef4444', '#8b5cf6'];

const DashboardClient = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to view your dashboard');
        setLoading(false);
        return;
      }

      const res = await axios.get('/api/v1/user/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setData(res.data.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return <ErrorState message={error || 'Failed to load dashboard'} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-12">
            <Header user={data.user} />
            <StatsSection stats={data.stats} challenge={data.challenge} />
            <ChartsSection charts={data.charts} />
            <RecommendationsSection recommendations={data.recommendations} />
          </div>

          <aside className="lg:col-span-4">
            <ActivityFeedSidebar activities={data.activities} />
          </aside>
        </div>
      </div>
    </div>
  );
};

// Components
interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-8">
    <div className="space-y-2">
      <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
        Welcome, {user.name?.split(' ')[0]} 📚
      </h1>
      <p className="text-gray-500 text-sm italic">
        "Keep tracking your journey through the world of words."
      </p>
    </div>
    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-[#00d84a]/20 transition-all">
      <Settings size={20} className="text-gray-400" />
    </button>
  </header>
);

interface StatsSectionProps {
  stats: Stats;
  challenge: Challenge;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats, challenge }) => {
  const percentage = Math.min(
    Math.round((stats.booksFinished / challenge.goal) * 100),
    100
  );
  const strokeDasharray = 301.4;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-2 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 rounded-3xl flex items-center gap-8 border border-white/10 hover:border-white/20 shadow-xl transition-all duration-300">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="#05140b" strokeWidth="12" fill="transparent" />
            <circle
              cx="64" cy="64" r="56" stroke="#00d84a" strokeWidth="12" fill="transparent"
              strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-black text-3xl text-[#00d84a]">{percentage}%</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#00d84a] text-xs font-bold uppercase tracking-widest">
            <Trophy size={16} /> {challenge.year} Challenge
          </div>
          <h3 className="text-4xl font-bold text-white">
            {stats.booksFinished} / {challenge.goal}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            You are {percentage}% through your annual goal. Keep reading!
          </p>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-gradient-to-r from-[#00d84a] to-[#00ff6a] rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <StatCard
        icon={<Flame size={32} className="text-orange-500" />}
        label="Day Streak"
        value={stats.streak}
      />

      <StatCard
        icon={<BookOpen size={32} className="text-blue-500" />}
        label="Pages Read"
        value={stats.pagesRead.toLocaleString()}
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 rounded-3xl border border-white/10 hover:border-white/20 flex flex-col justify-center items-center gap-4 shadow-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,216,74,0.1)]">
    {icon}
    <h3 className="text-4xl font-black text-[#00d84a]">{value}</h3>
    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">
      {label}
    </p>
  </div>
);

interface ChartsSectionProps {
  charts: ChartData;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ charts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-10 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl transition-all">
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
        📊 Favorite Genres
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={charts.genres || []}
              innerRadius={65}
              outerRadius={95}
              paddingAngle={8}
              dataKey="value"
            >
              {(charts.genres || []).map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#05140b',
                border: 'none',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6 text-xs">
        {(charts.genres || []).slice(0, 4).map((genre, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="text-gray-400">{genre.name}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-10 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl transition-all">
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
        📈 Pages per Month
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={charts.monthly || []}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff05"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: '#05140b',
                border: 'none',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar
              dataKey="pages"
              fill="#00d84a"
              radius={[10, 10, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

interface RecommendationsSectionProps {
  recommendations: Book[];
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations
}) => (
  <section className="space-y-8 border-t border-white/5 pt-8">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Sparkles className="text-[#00d84a]" size={24} />
        <h4 className="text-3xl font-serif font-bold italic">Curated For You</h4>
      </div>
      <Link
        href="/books"
        className="text-[#00d84a] text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2 transition-all hover:gap-3"
      >
        View All <ChevronRight size={16} />
      </Link>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {recommendations.map((book) => (
        <RecommendationCard key={book._id} book={book} />
      ))}
    </div>
  </section>
);

interface RecommendationCardProps {
  book: Book;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ book }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div
      className="group relative space-y-3"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link href={`/books/${book._id}`}>
        <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden border border-white/10 hover:border-[#00d84a]/40 shadow-lg hover:shadow-[0_0_20px_rgba(0,216,74,0.2)] transition-all duration-300 bg-white/5">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="px-1 space-y-1">
        <h5 className="text-sm font-bold line-clamp-2 group-hover:text-[#00d84a] transition-colors">
          {book.title}
        </h5>
        <p className="text-xs text-gray-500 italic">{book.author}</p>
      </div>

      {showTooltip && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#00d84a] text-black text-xs font-bold px-4 py-2 rounded-lg opacity-100 pointer-events-none whitespace-nowrap shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Info size={12} />
          {book.reason || 'Popular on BookWorm'}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#00d84a] rotate-45" />
        </div>
      )}
    </div>
  );
};

interface ActivityFeedSidebarProps {
  activities: Activity[];
}

const ActivityFeedSidebar: React.FC<ActivityFeedSidebarProps> = ({ activities }) => (
  <aside className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-3xl p-8 border border-white/10 hover:border-white/20 self-start sticky top-8 shadow-xl transition-all duration-300">
    <div className="flex justify-between items-center mb-8">
      <h4 className="font-serif font-bold text-2xl italic">Reader Feed</h4>
      <Users size={20} className="text-gray-500" />
    </div>

    <div className="space-y-8 max-h-[800px] overflow-y-auto pr-2">
      {activities.map((activity) => (
        <ActivityItem key={activity._id} activity={activity} />
      ))}
    </div>
  </aside>
);

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActionText = () => {
    switch (activity.action) {
      case 'finished':
        return 'finished reading';
      case 'rated':
        return 'rated';
      case 'added':
        return 'added to shelf';
      default:
        return 'did something with';
    }
  };

  return (
    <div className="flex gap-4 group pb-8 border-b border-white/5 last:border-0">
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-lg">
        <Image
          src={activity.userPhoto}
          alt={activity.userName}
          width={48}
          height={48}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex-1 space-y-2">
        <p className="text-sm leading-snug">
          <span className="font-bold text-[#00d84a] uppercase tracking-tighter">
            {activity.userName}
          </span>
          <span className="text-gray-500 mx-1.5">{getActionText()}</span>
          <span className="font-bold italic text-white">"{activity.target}"</span>
        </p>

        {activity.rating && (
          <div className="flex text-[#fbbf24] gap-0.5 mt-2">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={12}
                fill={idx < activity.rating! ? 'currentColor' : 'none'}
                strokeWidth={idx < activity.rating! ? 0 : 1.5}
              />
            ))}
          </div>
        )}

        {activity.comment && (
          <div className="bg-black/40 border border-white/5 p-3 rounded-lg mt-3">
            <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2">
              "{activity.comment}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410] flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="text-4xl">⚠️</div>
      <p className="text-gray-400 font-serif italic">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 bg-[#00d84a] text-black font-bold rounded-lg hover:shadow-lg transition-all"
      >
        Retry
      </button>
    </div>
  </div>
);

export default DashboardClient;