"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Plus, Edit2, Trash2, Loader2, ListTree, 
  Check, X, AlertTriangle, CheckCircle2, List 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Genre {
  _id: string;
  name: string;
  bookCount?: number;
}

export default function GenreManagementClient({ initialGenres }: { initialGenres: Genre[] }) {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>(initialGenres);
  const [btnLoading, setBtnLoading] = useState(false);
  const [genreName, setGenreName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genreName.trim()) return;

    setBtnLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.patch(`/api/v1/genres/${editingId}`, { name: genreName }, config);
        setEditingId(null);
      } else {
        await axios.post('/api/v1/genres', { name: genreName }, config);
        setShowSuccessModal(true); // সাকসেস মোডাল দেখাবে
      }

      setGenreName("");
      router.refresh(); // সার্ভার ডাটা আপডেট করার জন্য
      const res = await axios.get('/api/v1/genres'); // ক্লায়েন্ট লিস্ট আপডেট
      setGenres(res.data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedGenre) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`/api/v1/genres/${selectedGenre._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setGenres(genres.filter(g => g._id !== selectedGenre._id));
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <header>
        <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Genre Inventory</h1>
        <p className="text-gray-500 mt-1 italic">Control and categorize your library's collection.</p>
      </header>

      {/* Input Form */}
      <div className="bg-[#112216] p-6 rounded-[2rem] border border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <ListTree className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" value={genreName} required placeholder="Enter genre name (e.g. Mystery, Fantasy)"
              className="w-full bg-black/20 border border-white/10 p-4 pl-14 rounded-2xl outline-none focus:border-[#22c55e] text-white transition-all placeholder:text-gray-600"
              onChange={(e) => setGenreName(e.target.value)}
            />
          </div>
          <button 
            disabled={btnLoading}
            className="bg-[#22c55e] text-black px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-[#1bb054] disabled:opacity-50 transition-all shadow-lg"
          >
            {btnLoading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Check size={18} /> : <Plus size={18} />)}
            {editingId ? "Update" : "Add Genre"}
          </button>
        </form>
      </div>

      {/* Genre Table */}
      <div className="bg-[#112216] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-black/20 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
            <tr>
              <th className="px-8 py-6">Category Name</th>
              <th className="px-8 py-6">Books Count</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {genres.map((genre) => (
              <tr key={genre._id} className="group hover:bg-white/[0.02] transition-all">
                <td className="px-8 py-6 font-bold text-gray-200">{genre.name}</td>
                <td className="px-8 py-6">
                  <span className="bg-white/5 px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-500 border border-white/5 uppercase tracking-widest">
                    {genre.bookCount || 0} items
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingId(genre._id); setGenreName(genre.name); }} className="p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white"><Edit2 size={16}/></button>
                    <button onClick={() => { setSelectedGenre(genre); setShowDeleteModal(true); }} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Success Modal --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a140f] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-10 text-center space-y-8 shadow-2xl relative">
            <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto border border-[#22c55e]/30">
               <CheckCircle2 size={48} className="text-[#22c55e]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-white">Success!</h2>
              <p className="text-sm text-gray-500 leading-relaxed italic">The new genre has been cataloged in your library system.</p>
            </div>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-4 bg-[#c19a6b] text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#d4ac7d]"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* --- Delete Modal --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in zoom-in-95 duration-300">
          <div className="bg-[#1a140f] w-full max-w-md rounded-[2.5rem] border border-white/10 p-10 space-y-10">
            <div className="flex gap-5">
              <div className="p-4 bg-red-500/10 rounded-full text-red-500 h-fit"><AlertTriangle size={28}/></div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">Delete Genre?</h3>
                <p className="text-sm text-gray-500 leading-relaxed italic">Are you sure? Removing "{selectedGenre?.name}" will affect books assigned to this category.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-white">Keep it</button>
              <button onClick={confirmDelete} disabled={deleteLoading} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-700 flex items-center justify-center gap-2 shadow-xl shadow-red-600/20">
                {deleteLoading ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16}/>} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}