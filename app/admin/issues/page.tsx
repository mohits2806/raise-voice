"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/Admin/AdminGuard";
import Link from "next/link";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/lib/constants";
import { format } from "date-fns";

export default function AdminIssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [updatingIssueId, setUpdatingIssueId] = useState<string | null>(null);

  useEffect(() => {
    fetchIssues();
  }, [filter]);

  const fetchIssues = async () => {
    try {
      const url = filter
        ? `/api/admin/issues?status=${filter}`
        : "/api/admin/issues";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setIssues(data.issues);
      }
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (issueId: string, newStatus: string) => {
    setUpdatingIssueId(issueId);
    try {
      const response = await fetch(`/api/admin/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchIssues();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingIssueId(null);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: "rgb(var(--bg-tertiary))",
              border: "2px solid rgb(var(--border-primary))",
              color: "rgb(var(--text-primary))",
            }}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          <div className="card mb-6">
            <h1
              className="text-2xl sm:text-3xl font-bold font-display mb-4"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Manage Issues
            </h1>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("")}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  filter === "" ? "btn-primary" : "hover:scale-105"
                }`}
                style={
                  filter === ""
                    ? {}
                    : {
                        backgroundColor: "rgb(var(--bg-tertiary))",
                        border: "2px solid rgb(var(--border-primary))",
                        color: "rgb(var(--text-primary))",
                      }
                }
              >
                All
              </button>
              {ISSUE_STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFilter(status.value)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-white ${
                    filter === status.value ? status.color : "hover:scale-105"
                  }`}
                  style={
                    filter === status.value
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

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-16 h-16 border-4 rounded-full animate-spin"
                style={{
                  borderColor: "rgb(var(--border-primary))",
                  borderTopColor: "rgb(var(--accent-primary))",
                }}
              ></div>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid rgb(var(--border-primary))",
                    }}
                  >
                    <th
                      className="text-left py-3 px-4"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      Title
                    </th>
                    <th
                      className="text-left py-3 px-4"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      Category
                    </th>
                    <th
                      className="text-left py-3 px-4"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      Reporter
                    </th>
                    <th
                      className="text-left py-3 px-4"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      Status
                    </th>
                    <th
                      className="text-left py-3 px-4"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => {
                    const category = ISSUE_CATEGORIES.find(
                      (c) => c.value === issue.category
                    );
                    const statusInfo = ISSUE_STATUSES.find(
                      (s) => s.value === issue.status
                    );

                    return (
                      <tr
                        key={issue._id}
                        style={{
                          borderBottom: "1px solid rgb(var(--border-primary))",
                        }}
                      >
                        <td className="py-3 px-4">
                          <Link
                            href={`/issues/${issue._id}`}
                            className="font-semibold hover:underline"
                            style={{ color: "rgb(var(--accent-primary))" }}
                          >
                            {issue.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <span style={{ color: "rgb(var(--text-secondary))" }}>
                            {category?.icon} {category?.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span style={{ color: "rgb(var(--text-secondary))" }}>
                            {issue.userId?.name || "Unknown"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={issue.status}
                              onChange={(e) =>
                                handleStatusUpdate(issue._id, e.target.value)
                              }
                              disabled={updatingIssueId === issue._id}
                              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                statusInfo?.color
                              } ${
                                updatingIssueId === issue._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {ISSUE_STATUSES.map((status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                            {updatingIssueId === issue._id && (
                              <Loader2
                                className="animate-spin"
                                size={16}
                                style={{ color: "rgb(var(--accent-primary))" }}
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="text-sm"
                            style={{ color: "rgb(var(--text-tertiary))" }}
                          >
                            {format(new Date(issue.createdAt), "MMM d, yyyy")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {issues.length === 0 && (
                <div className="text-center py-12">
                  <p style={{ color: "rgb(var(--text-secondary))" }}>
                    No issues found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
