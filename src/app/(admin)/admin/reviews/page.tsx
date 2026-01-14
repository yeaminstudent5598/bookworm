import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import ReviewModerationClient from './ReviewModerationClient';

export const metadata: Metadata = {
  title: 'Review Moderation - Admin',
};

async function getInitialReviews() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('accessToken')?.value;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bookworm-xi-blond.vercel.app';
    
    const res = await fetch(`${baseUrl}/api/v1/admin/reviews?status=pending`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export default async function ReviewModerationPage() {
  const initialReviews = await getInitialReviews();

  return (
    <div className="p-4 sm:p-8">
      <ReviewModerationClient initialReviews={initialReviews} />
    </div>
  );
}