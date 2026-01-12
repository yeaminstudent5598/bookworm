"use client";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import {
  BookOpen, Users, MessageSquare, Settings, Bell, LogOut,
  TrendingUp, Plus, MoreHorizontal, User, AlertCircle, Database,
  Home, BarChart3, Menu, X, UserPlus, Zap
} from "lucide-react";

const genreData = [
  { name: "Fiction", value: 3500 },
  { name: "Mystery", value: 2800 },
  { name: "Sci-Fi", value: 2100 },
  { name: "Biography", value: 1200 },
  { name: "Romance", value: 1800 },
  { name: "Others", value: 1005 }
];

const activityData = [
  { date: "Mon", books: 240, users: 221, reviews: 229 },
  { date: "Tue", books: 221, users: 228, reviews: 200 },
  { date: "Wed", books: 229, users: 200, reviews: 221 },
  { date: "Thu", books: 200, users: 250, reviews: 210 },
  { date: "Fri", books: 250, users: 210, reviews: 229 },
  { date: "Sat", books: 210, users: 290, reviews: 250 },
  { date: "Sun", books: 290, users: 330, reviews: 320 }
];

const COLORS = ["#ec7f13", "#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", "#fef3c7"];

const recentActivity = [
  { id: 1, type: "user", title: "New User Registered", desc: "Sarah Johnson joined", time: "2m ago", color: "green" },
  { id: 2, type: "warning", title: "Review Reported", desc: "ID #4928 requires moderation", time: "1h ago", color: "orange" },
  { id: 3, type: "backup", title: "System Backup", desc: "Daily backup completed", time: "3h ago", color: "blue" },
  { id: 4, type: "book", title: "New Books Added", desc: "25 new books uploaded", time: "5h ago", color: "purple" }
];

const quickActions = [
  { icon: UserPlus, label: "Manage Users", color: "blue" },
  { icon: BookOpen, label: "Add Books", color: "orange" },
  { icon: MessageSquare, label: "Moderate Reviews", color: "purple" },
  { icon: Settings, label: "Settings", color: "slate" }
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  const getActivityIcon = (type) => {
    switch (type) {
      case "user":
        return <User size={20} />;
      case "warning":
        return <AlertCircle size={20} />;
      case "backup":
        return <Database size={20} />;
      case "book":
        return <BookOpen size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const colorClasses = {
    green: "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400",
    orange: "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400",
    blue: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
    slate: "bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f6] to-[#ede8e0] dark:from-[#221910] dark:to-[#2c2219]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#221910]/80 backdrop-blur-md border-b border-stone-200 dark:border-white/5">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#ec7f13]/10">
                <BookOpen className="text-[#ec7f13]" size={24} />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">BookWorm</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Admin Panel</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors relative">
              <Bell size={24} className="text-stone-600 dark:text-stone-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAU7Rc4SXDRKc7b_FbTFe64xIqw4NFTvAsJ5Xu8t-C6eHIUM3Zx8A4aCpwjfGf8tgNrZXHVrlHovM01Pe3PaJ2C7CB2KTgFy3rkc5HkpT3NFcgRyIhAmLch3wVzqM_0GvHflxmsrNg5Twhg-Nt5W7P4Oieaaiaofu9GQ0Exi2KW6L_s9rVrignH3TC5O-M_7xFfyDLY1IWWk6GpWDjlTTFD75Dc_mDku06ia6p0Qw2lQFtagA4mMzfCEUtarQOM-1jlpOsAcqd7Q"
              alt="Admin"
              className="w-9 h-9 rounded-full border border-stone-200 dark:border-white/10"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-20 left-0 z-30 w-64 h-[calc(100vh-80px)] bg-white dark:bg-[#2c2219] border-r border-stone-200 dark:border-white/5 overflow-y-auto transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="p-6 space-y-2">
            {[
              { icon: Home, label: "Dashboard", id: "home" },
              { icon: BarChart3, label: "Reports", id: "reports" },
              { icon: Users, label: "Users", id: "users" },
              { icon: BookOpen, label: "Books", id: "books" },
              { icon: MessageSquare, label: "Reviews", id: "reviews" },
              { icon: Settings, label: "Settings", id: "settings" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeNav === item.id
                    ? "bg-[#ec7f13]/10 text-[#ec7f13] font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-white/5"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Good Evening, <span className="text-[#ec7f13]">Admin</span>
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2">Here's what's happening in your library.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Books", value: "12,405", icon: BookOpen, trend: null },
              { label: "Active Users", value: "3,200", icon: Users, trend: "+5%" },
              { label: "Pending Reviews", value: "42", icon: MessageSquare, trend: null, highlight: true },
              { label: "Avg. Rating", value: "4.8", icon: TrendingUp, trend: "+0.2" }
            ].map((card, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${
                  card.highlight
                    ? "bg-gradient-to-br from-[#ec7f13] to-orange-600 text-white border-[#ec7f13]/50 shadow-lg shadow-[#ec7f13]/20"
                    : "bg-white dark:bg-[#362b21] border-stone-200 dark:border-white/5 hover:border-[#ec7f13]/30"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.highlight ? "bg-white/20" : "bg-[#ec7f13]/10"}`}>
                    <card.icon className={card.highlight ? "text-white" : "text-[#ec7f13]"} size={24} />
                  </div>
                  {card.trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold ${
                      card.highlight ? "bg-white/20 text-white" : "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                    }`}>
                      <TrendingUp size={14} />
                      {card.trend}
                    </div>
                  )}
                </div>
                <p className={`text-sm font-semibold ${card.highlight ? "text-white/80" : "text-stone-500 dark:text-stone-400"}`}>
                  {card.label}
                </p>
                <p className={`text-3xl font-bold mt-2 ${card.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Activity Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-[#362b21] p-6 rounded-2xl border border-stone-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Overview</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Last 7 days</p>
                </div>
                <button className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                  <MoreHorizontal size={20} className="text-stone-400" />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "#2c2219", border: "none", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="books" stroke="#ec7f13" strokeWidth={2} dot={{ fill: "#ec7f13" }} />
                  <Line type="monotone" dataKey="reviews" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Genre Distribution */}
            <div className="bg-white dark:bg-[#362b21] p-6 rounded-2xl border border-stone-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Genre Distribution</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{genreData.reduce((a, b) => a + b.value, 0).toLocaleString()} books</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={genreData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className="p-6 rounded-xl bg-white dark:bg-[#362b21] border border-stone-200 dark:border-white/5 hover:border-[#ec7f13]/30 transition-all group flex flex-col items-center gap-3"
                >
                  <div className={`p-4 rounded-lg ${colorClasses[action.color]} group-hover:scale-110 transition-transform`}>
                    <action.icon size={24} />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#362b21] rounded-2xl border border-stone-200 dark:border-white/5 overflow-hidden">
            <div className="p-6 border-b border-stone-200 dark:border-white/5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="divide-y divide-stone-200 dark:divide-white/5">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors flex items-center gap-4 cursor-pointer"
                >
                  <div className={`p-3 rounded-full ${colorClasses[activity.color]} shrink-0`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{activity.desc}</p>
                  </div>
                  <span className="text-sm text-stone-400 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}