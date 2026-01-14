"use client";

import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { 
  Plus, Search, Trash2, Edit3, UploadCloud, 
  PlayCircle, Youtube, Loader2, AlertTriangle, X, Link as LinkIcon, Save, CheckCircle2, Inbox 
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Tutorial {
  _id: string;
  title: string;
  videoUrl: string;
  description?: string;
}

export default function TutorialManagementClient({ initialTutorials }: { initialTutorials: Tutorial[] }) {
  const router = useRouter();
  const [tutorials, setTutorials] = useState<Tutorial[]>(initialTutorials);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & Message States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form States
  const [addFormData, setAddFormData] = useState({ title: "", videoUrl: "", description: "" });
  const [editFormData, setEditFormData] = useState({ title: "", videoUrl: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const fetchTutorials = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/api/v1/admin/tutorials", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setTutorials(res.data.data);
    } catch (err) {
      console.error("Sync error");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post("/api/v1/admin/tutorials", addFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAddFormData({ title: "", videoUrl: "", description: "" });
        setSuccessMessage("New tutorial guide added to library!");
        setShowSuccessModal(true);
        fetchTutorials();
        router.refresh();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Add failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.patch(`/api/v1/admin/tutorials/${editingId}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setShowEditModal(false);
        setSuccessMessage("Tutorial details updated successfully.");
        setShowSuccessModal(true);
        fetchTutorials();
        router.refresh();
      }
    } catch (err: any) {
      alert("Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedTutorial) return;
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`/api/v1/admin/tutorials/${selectedTutorial._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setSuccessMessage("Tutorial has been removed from catalog.");
      setShowSuccessModal(true);
      fetchTutorials();
      router.refresh();
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
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Tutorial Management</h1>
          <p className="text-[#8c7a6b] mt-1 text-sm italic">Organize guide videos and educational content.</p>
        </div>
      </div>

      {/* 🟢 Add Form Section */}
      <div className="bg-[#1a110a] border border-[#2c1a10] rounded-[2rem] p-6 sm:p-10 shadow-2xl space-y-8">
        <h3 className="text-[#e67e22] font-bold flex items-center gap-2 uppercase text-xs tracking-[0.2em]"><Plus size={18} /> New Tutorial Resource</h3>
        <form onSubmit={handleAddSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Video Title</label>
               <input type="text" required value={addFormData.title} placeholder="Organizing Books 101" className="w-full bg-black/30 border border-[#2c1a10] rounded-xl py-4 px-5 text-white outline-none focus:border-[#e67e22] transition-all" onChange={(e) => setAddFormData({...addFormData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">YouTube URL</label>
               <input type="text" required value={addFormData.videoUrl} placeholder="https://youtube.com/..." className="w-full bg-black/30 border border-[#2c1a10] rounded-xl py-4 px-5 text-white outline-none focus:border-[#e67e22] transition-all" onChange={(e) => setAddFormData({...addFormData, videoUrl: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Brief Description</label>
             <textarea rows={3} value={addFormData.description} placeholder="Describe the tutorial content..." className="w-full bg-black/30 border border-[#2c1a10] rounded-xl py-4 px-5 text-gray-400 text-sm outline-none focus:border-[#e67e22] resize-none" onChange={(e) => setAddFormData({...addFormData, description: e.target.value})} />
          </div>
          <div className="flex justify-end">
            <button disabled={btnLoading} className="bg-[#e67e22] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#d35400] transition-all shadow-xl shadow-[#e67e22]/10 flex items-center gap-2">
              {btnLoading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />} Upload Guide
            </button>
          </div>
        </form>
      </div>

      {/* 🟠 Content List Table */}
      <div className="bg-[#1a110a] border border-[#2c1a10] rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 sm:p-8 border-b border-[#2c1a10] flex flex-col sm:flex-row justify-between items-center bg-black/20 gap-4">
           <h3 className="text-white font-bold text-lg flex items-center gap-3"><PlayCircle className="text-[#e67e22]" /> Cataloged Guides</h3>
           <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input type="text" placeholder="Filter tutorials..." className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-3 pl-12 text-xs text-white outline-none focus:border-[#e67e22]" onChange={(e) => setSearchTerm(e.target.value)} />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-[#8c7a6b] text-[10px] font-black uppercase tracking-widest border-b border-[#2c1a10]">
              <tr>
                <th className="px-8 py-5">Tutorial Info</th>
                <th className="px-8 py-5 hidden lg:table-cell">Reference</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c1a10]">
              {loading ? (
                <tr><td colSpan={3} className="py-32 text-center text-[#e67e22] animate-pulse font-serif italic text-lg">Syncing with server...</td></tr>
              ) : filteredTutorials.length > 0 ? filteredTutorials.map((t) => (
                <tr key={t._id} className="group hover:bg-white/[0.01] transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-start gap-5">
                      <div className="relative w-24 h-14 bg-black rounded-lg overflow-hidden border border-white/5 flex-shrink-0">
                           {getYouTubeId(t.videoUrl) && <Image src={`https://img.youtube.com/vi/${getYouTubeId(t.videoUrl)}/mqdefault.jpg`} alt="YT" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />}
                           <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition-all"><Youtube size={20} className="text-red-600" /></div>
                      </div>
                      <div className="space-y-1 max-w-sm">
                        <span className="font-bold text-gray-100 text-base block leading-tight">{t.title}</span>
                        {/* ডেসক্রিপশন এখন টেবিলে দৃশ্যমান */}
                        <p className="text-xs text-gray-600 line-clamp-2 italic">"{t.description || "No description provided."}"</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                    <a href={t.videoUrl} target="_blank" className="text-[#e67e22] text-[10px] font-mono hover:underline truncate max-w-[200px] block">{t.videoUrl}</a>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => { setEditingId(t._id); setEditFormData({title: t.title, videoUrl: t.videoUrl, description: t.description || ""}); setShowEditModal(true); }} className="p-3 bg-white/5 text-gray-500 rounded-2xl hover:bg-white/10 hover:text-white transition-all"><Edit3 size={18}/></button>
                      <button onClick={() => { setSelectedTutorial(t); setShowDeleteModal(true); }} className="p-3 bg-red-500/5 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="py-32 text-center text-gray-700 italic border-2 border-dashed border-white/5"><Inbox className="mx-auto mb-2 opacity-20" size={40}/> No tutorials found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟡 EDIT MODAL (Description সহ) */}
      {showEditModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#14110e] w-full max-w-lg rounded-[2.5rem] border border-[#2c1a10] p-10 shadow-3xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={24}/></button>
            <div className="text-center mb-8"><h2 className="text-3xl font-serif italic text-white font-bold">Update Resource</h2></div>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Title</label>
                <input type="text" required value={editFormData.title} className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-4 px-6 text-[#e67e22] outline-none" onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Video Link</label>
                <input type="text" required value={editFormData.videoUrl} className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-4 px-6 text-[#e67e22] outline-none" onChange={(e) => setEditFormData({...editFormData, videoUrl: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Description</label>
                <textarea rows={3} value={editFormData.description} className="w-full bg-black/40 border border-[#2c1a10] rounded-xl py-4 px-6 text-gray-400 outline-none resize-none" onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} />
              </div>
              <button disabled={btnLoading} type="submit" className="w-full py-5 bg-[#f1c40f] text-black rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-[#d4ac0d] transition-all">
                {btnLoading ? <Loader2 className="animate-spin mx-auto" /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- ✅ SUCCESS MODAL (Add/Edit/Delete) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1a140f] w-full max-w-sm rounded-[3rem] border border-white/10 p-10 text-center space-y-8 shadow-2xl relative">
            <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto border border-[#22c55e]/30 animate-bounce">
               <CheckCircle2 size={48} className="text-[#22c55e]" />
            </div>
            <div className="space-y-2 px-4">
              <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Operation Successful</h2>
              <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest">{successMessage}</p>
            </div>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-[#c19a6b] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#d4ac7d]">Understood</button>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in zoom-in-95">
          <div className="bg-[#1a110a] w-full max-w-md rounded-[2.5rem] border border-[#2c1a10] p-10 space-y-10 shadow-3xl">
            <div className="flex gap-5">
              <div className="p-4 bg-red-500/10 rounded-full text-red-500 h-fit"><AlertTriangle size={28}/></div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">Remove Guide?</h3>
                <p className="text-sm text-gray-600 italic leading-relaxed">"{selectedTutorial?.title}" will be permanently deleted.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 text-gray-500 font-bold uppercase text-[10px] hover:text-white transition-colors">Cancel</button>
              <button onClick={confirmDelete} disabled={btnLoading} className="flex-1 py-4 bg-red-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] hover:bg-red-700 shadow-xl shadow-red-600/20">
                {btnLoading ? <Loader2 className="animate-spin mx-auto" /> : "Delete Now"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}