"use client";

import { useState } from "react";
import { Lock, Mail, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPasswordClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", otp: "", newPassword: "" });

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/auth/reset-password", formData);
      if (res.data.success) {
        alert("Password reset successfully!");
        router.push("/login");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP or request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a120b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-[400px] z-10 text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#3a2c1e] rounded-full flex items-center justify-center mb-6 shadow-2xl border border-white/5 text-[#ec7f13]">
            <KeyRound size={32} />
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">New Password</h1>
          <p className="text-gray-400 text-sm">Enter the 6-digit OTP and new password.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4 text-left">
          <input 
            type="email" placeholder="Email" required
            className="w-full h-14 px-5 bg-[#2d2116] border border-transparent rounded-2xl text-white outline-none focus:border-[#ec7f13]/50 shadow-inner"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input 
            type="text" placeholder="6-digit OTP" required maxLength={6}
            className="w-full h-14 px-5 bg-[#2d2116] border border-transparent rounded-2xl text-white text-center text-xl tracking-[10px] outline-none focus:border-[#ec7f13]/50 shadow-inner"
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
          />
          <div className="relative">
            <input 
              type="password" placeholder="New Password" required
              className="w-full h-14 px-5 bg-[#2d2116] border border-transparent rounded-2xl text-white outline-none focus:border-[#ec7f13]/50 shadow-inner"
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#ec7f13] hover:bg-[#ff8c1a] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span>Resetting...</span>
              </div>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}