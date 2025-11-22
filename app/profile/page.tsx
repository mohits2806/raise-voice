'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Mail, Calendar, MapPin, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/lib/constants';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchUserIssues();
    }
  }, [status]);

  const fetchUserIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      if (response.ok) {
        const data = await response.json();
        // Filter issues created by current user
        const userIssues = data.issues.filter(
          (issue: any) => issue.userId._id === session?.user?.id
        );
        setIssues(userIssues);
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-12 animate-pulse">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg font-medium mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const filteredIssues = filter === 'all' 
    ? issues 
    : issues.filter((issue) => issue.status === filter);

  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === 'open').length,
    inProgress: issues.filter((i) => i.status === 'in-progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-8 mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-24 h-24 rounded-full border-4 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center">
                  <UserIcon size={48} className="text-white/60" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {session.user.name || 'Anonymous User'}
              </h1>
              <div className="flex flex-col md:flex-row gap-4 text-white/80">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail size={18} />
                  <span>{session.user.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Calendar size={18} />
                  <span>Member since {format(new Date(), 'MMM yyyy')}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-white/70">Total Issues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{stats.resolved}</div>
                <div className="text-sm text-white/70">Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-xl p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-white/70">Total Reports</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle className="text-red-400" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.open}</div>
                <div className="text-sm text-white/70">Open</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="text-yellow-400" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
                <div className="text-sm text-white/70">In Progress</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="text-green-400" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.resolved}</div>
                <div className="text-sm text-white/70">Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">My Issues</h2>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'all'
                    ? 'bg-white text-purple-600'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                All ({stats.total})
              </button>
              {ISSUE_STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFilter(status.value)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === status.value
                      ? status.color
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {status.label} ({issues.filter((i) => i.status === status.value).length})
                </button>
              ))}
            </div>
          </div>

          {/* Issues Grid */}
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <MapPin size={48} className="text-white/30 mx-auto mb-4" />
              <p className="text-white/70 text-lg">
                {filter === 'all' 
                  ? "You haven't reported any issues yet"
                  : `No ${filter} issues`}
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition"
              >
                Report an Issue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIssues.map((issue) => {
                const category = ISSUE_CATEGORIES.find((c) => c.value === issue.category);
                const statusInfo = ISSUE_STATUSES.find((s) => s.value === issue.status);

                return (
                  <div
                    key={issue._id}
                    onClick={() => router.push(`/issues/${issue._id}`)}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{category?.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold line-clamp-2">{issue.title}</h3>
                        <p className="text-white/60 text-sm">{category?.label}</p>
                      </div>
                    </div>

                    {issue.images && issue.images.length > 0 && (
                      <img
                        src={issue.images[0]}
                        alt={issue.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                      <span className="text-white/60 text-xs">
                        {format(new Date(issue.createdAt), 'MMM d')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
