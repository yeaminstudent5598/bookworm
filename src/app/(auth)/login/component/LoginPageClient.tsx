"use client";

import { useState } from "react";
import { Mail, Eye, EyeOff, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { setCookie } from "cookies-next"; // কুকি সেট করার জন্য
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPageClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/v1/auth/login", formData);
      const result = res.data;

      if (result.success) {
        // ১. এক্সেস টোকেন কুকিতে সেট করা
        setCookie("accessToken", result.data.accessToken);
        
        // ২. 🔥 এই লাইনটি মিসিং ছিল: রোল কুকিতে সেট করা (মিডলওয়্যার এটি চেক করবে)
        setCookie("role", result.data.user.role);

        // লোকাল স্টোরেজেও রাখা (ক্লায়েন্ট সাইড লজিকের জন্য)
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("role", result.data.user.role);

        // ৩. রোল অনুযায়ী সঠিক পেজে রিডাইরেক্ট
        const targetPath = result.data.user.role === "admin" 
          ? "/admin/dashboard" 
          : "/my-library";
        
        // রাউটার রিফ্রেশ করা যাতে মিডলওয়্যার নতুন কুকি পায়
        router.refresh();
        router.push(targetPath);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a120b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-[400px] z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-[#3a2c1e] rounded-full flex items-center justify-center mb-6 shadow-2xl border border-white/5 transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-[#ec7f13]/10 rounded-full flex items-center justify-center text-[#ec7f13]">
              <BookOpen size={32} fill="currentColor" fillOpacity={0.2} />
            </div>
          </div>
          
          <h1 className="text-white text-4xl font-bold tracking-tight mb-1">
            Welcome Back,
          </h1>
          <h2 className="text-white text-3xl font-bold mb-2">BookWorm</h2>
          <p className="text-gray-400 text-sm font-medium opacity-80">Pick up where you left off.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-gray-400 ml-1">Email Address</label>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="reader@example.com" 
                required
                className="w-full h-14 pl-5 pr-12 bg-[#2d2116] border border-transparent rounded-2xl text-white placeholder:text-gray-600 outline-none focus:border-[#ec7f13]/50 transition-all duration-300 shadow-inner"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ec7f13] transition-colors" size={20} />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-gray-400 ml-1">Password</label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                required
                className="w-full h-14 pl-5 pr-12 bg-[#2d2116] border border-transparent rounded-2xl text-white placeholder:text-gray-600 outline-none focus:border-[#ec7f13]/50 transition-all duration-300 shadow-inner"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end relative z-20">
            <Link 
              href="/forgot-password" 
              prefetch={false}
              className="text-[#ec7f13] text-sm font-bold hover:text-[#ff9d3d] transition-colors cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#ec7f13] hover:bg-[#ff8c1a] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.97] shadow-[0_10px_25px_-5px_rgba(236,127,19,0.4)] disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                Log In <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800/50"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1a120b] px-4 text-gray-500 font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="w-full">
          <button 
            type="button"
            className="flex w-full items-center justify-center gap-3 h-14 bg-[#2d2116] border border-white/5 rounded-2xl text-white font-semibold hover:bg-[#3a2c1e] transition-all duration-300 group"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
            Sign in with Google
          </button>
        </div>

        {/* Register Link */}
        <p className="text-center mt-10 text-gray-400 text-sm">
          New here?{" "}
          <Link href="/register" className="text-[#ec7f13] font-black hover:text-[#ff9d3d] transition-colors ml-1">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}