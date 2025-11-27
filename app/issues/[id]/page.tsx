"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, User, Trash2, Edit } from "lucide-react";
import dynamic from "next/dynamic";
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/lib/constants";
import { format } from "date-fns";
import Swal from "sweetalert2";

const InteractiveMap = dynamic(
  () => import("@/components/Map/InteractiveMap"),
  {
    ssr: false,
  }
);

export default function IssueDetailsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (issueId) {
      fetchIssue();
    }
  }, [issueId]);

  const fetchIssue = async () => {
    try {
      const response = await fetch(`/api/issues/${issueId}`);
      if (response.ok) {
        const data = await response.json();
        setIssue(data.issue);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to fetch issue:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!session || issue.userId._id !== session.user.id) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setIssue(data.issue);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!session || issue.userId._id !== session.user.id) return;

    const result = await Swal.fire({
      title: "Delete Issue?",
      text: "This will permanently delete your issue including all images.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "rgb(var(--bg-secondary))",
      color: "rgb(var(--text-primary))",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await Swal.fire({
          title: "Deleted!",
          text: "Your issue has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#9333ea",
          timer: 2000,
          background: "rgb(var(--bg-secondary))",
          color: "rgb(var(--text-primary))",
        });
        router.push("/");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete issue:", error);
      await Swal.fire({
        title: "Error!",
        text: "Failed to delete the issue. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "rgb(var(--bg-secondary))",
        color: "rgb(var(--text-primary))",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-12 animate-pulse">
          <div
            className="w-16 h-16 border-4 rounded-full animate-spin mx-auto"
            style={{
              borderColor: "rgb(var(--border-primary))",
              borderTopColor: "rgb(var(--accent-primary))",
            }}
          ></div>
          <p
            className="text-lg font-medium mt-4"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Loading issue...
          </p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return null;
  }

  const category = ISSUE_CATEGORIES.find((c) => c.value === issue.category);
  const statusInfo = ISSUE_STATUSES.find((s) => s.value === issue.status);
  const isOwner = session?.user?.id === issue.userId._id;
  const [lng, lat] = issue.location.coordinates;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="card px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] mb-6"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          <ArrowLeft size={20} />
          Back to Map
        </button>

        {/* Main Content */}
        <div className="card p-6 sm:p-8 mb-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{category?.icon}</span>
                <div>
                  <h1
                    className="text-2xl sm:text-3xl font-bold font-display"
                    style={{ color: "rgb(var(--text-primary))" }}
                  >
                    {issue.title}
                  </h1>
                  <p
                    className="text-sm sm:text-base"
                    style={{ color: "rgb(var(--text-secondary))" }}
                  >
                    {category?.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`px-4 py-2 rounded-xl font-semibold text-white ${
                statusInfo?.color || "bg-gray-500"
              }`}
            >
              {statusInfo?.label}
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <User size={20} style={{ color: "rgb(var(--text-tertiary))" }} />
              <div>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Reported by
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  {issue.userId.name || "Anonymous"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar
                size={20}
                style={{ color: "rgb(var(--text-tertiary))" }}
              />
              <div>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Created
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  {format(new Date(issue.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin
                size={20}
                style={{ color: "rgb(var(--text-tertiary))" }}
              />
              <div>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Location
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  {issue.address || "View on map"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2
              className="text-lg sm:text-xl font-bold font-display mb-3"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Description
            </h2>
            <p
              className="whitespace-pre-wrap"
              style={{ color: "rgb(var(--text-secondary))" }}
            >
              {issue.description}
            </p>
          </div>

          {/* Images */}
          {issue.images && issue.images.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-lg sm:text-xl font-bold font-display mb-3"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                Images ({issue.images.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105"
                    onClick={() => setSelectedImage(image)}
                    style={{
                      border: "2px solid rgb(var(--border-primary))",
                      boxShadow: "var(--shadow-md)",
                    }}
                  >
                    <img
                      src={image}
                      alt={`Issue image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          <div className="mb-6">
            <h2
              className="text-lg sm:text-xl font-bold font-display mb-3"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Location on Map
            </h2>
            <div className="rounded-xl overflow-hidden">
              <InteractiveMap
                issues={[issue]}
                height="400px"
                initialCenter={{ lat, lng }}
              />
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div
              className="border-t pt-6"
              style={{ borderColor: "rgb(var(--border-primary))" }}
            >
              <h2
                className="text-lg sm:text-xl font-bold font-display mb-4"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                Manage Issue
              </h2>

              {/* Status Update */}
              <div className="mb-4">
                <p
                  className="mb-2"
                  style={{ color: "rgb(var(--text-secondary))" }}
                >
                  Update Status:
                </p>
                <div className="flex flex-wrap gap-2">
                  {ISSUE_STATUSES.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(status.value)}
                      disabled={updating || issue.status === status.value}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        issue.status === status.value
                          ? status.color + " text-white"
                          : "hover:scale-105"
                      } disabled:opacity-50`}
                      style={
                        issue.status === status.value
                          ? {}
                          : {
                              backgroundColor: "rgb(var(--bg-tertiary))",
                              border: "2px solid rgb(var(--border-primary))",
                              color: "rgb(var(--text-primary))",
                            }
                      }
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] text-white"
                style={{
                  backgroundColor: "rgb(var(--accent-error))",
                }}
              >
                <Trash2 size={18} />
                Delete Issue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 rounded-full p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 text-white"
              style={{
                backgroundColor: "rgba(var(--bg-tertiary), 0.8)",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
