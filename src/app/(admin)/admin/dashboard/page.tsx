import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { DashboardClient } from './component/adminDashboardClient/DashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | BookWorm',
  description: 'Overview of library performance and community growth.',
};

async function getDashboardData() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // ১. স্ট্যাটাস এবং অ্যাক্টিভিটি ফেচ
    const statsRes = await fetch(`${baseUrl}/api/v1/admin/stats`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` }
    });

    // ২. ইউজার গ্রোথ ফেচ
    const growthRes = await fetch(`${baseUrl}/api/v1/admin/user-growth`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` }
    });

    const statsData = await statsRes.json();
    const growthData = await growthRes.json();

    return {
      stats: statsData.success ? statsData.data : null,
      growth: growthData.success ? growthData.data : [],
    };
  } catch (error) {
    console.error("Dashboard SSR Error:", error);
    return { stats: null, growth: [] };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-[#0d0a07] p-4 sm:p-8 lg:p-12">
      <DashboardClient initialData={data.stats} initialGrowth={data.growth} />
    </div>
  );
}