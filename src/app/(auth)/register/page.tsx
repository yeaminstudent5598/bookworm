"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", photo: "" });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Backend API Call: /api/v1/auth/register
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (res.ok) router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffefc] p-4">
      <div className="max-w-md w-full bg-[#fdfaf1] border border-[#e5d9c1] p-8 rounded-2xl shadow-sm">
        <h2 className="text-3xl font-serif font-bold text-[#5c4033] text-center mb-6">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-3 rounded-lg border border-[#e5d9c1]" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email Address" className="w-full p-3 rounded-lg border border-[#e5d9c1]" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="url" placeholder="Profile Photo URL" className="w-full p-3 rounded-lg border border-[#e5d9c1]" 
            onChange={(e) => setFormData({...formData, photo: e.target.value})} required />
          <input type="password" placeholder="Password (Min 6 chars)" className="w-full p-3 rounded-lg border border-[#e5d9c1]" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          
          <button type="submit" className="w-full bg-[#5c4033] text-white p-3 rounded-lg font-bold hover:bg-[#3e2b22] transition-colors">
            Join the Library
          </button>
        </form>
        <p className="mt-4 text-center text-[#8b5e3c]">
          Already have an account? <Link href="/login" className="font-bold underline">Login</Link>
        </p>
      </div>
    </div>
  );
}