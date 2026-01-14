// app/(user)/books/page.tsx

import BrowseLibraryClient from "./browser-client";

interface Props {
  params: Promise<{}>;
  searchParams: Promise<{ 
    page?: string;
    search?: string;
    genre?: string;
    rating?: string;
    sort?: string;
  }>;
}

// Metadata for SEO
export const metadata = {
  title: 'Browse Books | BookWorm',
  description: 'Discover and explore thousands of books. Search, filter by genre, rating, and find your next great read.'
};


export default async function BrowseBooksPage({ params, searchParams }: Props) {
  const sp = await searchParams;
  
  return (
    <BrowseLibraryClient 
      initialPage={parseInt(sp.page || '1')}
      initialSearch={sp.search || ''}
      initialGenre={sp.genre || ''}
      initialRating={parseFloat(sp.rating || '1')}
      initialSort={sp.sort || 'Top Rated'}
    />
  );
}