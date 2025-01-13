"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ email: "", password: "" });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch(`http://localhost:4000/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const body = await res.json();

    if (res.ok) {
      console.log("You have successfully logged in!!");

      // TODO: navigate to the team page
      setIsLoading(false);
      return;
    }

    if (body.errors) {
      // Input validation failed
      setErrors({
        email:
          body.errors.find((err: { input: string }) => err.input === "email")
            ?.error ?? "",
        password:
          body.errors.find((err: { input: string }) => err.input === "password")
            ?.error ?? "",
      });
    } else {
      // wrong password

      setErrors({ email: "", password: body.message });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Login / Register</h1>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-500">
              {errors.password}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
