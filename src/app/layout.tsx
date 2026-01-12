"use client";
import { usePathname } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import './globals.css';
import { useEffect, useState } from 'react';
import Footer from '@/components/shared/footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<'admin' | 'user' | null>(null);

  // Login ba Register page hole amra Sidebar/Navbar/Footer dekhabo na
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const savedRole = localStorage.getItem("role") as 'admin' | 'user';
    setRole(savedRole || 'user');
  }, [pathname]);

  return (
    <html lang="en">
      <body className="bg-[#fffefc] font-sans">
        {isAuthPage ? (
          <div className="min-h-screen">{children}</div>
        ) : (
          <div className="flex min-h-screen">
            {/* 1. Sidebar Left-e */}
            <Sidebar role={role || 'user'} />

            {/* 2. Main Content Area Right-e */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto">
                  {children} 
                </div>
              </main>
              {/* 3. Footer Bottom-e */}
              <Footer />
            </div>
          </div>
        )}
      </body>
    </html>
  );
}