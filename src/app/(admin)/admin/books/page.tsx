import type { Metadata } from 'next';
import { ManageBooksClient } from './Component/ManageBooksClient';

export const metadata: Metadata = {
  title: 'Manage Books - BookWorm Admin',
  description: 'Manage and organize your book collection',
};

export default function ManageBooksPage() {
  return <ManageBooksClient />;
}