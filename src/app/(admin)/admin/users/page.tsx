import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import UserManagementClient from './components/UserManagementClient';

export const metadata: Metadata = {
  title: 'Community Control - Admin Portal',
};

async function getInitialUsers() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bookworm-xi-blond.vercel.app';
    
    const res = await fetch(`${baseUrl}/api/v1/admin/users`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("User Fetch Error:", error);
    return [];
  }
}

export default async function ManageUsersPage() {
  const initialUsers = await getInitialUsers();

  return (
    <div className="min-h-screen bg-[#0d0a07] p-4 sm:p-10">
      <UserManagementClient initialUsers={initialUsers} />
    </div>
  );
}