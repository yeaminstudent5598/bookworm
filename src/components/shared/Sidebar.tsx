"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { USER_LINKS, ADMIN_LINKS } from '@/constants/navLinks';
import { cn } from '@/lib/utils';

export default function Sidebar({ role }: { role: 'admin' | 'user' }) {
  const pathname = usePathname();
  const links = role === 'admin' ? ADMIN_LINKS : USER_LINKS;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#fdfaf1] border-r border-[#e5d9c1] h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-serif font-bold text-[#5c4033]">BookWorm</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
              pathname === link.href 
                ? "bg-[#5c4033] text-white shadow-md" 
                : "text-[#8b5e3c] hover:bg-[#f5ebd8]"
            )}
          >
            <link.icon size={20} />
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}