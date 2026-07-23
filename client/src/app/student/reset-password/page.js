"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { studentApi } from "@/lib/api";
import BrandMark from "@/components/ui/BrandMark";
import { useToast } from "@/context/ToastContext";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await studentApi.resetPassword({ token, newPassword: password });
      showToast("Password reset successfully", "success");
      router.replace("/student/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        Invalid reset link.{" "}
        <Link href="/student/forgot-password" className="font-semibold underline">
          Request a new one
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <div>
        <label className="mb-1.5 block text-sm font-medium">New Password</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-premium pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Confirm Password
        </label>
        <input
          type={show ? "text" : "password"}
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input-premium"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Reset Password
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
        <div className="border-b border-border bg-brand-primary-light/40 px-6 py-5 text-center">
          <BrandMark className="mx-auto h-14 w-14" />
          <h1 className="mt-3 text-2xl font-extrabold text-primary-dark">
            Reset Password
          </h1>
          <p className="mt-1 text-sm text-muted">Choose a new secure password</p>
        </div>
        <div className="p-6">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
              </div>
            }
          >
            <ResetForm />
          </Suspense>
          <p className="mt-4 text-center text-sm text-muted">
            <Link href="/student/login" className="font-semibold text-brand-primary">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
