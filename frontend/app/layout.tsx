"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";

import { useUsersStore } from "@/data/user";

import { axios } from "@/lib/axios";
import { type User } from "@/lib/types";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setUser } = useUsersStore();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Hello");
    if (!user) return;

    async function fetchUser() {
      try {
        const { data } = await axios.get<User>("/auth/me");

        setUser(data);
        if (pathname === "/") router.push("/team");
      } catch {
        if (pathname !== "/") router.push("/");
      }
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
