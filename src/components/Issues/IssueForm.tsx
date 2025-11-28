"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  MapPin,
  Loader2,
  Camera,
  FileText,
  Tag,
  Shield,
} from "lucide-react";
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
    isAnonymous: true,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="card max-w-3xl w-full max-h-[92vh] overflow-hidden animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header with Gradient */}
        <div
          className="relative p-6 sm:p-8"
          style={{
            background:
              "linear-gradient(135deg, rgb(var(--accent-primary)) 0%, rgb(var(--accent-secondary, var(--accent-primary))) 100%)",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              backdropFilter: "blur(10px)",
            }}
          >
            <X size={24} />
          </button>

          <div className="pr-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-2 text-white">
              Raise a Issue
            </h2>
            <p className="text-white/90 text-sm sm:text-base">
              Help improve your community anonymously
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 mb-6">
            {error && (
              <div
                className="p-4 rounded-xl text-sm sm:text-base animate-slide-down flex items-start gap-3"
                style={{
                  backgroundColor: "rgba(var(--accent-error), 0.1)",
                  border: "2px solid rgb(var(--accent-error))",
                  color: "rgb(var(--accent-error))",
                }}
              >
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Title with Icon */}
            <div className="space-y-2">
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                <FileText
                  size={18}
                  style={{ color: "rgb(var(--accent-primary))" }}
                />
                Issue Title{" "}
                <span style={{ color: "rgb(var(--accent-error))" }}>*</span>
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
                placeholder="Brief description (e.g., Broken street light on Main St)"
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
              <p
                className="text-xs"
                style={{ color: "rgb(var(--text-tertiary))" }}
              >
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Category with Icon */}
            <div className="space-y-2">
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                <Tag
                  size={18}
                  style={{ color: "rgb(var(--accent-primary))" }}
                />
                Category{" "}
                <span style={{ color: "rgb(var(--accent-error))" }}> *</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3.5 rounded-xl font-medium transition-all duration-300 outline-none cursor-pointer hover:shadow-md"
                style={{
                  backgroundColor: "rgb(var(--bg-tertiary))",
                  border: "2px solid rgb(var(--border-secondary))",
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
            <div className="space-y-2">
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                <FileText
                  size={18}
                  style={{ color: "rgb(var(--accent-primary))" }}
                />
                Detailed Description{" "}
                <span style={{ color: "rgb(var(--accent-error))" }}>*</span>
              </label>
              <textarea
                required
                minLength={10}
                maxLength={1000}
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Provide detailed information about the issue, when it started, and its impact on the community..."
                className="w-full px-4 py-3.5 rounded-xl font-medium transition-all duration-300 outline-none resize-none focus:ring-2 focus:ring-offset-2"
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
              <div className="flex justify-between items-center">
                <p
                  className="text-xs"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  {formData.description.length}/1000 characters
                </p>
                <p
                  className="text-xs"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  {formData.description.length >= 10
                    ? "✓ Minimum met"
                    : "Minimum 10 characters"}
                </p>
              </div>
            </div>

            {/* Location with Enhanced Display */}
            <div className="space-y-2">
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                <MapPin
                  size={18}
                  style={{ color: "rgb(var(--accent-primary))" }}
                />
                Location{" "}
                <span style={{ color: "rgb(var(--accent-error))" }}>*</span>
              </label>
              <div
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                  selectedLocation ? "ring-2 ring-green-500/50" : ""
                }`}
                style={{
                  backgroundColor: selectedLocation
                    ? "rgba(var(--accent-success), 0.1)"
                    : "rgb(var(--bg-secondary))",
                  border: selectedLocation
                    ? "2px solid rgb(var(--accent-success))"
                    : "2px solid rgb(var(--border-primary))",
                }}
              >
                <div
                  className={`p-2 rounded-full ${
                    selectedLocation ? "animate-pulse" : ""
                  }`}
                  style={{
                    backgroundColor: selectedLocation
                      ? "rgb(var(--accent-success))"
                      : "rgb(var(--bg-tertiary))",
                  }}
                >
                  <MapPin
                    size={20}
                    style={{
                      color: selectedLocation
                        ? "white"
                        : "rgb(var(--text-tertiary))",
                    }}
                  />
                </div>
                <div className="flex-1">
                  {selectedLocation ? (
                    <>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "rgb(var(--text-primary))" }}
                      >
                        Location Selected ✓
                      </p>
                      <p
                        className="text-xs font-mono"
                        style={{ color: "rgb(var(--text-secondary))" }}
                      >
                        {selectedLocation.lat.toFixed(6)},{" "}
                        {selectedLocation.lng.toFixed(6)}
                      </p>
                    </>
                  ) : (
                    <p
                      className="text-sm"
                      style={{ color: "rgb(var(--text-tertiary))" }}
                    >
                      📍 Click on the map to select location
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Images with Modern Upload Area */}
            <div className="space-y-2">
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                <Camera
                  size={18}
                  style={{ color: "rgb(var(--accent-primary))" }}
                />
                Photo Evidence{" "}
                <span
                  className="text-xs font-normal"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  (Optional, but recommended)
                </span>
              </label>
              <ImageUpload
                onImagesChange={(urls) =>
                  setFormData({ ...formData, images: urls })
                }
                onUploadingChange={setImageUploading}
              />
            </div>

            {/* Enhanced Privacy Notice */}
            <div
              className="relative overflow-hidden p-5 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(var(--accent-success), 0.1) 0%, rgba(var(--accent-success), 0.05) 100%)",
                border: "2px solid rgb(var(--accent-success))",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 p-3 rounded-full"
                  style={{
                    backgroundColor: "rgb(var(--accent-success))",
                  }}
                >
                  <Shield size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3
                    className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2"
                    style={{ color: "rgb(var(--text-primary))" }}
                  >
                    100% Anonymous & Protected
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white">
                      Verified
                    </span>
                  </h3>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: "rgb(var(--text-secondary))" }}
                  >
                    Your identity is completely protected. We{" "}
                    <strong>never</strong> show your name, email, or any
                    personal information to anyone - not even to administrators.
                    This ensures you can report issues safely without fear of
                    retaliation.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(var(--accent-success), 0.2)",
                        color: "rgb(var(--accent-success))",
                      }}
                    >
                      🔒 End-to-end privacy
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(var(--accent-success), 0.2)",
                        color: "rgb(var(--accent-success))",
                      }}
                    >
                      🛡️ No tracking
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(var(--accent-success), 0.2)",
                        color: "rgb(var(--accent-success))",
                      }}
                    >
                      ✨ Full anonymity
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: "rgb(var(--bg-tertiary))",
                  border: "2px solid rgb(var(--border-primary))",
                  color: "rgb(var(--text-primary))",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || imageUploading || !selectedLocation}
                className="flex-1 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "rgb(var(--accent-primary))",
                  color: "white",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Submitting Securely...</span>
                  </>
                ) : imageUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Uploading Images...</span>
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    <span>Submit Anonymously</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
