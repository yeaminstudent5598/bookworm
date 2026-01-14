"use client";

import { useState } from "react";
import { Mail, ArrowLeft, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/v1/auth/forgot-password", { email });
      setIsSubmitted(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a120b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-[400px] z-10 text-center">
        {!isSubmitted ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-[#3a2c1e] rounded-full flex items-center justify-center mb-6 shadow-2xl border border-white/5">
                <div className="w-14 h-14 bg-[#ec7f13]/10 rounded-full flex items-center justify-center text-[#ec7f13]">
                  <KeyRound size={32} />
                </div>
              </div>
              <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Forgot Password?</h1>
              <p className="text-gray-400 text-sm px-6">Enter your email and we'll send you an OTP.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="relative">
                <input 
                  type="email" placeholder="Email Address" required value={email}
                  className="w-full h-14 pl-5 pr-12 bg-[#2d2116] border border-transparent rounded-2xl text-white outline-none focus:border-[#ec7f13]/50 shadow-inner"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#ec7f13] hover:bg-[#ff8c1a] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={60} className="text-green-500 mx-auto mb-6" />
            <h1 className="text-white text-3xl font-bold mb-2">Check Your Email</h1>
            <p className="text-gray-400 mb-8">OTP sent to <span className="text-white font-bold">{email}</span></p>
            <Link href="/reset-password" title="Go to Reset" className="block w-full bg-[#ec7f13] py-4 rounded-2xl text-white font-bold">
              Verify OTP
            </Link>
          </div>
        )}

        <div className="mt-10">
          <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}