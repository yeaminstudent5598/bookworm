"use client";

import React, { useState, useCallback } from "react";
import axios from "axios";
import { 
  Search, Trash2, Users, Loader2, CheckCircle2, 
  X, AlertTriangle 
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error("Sync error");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.patch(`/api/v1/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSuccessMessage(`User promoted to ${newRole} successfully.`);
        setShowSuccessModal(true);
        fetchUsers();
        router.refresh();
      }
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`/api/v1/admin/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setSuccessMessage("Community account permanently removed.");
      setShowSuccessModal(true);
      fetchUsers();
      router.refresh();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in duration-700 pb-20 px-2 sm:px-4">
      
      {/* Header with Responsive Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">Community Control</h1>
          <p className="text-gray-500 italic text-sm">Manage reader permissions and system access levels.</p>
        </div>
        <div className="bg-[#112216] border border-white/10 px-6 sm:px-8 py-4 rounded-2xl flex items-center gap-4 shadow-xl w-full md:w-auto">
           <div className="p-3 bg-black/30 rounded-full text-[#22c55e]"><Users size={20}/></div>
           <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Readers Online</p>
              <h3 className="text-2xl font-bold text-white">{users.length}</h3>
           </div>
        </div>
      </div>

      {/* Search Bar - Responsive size */}
      <div className="relative max-w-2xl w-full">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
        <input 
          type="text" placeholder="Search by name or email..."
          className="w-full bg-[#112216] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:border-[#22c55e] transition-all shadow-inner"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table Container */}
      <div className="bg-[#112216] rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-black/20 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Member Profile</th>
                <th className="px-8 py-6">Access Role</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="group hover:bg-white/[0.01] transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/5 shadow-lg flex-shrink-0 group-hover:border-[#c19a6b]/50 transition-all bg-[#c19a6b]/10 flex items-center justify-center">
                        {user.photo ? (
                          <Image src={user.photo} alt="P" fill className="object-cover" />
                        ) : <span className="font-black text-[#c19a6b] text-sm uppercase">{user.name[0]}</span>}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-100 text-sm sm:text-base truncate">{user.name}</h4>
                        <p className="text-xs text-gray-500 italic truncate max-w-[200px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                      user.role === 'admin' ? 'bg-[#c19a6b]/10 text-[#c19a6b] border-[#c19a6b]/20' : 'bg-gray-800/40 text-gray-400 border-gray-700/50'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3 sm:opacity-0 group-hover:opacity-100 transition-all">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="bg-[#05140b] border border-white/10 text-gray-400 text-[10px] font-black uppercase py-2 px-3 rounded-xl outline-none focus:border-[#22c55e] cursor-pointer"
                      >
                        <option value="user">Promote to User</option>
                        <option value="admin">Promote to Admin</option>
                      </select>
                      <button 
                        onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                        className="p-3 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals are kept inside the return with responsive scale */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1a140f] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-10 text-center space-y-8 shadow-2xl">
            <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto border border-[#22c55e]/30">
               <CheckCircle2 size={48} className="text-[#22c55e]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Access Updated</h2>
              <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest px-4">{successMessage}</p>
            </div>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-[#c19a6b] text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#d4ac7d]">Done</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation UI */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in zoom-in-95 duration-300">
          <div className="bg-[#1a110a] w-full max-w-md rounded-[2rem] border border-white/10 p-10 space-y-10 shadow-3xl">
            <div className="flex gap-5">
              <div className="p-4 bg-red-500/10 rounded-full text-red-500 h-fit flex-shrink-0"><AlertTriangle size={28}/></div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">Revoke Access?</h3>
                <p className="text-sm text-gray-500 italic leading-relaxed">Are you sure you want to remove "{selectedUser?.name}" from the community? This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 text-gray-500 font-bold uppercase text-[10px] hover:text-white transition-colors">Keep Member</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all">Remove Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}