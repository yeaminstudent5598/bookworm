"use client";
import { useState, useEffect } from "react";
import { Star, Bookmark, Share2, ArrowLeft, MessageCircle, Users, Calendar, BookOpen } from "lucide-react";

export default function BookDetails() {
  const [book, setBook] = useState({
    title: "The Midnight Library",
    author: "Matt Haig",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA48qQnGH4gtrlK6_OwthrqdGuhfSfVAdBkkORzCR6Y4xYefzLTDrP1MDtQh1GTUOtMa0KT9TrS_bbOWZHwYU0zqYgH-BaNCGmDmYNHBOzfVfcS71MA_0RQP0G697abAuD2jlI0tfKmsuKVanh1vi4ficpA4TsIiqNrSql4bzjWu2E81g1NUhi71Z7D9qfhIYuvNk3SFCpGuvA-KlOAXBSKj5MAKuDaE9o3p3YGKHHJNbFTtF-ILWJtC4m4g1k8xKfHznj1lYiIyg",
    genres: ["Fiction", "Fantasy", "Contemporary", "Philosophical"],
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices...",
    averageRating: 4.8,
    totalRatings: 1240,
    published: "2020",
    pages: 320,
    language: "English"
  });

  const [reviews, setReviews] = useState([
    {
      _id: "1",
      user: { name: "BookLover99", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY9gOywbhZ9zAFJkZ0jjBHXY7SJupJCjsXPd-oN1PGOkhY7U15y2mGA0u0rI_xjqutnh6ZvzcaI8Y125o7MfujKxHeujZO8fReLIsVjHTvTU3uQu4zLzlykYDbICpftzMjbrz-nbQmDHL5tsd9QbXDIniVSeGCBy5r0H62aCiGsjSznf44-pW5UiTOgMKtWSK_QA0LSHQkXrmD4xFdMXiZMHPhTV5Ee4EojctR1amWrwEjtUPNL18J7LnlSYfP5x-q9WQqYemvXQ" },
      rating: 5,
      comment: "A beautiful story about regret and the choices we make. It really made me think about my own life. Highly recommend!",
      date: "2 days ago"
    },
    {
      _id: "2",
      user: { name: "ReaderTom", avatar: null },
      rating: 4,
      comment: "Couldn't put it down. The concept is fascinating, though the middle part felt a bit slow. Still a solid read.",
      date: "1 week ago"
    }
  ]);

  const [selectedShelf, setSelectedShelf] = useState(null);
  const [showShelfMenu, setShowShelfMenu] = useState(false);

  const shelfOptions = [
    { name: "Want to Read", icon: BookOpen, color: "text-orange-500" },
    { name: "Currently Reading", icon: MessageCircle, color: "text-blue-500" },
    { name: "Read", icon: Star, color: "text-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f6] to-[#ede8e0] dark:from-[#221910] dark:to-[#2c2219]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#221910]/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-slate-900 dark:text-white" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors">
              <Bookmark size={24} className="text-slate-900 dark:text-white" />
            </button>
            <button className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors">
              <Share2 size={24} className="text-slate-900 dark:text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Book Cover */}
      <div className="relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 h-96 bg-cover bg-center blur-xl opacity-30 dark:opacity-20"
          style={{ backgroundImage: `url(${book.coverImage})` }}
        ></div>
        <div className="absolute inset-0 h-96 bg-gradient-to-b from-transparent via-white/50 dark:via-[#221910]/70 to-white dark:to-[#221910]"></div>

        {/* Book Cover */}
        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-8 flex justify-center">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ec7f13] to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src={book.coverImage}
              alt={book.title}
              className="relative w-48 sm:w-56 md:w-64 rounded-2xl shadow-2xl object-cover aspect-[2/3]"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        {/* Title & Author Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            {book.title}
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 mb-4">
            by <span className="font-semibold">{book.author}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex text-[#ec7f13]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(book.averageRating) ? "fill-[#ec7f13]" : i < book.averageRating ? "fill-[#ec7f13]" : ""}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{book.averageRating}</span>
            </div>
            <span className="text-stone-500 dark:text-stone-400 text-sm">
              ({book.totalRatings.toLocaleString()} ratings)
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {book.genres.map((genre) => (
              <span
                key={genre}
                className="px-4 py-2 bg-stone-100 dark:bg-white/10 rounded-full text-sm font-medium text-slate-900 dark:text-white border border-stone-200 dark:border-white/10"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="relative">
            <button
              onClick={() => setShowShelfMenu(!showShelfMenu)}
              className="w-full bg-[#ec7f13] hover:bg-[#d66e0a] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#ec7f13]/30 flex items-center justify-center gap-2 group"
            >
              <BookOpen size={20} />
              <span>Add to Shelf</span>
            </button>

            {/* Dropdown Menu */}
            {showShelfMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#2c2219] rounded-xl shadow-xl border border-stone-200 dark:border-white/10 overflow-hidden z-50">
                {shelfOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => {
                      setSelectedShelf(option.name);
                      setShowShelfMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-left font-semibold transition-colors flex items-center gap-3 ${
                      selectedShelf === option.name
                        ? "bg-[#ec7f13]/10 text-[#ec7f13]"
                        : "text-slate-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <option.icon size={18} className={option.color} />
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <MessageCircle size={20} />
            <span>Write Review</span>
          </button>
        </div>

        {/* Book Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-[#2c2219] p-4 rounded-xl border border-stone-200 dark:border-white/5">
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">Published</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{book.published}</p>
          </div>
          <div className="bg-white dark:bg-[#2c2219] p-4 rounded-xl border border-stone-200 dark:border-white/5">
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">Pages</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{book.pages}</p>
          </div>
          <div className="bg-white dark:bg-[#2c2219] p-4 rounded-xl border border-stone-200 dark:border-white/5">
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">Language</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{book.language}</p>
          </div>
          <div className="bg-white dark:bg-[#2c2219] p-4 rounded-xl border border-stone-200 dark:border-white/5">
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">Readers</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{(book.totalRatings / 100).toFixed(0)}K</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-[#2c2219] p-6 md:p-8 rounded-2xl border border-stone-200 dark:border-white/5 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Synopsis</h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-lg">
            {book.description}
            <button className="ml-2 text-[#ec7f13] font-bold hover:underline">Read more</button>
          </p>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-200 dark:border-white/5 pb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reviews</h2>
              <p className="text-stone-500 dark:text-stone-400">{reviews.length} reader reviews</p>
            </div>
            <button className="mt-4 md:mt-0 text-[#ec7f13] font-bold hover:underline flex items-center gap-1">
              View all {book.totalRatings.toLocaleString()} reviews
              <ArrowLeft size={16} className="rotate-180" />
            </button>
          </div>

          {/* Review Cards */}
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-[#2c2219] p-6 rounded-xl border border-stone-200 dark:border-white/5 hover:border-[#ec7f13]/30 transition-all"
              >
                {/* Reviewer Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {review.user.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ec7f13] to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                        {review.user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{review.user.name}</p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex text-[#ec7f13]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-[#ec7f13]" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>

          {/* Load More */}
          <button className="w-full py-4 text-[#ec7f13] font-bold hover:bg-[#ec7f13]/5 rounded-lg transition-colors">
            View all {book.totalRatings.toLocaleString()} reviews
          </button>
        </div>
      </main>
    </div>
  );
}