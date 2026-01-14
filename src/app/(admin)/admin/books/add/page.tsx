import React from 'react';
import type { Metadata } from 'next';
import { AddBookForm } from './Component/AddBookForm';

export const metadata: Metadata = {
  title: 'Add New Book - Admin',
};

async function getGenres() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/genres`, { cache: 'no-store' });

    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export default async function AddBookPage() {
  const genres = await getGenres();

  return (
    <div className="p-4 sm:p-8">
      <AddBookForm genres={genres} />
    </div>
  );
}