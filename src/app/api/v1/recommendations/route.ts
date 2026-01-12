import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { RecommendationService } from '@/modules/book/recommendation.service';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  
  const result = await RecommendationService.getRecommendations(userId!);
  return NextResponse.json({ success: true, data: result });
}