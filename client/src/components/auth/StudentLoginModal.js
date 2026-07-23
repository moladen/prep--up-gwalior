"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useToast } from "@/context/ToastContext";
import BrandMark from "@/components/ui/BrandMark";

export default function StudentLoginModal() {
  const { loginOpen, closeLogin, login, student } = useStudentAuth();
  const { showToast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (student && loginOpen) closeLogin();
  }, [student, loginOpen, closeLogin]);

  useEffect(() => {
    if (!loginOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLogin();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loginOpen, closeLogin]);

  if (!loginOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(identifier, password);
      showToast("Welcome back!", "success");
      if (!remember) {
        /* session cookie still applies; remember is UX preference */
      }
    } catch (err) {
      setError(err.message || "Login failed");
      showToast(err.message || "Login failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--brand-navy)]/55 backdrop-blur-sm"
        aria-label="Close login"
        onClick={closeLogin}
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10" />
            <div>
              <p className="text-sm font-bold text-brand-primary">Prep Up Gwalior</p>
              <p className="text-xs text-muted">Student Login</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLogin}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-extrabold text-primary-dark">Welcome Back</h2>
            <p className="mt-1 text-sm text-muted">
              Sign in with your email or mobile number.
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-dark">
              Email / Mobile Number
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-xl border border-[#ead9d0] bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              placeholder="email@example.com or 9876543210"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-dark">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#ead9d0] bg-white px-4 py-3 pr-11 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              Remember me
            </label>
            <Link
              href="/contact"
              onClick={closeLogin}
              className="font-medium text-brand-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary !mt-2 w-full justify-center disabled:opacity-60"
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

          <p className="text-center text-sm text-muted">
            New student? Contact the institute to get your account.
          </p>
        </form>
      </div>
    </div>
  );
}
