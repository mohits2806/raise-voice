'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, User, Trash2, Edit } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/lib/constants';
import { format } from 'date-fns';

const InteractiveMap = dynamic(() => import('@/components/Map/InteractiveMap'), {
  ssr: false,
});

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
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to fetch issue:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!session || issue.userId._id !== session.user.id) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setIssue(data.issue);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!session || issue.userId._id !== session.user.id) return;
    if (!confirm('Are you sure you want to delete this issue?')) return;

    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete issue:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-12 animate-pulse">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg font-medium mt-4">Loading issue...</p>
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
          onClick={() => router.push('/')}
          className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-white/20 transition mb-6"
        >
          <ArrowLeft size={20} />
          Back to Map
        </button>

        {/* Main Content */}
        <div className="glass rounded-2xl p-8 mb-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{category?.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold text-white">{issue.title}</h1>
                  <p className="text-white/70">{category?.label}</p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-lg font-semibold ${statusInfo?.color || 'bg-gray-500'}`}>
              {statusInfo?.label}
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 text-white/90">
              <User size={20} className="text-white/60" />
              <div>
                <p className="text-sm text-white/60">Reported by</p>
                <p className="font-semibold">{issue.userId.name || 'Anonymous'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/90">
              <Calendar size={20} className="text-white/60" />
              <div>
                <p className="text-sm text-white/60">Created</p>
                <p className="font-semibold">{format(new Date(issue.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/90">
              <MapPin size={20} className="text-white/60" />
              <div>
                <p className="text-sm text-white/60">Location</p>
                <p className="font-semibold">{issue.address || 'View on map'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-3">Description</h2>
            <p className="text-white/90 whitespace-pre-wrap">{issue.description}</p>
          </div>

          {/* Images */}
          {issue.images && issue.images.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-3">Images ({issue.images.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
                    onClick={() => setSelectedImage(image)}
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
            <h2 className="text-xl font-bold text-white mb-3">Location on Map</h2>
            <div className="rounded-lg overflow-hidden">
              <InteractiveMap 
                issues={[issue]} 
                height="400px" 
                initialCenter={{ lat, lng }}
              />
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="border-t border-white/20 pt-6">
              <h2 className="text-xl font-bold text-white mb-4">Manage Issue</h2>
              
              {/* Status Update */}
              <div className="mb-4">
                <p className="text-white/70 mb-2">Update Status:</p>
                <div className="flex flex-wrap gap-2">
                  {ISSUE_STATUSES.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(status.value)}
                      disabled={updating || issue.status === status.value}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        issue.status === status.value
                          ? status.color
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      } disabled:opacity-50`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 transition"
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
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
