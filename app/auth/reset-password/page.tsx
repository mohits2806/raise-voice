"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const getPasswordStrength = () => {
    if (!password) return { text: "", color: "", width: "0%" };
    if (password.length < 6)
      return { text: "Too short", color: "#ef4444", width: "25%" };
    if (password.length < 8)
      return { text: "Weak", color: "#f97316", width: "50%" };
    if (password.length < 12)
      return { text: "Good", color: "#eab308", width: "75%" };
    return { text: "Strong", color: "#22c55e", width: "100%" };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/signin"), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
            Password Reset Successful!
          </h1>

          <p
            className="text-sm sm:text-base mb-6"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            Your password has been updated. Redirecting you to sign in...
          </p>

          <div className="flex items-center justify-center gap-2">
            <Loader2
              className="animate-spin"
              size={20}
              style={{ color: "rgb(var(--accent-primary))" }}
            />
            <span
              className="text-sm"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              Redirecting...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "rgb(var(--bg-primary))" }}
      >
        <div className="card max-w-md w-full text-center">
          <div className="mb-6">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(var(--accent-error), 0.2)" }}
            >
              <AlertTriangle
                size={40}
                style={{ color: "rgb(var(--accent-error))" }}
              />
            </div>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold font-display mb-4"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Invalid Reset Link
          </h1>

          <p
            className="text-sm sm:text-base mb-6"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            {error || "This password reset link is invalid or has expired."}
          </p>

          <Link
            href="/auth/forgot-password"
            className="btn-primary inline-block"
          >
            Request New Reset Link
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
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgb(var(--accent-primary)) 0%, rgb(var(--accent-secondary, var(--accent-primary))) 100%)",
            }}
          >
            <Lock size={32} className="text-white" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold font-display mb-2"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Reset Your Password
          </h1>
          <p
            className="text-sm sm:text-base"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            Enter your new password below
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
          {/* New Password */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              <Lock size={18} style={{ color: "rgb(var(--accent-primary))" }} />
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                className="w-full px-4 py-3.5 pr-12 rounded-xl font-medium transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: "rgb(var(--bg-tertiary))",
                  border: "2px solid rgb(var(--border-secondary))",
                  color: "rgb(var(--text-primary))",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors duration-300"
                style={{ color: "rgb(var(--text-tertiary))" }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs"
                    style={{ color: "rgb(var(--text-tertiary))" }}
                  >
                    Password strength:
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.text}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgb(var(--bg-secondary))" }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: passwordStrength.width,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              <Lock size={18} style={{ color: "rgb(var(--accent-primary))" }} />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full px-4 py-3.5 pr-12 rounded-xl font-medium transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: "rgb(var(--bg-tertiary))",
                  border: "2px solid rgb(var(--border-secondary))",
                  color: "rgb(var(--text-primary))",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors duration-300"
                style={{ color: "rgb(var(--text-tertiary))" }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p
                className="mt-2 text-xs"
                style={{ color: "rgb(var(--accent-error))" }}
              >
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword
            }
            className="w-full px-6 py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
            style={{
              backgroundColor: "rgb(var(--accent-primary))",
              color: "white",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Resetting Password...
              </>
            ) : (
              <>
                <Lock size={20} />
                Reset Password
              </>
            )}
          </button>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-sm font-medium hover:underline transition-colors duration-300"
              style={{ color: "rgb(var(--accent-primary))" }}
            >
              Remember your password? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "rgb(var(--bg-primary))" }}
        >
          <Loader2
            className="animate-spin"
            size={40}
            style={{ color: "rgb(var(--accent-primary))" }}
          />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
