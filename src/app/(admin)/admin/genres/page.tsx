"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader2, ListTree, Check, X, AlertTriangle, List } from 'lucide-react';

const ManageGenresPage = () => {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  
  // নতুন জেনার বা এডিট করার জন্য স্টেট
  const [genreName, setGenreName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // মোডাল স্টেট
  const [showModal, setShowModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ১. সব জেনার ফেচ করা
  const fetchGenres = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/genres');
      setGenres(res.data.data);
    } catch (err) {
      console.error("Error fetching genres:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGenres(); }, []);

  // ২. জেনার তৈরি বা আপডেট করা
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genreName.trim()) return;

    setBtnLoading(true);
    try {
      if (editingId) {
        await axios.patch(`/api/v1/genres/${editingId}`, { name: genreName });
        setEditingId(null);
      } else {
        await axios.post('/api/v1/genres', { name: genreName });
      }
      setGenreName("");
      fetchGenres();
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  // ডিলিট মোডাল ওপেন করার ফাংশন
  const openDeleteModal = (genre: any) => {
    setSelectedGenre(genre);
    setShowModal(true);
  };

  // ৩. আসল জেনার ডিলিট করার ফাংশন
  const confirmDelete = async () => {
    if (!selectedGenre) return;

    try {
      setDeleteLoading(true);
      await axios.delete(`/api/v1/genres/${selectedGenre._id}`);
      setShowModal(false);
      fetchGenres();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const startEdit = (genre: any) => {
    setEditingId(genre._id);
    setGenreName(genre.name);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold font-serif text-white tracking-tight">Manage Genres</h1>
        <p className="text-gray-500 text-sm">Organize and control the book categories in your system.</p>
      </div>

      {/* Add/Edit Genre Form */}
      <div className="bg-[#112216] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <ListTree className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              value={genreName}
              required
              placeholder="Enter genre name (e.g. Mystery, Sci-Fi)"
              className="w-full bg-[#05140b] border border-gray-700 p-3.5 pl-12 rounded-xl outline-none focus:border-[#22c55e] text-sm text-white transition-all"
              onChange={(e) => setGenreName(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={btnLoading}
            className="bg-[#22c55e] text-black px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1bb054] transition-all disabled:opacity-50"
          >
            {btnLoading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Check size={18} /> : <Plus size={18} />)}
            {editingId ? "Update Genre" : "Add Genre"}
          </button>
          {editingId && (
            <button 
              type="button"
              onClick={() => { setEditingId(null); setGenreName(""); }}
              className="bg-gray-800 text-white px-4 py-3.5 rounded-xl hover:bg-gray-700 transition-all"
            >
              <X size={18} />
            </button>
          )}
        </form>
      </div>

      {/* Genre List Table */}
      <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-[#22c55e]" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-800 bg-black/20">
                <tr>
                  <th className="px-8 py-5">Genre Name</th>
                  <th className="px-8 py-4">Linked Inventory</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {genres.map((genre) => (
                  <tr key={genre._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-5 font-bold text-gray-200">{genre.name}</td>
                    <td className="px-8 py-5 text-sm">
                      <span className="bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-800 text-gray-400 text-xs">
                        {genre.bookCount || 0} books
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(genre)}
                          className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(genre)}
                          className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- কাস্টম ডিলিট মোডাল --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => !deleteLoading && setShowModal(false)}
          ></div>
          
          <div className="relative w-full max-w-md bg-[#112216] border border-gray-800 rounded-2xl p-7 shadow-2xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className="p-3.5 bg-red-500/10 rounded-full text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Delete Genre</h3>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone and may affect books linked to this genre.</p>
              </div>
            </div>

            {/* Selected Genre Detail Card */}
            <div className="bg-black/20 p-5 rounded-xl border border-gray-800/50 flex items-center gap-4 mb-8">
               <div className="p-3 bg-gray-800 rounded-lg text-[#22c55e]">
                  <List size={20} />
               </div>
               <div>
                  <h4 className="text-white font-bold">{selectedGenre?.name}</h4>
                  <p className="text-xs text-gray-500">Category • {selectedGenre?.bookCount || 0} books linked</p>
               </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <button 
                onClick={() => setShowModal(false)}
                disabled={deleteLoading}
                className="px-6 py-2.5 text-gray-400 font-bold hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="bg-[#e11d48] text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {deleteLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGenresPage;