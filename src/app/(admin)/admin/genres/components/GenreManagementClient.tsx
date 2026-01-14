"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Plus, Edit2, Trash2, Loader2, ListTree, 
  Check, X, AlertTriangle, CheckCircle2 
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
        setShowSuccessModal(true);
      }

      setGenreName("");
      router.refresh();
      const res = await axios.get('/api/v1/genres');
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
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in duration-700 pb-10 px-2 sm:px-0">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">Genre Inventory</h1>
        <p className="text-gray-500 text-sm italic">Organize and categorize your library's collection.</p>
      </header>

      {/* Input Form - Responsive flex col to row */}
      <div className="bg-[#112216] p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <ListTree className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" value={genreName} required placeholder="Enter genre name..."
              className="w-full bg-black/20 border border-white/10 p-3.5 pl-12 rounded-xl sm:rounded-2xl outline-none focus:border-[#22c55e] text-white transition-all text-sm"
              onChange={(e) => setGenreName(e.target.value)}
            />
          </div>
          <button 
            disabled={btnLoading}
            className="bg-[#22c55e] text-black px-8 py-3.5 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-[#1bb054] disabled:opacity-50 transition-all shadow-lg shadow-[#22c55e]/10 h-full"
          >
            {btnLoading ? <Loader2 className="animate-spin" size={16} /> : (editingId ? <Check size={16} /> : <Plus size={16} />)}
            {editingId ? "Update" : "Add Genre"}
          </button>
        </form>
      </div>

      {/* Genre Table - Scrollable Container */}
      <div className="bg-[#112216] rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-black/20 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
              <tr>
                <th className="px-6 py-5">Category Name</th>
                <th className="px-6 py-5">Books Count</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {genres.map((genre) => (
                <tr key={genre._id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-6 py-5 font-bold text-gray-200 text-sm">{genre.name}</td>
                  <td className="px-6 py-5">
                    <span className="bg-white/5 px-3 py-1 rounded-lg text-[9px] font-black text-gray-500 border border-white/5 uppercase tracking-tighter">
                      {genre.bookCount || 0} items
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => { setEditingId(genre._id); setGenreName(genre.name); }} className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit2 size={14}/></button>
                      <button onClick={() => { setSelectedGenre(genre); setShowDeleteModal(true); }} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals are kept inside the return with responsive centering */}
      {showSuccessModal && <SuccessPopup onClose={() => setShowSuccessModal(false)} />}
      {showDeleteModal && (
        <DeletePopup 
          name={selectedGenre?.name || ""} 
          loading={deleteLoading} 
          onCancel={() => setShowDeleteModal(false)} 
          onConfirm={confirmDelete} 
        />
      )}
    </div>
  );
}

// --- Internal Modal Components for Cleanliness ---
function SuccessPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#1a140f] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-8 sm:p-10 text-center space-y-6 shadow-2xl">
        <div className="w-16 sm:w-20 h-16 sm:h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto border border-[#22c55e]/30">
           <CheckCircle2 size={40} className="text-[#22c55e]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">Cataloged!</h2>
          <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-tighter">Your library category has been added successfully.</p>
        </div>
        <button onClick={onClose} className="w-full py-4 bg-[#c19a6b] text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#d4ac7d] transition-all">Excellent</button>
      </div>
    </div>
  );
}

function DeletePopup({ name, loading, onCancel, onConfirm }: any) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in zoom-in-95 duration-300">
      <div className="bg-[#1a140f] w-full max-w-md rounded-[2rem] border border-white/10 p-8 sm:p-10 space-y-8 shadow-3xl">
        <div className="flex gap-4">
          <div className="p-4 bg-red-500/10 rounded-full text-red-500 h-fit flex-shrink-0"><AlertTriangle size={24}/></div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Delete Category?</h3>
            <p className="text-sm text-gray-500 italic leading-relaxed">Are you sure? This will permanently remove "{name}" from the system.</p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors">Keep it</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 flex items-center justify-center gap-2 shadow-xl shadow-red-600/20">
            {loading ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16}/>} Delete
          </button>
        </div>
      </div>
    </div>
  );
}