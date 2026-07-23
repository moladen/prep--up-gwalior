"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useToast } from "@/context/ToastContext";
import BrandMark from "@/components/ui/BrandMark";

export default function StudentLoginPage() {
  const { student, loading, login } = useStudentAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only redirect if already logged in (not mid-submit — login() handles that)
    if (!loading && student && !submitting) {
      router.replace("/student/dashboard");
    }
  }, [student, loading, router, submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(identifier, password);
      showToast("Welcome back!", "success");
      void remember;
      // login() does a full page assign — keep submitting true
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
      setSubmitting(false);
    }
  };

  if (!loading && student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
        <div className="border-b border-border bg-brand-primary-light/40 px-6 py-5 text-center">
          <BrandMark className="mx-auto h-14 w-14" />
          <p className="mt-3 text-sm font-bold text-brand-primary">Prep Up Gwalior</p>
          <h1 className="mt-1 text-2xl font-extrabold text-primary-dark">Welcome Back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to your student portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email / Mobile</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="input-premium"
              placeholder="email@example.com or mobile"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-premium pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <Link href="/student/forgot-password" className="font-medium text-brand-primary hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-achiever-cta w-full justify-center disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
