"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "rgb(var(--bg-primary))" }}
      >
        <div className="card max-w-md w-full text-center">
          <div className="mb-6">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--accent-success)) 0%, #22c55e 100%)",
              }}
            >
              <CheckCircle size={40} className="text-white" />
            </div>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold font-display mb-4"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Check Your Email
          </h1>

          <p
            className="text-sm sm:text-base mb-2"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            If an account exists for <strong>{email}</strong>, we've sent a
            password reset link.
          </p>

          <p
            className="text-sm mb-6"
            style={{ color: "rgb(var(--text-tertiary))" }}
          >
            Check your inbox and click the link to reset your password. The link
            will expire in 1 hour.
          </p>

          <div
            className="p-4 rounded-xl mb-6"
            style={{
              backgroundColor: "rgba(var(--accent-warning), 0.1)",
              border: "1px solid rgb(var(--accent-warning))",
            }}
          >
            <p
              className="text-sm"
              style={{ color: "rgb(var(--text-secondary))" }}
            >
              <strong style={{ color: "rgb(var(--accent-warning))" }}>
                Didn't receive it?
              </strong>{" "}
              Check your spam folder or try again in a few minutes.
            </p>
          </div>

          <Link
            href="/auth/signin"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "rgb(var(--bg-primary))" }}
    >
      <div className="card max-w-md w-full">
        {/* Header with Gradient */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgb(var(--accent-primary)) 0%, rgb(var(--accent-secondary, var(--accent-primary))) 100%)",
            }}
          >
            <Mail size={32} className="text-white" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold font-display mb-2"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Forgot Password?
          </h1>
          <p
            className="text-sm sm:text-base"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {error && (
          <div
            className="p-4 rounded-xl mb-6 flex items-start gap-3"
            style={{
              backgroundColor: "rgba(var(--accent-error), 0.1)",
              border: "2px solid rgb(var(--accent-error))",
            }}
          >
            <span className="text-xl">⚠️</span>
            <span
              className="text-sm"
              style={{ color: "rgb(var(--accent-error))" }}
            >
              {error}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              <Mail size={18} style={{ color: "rgb(var(--accent-primary))" }} />
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3.5 rounded-xl font-medium transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: "rgb(var(--bg-tertiary))",
                border: "2px solid rgb(var(--border-secondary))",
                color: "rgb(var(--text-primary))",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "rgb(var(--accent-primary))";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(var(--accent-primary), 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  "rgb(var(--border-secondary))";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
            style={{
              backgroundColor: "rgb(var(--accent-primary))",
              color: "white",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sending Reset Link...
              </>
            ) : (
              <>
                <Mail size={20} />
                Send Reset Link
              </>
            )}
          </button>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline transition-colors duration-300"
              style={{ color: "rgb(var(--accent-primary))" }}
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
