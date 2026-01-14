"use client";

import { useState, useEffect } from "react";
import { User, Camera, Loader2, Key, CheckCircle, ArrowLeft, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function ProfileClient() {
  const [userData, setUserData] = useState<any>(null); // ডাটাবেস থেকে আসা ইউজার ডাটা
  const [loading, setLoading] = useState(true); // পেজ লোডিং
  const [updateLoading, setUpdateLoading] = useState(false); // পাসওয়ার্ড আপডেট লোডিং
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // API থেকে ইউজারের আসল প্রোফাইল ডাটা ফেচ করা
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get("/api/v1/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setUserData(res.data.data); // ডাটাবেসের ডাটা সেট করা
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
        userId: userData?._id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update password" });
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
    <div className="min-h-screen bg-[#0a1410] text-white pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-6 py-8 md:py-16">
        
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        </div>

        {/* User Card - এখানে ডাটাবেসের ডাটা দেখানো হচ্ছে */}
        <div className="bg-[#1c1c1a]/40 border border-white/5 rounded-[32px] p-8 mb-8 text-center shadow-xl">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full rounded-full border-4 border-[#ec7f13] overflow-hidden bg-[#2d2116]">
              <Image 
                src={userData?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                alt="Profile" fill className="object-cover"
                unoptimized // Cloudinary ইমেজ ঠিকমতো লোড করার জন্য
              />
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-[#ec7f13] rounded-full shadow-lg border-2 border-[#0a1410]">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-2xl font-bold">{userData?.name || "User"}</h2>
          <p className="text-gray-400 text-sm mt-1">{userData?.email}</p>
          <div className="mt-4 inline-block px-4 py-1 bg-[#ec7f13]/10 text-[#ec7f13] rounded-full text-xs font-bold uppercase tracking-widest">
            {userData?.role}
          </div>
        </div>

        {/* Change Password Form (কোড আগের মতোই) */}
        <div className="bg-[#1c1c1a]/40 border border-white/5 rounded-[32px] p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#ec7f13]/10 rounded-lg text-[#ec7f13]">
              <Key size={20} />
            </div>
            <h3 className="text-xl font-bold">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5">
             <input 
                type="password" placeholder="Old Password" required
                className="w-full h-14 px-5 bg-[#2d2116] border border-transparent rounded-2xl text-white outline-none focus:border-[#ec7f13]/50 shadow-inner"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
              />
              <input 
                type="password" placeholder="New Password" required
                className="w-full h-14 px-5 bg-[#2d2116] border border-transparent rounded-2xl text-white outline-none focus:border-[#ec7f13]/50 shadow-inner"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
              <input 
                type="password" placeholder="Confirm Password" required
                className="w-full h-14 px-5 bg-[#2d2116] border border-transparent rounded-2xl text-white outline-none focus:border-[#ec7f13]/50 shadow-inner"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />

            <button 
              type="submit" 
              disabled={updateLoading}
              className="w-full bg-[#ec7f13] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              {updateLoading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}