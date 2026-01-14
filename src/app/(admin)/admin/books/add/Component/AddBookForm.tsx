"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Loader2, CheckCircle, ArrowLeft, UploadCloud, 
  Calendar, X, BookOpen, Plus 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Genre {
  _id: string;
  name: string;
}

interface AddBookFormProps {
  genres: Genre[];
}

export function AddBookForm({ genres }: AddBookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPageMounted, setIsPageMounted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Success Modal States
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedBook, setAddedBook] = useState<{title: string, author: string} | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    pages: '',
    genre: '',
    pubYear: '',
    photo: null as File | null,
  });

  useEffect(() => {
    setIsPageMounted(true);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be less than 3MB');
        return;
      }
      setFormData({ ...formData, photo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      const year = new Date(selectedDate).getFullYear().toString();
      setFormData({ ...formData, pubYear: year });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      pages: '',
      genre: '',
      pubYear: '',
      photo: null,
    });
    setImagePreview(null);
    setShowSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.genre || !formData.photo) {
      alert('Genre and Book Cover are required!');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('genre', formData.genre);
      data.append('description', formData.description);
      data.append('pages', formData.pages);
      data.append('pubYear', formData.pubYear);
      data.append('photo', formData.photo);

      const res = await axios.post('/api/v1/admin/books', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setAddedBook({ title: formData.title, author: formData.author });
        setShowSuccess(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  if (!isPageMounted) return <div className="h-screen bg-[#1a140f]" />;

  return (
    <div className="min-h-screen bg-[#1a140f] text-[#f5f5f5] p-4 sm:p-8 lg:p-16 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <p className="text-[#c19a6b] text-[10px] font-bold uppercase tracking-[0.3em]">Administrative Portal</p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full hover:bg-[#c19a6b] hover:text-black transition-all">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight">Add New Book</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Form Info */}
        <div className="lg:col-span-8 space-y-8 bg-[#261d15]/50 p-6 sm:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Book Title</label>
                <input 
                  type="text" required placeholder="The Great Gatsby"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c19a6b] transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Author</label>
                <input 
                  type="text" required placeholder="F. Scott Fitzgerald"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c19a6b] transition-all"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Genre</label>
                <select 
                  required className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c19a6b] appearance-none"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                >
                  <option value="" className="bg-[#1a140f]">Select Genre</option>
                  {genres.map(g => <option key={g._id} value={g._id} className="bg-[#1a140f]">{g.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</label>
              <textarea 
                rows={4} required placeholder="A brief overview of the story..."
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c19a6b] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Pages</label>
                <input 
                  type="number" required placeholder="350"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c19a6b]"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Publication Year</label>
                <div className="relative">
                  <input 
                    type="date" required
                    className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c19a6b] text-gray-400"
                    onChange={handleDateChange}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upload */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#261d15] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl sticky top-8">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-6">Book Cover</label>
            
            <div className="relative aspect-[3/4.5] w-full rounded-2xl overflow-hidden border-2 border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center group hover:border-[#c19a6b]/50 transition-all cursor-pointer">
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-center p-6 space-y-4">
                  <div className="w-16 h-16 bg-[#c19a6b]/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#c19a6b]/20 transition-all">
                    <UploadCloud size={32} className="text-[#c19a6b]" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">Click to upload image</p>
                  <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">JPG, PNG (Max 3MB)</p>
                </div>
              )}
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} required />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full mt-10 py-5 bg-[#c19a6b] text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#d4ac7d] transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Save to Catalog"}
            </button>
          </div>
        </div>
      </form>

      {/* --- Success Modal (image_c7d0cb.png style) --- */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a140f] w-full max-w-md rounded-[2.5rem] border border-white/10 p-10 shadow-2xl relative text-center space-y-8">
            <button onClick={() => setShowSuccess(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>

            {/* Success Icon */}
            <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto border border-[#22c55e]/30">
              <div className="w-14 h-14 bg-[#22c55e] rounded-full flex items-center justify-center text-black">
                <CheckCircle size={32} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Book Added Successfully!</h2>
              <p className="text-sm text-gray-500 max-w-[250px] mx-auto leading-relaxed">
                Your collection is growing. This book is now available in your personal library.
              </p>
            </div>

            {/* Mini Book Card */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 flex items-center gap-5 text-left">
              <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                <Image src={imagePreview || "/placeholder.png"} alt="book" fill className="object-cover" />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-[#c19a6b] uppercase tracking-widest">Just Added</p>
                <h4 className="text-lg font-bold text-white line-clamp-1">{addedBook?.title}</h4>
                <p className="text-xs text-gray-500 italic">{addedBook?.author}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Link 
                href="/admin/books" 
                className="w-full bg-[#4a3a2a] text-[#c19a6b] py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#5d4a36] transition-all"
              >
                <BookOpen size={16} /> View in Library
              </Link>
              <button 
                onClick={resetForm}
                className="text-[10px] font-black uppercase text-gray-500 hover:text-[#c19a6b] tracking-widest transition-all"
              >
                + Add Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}