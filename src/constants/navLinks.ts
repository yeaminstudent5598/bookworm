import { 
  LayoutDashboard, BookOpen, Library, Video, 
  Settings, Users, MessageSquare, BookPlus 
} from 'lucide-react';

export const USER_LINKS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Library', href: '/my-library', icon: Library },
  { name: 'Browse Books', href: '/books', icon: BookOpen },
  { name: 'Tutorials', href: '/tutorials', icon: Video },
];

export const ADMIN_LINKS = [
  { name: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Manage Books', href: '/admin/books', icon: BookPlus },
  { name: 'Manage Genres', href: '/admin/genres', icon: Settings },
  { name: 'Moderate Reviews', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Manage Tutorials', href: '/admin/tutorials', icon: Video },
];