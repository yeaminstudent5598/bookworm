import type { Metadata } from 'next';
import GenreManagementClient from './components/GenreManagementClient';

export const metadata: Metadata = {
  title: 'Manage Genres - BookWorm Admin',
};

async function getGenres() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bookworm-xi-blond.vercel.app';
    const res = await fetch(`${baseUrl}/api/v1/genres`, { cache: 'no-store' });

    if (!res.ok) throw new Error('Failed to fetch genres');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function ManageGenresPage() {
  const genres = await getGenres();

  return (
    <div className="p-4 sm:p-8">
      <GenreManagementClient initialGenres={genres} />
    </div>
  );
}