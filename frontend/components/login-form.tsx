"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useUsersStore } from "@/data/user";

import { axios } from "@/lib/axios";
import { type User } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();

  const { setUser } = useUsersStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ email: "", password: "" });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post<User>(`/auth/login`, {
        email,
        password,
      });
      setUser(data);

      router.push("/team");
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        if (data?.errors) {
          // Input validation failed
          setErrors({
            email:
              data.errors.find(
                (err: { input: string }) => err.input === "email"
              )?.error ?? "",
            password:
              data.errors.find(
                (err: { input: string }) => err.input === "password"
              )?.error ?? "",
          });
        } else {
          // wrong password

          setErrors({ email: "", password: data?.message });
        }
      } else {
        setErrors({ email: "", password: "An unexpected error occurred" });
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
}
