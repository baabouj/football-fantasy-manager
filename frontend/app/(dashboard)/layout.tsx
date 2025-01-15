import { Nav } from "@/components/nav";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="container mx-auto">{children}</main>
      <Toaster />
    </>
  );
}
