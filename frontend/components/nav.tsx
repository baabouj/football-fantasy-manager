"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();

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
      </div>
    </nav>
  );
}
