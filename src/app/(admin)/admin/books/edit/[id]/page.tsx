"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Camera, Loader2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const EditBookPage = () => {
  // Next.js 15+ এ useParams সরাসরি ইউজ করা যায় ক্লায়েন্ট কম্পোনেন্টে
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    pages: '',
    genre: '',
    pubYear: '',
    photo: null as File | null,
  });

  // ১. জেনার লিস্ট এবং বইয়ের ডিটেইলস ফেচ করা
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // রিকয়ারমেন্ট অনুযায়ী জেনার এবং বইয়ের ডাটা এপিআই থেকে আনা
        const [genresRes, bookRes] = await Promise.all([
          axios.get('/api/v1/genres'),
          axios.get(`/api/v1/admin/books/${id}`) // আপনার ৪MD এরর ফিক্স করতে এই পাথটি নিশ্চিত করুন
        ]);

        const book = bookRes.data.data;
        setGenres(genresRes.data.data || []);

        if (book) {
          // সেফ ডাটা পপুলেশন (toString এরর এড়াতে)
          setFormData({
            title: book.title || '',
            author: book.author || '',
            description: book.description || '',
            pages: book.pages ? String(book.pages) : '', 
            genre: book.genre?._id || book.genre || '', // ObjectId হ্যান্ডেল করা
            pubYear: book.pubYear ? String(book.pubYear) : '',
            photo: null
          });
          setImagePreview(book.coverImage || null);
        }
      } catch (err) {
        console.error("Data load failed:", err);
        alert("404: Book not found or API route missing.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("genre", formData.genre);
      data.append("description", formData.description);
      data.append("pages", formData.pages);
      data.append("pubYear", formData.pubYear);
      
      // নতুন কভার ইমেজ থাকলে তা ক্লাউডিনারিতে আপলোডের জন্য পাঠানো
      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      const res = await axios.patch(`/api/v1/admin/books/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        alert("✅ Book updated successfully!");
        router.push('/admin/books'); // ম্যানেজ বুকস পেজে রিডাইরেক্ট
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#05140b]">
      <Loader2 className="animate-spin text-[#22c55e]" size={48} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/books" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold font-serif">Edit Book</h1>
          <p className="text-gray-500 text-sm italic">Updating: {formData.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left: Main Form */}
        <div className="lg:col-span-8 bg-[#112216] p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title</label>
              <input 
                type="text" required value={formData.title}
                className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none focus:border-[#22c55e] transition-all"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Author</label>
              <input 
                type="text" required value={formData.author}
                className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none focus:border-[#22c55e]"
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Genre</label>
            <select 
              required value={formData.genre}
              className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none focus:border-[#22c55e]"
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
            >
              <option value="">Select Genre</option>
              {genres.map((g) => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
            <textarea 
              rows={6} required value={formData.description}
              className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none focus:border-[#22c55e] resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pages</label>
              <input type="number" required value={formData.pages} className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none" onChange={(e) => setFormData({...formData, pages: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pub Year</label>
              <input type="number" required value={formData.pubYear} className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-xl outline-none" onChange={(e) => setFormData({...formData, pubYear: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Right: Cover & Save */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#112216] p-6 rounded-2xl border border-gray-800 space-y-6 shadow-xl">
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Book Cover</label>
              <div className="relative aspect-[3/4.5] w-full rounded-xl overflow-hidden border border-gray-700 bg-black/40 group">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-700">
                    <ImageIcon size={40} />
                    <p className="text-[10px] mt-2 font-bold">No Image Found</p>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                  <Camera size={32} className="text-[#22c55e] mb-2" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Change Cover</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                type="submit"
                disabled={updating}
                className="w-full py-4 bg-[#22c55e] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1bb054] transition-all shadow-lg shadow-[#22c55e]/20 disabled:opacity-50"
              >
                {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Update Details
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="w-full py-4 text-gray-500 font-bold hover:text-white transition-all text-sm"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBookPage;