"use client";
import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", genre: "", description: "", coverImage: "" });

  const fetchBooks = async () => {
    const res = await fetch("/api/books");
    const data = await res.json();
    if (data.success) setBooks(data.data);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowModal(false);
      fetchBooks();
      alert("Book Added!");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      fetchBooks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-[#5c4033]">Manage Library</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#5c4033] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#3e2b22]"
        >
          <Plus size={20} /> Add New Book
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5d9c1] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#fdfaf1] border-b border-[#e5d9c1]">
            <tr>
              <th className="p-4 text-[#5c4033]">Cover</th>
              <th className="p-4 text-[#5c4033]">Title & Author</th>
              <th className="p-4 text-[#5c4033]">Genre</th>
              <th className="p-4 text-[#5c4033]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book: any) => (
              <tr key={book._id} className="border-b border-[#f5f5f5] hover:bg-gray-50">
                <td className="p-4"><img src={book.coverImage} className="w-12 h-16 object-cover rounded shadow-sm" /></td>
                <td className="p-4">
                  <div className="font-bold text-[#5c4033]">{book.title}</div>
                  <div className="text-sm text-gray-500">{book.author}</div>
                </td>
                <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{book.genre?.name}</span></td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button className="text-blue-600 hover:scale-110 transition-transform"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(book._id)} className="text-red-600 hover:scale-110 transition-transform"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Add Modal (Logic can be expanded) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-serif font-bold mb-4">Add New Masterpiece</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Book Title" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              <input type="text" placeholder="Author Name" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, author: e.target.value})} required />
              <input type="text" placeholder="Cover Image URL" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, coverImage: e.target.value})} required />
              <textarea placeholder="Description" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-[#5c4033] text-white py-2 rounded font-bold">Save Book</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}