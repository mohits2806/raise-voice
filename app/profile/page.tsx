'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Mail, Phone, Calendar, MapPin, TrendingUp, CheckCircle, Clock, AlertCircle, Edit2, Check, X, Loader } from 'lucide-react';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/lib/constants';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  background: 'rgb(var(--bg-secondary))',
  color: 'rgb(var(--text-primary))',
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Edit states for Modal
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setEditName(session.user.name || '');
      setEditPhone(session.user.phone || '');
    }
  }, [session]);

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

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Toast.fire({
        icon: 'error',
        title: 'Name is required'
      });
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      // Important: NextAuth `update` forces a session refresh
      await update({
        ...session,
        user: {
          ...session?.user,
          name: editName,
          phone: editPhone
        }
      });
      
      setIsEditing(false);
      Toast.fire({
        icon: 'success',
        title: 'Profile updated successfully'
      });
    } catch (err: any) {
      Toast.fire({
        icon: 'error',
        title: err.message
      });
    } finally {
      setIsSaving(false);
    }
  };

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
        <div className="card p-6 sm:p-8 mb-6 animate-fade-in relative">
          {!isEditing ? (
            <button 
              onClick={() => {
                setEditName(session.user.name || '');
                setEditPhone(session.user.phone || '');
                setIsEditing(true);
              }}
              className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              title="Edit Profile"
            >
              <Edit2 size={20} />
            </button>
          ) : null}

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: 'rgba(var(--accent-primary), 0.1)',
                    border: '4px solid rgb(var(--border-primary))',
                  }}
                >
                 <UserIcon size={48} style={{ color: 'rgb(var(--accent-primary))' }} />
                </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
                {session.user.name || 'Anonymous User'}
              </h1>
              
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mt-2">
                <div className="flex items-center gap-2 justify-center md:justify-start" style={{ color: 'rgb(var(--text-secondary))' }}>
                  <Mail size={18} />
                  <span className="text-sm sm:text-base font-medium">{session.user.email}</span>
                </div>
                {session.user.phone && (
                  <div className="flex items-center gap-2 justify-center md:justify-start" style={{ color: 'rgb(var(--text-secondary))' }}>
                    <Phone size={18} />
                    <span className="text-sm sm:text-base font-medium">{session.user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 justify-center md:justify-start" style={{ color: 'rgb(var(--text-secondary))' }}>
                  <Calendar size={18} />
                  <span className="text-sm sm:text-base font-medium">Member since {format(new Date(), 'MMM yyyy')}</span>
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

      {/* Profile Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
            style={{
              backgroundColor: 'rgb(var(--bg-primary))',
              border: '1px solid rgb(var(--border-primary))',
            }}
          >
            {/* Modal Header */}
            <div 
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{
                borderColor: 'rgb(var(--border-primary))',
                backgroundColor: 'rgba(var(--bg-secondary), 0.5)'
              }}
            >
              <h3 className="text-lg font-bold font-display" style={{ color: 'rgb(var(--text-primary))' }}>
                Edit Profile
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: 'rgb(var(--text-tertiary))' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Email Field (Readonly) */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Email Address
                </label>
                <div className="relative opacity-60 cursor-not-allowed">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} style={{ color: 'rgb(var(--text-tertiary))' }} />
                  </div>
                  <input 
                    type="text" 
                    value={session?.user?.email || ''}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl cursor-not-allowed"
                    style={{
                      backgroundColor: 'rgb(var(--bg-tertiary))',
                      color: 'rgb(var(--text-secondary))',
                      border: '2px solid rgb(var(--border-secondary))',
                    }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'rgb(var(--text-tertiary))' }}>
                  Email address cannot be changed once account is created.
                </p>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Full Name <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={16} style={{ color: 'rgb(var(--text-tertiary))' }} />
                  </div>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all duration-300"
                    style={{
                      backgroundColor: 'rgb(var(--bg-secondary))',
                      color: 'rgb(var(--text-primary))',
                      border: '2px solid rgb(var(--border-primary))',
                    }}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} style={{ color: 'rgb(var(--text-tertiary))' }} />
                  </div>
                  <input 
                    type="text" 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all duration-300"
                    style={{
                      backgroundColor: 'rgb(var(--bg-secondary))',
                      color: 'rgb(var(--text-primary))',
                      border: '2px solid rgb(var(--border-primary))',
                    }}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="px-6 py-4 border-t flex items-center justify-end gap-3"
              style={{
                borderColor: 'rgb(var(--border-primary))',
                backgroundColor: 'rgba(var(--bg-secondary), 0.3)'
              }}
            >
              <button 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'transparent',
                  color: 'rgb(var(--text-secondary))',
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg"
              >
                {isSaving ? <Loader size={18} className="animate-spin" /> : <Check size={18} />} 
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
