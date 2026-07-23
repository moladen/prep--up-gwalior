"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";
import { openWhatsAppEnquiry } from "@/lib/whatsapp";
import { useContact } from "@/context/ContactContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactForm({
  defaultCourse = "",
  title = "Send Us a Message",
  compact = false,
  onSuccess,
}) {
  const contact = useContact();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: defaultCourse,
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.errors?.join(", ") || data.message || "Submission failed"
        );
      }

      setSubmitted(true);
      openWhatsAppEnquiry(form, contact.phones[0]);
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className={`flex flex-col items-center justify-center text-center ${
          compact ? "p-6" : "premium-card p-10"
        }`}
      >
        <CheckCircle className="mb-4 h-12 w-12 text-green-600" />
        <h3 className="text-xl font-bold text-primary-dark">Thank You!</h3>
        <p className="mt-2 text-muted">
          Your enquiry is saved. WhatsApp is opening — send the message to
          complete your enrollment.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              email: "",
              phone: "",
              course: defaultCourse,
              message: "",
            });
          }}
        >
          Send Another Enquiry
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`h-full ${compact ? "" : "premium-card p-6 sm:p-8"}`}
    >
      {!compact && (
        <h3 className="mb-6 text-xl font-bold text-primary-dark">{title}</h3>
      )}
      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "gap-5 sm:grid-cols-2"}`}>
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="input-premium"
            placeholder="Your name"
            autoComplete="name"
            suppressHydrationWarning
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className="input-premium"
            placeholder="Your phone number"
            autoComplete="tel"
            suppressHydrationWarning
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="input-premium"
            placeholder="your@email.com"
            autoComplete="email"
            suppressHydrationWarning
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="course"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Course Interested In
          </label>
          <input
            id="course"
            name="course"
            type="text"
            value={form.course}
            onChange={handleChange}
            className="input-premium"
            placeholder="e.g. CLAT, CAT, SSC CGL"
            suppressHydrationWarning
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={compact ? 3 : 4}
            value={form.message}
            onChange={handleChange}
            className="input-premium resize-none py-3"
            placeholder="Tell us about your goals..."
            suppressHydrationWarning
          />
        </div>
      </div>
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed"
        suppressHydrationWarning
      >
        {loading ? "Submitting..." : "Submit & Open WhatsApp"}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
