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
    <div className="flex min-h-screen bg-[#0d0a07] text-white selection:bg-[#22c55e]/30">
      
      {/* ১. সাইডবার - এটি ডেস্কটপে ফিক্সড থাকবে এবং মোবাইলে টগল হবে */}
      <AdminSidebar />

      {/* ২. মেইন কন্টেন্ট এরিয়া */}
      {/* lg:ml-64 এবং xl:ml-72 আপনার সাইডবারের উইডথের সাথে সিংক্রোনাইজ করা হয়েছে */}
      <div className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out lg:ml-64 xl:ml-72">
        
        {/* অ্যাডমিন হেডার - এটি টপ বার হিসেবে কাজ করবে */}
        <AdminHeader />

        {/* ৩. পেজ কন্টেন্ট - রেসপন্সিভ প্যাডিং সহ */}
        <main className="flex-1 w-full overflow-x-hidden">
          {/* - pt-4: মোবাইলে হেডারের নিচে জায়গা রাখার জন্য।
            - lg:pt-8: ডেস্কটপে সুন্দর স্পেসিং।
            - max-w-[1600px]: খুব বড় মনিটরে কন্টেন্ট যেন বেশি ছড়িয়ে না যায়।
          */}
          <div className="p-4 sm:p-6 lg:p-10 xl:p-12 2xl:p-14 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>

        {/* ঐচ্ছিক: ছোট ফুটার বা কপিরাইট টেক্সট (যদি লাগে) */}
        <footer className="px-6 py-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            © 2026 BookWorm System • Secure Admin Portal
          </p>
        </footer>
      </div>
    </div>
  );
}