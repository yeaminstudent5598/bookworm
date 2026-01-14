import React from 'react';
import type { Metadata } from 'next';
import { AddBookForm } from './Component/AddBookForm';

export const metadata: Metadata = {
  title: 'Add New Book - BookWorm Admin',
  description: 'Add a new book to the library collection',
};

// Server-side data fetching for genres
async function getGenres() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/genres`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!res.ok) {
      throw new Error('Failed to fetch genres');
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return [];
  }
}

export default async function AddBookPage() {
  const genres = await getGenres();

  return <AddBookForm genres={genres} />;
}