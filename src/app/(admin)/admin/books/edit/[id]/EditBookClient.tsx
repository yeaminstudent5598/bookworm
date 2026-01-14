"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, Save, ArrowLeft, Image as LucideImage } from 'lucide-react';
import Link from 'next/link';

interface Genre {
  _id: string;
  name: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  pages: number;
  genre: { _id: string; name: string; };
  pubYear: number;
  coverImage: string;
}

interface EditBookClientProps {
  bookId: string;
  initialBook: Book;
  genres: Genre[];
}

export function EditBookSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-pulse px-4">
      <div className="flex items-center gap-4 py-6">
        <div className="w-10 h-10 bg-white/10 rounded-full" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/10 rounded" />
          <div className="h-4 w-32 bg-white/10 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#112216] h-[500px] rounded-[2rem] border border-white/5" />
        <div className="lg:col-span-4 bg-[#112216] h-[400px] rounded-[2rem] border border-white/5" />
      </div>
    </div>
  );
}

export function EditBookClient({ bookId, initialBook, genres }: EditBookClientProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(initialBook.coverImage);
  const [formData, setFormData] = useState({
    title: initialBook.title,
    author: initialBook.author,
    description: initialBook.description,
    pages: String(initialBook.pages),
    genre: initialBook.genre?._id || "",
    pubYear: String(initialBook.pubYear),
    photo: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("genre", formData.genre);
      data.append("description", formData.description);
      data.append("pages", formData.pages);
      data.append("pubYear", formData.pubYear);
      if (formData.photo) data.append("photo", formData.photo);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/books/${bookId}`, {
        method: 'PATCH',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: data
      });

      const result = await response.json();
      if (result.success) {
        alert("  Book updated successfully!");
        router.push('/admin/books');
        router.refresh();
      } else {
        throw new Error(result.message || "Update failed");
      }
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 py-6 mb-4 sticky top-0 bg-[#05140b]/90 backdrop-blur-md z-30 lg:static lg:bg-transparent">
        <Link href="/admin/books" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-3xl font-bold font-serif text-white truncate">Edit Book</h1>
          <p className="text-gray-500 text-[10px] sm:text-sm italic truncate">Updating: {initialBook.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 text-white">
        {/* Form Section */}
        <div className="lg:col-span-8 bg-[#112216] p-5 sm:p-8 rounded-[2rem] border border-white/5 space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
              <input type="text" value={formData.title} className="w-full bg-[#05140b] border border-white/10 p-3.5 rounded-xl text-sm outline-none focus:border-[#22c55e] transition-all" onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Author</label>
              <input type="text" value={formData.author} className="w-full bg-[#05140b] border border-white/10 p-3.5 rounded-xl text-sm outline-none focus:border-[#22c55e] transition-all" onChange={(e) => setFormData({...formData, author: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Genre</label>
            <select value={formData.genre} className="w-full bg-[#05140b] border border-white/10 p-3.5 rounded-xl text-sm outline-none focus:border-[#22c55e] cursor-pointer" onChange={(e) => setFormData({...formData, genre: e.target.value})}>
              <option value="">Select Genre</option>
              {genres.map((g) => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
            <textarea rows={6} value={formData.description} className="w-full bg-[#05140b] border border-white/10 p-3.5 rounded-xl text-sm outline-none focus:border-[#22c55e] resize-none" onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Pages</label>
              <input type="number" value={formData.pages} className="w-full bg-[#05140b] border border-white/10 p-3.5 rounded-xl text-sm outline-none focus:border-[#22c55e]" onChange={(e) => setFormData({...formData, pages: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Year</label>
              <input type="number" value={formData.pubYear} className="w-full bg-[#05140b] border border-white/10 p-3.5 rounded-xl text-sm outline-none focus:border-[#22c55e]" onChange={(e) => setFormData({...formData, pubYear: e.target.value})} />
            </div>
          </div>

          {/* Mobile Button */}
          <button onClick={handleSubmit} disabled={updating} className="lg:hidden w-full py-4 bg-[#22c55e] text-black font-black uppercase text-[10px] tracking-widest rounded-xl disabled:opacity-50 active:scale-95 transition-all">
            {updating ? "Updating..." : "Update Book Details"}
          </button>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#112216] p-6 rounded-[2rem] border border-white/5 space-y-6 shadow-xl">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Book Cover</label>
              <div className="relative aspect-[3/4.5] w-full max-w-[260px] mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-white/10 bg-black/40 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                  <Camera size={32} className="text-[#22c55e] mb-2" />
                  <span className="text-[10px] font-black text-white uppercase">Change Cover</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>
            
            <div className="hidden lg:block space-y-3">
              <button onClick={handleSubmit} disabled={updating} className="w-full py-4 bg-[#22c55e] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#1bb054] transition-all disabled:opacity-50 shadow-lg shadow-[#22c55e]/20">
                {updating ? <Loader2 className="animate-spin inline mr-2" size={16} /> : <Save className="inline mr-2" size={16} />}
                {updating ? "Updating..." : "Update Details"}
              </button>
              <button onClick={() => router.back()} className="w-full py-3 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all">
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}