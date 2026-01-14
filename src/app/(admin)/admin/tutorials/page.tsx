import React from 'react';
import { cookies } from 'next/headers';
import TutorialManagementClient from './Component/TutorialManagementClient';

async function getTutorials() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bookworm-xi-blond.vercel.app';

    const res = await fetch(`${baseUrl}/api/v1/admin/tutorials`, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch tutorials');

    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error: any) {
    console.error('❌ Server Fetch Error:', error.message);
    return [];
  }
}

export default async function TutorialManagementPage() {
  const initialTutorials = await getTutorials();

  return (
    <div className="p-4 sm:p-8">
      <TutorialManagementClient initialTutorials={initialTutorials} />
    </div>
  );
}