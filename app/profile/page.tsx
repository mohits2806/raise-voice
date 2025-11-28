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
  }, [status, router]);

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
        <div className="card p-12 animate-pulse">
          <div 
            className="w-16 h-16 border-4 rounded-full animate-spin mx-auto"
            style={{
              borderColor: 'rgb(var(--border-primary))',
              borderTopColor: 'rgb(var(--accent-primary))',
            }}
          ></div>
          <p className="text-lg font-medium mt-4" style={{ color: 'rgb(var(--text-primary))' }}>
            Loading profile...
          </p>
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
        <div className="card p-6 sm:p-8 mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgb(var(--bg-secondary))',
                    border: '4px solid rgb(var(--border-primary))',
                  }}
                >
                 <UserIcon size={48} style={{ color: 'rgb(var(--text-tertiary))' }} />
                </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
                {session.user.name || 'Anonymous User'}
              </h1>
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                <div className="flex items-center gap-2 justify-center md:justify-start" style={{ color: 'rgb(var(--text-secondary))' }}>
                  <Mail size={18} />
                  <span className="text-sm sm:text-base">{session.user.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start" style={{ color: 'rgb(var(--text-secondary))' }}>
                  <Calendar size={18} />
                  <span className="text-sm sm:text-base">Member since {format(new Date(), 'MMM yyyy')}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gradient-primary">{stats.total}</div>
                <div className="text-xs sm:text-sm" style={{ color: 'rgb(var(--text-tertiary))' }}>Total Issues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'rgb(var(--accent-success))' }}>{stats.resolved}</div>
                <div className="text-xs sm:text-sm" style={{ color: 'rgb(var(--text-tertiary))' }}>Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="card group cursor-default">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ backgroundColor: 'rgba(var(--accent-primary), 0.1)' }}
              >
                <TrendingUp size={24} style={{ color: 'rgb(var(--accent-primary))' }} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>{stats.total}</div>
                <div className="text-xs sm:text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Total Reports</div>
              </div>
            </div>
          </div>

          <div className="card group cursor-default">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ backgroundColor: 'rgba(var(--accent-error), 0.1)' }}
              >
                <AlertCircle size={24} style={{ color: 'rgb(var(--accent-error))' }} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>{stats.open}</div>
                <div className="text-xs sm:text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Open</div>
              </div>
            </div>
          </div>

          <div className="card group cursor-default">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ backgroundColor: 'rgba(var(--accent-warning), 0.1)' }}
              >
                <Clock size={24} style={{ color: 'rgb(var(--accent-warning))' }} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>{stats.inProgress}</div>
                <div className="text-xs sm:text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>In Progress</div>
              </div>
            </div>
          </div>

          <div className="card group cursor-default">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ backgroundColor: 'rgba(var(--accent-success), 0.1)' }}
              >
                <CheckCircle size={24} style={{ color: 'rgb(var(--accent-success))' }} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>{stats.resolved}</div>
                <div className="text-xs sm:text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'rgb(var(--text-primary))' }}>
              My Issues
            </h2>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  filter === 'all'
                    ? 'btn-primary'
                    : 'hover:scale-105'
                }`}
                style={filter === 'all' ? {} : {
                  backgroundColor: 'rgb(var(--bg-tertiary))',
                  border: '2px solid rgb(var(--border-primary))',
                  color: 'rgb(var(--text-primary))',
                }}
              >
                All ({stats.total})
              </button>
              {ISSUE_STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFilter(status.value)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-white ${
                    filter === status.value
                      ? status.color
                      : 'hover:scale-105'
                  }`}
                  style={filter === status.value ? {} : {
                    backgroundColor: 'rgb(var(--bg-tertiary))',
                    border: '2px solid rgb(var(--border-primary))',
                    color: 'rgb(var(--text-primary))',
                  }}
                >
                  {status.label} ({issues.filter((i) => i.status === status.value).length})
                </button>
              ))}
            </div>
          </div>

          {/* Issues Grid */}
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <MapPin size={48} className="mx-auto mb-4" style={{ color: 'rgb(var(--text-tertiary))' }} />
              <p className="text-base sm:text-lg mb-4" style={{ color: 'rgb(var(--text-secondary))' }}>
                {filter === 'all' 
                  ? "You haven't reported any issues yet"
                  : `No ${filter} issues`}
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                Raise a Issue
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
                    className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    style={{
                      backgroundColor: 'rgb(var(--bg-secondary))',
                      border: '2px solid rgb(var(--border-primary))',
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{category?.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-2 mb-1" style={{ color: 'rgb(var(--text-primary))' }}>
                          {issue.title}
                        </h3>
                        <p className="text-xs sm:text-sm" style={{ color: 'rgb(var(--text-tertiary))' }}>
                          {category?.label}
                        </p>
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
                      <span className={`text-xs px-3 py-1 rounded-full text-white ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                      <span className="text-xs" style={{ color: 'rgb(var(--text-tertiary))' }}>
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
