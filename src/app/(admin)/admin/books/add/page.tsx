"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Loader2, CheckCircle, ArrowLeft, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AddBookPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<any[]>([]); // জেনার লিস্টের জন্য
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    pages: '',
    genre: '', // এখানে জেনারের _id স্টোর হবে
    pubYear: '',
    photo: null as File | null,
  });

  // ১. ডাটাবেস থেকে জেনারগুলো ফেচ করে আনা (ObjectId Error ফিক্স করার জন্য)
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('/api/v1/genres');
        setGenres(res.data.data);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    };
    fetchGenres();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.genre) return alert("Please select a genre");
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("genre", formData.genre); // এটি এখন একটি বৈধ ObjectId পাঠাবে
      data.append("description", formData.description);
      data.append("pages", formData.pages);
      data.append("pubYear", formData.pubYear);
      if (formData.photo) data.append("photo", formData.photo);

      const res = await axios.post('/api/v1/admin/books', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        alert("🎉 Book added to library successfully!");
        router.push('/admin/books');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/books" className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-800 transition-all text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold font-serif text-white">Add New Book</h1>
          <p className="text-gray-500 text-sm">Fill in the details below to add a new title to the library catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 bg-[#112216] p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Book Title</label>
            <input 
              type="text" required placeholder="e.g. The Great Gatsby"
              className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none focus:ring-1 focus:ring-[#22c55e] transition-all"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Author</label>
              <input 
                type="text" required placeholder="e.g. F. Scott Fitzgerald"
                className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none focus:ring-1 focus:ring-[#22c55e]"
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Genre</label>
              <select 
                required
                className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none focus:ring-1 focus:ring-[#22c55e] text-gray-300"
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
              >
                <option value="">Select genre...</option>
                {genres.map((g) => (
                  <option key={g._id} value={g._id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea 
              rows={5} required placeholder="Enter a brief summary of the book..."
              className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none focus:ring-1 focus:ring-[#22c55e] resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Pages</label>
              <input type="number" required placeholder="320" className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none" onChange={(e) => setFormData({...formData, pages: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Publication Year</label>
              <input type="number" required placeholder="YYYY" className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none" onChange={(e) => setFormData({...formData, pubYear: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Right Column: Book Cover Upload */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#112216] p-6 rounded-2xl border border-gray-800 space-y-4 shadow-xl">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Book Cover</label>
            
            <div className="relative aspect-[3/4.5] w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-700 bg-black/20 flex flex-col items-center justify-center group hover:border-[#22c55e] transition-all cursor-pointer">
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-center p-6">
                  <UploadCloud size={48} className="mx-auto text-gray-600 mb-3 group-hover:text-[#22c55e] transition-colors" />
                  <p className="text-sm font-bold text-gray-400">Click to upload</p>
                  <p className="text-[10px] text-gray-600 mt-1 uppercase">SVG, PNG, JPG or GIF (max. 3MB)</p>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} required />
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg flex gap-3">
               <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-[10px] flex-shrink-0">!</div>
               <p className="text-[10px] text-orange-200 leading-tight">Recommended size: 1200x1800px for best quality display.</p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#22c55e] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1bb054] transition-all shadow-lg shadow-[#22c55e]/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                Save Book
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="w-full py-4 text-gray-400 font-bold hover:text-white transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBookPage;