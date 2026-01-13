import { NextResponse } from 'next/server';
import { RecommendationService } from './recommendation.service';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/jwt';

const getPersonalizedRecommendations = async (req: Request) => {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    let userId = "";
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) userId = decoded.id;
    }

    const result = await RecommendationService.getRecommendations(userId);

    return NextResponse.json({
      success: true,
      message: "Recommendations fetched successfully!",
      data: result
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const RecommendationController = { getPersonalizedRecommendations };