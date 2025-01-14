import { Nav } from "@/components/nav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="container mx-auto">{children}</main>
    </>
  );
}
