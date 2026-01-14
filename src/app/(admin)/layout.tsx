import React from 'react';
import type { Metadata } from 'next';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminHeader } from './admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Admin Dashboard - BookWorm',
  description: 'Manage books, users, and content',
};

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410] text-white">
      {/* Sidebar - Client Component */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 xl:ml-72 flex flex-col min-h-screen">
        {/* Header - Client Component */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}