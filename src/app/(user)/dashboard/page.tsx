// app/(user)/dashboard/page.tsx
import { ReactNode } from 'react';
import DashboardClient from './dashboard-client';

interface Props {
  params: Promise<{}>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Metadata for SEO
export const metadata = {
  title: 'Dashboard | BookWorm',
  description: 'Track your reading journey with personalized stats, challenges, and recommendations'
};


export default async function DashboardPage() {

  return (
    <DashboardClient />
  );
}