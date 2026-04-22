"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    const callbackUrl = urlParams.get("callbackUrl");

    if (errorParam === "CredentialsSignin") {
      setMessage("Please sign in to continue");
    }
    if (callbackUrl) {
      setMessage("Please sign in to access that page");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result && !result.success) {
      if (result.errors) {
        setErrors(result.errors);
      }
      if (result.message) {
        setMessage(result.message);
        toast.error(result.message);
      }
      setLoading(false);
    }
    // If success, router will redirect
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Sign in to your account to continue
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                error={errors.password?.[0]}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-500">Don't have an account? </span>
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Sign up
          </Link>
        </div>

        <div className="mt-8 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
          <p className="text-xs text-zinc-500">
            <strong>Demo credentials:</strong>
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Email: demo@worknest.app | Password: demo1234
          </p>
        </div>
      </div>
    </div>
  );
}