// src/app/(user)/tutorials/page.tsx
import TutorialsClient from './TutorialsClient';

export const metadata = {
  title: 'Tutorials - BookWorm',
  description: 'Explore our collection of book-related video guides and tutorials.',
};

export default function TutorialsPage() {
  return <TutorialsClient />;
}