// src/app/(user)/layout.tsx
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* শুধুমাত্র ইউজার পেজগুলোর জন্য এখানে Navbar থাকবে */}
      <Navbar /> 
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}