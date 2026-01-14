import { NextResponse } from 'next/server';
import { Book } from '@/modules/book/book.model';
import { Shelf } from '@/modules/shelf/shelf.model';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const decoded = verifyToken(token!);
    const userId = (decoded as any).id;

    const shelfData = await Shelf.find({ user: userId });
    const readBooks = shelfData.filter(s => s.status === 'Read').length;
    
    const genreStats = await Shelf.aggregate([
      { $match: { user: userId, status: 'Read' } },
      { $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'bookInfo' } },
      { $unwind: '$bookInfo' },
      { $group: { _id: '$bookInfo.genre', count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        challenge: { current: readBooks, goal: 50 },
        stats: {
          streak: 14, 
          totalPages: readBooks * 250, 
          readingTime: "45h 20m"
        },
        genreData: genreStats.map(g => ({ name: g._id, value: g.count }))
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}