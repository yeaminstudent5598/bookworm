"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Key, Loader2, CheckCircle, ArrowLeft, Camera, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function AdminProfileClient() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("/api/v1/admin/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setAdmin(res.data.data);
      } catch (err) {
        console.error("Admin profile fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match!" });
    }

    setUpdateLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post("/api/v1/auth/change-password", {
        userId: admin?._id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Admin password updated!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a1410] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#ec7f13]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a1410] text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold font-serif tracking-tight">Admin Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Identity Card */}
          <div className="lg:col-span-5 bg-[#121f17] border border-white/10 rounded-[32px] p-8 text-center shadow-2xl">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full border-4 border-[#ec7f13] overflow-hidden bg-black/40">
                <Image src={admin?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Admin" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-2.5 bg-[#ec7f13] rounded-full text-white shadow-xl">
                <ShieldCheck size={18} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">{admin?.name}</h2>
            <p className="text-[#ec7f13] text-xs font-black uppercase tracking-widest bg-[#ec7f13]/10 px-4 py-1.5 rounded-full inline-block">System Authority</p>
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Active Session
              </div>
              <div className="text-sm text-gray-400">Email: <span className="text-white font-medium">{admin?.email}</span></div>
            </div>
          </div>

          {/* Security Form */}
          <div className="lg:col-span-7 bg-[#1c1c1a]/40 border border-white/5 rounded-[32px] p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-[#ec7f13]/10 rounded-xl text-[#ec7f13]"><Lock size={20} /></div>
              <h3 className="text-xl font-bold">Security Update</h3>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl mb-6 flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                <CheckCircle size={18} /> <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input 
                type="password" placeholder="Old Password" required value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                className="w-full h-14 px-5 bg-[#2d2116] border border-transparent rounded-2xl text-white outline-none focus:border-[#ec7f13]/50 shadow-inner"
              />
              <input 
                type="password" placeholder="New Password" required value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full h-14 px-5 bg-[#2d2116] border border-transparent rounded-2xl text-white outline-none focus:border-[#ec7f13]/50 shadow-inner"
              />
              <input 
                type="password" placeholder="Confirm New Password" required value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full h-14 px-5 bg-[#2d2116] border border-transparent rounded-2xl text-white outline-none focus:border-[#ec7f13]/50 shadow-inner"
              />
              <button 
                type="submit" disabled={updateLoading}
                className="w-full h-14 bg-[#ec7f13] hover:bg-[#ff8c1a] text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {updateLoading ? <Loader2 className="animate-spin" size={20} /> : "Change Security Key"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}