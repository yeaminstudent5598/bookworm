import { NextResponse } from 'next/server';
import { DashboardService } from './dashboard.service';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/jwt';

const getDashboardStats = async (req: Request) => {
  try {
    await dbConnect();
    
    // টোকেন চেক
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) throw new Error("Unauthorized! Token missing.");

    const decoded = verifyToken(token);
    if (!decoded) throw new Error("Invalid session. Please login again.");

    // ডাটা ফেচ
    const result = await DashboardService.getUserDashboardStatsFromDB(decoded.id);
    
    return NextResponse.json({
      success: true,
      message: "Dashboard data synced successfully!",
      data: result
    });
  } catch (err: any) {
    console.error("🚩 Backend Dashboard Error:", err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const DashboardController = { getDashboardStats };