
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, Save, ArrowLeft, Image } from 'lucide-react';
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
  genre: {
    _id: string;
    name: string;
  };
  pubYear: number;
  coverImage: string;
}

interface EditBookClientProps {
  bookId: string;
  initialBook: Book;
  genres: Genre[];
}

// ============================================================
// SKELETON COMPONENT
// ============================================================
function EditBookSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-800 rounded-full" />
        <div>
          <div className="h-10 w-48 bg-gray-800/50 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-800/50 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8 bg-[#112216] p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-800/50 rounded" />
              <div className="h-14 w-full bg-[#05140b] border border-gray-700 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-800/50 rounded" />
              <div className="h-14 w-full bg-[#05140b] border border-gray-700 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-800/50 rounded" />
            <div className="h-14 w-full bg-[#05140b] border border-gray-700 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-800/50 rounded" />
            <div className="h-40 w-full bg-[#05140b] border border-gray-700 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-800/50 rounded" />
              <div className="h-14 w-full bg-[#05140b] border border-gray-700 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-800/50 rounded" />
              <div className="h-14 w-full bg-[#05140b] border border-gray-700 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#112216] p-6 rounded-2xl border border-gray-800 space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="h-3 w-24 bg-gray-800/50 rounded" />
              <div className="aspect-[3/4.5] w-full bg-gray-900 rounded-xl border border-gray-700" />
            </div>
            <div className="pt-4 space-y-3">
              <div className="h-14 w-full bg-gray-800/50 rounded-xl" />
              <div className="h-14 w-full bg-gray-800/30 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CLIENT COMPONENT
// ============================================================
export function EditBookClient({ bookId, initialBook, genres }: EditBookClientProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(initialBook.coverImage);

  const [formData, setFormData] = useState({
    title: initialBook.title,
    author: initialBook.author,
    description: initialBook.description,
    pages: String(initialBook.pages),
    genre: initialBook.genre._id,
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
      
      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/v1/admin/books/${bookId}`, {
        method: 'PATCH',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: data
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Book updated successfully!");
        router.push('/admin/books');
        router.refresh(); // Refresh server data
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error: any) {
      alert(error.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link 
          href="/admin/books" 
          className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif">Edit Book</h1>
          <p className="text-gray-500 text-xs sm:text-sm italic truncate">
            Updating: {formData.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-6 sm:mt-8">
        
        {/* Left: Main Form */}
        <div className="lg:col-span-8 bg-[#112216] p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-4 sm:space-y-6">
          {/* Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
                Title
              </label>
              <input 
                type="text" 
                required 
                value={formData.title}
                className="w-full bg-[#05140b] border border-gray-700 p-3 sm:p-4 rounded-xl text-sm outline-none focus:border-[#22c55e] transition-all"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
                Author
              </label>
              <input 
                type="text" 
                required 
                value={formData.author}
                className="w-full bg-[#05140b] border border-gray-700 p-3 sm:p-4 rounded-xl text-sm outline-none focus:border-[#22c55e]"
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
              Genre
            </label>
            <select 
              required 
              value={formData.genre}
              className="w-full bg-[#05140b] border border-gray-700 p-3 sm:p-4 rounded-xl text-sm outline-none focus:border-[#22c55e]"
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
            >
              <option value="">Select Genre</option>
              {genres.map((g) => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
              Description
            </label>
            <textarea 
              rows={6} 
              required 
              value={formData.description}
              className="w-full bg-[#05140b] border border-gray-700 p-3 sm:p-4 rounded-xl text-sm outline-none focus:border-[#22c55e] resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Pages & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
                Pages
              </label>
              <input 
                type="number" 
                required 
                value={formData.pages} 
                className="w-full bg-[#05140b] border border-gray-700 p-3 sm:p-4 rounded-xl text-sm outline-none focus:border-[#22c55e]" 
                onChange={(e) => setFormData({...formData, pages: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
                Pub Year
              </label>
              <input 
                type="number" 
                required 
                value={formData.pubYear} 
                className="w-full bg-[#05140b] border border-gray-700 p-3 sm:p-4 rounded-xl text-sm outline-none focus:border-[#22c55e]" 
                onChange={(e) => setFormData({...formData, pubYear: e.target.value})} 
              />
            </div>
          </div>

          {/* Submit Button - Mobile Only */}
          <div className="lg:hidden pt-4">
            <button 
              onClick={handleSubmit}
              disabled={updating}
              className="w-full py-3 sm:py-4 bg-[#22c55e] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1bb054] transition-all shadow-lg shadow-[#22c55e]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {updating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Details
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Cover & Save */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#112216] p-4 sm:p-6 rounded-2xl border border-gray-800 space-y-4 sm:space-y-6 shadow-xl">
            <div className="space-y-4">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
                Book Cover
              </label>
              <div className="relative aspect-[3/4.5] w-full rounded-xl overflow-hidden border border-gray-700 bg-black/40 group">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-700">
                    <Image size={32} className="sm:w-10 sm:h-10" />
                    <p className="text-[9px] sm:text-[10px] mt-2 font-bold">No Image Found</p>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                  <Camera size={28} className="text-[#22c55e] mb-2 sm:w-8 sm:h-8" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-tighter">
                    Change Cover
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                </label>
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden lg:block pt-4 space-y-3">
              <button 
                onClick={handleSubmit}
                disabled={updating}
                className="w-full py-3 sm:py-4 bg-[#22c55e] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1bb054] transition-all shadow-lg shadow-[#22c55e]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {updating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Details
                  </>
                )}
              </button>
              <button 
                onClick={() => router.back()}
                className="w-full py-3 sm:py-4 text-gray-500 font-bold hover:text-white transition-all text-xs sm:text-sm"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}