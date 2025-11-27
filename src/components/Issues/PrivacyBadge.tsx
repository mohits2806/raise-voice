"use client";

interface PrivacyBadgeProps {
  isAnonymous: boolean;
  size?: "sm" | "md" | "lg";
}

export default function PrivacyBadge({
  isAnonymous,
  size = "md",
}: PrivacyBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  if (isAnonymous) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
        style={{
          backgroundColor: "rgba(var(--accent-primary), 0.1)",
          color: "rgb(var(--accent-primary))",
          border: "1px solid rgb(var(--accent-primary))",
        }}
      >
        🔒 Anonymous
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: "rgba(var(--text-tertiary), 0.1)",
        color: "rgb(var(--text-secondary))",
        border: "1px solid rgba(var(--text-tertiary), 0.3)",
      }}
    >
      👤 Public
    </span>
  );
}
