"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { setCookie } from "cookies-next";
import axios from "axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/v1/auth/login", formData);
      const result = res.data;

      if (result.success) {
        // ✅ টোকেনের নাম সব জায়গায় 'accessToken' রাখা হয়েছে
        setCookie("accessToken", result.data.accessToken);
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("role", result.data.user.role);

        window.location.href = result.data.user.role === "admin" 
          ? "/admin/dashboard" 
          : "/my-library";
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#221910] flex flex-col justify-center items-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-5 bg-[#3a2c1e] p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#ec7f13]/20 rounded-full flex items-center justify-center mb-4 text-[#ec7f13]">
            <BookOpen size={32} />
          </div>
          <h1 className="text-white text-2xl font-bold">Welcome Back</h1>
        </div>
        
        <input 
          type="email" placeholder="Email" required
          className="w-full h-14 px-4 bg-[#221910] rounded-xl text-white outline-none focus:ring-2 focus:ring-[#ec7f13]"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} placeholder="Password" required
            className="w-full h-14 px-4 bg-[#221910] rounded-xl text-white outline-none focus:ring-2 focus:ring-[#ec7f13]"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#ec7f13] text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : "Log In"}
        </button>
      </form>
    </div>
  );
}