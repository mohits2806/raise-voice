"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X, MapPin, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { ISSUE_CATEGORIES } from "@/lib/constants";

interface IssueFormProps {
  onClose: () => void;
  selectedLocation: { lat: number; lng: number } | null;
}

export default function IssueForm({
  onClose,
  selectedLocation,
}: IssueFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "water-supply",
    images: [] as string[],
    isAnonymous: true, // Default to anonymous for privacy
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedLocation) {
      setError("Please select a location on the map");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create issue");
      }

      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={onClose}
    >
      <div
        className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 p-6 flex items-center justify-between z-10"
          style={{
            backgroundColor: "rgb(var(--bg-primary))",
            borderBottom: "2px solid rgb(var(--border-primary))",
          }}
        >
          <h2
            className="text-2xl font-bold font-display"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Report an Issue
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: "rgb(var(--bg-secondary))",
              color: "rgb(var(--text-primary))",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div
              className="p-4 rounded-xl text-sm sm:text-base animate-slide-down"
              style={{
                backgroundColor: "rgba(var(--accent-error), 0.1)",
                border: "1px solid rgb(var(--accent-error))",
                color: "rgb(var(--accent-error))",
              }}
            >
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Title *
            </label>
            <input
              type="text"
              required
              minLength={5}
              maxLength={100}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Brief description of the issue"
              className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 outline-none"
              style={{
                backgroundColor: "rgb(var(--bg-tertiary))",
                border: "2px solid rgb(var(--border-primary))",
                color: "rgb(var(--text-primary))",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgb(var(--accent-primary))")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgb(var(--border-primary))")
              }
            />
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 outline-none"
              style={{
                backgroundColor: "rgb(var(--bg-tertiary))",
                border: "2px solid rgb(var(--border-primary))",
                color: "rgb(var(--text-primary))",
              }}
            >
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Description *
            </label>
            <textarea
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide detailed information about the issue"
              className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 outline-none resize-none"
              style={{
                backgroundColor: "rgb(var(--bg-tertiary))",
                border: "2px solid rgb(var(--border-primary))",
                color: "rgb(var(--text-primary))",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgb(var(--accent-primary))")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgb(var(--border-primary))")
              }
            />
            <p
              className="text-xs sm:text-sm mt-1"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Location */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Location *
            </label>
            <div
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{ backgroundColor: "rgb(var(--bg-secondary))" }}
            >
              <MapPin
                size={20}
                style={{ color: "rgb(var(--accent-primary))" }}
              />
              {selectedLocation ? (
                <span
                  className="text-sm font-medium"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  {selectedLocation.lat.toFixed(6)},{" "}
                  {selectedLocation.lng.toFixed(6)}
                </span>
              ) : (
                <span
                  className="text-sm"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Click on the map to select location
                </span>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Images (Optional)
            </label>
            <ImageUpload
              onImagesChange={(urls) =>
                setFormData({ ...formData, images: urls })
              }
              onUploadingChange={setImageUploading}
            />
          </div>

          {/* Privacy Notice - Always Anonymous */}
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "rgba(var(--accent-success), 0.1)",
              border: "1px solid rgb(var(--accent-success))",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <div
                  className="font-semibold mb-1"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  Privacy Protected - 100% Anonymous
                </div>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "rgb(var(--text-secondary))" }}
                >
                  All reports are completely anonymous. Your personal
                  information (name, email) is never shown to anyone, including
                  admins. This ensures you can report issues safely without fear
                  of retaliation.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || imageUploading || !selectedLocation}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                "Submit Issue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
