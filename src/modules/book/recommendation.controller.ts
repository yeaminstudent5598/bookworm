import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/jwt';
import { getRecommendations } from './recommendation.service';

const getPersonalizedRecommendations = async (req: Request) => {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    let userId = "";

    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded && typeof decoded !== 'string') {
          userId = decoded.id; 
        }
      } catch (tokenError) {
        console.error("Token verification failed, defaulting to popular books.");
      }
    }

    const result = await getRecommendations(userId);

    return NextResponse.json({
      success: true,
      message: "Personalized recommendations fetched successfully!",
      data: result
    });

  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      message: err.message || "Internal Server Error" 
    }, { status: 400 });
  }
};

export const RecommendationController = { getPersonalizedRecommendations };