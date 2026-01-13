"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  Search, UserPlus, Trash2, ChevronLeft, 
  ChevronRight, Users, Loader2, AlertCircle 
} from "lucide-react";
import Image from "next/image";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // ১. ইউজার ডাটা ফেচ করা
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/v1/admin/users");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      setError("Failed to sync community data.");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ২. রোল পরিবর্তন করা
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await axios.patch(`/api/v1/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      alert("Failed to update role");
    }
  };

  // ৩. ইউজার ডিলিট করা
  const handleDelete = async (userId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user: ${name}?`)) return;
    try {
      await axios.delete(`/api/v1/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#22c55e]" size={48} />
      <p className="text-gray-500 animate-pulse">Gathering community members...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Community Control</h1>
          <p className="text-gray-500 mt-2">Manage reader permissions and administrative roles.</p>
        </div>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text"
            placeholder="Search readers by name or email..."
            className="w-full bg-[#112216] border border-gray-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#22c55e] transition-all text-white placeholder:text-gray-600"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-[#112216] border border-gray-800 p-4 rounded-xl flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-black/30 rounded-full text-[#22c55e]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Readers</p>
            <h3 className="text-2xl font-bold text-white">{users.length.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Users Table Content */}
      <div className="bg-[#112216] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-gray-800">
              <tr>
                <th className="px-8 py-5">Profile</th>
                <th className="px-8 py-5">Contact Info</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5 flex items-center gap-4">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-800 shadow-inner">
                        <Image 
                          src={user.photo || "/placeholder-avatar.png"} 
                          alt={user.name} fill className="object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-200 group-hover:text-[#22c55e] transition-colors">{user.name}</p>
                        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter">ID: #{user._id.slice(-4)}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-400">{user.email}</td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin' 
                        ? 'bg-[#22c55e]/10 text-[#22c55e]' 
                        : 'bg-gray-800 text-gray-500'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <select 
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="bg-[#05140b] border border-gray-700 text-gray-300 text-[11px] font-bold py-1.5 px-3 rounded-lg outline-none focus:border-[#22c55e] cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button 
                          onClick={() => handleDelete(user._id, user.name)}
                          className="p-2 text-gray-600 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-600 italic">No community members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-5 bg-black/10 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
          <p>Displaying {filteredUsers.length} active members</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#05140b] border border-gray-800 rounded-lg hover:border-gray-600 transition-all flex items-center gap-1 font-bold">
              <ChevronLeft size={14} /> Prev
            </button>
            <button className="px-4 py-2 bg-[#05140b] border border-gray-800 rounded-lg hover:border-gray-600 transition-all flex items-center gap-1 font-bold">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}