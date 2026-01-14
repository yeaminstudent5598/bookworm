import React from 'react';
import type { Metadata } from 'next';
import { DashboardClient } from './component/adminDashboardClient/DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard - BookWorm Admin',
  description: 'Admin dashboard for managing books, users, and analytics',
};

// Server Component - No API calls here, just rendering
export default function AdminDashboardPage() {
  return <DashboardClient />;
}