"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff, Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (formData.photo) data.append("photo", formData.photo);

      const response = await axios.post("/api/v1/auth/register", data);

      if (response.data.success) {
        alert("Registration Successful!");
        router.push("/login");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1a120b]">
      {/* Left Image Section */}
      <div className="relative hidden w-1/2 lg:block">
        <Image 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000" 
          alt="Library" fill className="object-cover" 
        />
        <div className="absolute inset-0 bg-[#1a120b]/60" />
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col items-center justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-white mb-2">Join BookWorm</h1>
          <p className="text-gray-400 mb-8 font-serif italic">Start your personalized reading journey.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24">
                <div className="w-full h-full rounded-full bg-[#2d2116] border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden">
                  {imagePreview ? <Image src={imagePreview} alt="P" fill className="object-cover" /> : <User size={40} className="text-gray-600" />}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-[#ec7f13] rounded-full text-white cursor-pointer hover:bg-[#ff8c1a]">
                  <Camera size={16} /><input type="file" className="hidden" onChange={handleImageChange} required />
                </label>
              </div>
            </div>

            <div className="space-y-4">
               <input 
                  type="text" placeholder="Full Name" required
                  className="w-full h-14 px-5 bg-[#2d2116] rounded-2xl text-white outline-none focus:border-[#ec7f13] border border-transparent"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
               <input 
                  type="email" placeholder="Email Address" required
                  className="w-full h-14 px-5 bg-[#2d2116] rounded-2xl text-white outline-none focus:border-[#ec7f13] border border-transparent"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
               <div className="relative">
                 <input 
                    type={showPassword ? "text" : "password"} placeholder="Password" required
                    className="w-full h-14 px-5 bg-[#2d2116] rounded-2xl text-white outline-none focus:border-[#ec7f13] border border-transparent"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
               </div>
            </div>

            <button disabled={loading} className="w-full h-14 bg-[#ec7f13] text-white rounded-2xl font-bold hover:bg-[#ff8c1a] shadow-lg flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
            </button>

            <p className="text-center text-gray-400">
              Already a member? <Link href="/login" className="text-[#ec7f13] font-bold">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}