"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { studentApi } from "@/lib/api";
import BrandMark from "@/components/ui/BrandMark";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const data = await studentApi.forgotPassword({ identifier });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
        <div className="border-b border-border bg-brand-primary-light/40 px-6 py-5 text-center">
          <BrandMark className="mx-auto h-14 w-14" />
          <h1 className="mt-3 text-2xl font-extrabold text-primary-dark">
            Forgot Password
          </h1>
          <p className="mt-1 text-sm text-muted">
            Enter your registered email or mobile
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {result ? (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <p>{result.message}</p>
              {result.resetUrl ? (
                <p className="mt-2 break-all">
                  Reset link:{" "}
                  <Link
                    href={result.resetUrl.replace(/^https?:\/\/[^/]+/, "")}
                    className="font-semibold text-brand-primary underline"
                  >
                    Open reset page
                  </Link>
                </p>
              ) : null}
              <p className="mt-2 text-xs text-emerald-700">
                In production, this link will be emailed. For now, use the link
                above or contact the institute.
              </p>
            </div>
          ) : null}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Email / Mobile
            </label>
            <input
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="input-premium"
              placeholder="email@example.com or mobile"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Get Reset Link
          </button>
          <p className="text-center text-sm text-muted">
            <Link href="/student/login" className="font-semibold text-brand-primary">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
