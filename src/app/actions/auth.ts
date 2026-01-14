"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function loginAction(userData: { accessToken: string; role: string }) {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", userData.accessToken, {
    path: "/",
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, 
  });

  cookieStore.set("role", userData.role, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (userData.role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/my-library");
  }
}


export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("role");

  redirect("/login");
}