"use client";
import { useState, useEffect } from "react";
import { BookOpen, Clock, CheckCircle, Edit3, Filter, Search, ChevronRight } from "lucide-react";

export default function MyLibrary() {
  const [activeTab, setActiveTab] = useState("Currently Reading");
  const [shelves, setShelves] = useState([
    {
      _id: "1",
      status: "Currently Reading",
      book: { title: "The Great Gatsby", author: "F. Scott Fitzgerald", coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaVRaz8xvxu22OhNLZrbxhN8V2UDZH_egNTEBOmgMeJAGCB9Twqo08p6W_TSoAiNJq8k7Ljdw16p2KyVqYTZbo632z_44oaRsMQwMcpxDYO-cSoBzhYoBZ1Mb-qjGfiRvecd7f4-2VniKlxGbIBU46f2EsKQ6aXg4Sg3z_p2_7oYzl8h32nl3Bwglkxio1uS-3pNAO_LwHTNaQ1c3gvZyzSBjMMaolHvUGJQH8QzxUorRnmt5B2wgY__AddQz192cM3G0rHtt7UQ" },
      progress: 50,
      totalPages: 300,
      currentPage: 150
    },
    {
      _id: "2",
      status: "Currently Reading",
      book: { title: "Dune", author: "Frank Herbert", coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlCFPpX7cwZ_9utd9FLGPgAurf2IIKa9Gt1_mBdGfZL_3got60QlxoYzzL350rO9u5aXqjC2mwnp4leMnf0jzzXXPLD8NdqHZPzEmJhgNSL1eU1S5wG8kLGfLJr-p5P0GopZIuGqhy6owZVSY_QUUt48GaCkdtKRC2ITXWoRijjf4xVVvCfYh589hed3J8yGaeboR2daGPvZMUCIa_ybNmFuA5B7cNAYjY4CSkcJ8MQatxqWCOUV4BmRPTQYwqEYlrre-lNshvVA" },
      progress: 12,
      totalPages: 658,
      currentPage: 82
    },
    {
      _id: "3",
      status: "Want to Read",
      book: { title: "Normal People", author: "Sally Rooney", coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3aVJlQ21YcwAO8OB-WAjyhM_wbN_EBNl9_HHbGROjQEJOSS3gxa8XWR9uijjn77XelpkwnppqdULYkrJPwiQccSmx95RRlfAly9ZC1hVQzOg4NSIBS1J-t5NWOoNC9qg6VlRxrwNTLLLwkYLeyD788vA-NtJrUQd8OfaXhOwye_bLglhtYrxRM1bQIoaGrCv8eNwgyLSzFQplvdWfLGiGbyjrua1yEyA0_soN3eoqeh4j8hm5NPNx3ZSA_nyYC781hlKImeEaVg" },
      progress: 0,
      totalPages: 270,
      currentPage: 0
    },
    {
      _id: "4",
      status: "Read",
      book: { title: "1984", author: "George Orwell", coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpU6NAu8xW5EZjWaGUPCkZ47S7XleQ3iO8dBD7h_hF1d3idFuxGVu60IsJofbul6sNCvHchxD5i653yE_QQKcOgoVbs-_qhn4s-n37i2o5IwtwduiQKi7xEDDbBj69xLanFSpzdkZOGkoIMDpZByfUMVc_2InlzRCiSR-rqbiO-V4Ts2Fb8tr81lseYjqTczC6MKodp24GcDfgpoTdZ-o2qpB8_sS8YfHe1u8Mpk2ZqdZMp-U65VbiJdsAQsgysm-RqIZZFP5-LQ" },
      rating: 5.0
    },
  ]);

  const [loading, setLoading] = useState(false);

  const filteredBooks = shelves.filter((s) => s.status === activeTab);

  const tabs = [
    { name: "Want to Read", icon: Clock, color: "text-orange-500" },
    { name: "Currently Reading", icon: BookOpen, color: "text-blue-500" },
    { name: "Read", icon: CheckCircle, color: "text-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f6] to-[#ede8e0] dark:from-[#221910] dark:to-[#2c2219]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#221910]/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-[#ec7f13]/10">
                <BookOpen className="text-[#ec7f13]" size={28} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">My Library</h1>
                <p className="text-sm text-stone-500 dark:text-stone-400">Manage your reading journey</p>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors">
              <Filter size={24} className="text-stone-600 dark:text-stone-400" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search books in your library..." 
              className="w-full pl-12 pr-4 py-3 bg-stone-100 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 focus:outline-none focus:border-[#ec7f13] dark:text-white"
            />
          </div>
        </div>
      </header>

      {/* Segmented Tabs */}
      <div className="sticky top-20 z-30 bg-white/80 dark:bg-[#221910]/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-4 md:px-6 py-4 font-semibold text-sm md:text-base whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab.name
                    ? "border-[#ec7f13] text-[#ec7f13]"
                    : "border-transparent text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.name}</span>
                <span className="text-xs md:text-sm font-bold">{shelves.filter(s => s.status === tab.name).length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{activeTab}</h2>
          <p className="text-stone-500 dark:text-stone-400">{filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}</p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredBooks.map((item) => (
              <article
                key={item._id}
                className="group bg-white dark:bg-[#2c2219] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-stone-100 dark:border-white/5 hover:border-[#ec7f13]/30"
              >
                {/* Book Cover */}
                <div className="relative h-64 md:h-72 overflow-hidden bg-stone-200 dark:bg-stone-800">
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  
                  {/* Rating Badge */}
                  {item.rating && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <span>⭐</span> {item.rating}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">
                    {item.book.title}
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">{item.book.author}</p>

                  {/* Progress Section (for Currently Reading) */}
                  {activeTab === "Currently Reading" && (
                    <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-white/5">
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="font-semibold text-[#ec7f13]">{item.progress}% Complete</span>
                        <span className="text-stone-500 dark:text-stone-400">{item.currentPage}/{item.totalPages} pages</span>
                      </div>
                      <div className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#ec7f13] to-[#d66e0a] rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <button className="w-full mt-4 bg-[#ec7f13] hover:bg-[#d66e0a] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group/btn">
                        <Edit3 size={18} />
                        <span>Update Progress</span>
                      </button>
                    </div>
                  )}

                  {/* Action for Want to Read */}
                  {activeTab === "Want to Read" && (
                    <button className="w-full mt-4 bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <BookOpen size={18} />
                      <span>Start Reading</span>
                    </button>
                  )}

                  {/* Action for Read */}
                  {activeTab === "Read" && (
                    <div className="pt-4 border-t border-stone-200 dark:border-white/5">
                      <button className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                        Write Review
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No books yet</h3>
            <p className="text-stone-500 dark:text-stone-400 mb-6">Start adding books to your {activeTab.toLowerCase()} shelf</p>
            <button className="bg-[#ec7f13] hover:bg-[#d66e0a] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Explore Books
            </button>
          </div>
        )}
      </main>

      {/* Quick Stats Footer (Desktop only) */}
      <footer className="hidden lg:block bg-white dark:bg-[#2c2219] border-t border-stone-200 dark:border-white/5 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ec7f13] mb-2">{shelves.filter(s => s.status === "Currently Reading").length}</div>
              <p className="text-stone-500 dark:text-stone-400">Currently Reading</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">{shelves.filter(s => s.status === "Want to Read").length}</div>
              <p className="text-stone-500 dark:text-stone-400">Want to Read</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">{shelves.filter(s => s.status === "Read").length}</div>
              <p className="text-stone-500 dark:text-stone-400">Books Read</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">{shelves.length}</div>
              <p className="text-stone-500 dark:text-stone-400">Total Books</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}