'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/Admin/AdminGuard';
import { TrendingUp, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Stats {
  users: { total: number };
  issues: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
  };
  recentActivity: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'rgb(var(--text-secondary))' }}>
              Manage issues and users across the platform
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div 
                className="w-16 h-16 border-4 rounded-full animate-spin"
                style={{
                  borderColor: 'rgb(var(--border-primary))',
                  borderTopColor: 'rgb(var(--accent-primary))',
                }}
              ></div>
            </div>
          ) : stats ? (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Link href="/admin/issues" className="card group cursor-pointer hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(var(--accent-primary), 0.1)' }}
                    >
                      <TrendingUp size={24} style={{ color: 'rgb(var(--accent-primary))' }} />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                        {stats.issues.total}
                      </div>
                      <div className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Total Issues</div>
                    </div>
                  </div>
                </Link>

                <div className="card">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(var(--accent-error), 0.1)' }}
                    >
                      <AlertCircle size={24} style={{ color: 'rgb(var(--accent-error))' }} />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                        {stats.issues.open}
                      </div>
                      <div className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Open</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(var(--accent-warning), 0.1)' }}
                    >
                      <Clock size={24} style={{ color: 'rgb(var(--accent-warning))' }} />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                        {stats.issues.inProgress}
                      </div>
                      <div className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>In Progress</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(var(--accent-success), 0.1)' }}
                    >
                      <CheckCircle size={24} style={{ color: 'rgb(var(--accent-success))' }} />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                        {stats.issues.resolved}
                      </div>
                      <div className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Resolved</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                <Link href="/admin/issues" className="card hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-xl font-bold font-display mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
                    Manage Issues
                  </h3>
                  <p style={{ color: 'rgb(var(--text-secondary))' }}>
                    View, update status, and delete reported issues
                  </p>
                </Link>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <h2 className="text-xl sm:text-2xl font-bold font-display mb-4" style={{ color: 'rgb(var(--text-primary))' }}>
                  Recent Activity
                </h2>

                {stats.recentActivity.length === 0 ? (
                  <p style={{ color: 'rgb(var(--text-secondary))' }}>No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity: any) => (
                      <Link
                        key={activity.id}
                        href={`/issues/${activity.id}`}
                        className="block p-4 rounded-xl transition-all duration-300 hover:scale-[1.01]"
                        style={{
                          backgroundColor: 'rgb(var(--bg-secondary))',
                          border: '2px solid rgb(var(--border-primary))',
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1" style={{ color: 'rgb(var(--text-primary))' }}>
                              {activity.title}
                            </h4>
                            <p className="text-sm mb-2" style={{ color: 'rgb(var(--text-tertiary))' }}>
                              by {activity.user.name} • {activity.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                              activity.status === 'open' ? 'bg-red-500' :
                              activity.status === 'in-progress' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}>
                              {activity.status}
                            </span>
                            <p className="text-xs mt-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
                              {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p style={{ color: 'rgb(var(--text-secondary))' }}>Failed to load dashboard</p>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
