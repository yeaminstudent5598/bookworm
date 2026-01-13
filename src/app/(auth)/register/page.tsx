"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff, Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
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
      // ফাইল পাঠানোর জন্য অবশ্যই FormData ব্যবহার করতে হবে
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      const response = await axios.post("/api/v1/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Registration Successful!");
        router.push("/login");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf7f2]">
      {/* Left: Branding Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
          alt="Library"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-20 left-12 right-12 text-white">
          <div className="flex items-center gap-2 mb-4">
             <span className="text-3xl font-bold italic font-serif">BookWorm</span>
          </div>
          <p className="text-2xl font-serif italic italic">&quot;A room without books is like a body without a soul.&quot;</p>
          <p className="mt-4 text-sm opacity-80">— Cicero</p>
        </div>
      </div>

      {/* Right: Registration Form */}
      <div className="flex flex-col items-center justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-serif font-bold text-[#1a1a1a]">Join the Library</h1>
          <p className="mt-2 text-gray-500 font-serif italic">Start your personalized reading journey today.</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="relative w-24 h-24">
                <div className="w-full h-full rounded-full bg-[#f0e6d6] border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <User size={40} className="text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-[#b45309] rounded-full text-white cursor-pointer hover:bg-[#92400e] transition-all">
                  <Camera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                </label>
              </div>
              <span className="text-xs font-semibold text-[#b45309] uppercase tracking-wider">Upload Profile Photo</span>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b45309] outline-none"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b45309] outline-none"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b45309] outline-none"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-[#b45309] text-white rounded-lg font-bold text-lg hover:bg-[#92400e] transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
            </button>

            <p className="text-center text-sm font-serif">
              Already a member? <Link href="/login" className="text-[#b45309] font-bold hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;