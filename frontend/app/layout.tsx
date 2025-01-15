import type { Metadata } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";

import { Nav } from "@/components/nav";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Football Fantasy Manager",
  description: "Manage your fantasy football team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="flex flex-col min-h-screen bg-background">
          <Nav />
          <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
          <footer className="text-center p-4 text-sm text-muted-foreground">
            © {new Date().getFullYear()} Football Fantasy Manager. All rights
            reserved.
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
