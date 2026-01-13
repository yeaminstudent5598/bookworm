import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    redirect("/login");
  }

  if (decoded.role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/my-library");
  }

  return null; 
}