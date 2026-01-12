"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen } from "lucide-react";
import { setCookie } from "cookies-next";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setCookie("token", result.data.accessToken);
        setCookie("role", result.data.user.role);
        
        localStorage.setItem("token", result.data.accessToken);
        localStorage.setItem("role", result.data.user.role);

        // Success redirect
        window.location.href = result.data.user.role === "admin" 
          ? "/admin/dashboard" 
          : "/my-library";
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#221910] flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-5 mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f8f7f6]/50 to-[#f8f7f6] dark:via-[#221910]/80 dark:to-[#221910]"></div>
      </div>

      <main className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-[#ec7f13]/20 rounded-full flex items-center justify-center mb-6 text-[#ec7f13] shadow-inner">
            <BookOpen size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-[#3a2c1e] dark:text-white text-3xl font-bold tracking-tight mb-2 font-display">
            Welcome Back, BookWorm
          </h1>
          <p className="text-slate-500 dark:text-[#c9ad92] text-base italic">
            Pick up where you left off.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 dark:text-[#c9ad92] text-sm font-semibold ml-1">Email Address</label>
            <div className="relative group">
              <input
                type="email"
                placeholder="reader@example.com"
                required
                className="w-full h-14 px-4 bg-white dark:bg-[#3a2c1e] rounded-xl border-0 ring-1 ring-slate-200 dark:ring-transparent focus:ring-2 focus:ring-[#ec7f13] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8a7a6b] shadow-sm transition-all"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ec7f13] transition-colors">
                <Mail size={20} />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 dark:text-[#c9ad92] text-sm font-semibold ml-1">Password</label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                className="w-full h-14 pl-4 pr-12 bg-white dark:bg-[#3a2c1e] rounded-xl border-0 ring-1 ring-slate-200 dark:ring-transparent focus:ring-2 focus:ring-[#ec7f13] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8a7a6b] shadow-sm transition-all"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ec7f13] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link href="#" className="text-[#ec7f13] hover:underline text-sm font-medium transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ec7f13] hover:bg-[#d66f0d] text-white font-bold h-14 rounded-xl shadow-lg shadow-[#ec7f13]/20 transition-all transform active:scale-[0.98] text-lg flex items-center justify-center gap-2 group"
          >
            <span>{loading ? "Opening Library..." : "Log In"}</span>
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#f8f7f6] dark:bg-[#221910] text-slate-500 dark:text-white/40 font-medium italic">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Apple'].map((platform) => (
              <button
                key={platform}
                type="button"
                className="flex items-center justify-center gap-3 bg-white dark:bg-[#3a2c1e] hover:bg-slate-50 dark:hover:bg-[#4e3b29] border border-slate-200 dark:border-transparent rounded-xl h-12 text-slate-700 dark:text-white transition-colors font-medium text-sm"
              >
                <img src={platform === 'Google' ? 'https://www.svgrepo.com/show/475656/google-color.svg' : 'https://www.svgrepo.com/show/303108/apple-black-logo.svg'} className="h-5 w-5" alt="" />
                {platform}
              </button>
            ))}
          </div>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 dark:text-white/60 text-sm">
            New here? <Link href="/register" className="text-[#ec7f13] font-bold hover:underline">Create an Account</Link>
          </p>
        </div>
      </main>

      {/* Decorative Bottom Element */}
      <div className="fixed bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#221910] via-[#ec7f13] to-[#221910] opacity-50"></div>
    </div>
  );
}