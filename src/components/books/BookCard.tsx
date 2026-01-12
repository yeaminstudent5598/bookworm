import Link from 'next/link';
import { Star } from 'lucide-react';

interface BookProps {
  book: {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
    averageRating: number;
    genre: { name: string };
  };
}

export default function BookCard({ book }: BookProps) {
  return (
    <div className="bg-[#fdfaf1] border border-[#e5d9c1] rounded-xl overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={book.coverImage || "https://via.placeholder.com/150"} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold">{book.averageRating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <span className="text-[10px] uppercase tracking-widest text-[#8b5e3c] font-bold">{book.genre.name}</span>
        <h3 className="text-lg font-serif font-bold text-[#5c4033] line-clamp-1">{book.title}</h3>
        <p className="text-sm text-[#8b5e3c] mb-4">{book.author}</p>
        
        <Link 
          href={`/books/${book._id}`}
          className="block text-center bg-[#5c4033] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#3e2b22] transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}