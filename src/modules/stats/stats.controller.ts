import { NextResponse } from 'next/server';
import { StatsService } from './stats.service';
import dbConnect from '@/lib/dbConnect';

const getAdminStats = async () => {
  try {
    await dbConnect();
    const result = await StatsService.getAdminStatsFromDB();
    
    return NextResponse.json({
      success: true,
      message: "Dashboard stats fetched successfully!",
      data: result
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to fetch dashboard stats"
    }, { status: 400 });
  }
};

export const StatsController = { getAdminStats };