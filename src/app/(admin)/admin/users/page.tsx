"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, User as UserIcon, RefreshCcw } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const res = await fetch(`/api/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      alert("Role updated successfully!");
      fetchUsers();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading community members...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-[#5c4033]">Community Management</h1>

      <div className="bg-white rounded-2xl border border-[#e5d9c1] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#fdfaf1] border-b border-[#e5d9c1]">
            <tr>
              <th className="p-4 text-[#5c4033]">User Details</th>
              <th className="p-4 text-[#5c4033]">Current Role</th>
              <th className="p-4 text-[#5c4033]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id} className="border-b border-[#f5f5f5] hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold text-[#5c4033]">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleRoleChange(user._id, user.role)}
                    className="flex items-center gap-2 text-sm font-bold text-[#5c4033] hover:underline"
                  >
                    <RefreshCcw size={16} /> Change to {user.role === 'admin' ? 'User' : 'Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}