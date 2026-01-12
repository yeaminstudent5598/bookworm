"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login"); // Login na thakle Login-e pathao
    } else {
      // Role onujayi specific page-e pathiye dao
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/my-library");
      }
    }
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#fdfaf1]">
      <div className="animate-bounce font-serif text-2xl text-[#5c4033]">
        Opening your Library...
      </div>
    </div>
  );
}