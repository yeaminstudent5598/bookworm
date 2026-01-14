import { NextResponse } from 'next/server';
import { DashboardService } from './dashboard.service';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/jwt';

const getDashboardStats = async (req: Request) => {
  try {
    await dbConnect();
    
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized! Login required." }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ success: false, message: "Invalid session. Please login again." }, { status: 401 });
    }

    const result = await DashboardService.getUserDashboardStatsFromDB(decoded.id);
    
    return NextResponse.json({
      success: true,
      message: "Dashboard stats synced successfully!",
      data: result
    });

  } catch (err: any) {
    console.error("🚩 Dashboard Controller Error:", err.message);
    return NextResponse.json({ 
      success: false, 
      message: err.message || "Failed to fetch dashboard data" 
    }, { status: 400 });
  }
};

export const DashboardController = { getDashboardStats };