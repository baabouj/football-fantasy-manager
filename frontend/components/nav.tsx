"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useUsersStore } from "@/data/user";
import { axios } from "@/lib/axios";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const { setUser } = useUsersStore();

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(undefined);
      router.push("/");
    } catch {
      setUser(undefined);
      router.push("/");
    }
  };

  return (
    <nav className="flex justify-between items-center p-4">
      <Link href="/" className="text-xl font-bold">
        Football Fantasy Manager
      </Link>
      <div className="space-x-4">
        <Link
          href="/team"
          className={cn(
            "hover:underline",
            pathname === "/team" && "font-bold underline"
          )}
        >
          Team
        </Link>
        <Link
          href="/transfer"
          className={cn(
            "hover:underline",
            pathname === "/transfer" && "font-bold underline"
          )}
        >
          Transfer Market
        </Link>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
