"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClubIcon as Football, LogOutIcon, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

import { useUsersStore } from "@/data/user";
import { useTeamsStore } from "@/data/team";

import { cn } from "@/lib/utils";
import { axios } from "@/lib/axios";
import { type User } from "@/lib/types";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const { setUser } = useUsersStore();
  const { setTeam } = useTeamsStore();

  const isLoginPage = pathname === "/";

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get<User>("/auth/me");

        setUser(data);
        if (isLoginPage) router.push("/team");
      } catch {
        if (!isLoginPage) router.push("/");
      }
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(undefined);
      setTeam(undefined);

      router.push("/");
    } catch {
      router.push("/");
    }
  };

  const NavItems = () => (
    <>
      <Button
        variant="ghost"
        asChild
        className={cn(
          "hover:bg-primary/10",
          pathname === "/team" && "bg-primary/10 font-semibold"
        )}
      >
        <Link href="/team">Team</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={cn(
          "hover:bg-primary/10",
          pathname === "/transfer" && "bg-primary/10 font-semibold"
        )}
      >
        <Link href="/transfer">Transfer Market</Link>
      </Button>
    </>
  );

  return (
    <nav className="sticky flex justify-center items-center top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container w-full flex justify-between items-center h-14">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Football className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Football Fantasy Manager
            </span>
          </Link>
          {!isLoginPage && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <NavItems />
            </nav>
          )}
        </div>
        {!isLoginPage && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-4 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <Football className="mr-2 h-4 w-4" />
                <span className="font-bold">Football Fantasy Manager</span>
              </Link>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  <NavItems />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
        <div className="flex items-center justify-end">
          <nav className="flex gap-2 items-center">
            <ModeToggle />
            {!isLoginPage && (
              <Button variant="ghost" onClick={logout}>
                <LogOutIcon />
              </Button>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
