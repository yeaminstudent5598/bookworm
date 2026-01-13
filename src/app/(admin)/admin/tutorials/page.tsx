"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  Plus, Search, Trash2, Edit3, UploadCloud, 
  PlayCircle, Youtube, Loader2, AlertTriangle, X, Link as LinkIcon, Save 
} from "lucide-react";
import Image from "next/image";

export default function TutorialManagementPage() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ১. অ্যাড ফর্ম স্টেট (শুধুমাত্র নতুন অ্যাড করার জন্য)
  const [addFormData, setAddFormData] = useState({ title: "", videoUrl: "", description: "" });

  // ২. এডিট মোডাল স্টেট (শুধুমাত্র এডিট করার জন্য)
  const [editFormData, setEditFormData] = useState({ title: "", videoUrl: "", description: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ৩. ডিলিট মোডাল স্টেট
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);

  // ডাটা ফেচ করা
  const fetchTutorials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/admin/tutorials");
      if (res.data.success) {
        setTutorials(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch tutorials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTutorials(); }, [fetchTutorials]);

  // নতুন টিউটোরিয়াল অ্যাড করার হ্যান্ডলার
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const res = await axios.post("/api/v1/admin/tutorials", addFormData);
      if (res.data.success) {
        setAddFormData({ title: "", videoUrl: "", description: "" });
        fetchTutorials();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Add failed");
    } finally {
      setBtnLoading(false);
    }
  };

  // এডিট মোডাল ওপেন করা
  const openEditModal = (tutorial: any) => {
    setEditingId(tutorial._id);
    setEditFormData({
      title: tutorial.title,
      videoUrl: tutorial.videoUrl,
      description: tutorial.description || ""
    });
    setShowEditModal(true);
  };

  // এডিট সাবমিট হ্যান্ডলার (শুধুমাত্র মোডাল থেকে)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const res = await axios.patch(`/api/v1/admin/tutorials/${editingId}`, editFormData);
      if (res.data.success) {
        setShowEditModal(false);
        setEditingId(null);
        fetchTutorials();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  // ডিলিট কনফার্মেশন
  const confirmDelete = async () => {
    try {
      setBtnLoading(true);
      await axios.delete(`/api/v1/admin/tutorials/${selectedTutorial._id}`);
      setShowDeleteModal(false);
      fetchTutorials();
    } catch (err) {
      alert("Delete failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const filteredTutorials = tutorials.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Tutorial Library Management</h1>
        <p className="text-[#8c7a6b] mt-2 text-sm">Manage and organize video tutorials for the BookWorm community.</p>
      </div>

      {/* 🟢 Add New Tutorial Form (শুধুমাত্র অ্যাড করার জন্য) */}
      <div className="bg-[#1a110a] border border-[#2c1a10] rounded-2xl p-8 shadow-2xl space-y-6">
        <h3 className="text-[#e67e22] font-bold flex items-center gap-2">
          <Plus size={20} /> Add New Tutorial
        </h3>
        <form onSubmit={handleAddSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#8c7a6b] uppercase tracking-widest">Video Title</label>
              <input 
                type="text" required value={addFormData.title}
                placeholder="e.g. How to organize your reading list"
                className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-3.5 px-4 text-white outline-none focus:border-[#e67e22] transition-all"
                onChange={(e) => setAddFormData({...addFormData, title: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#8c7a6b] uppercase tracking-widest">YouTube Video URL</label>
              <input 
                type="text" required value={addFormData.videoUrl}
                placeholder="e.g. https://www.youtube.com/watch?v=..."
                className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-3.5 px-4 text-white outline-none focus:border-[#e67e22] transition-all"
                onChange={(e) => setAddFormData({...addFormData, videoUrl: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#8c7a6b] uppercase tracking-widest">Brief Summary (Description)</label>
            <textarea 
              rows={3} value={addFormData.description}
              placeholder="Enter a short description about this tutorial..."
              className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-4 px-5 text-gray-300 text-sm outline-none focus:border-[#e67e22] transition-all resize-none"
              onChange={(e) => setAddFormData({...addFormData, description: e.target.value})}
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={btnLoading} className="bg-[#e67e22] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-[#d35400] transition-all shadow-lg">
              {btnLoading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
              Upload to Library
            </button>
          </div>
        </form>
      </div>

      {/* 🟠 Table Section (বাটন সব সময় দৃশ্যমান) */}
      <div className="bg-[#1a110a] border border-[#2c1a10] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2c1a10] flex justify-between items-center bg-black/20">
           <h3 className="text-white font-bold text-lg flex items-center gap-3">
             <PlayCircle className="text-[#e67e22]" /> Existing Tutorials
           </h3>
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="text" placeholder="Search tutorials..."
                className="w-full bg-black/40 border border-[#2c1a10] rounded-lg py-2 pl-9 pr-4 text-xs text-white outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-black/40 text-[#8c7a6b] text-[10px] font-bold uppercase tracking-widest border-b border-[#2c1a10]">
            <tr>
              <th className="px-8 py-5">Video Title</th>
              <th className="px-8 py-5 text-center">YouTube Link</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2c1a10]">
            {loading ? (
              <tr><td colSpan={3} className="py-24 text-center text-[#e67e22] font-bold animate-pulse">Syncing...</td></tr>
            ) : filteredTutorials.map((t) => (
              <tr key={t._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6 flex items-center gap-4">
                  <div className="relative w-20 h-12 bg-black rounded-lg overflow-hidden border border-gray-800 flex-shrink-0">
                       {getYouTubeId(t.videoUrl) ? (
                          <Image src={`https://img.youtube.com/vi/${getYouTubeId(t.videoUrl)}/mqdefault.jpg`} alt="T" fill className="object-cover" />
                       ) : <Youtube size={20} className="mx-auto mt-3 text-gray-700"/>}
                  </div>
                  <div>
                    <span className="font-bold text-gray-200 text-sm transition-colors">{t.title}</span>
                    <p className="text-[10px] text-gray-600 truncate max-w-xs mt-1">{t.description || "No description."}</p>
                  </div>
                </td>
                <td className="px-8 py-6 text-center text-[#e67e22] text-xs font-mono">
                  <a href={t.videoUrl} target="_blank" className="hover:underline">{t.videoUrl.slice(0, 30)}...</a>
                </td>
                <td className="px-8 py-6 text-right">
                  {/* Action বাটনগুলো এখন সব সময় দেখা যাবে (Hover এর দরকার নেই) */}
                  <div className="flex justify-end gap-3">
                    <button onClick={() => openEditModal(t)} className="p-2.5 bg-orange-400/10 text-orange-400 rounded-xl hover:bg-orange-400 hover:text-black transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => { setSelectedTutorial(t); setShowDeleteModal(true); }} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🟡 EDIT MODAL (image_202367.png অনুযায়ী) */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative w-full max-w-lg bg-[#14110e] border border-[#2c1a10] rounded-[2rem] p-10 shadow-3xl animate-in zoom-in duration-300">
            <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={24} /></button>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-serif italic text-white tracking-wide">Edit Tutorial</h2>
              <p className="text-gray-500 text-sm mt-2">Update the details for your library guide.</p>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8c7a6b] uppercase tracking-widest ml-1">Video Title</label>
                <input 
                  type="text" required value={editFormData.title}
                  className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-4 px-5 text-[#e67e22] outline-none focus:border-[#e67e22] transition-all"
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8c7a6b] uppercase tracking-widest ml-1">YouTube URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
                  <input 
                    type="text" required value={editFormData.videoUrl}
                    className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-4 pl-12 pr-5 text-[#e67e22] outline-none focus:border-[#e67e22] transition-all"
                    onChange={(e) => setEditFormData({...editFormData, videoUrl: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8c7a6b] uppercase tracking-widest ml-1">Brief Summary</label>
                <textarea 
                  rows={4} maxLength={250} value={editFormData.description}
                  placeholder="Summarize the video content..."
                  className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-4 px-5 text-gray-300 text-sm outline-none focus:border-[#e67e22] transition-all resize-none"
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                />
                <div className="flex justify-end text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    {editFormData.description.length}/250 characters
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="text-gray-500 font-bold text-sm hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={btnLoading} className="bg-[#f1c40f] text-black px-10 py-4 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-[#d4ac0d] transition-all shadow-xl shadow-[#f1c40f]/10">
                  {btnLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 DELETE MODAL (image_1de90b.png অনুযায়ী) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative w-full max-w-sm bg-[#112216] border border-gray-800 rounded-2xl p-7 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-full"><AlertTriangle size={24}/></div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Delete Tutorial</h3>
                <p className="text-xs text-gray-500 mt-1">This action cannot be undone.</p>
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-gray-800 flex items-center gap-3 mb-6 overflow-hidden">
               <Youtube size={24} className="text-red-500 flex-shrink-0" />
               <p className="text-sm font-bold text-white truncate">{selectedTutorial?.title}</p>
            </div>
            <div className="flex justify-end gap-4">
               <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 font-bold text-sm">Cancel</button>
               <button onClick={confirmDelete} className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-500/20">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}