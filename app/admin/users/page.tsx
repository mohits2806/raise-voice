'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/Admin/AdminGuard';
import Link from 'next/link';
import { ArrowLeft, Shield, User } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const actionText = newRole === 'admin' ? 'promote this user to Admin' : 'revoke Admin access';
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333ea', // Purple-600
      cancelButtonColor: '#6b7280', // Gray-500
      confirmButtonText: 'Yes, update role!',
      background: 'rgb(var(--bg-secondary))',
      color: 'rgb(var(--text-primary))'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        });

        if (response.ok) {
          await Swal.fire({
            title: 'Updated!',
            text: `User role has been updated to ${newRole}.`,
            icon: 'success',
            confirmButtonColor: '#9333ea',
            background: 'rgb(var(--bg-secondary))',
            color: 'rgb(var(--text-primary))'
          });
          fetchUsers();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update role');
        }
      } catch (error: any) {
        console.error('Failed to update role:', error);
        Swal.fire({
          title: 'Error!',
          text: error.message || 'Something went wrong.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: 'rgb(var(--bg-secondary))',
          color: 'rgb(var(--text-primary))'
        });
      }
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
              backgroundColor: 'rgb(var(--bg-tertiary))',
              border: '2px solid rgb(var(--border-primary))',
              color: 'rgb(var(--text-primary))',
            }}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          <div className="card mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-display" style={{ color: 'rgb(var(--text-primary))' }}>
              Manage Users
            </h1>
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
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '2px solid rgb(var(--border-primary))' }}>
                    <th className="text-left py-3 px-4" style={{ color: 'rgb(var(--text-primary))' }}>Name</th>
                    <th className="text-left py-3 px-4" style={{ color: 'rgb(var(--text-primary))' }}>Email</th>
                    <th className="text-left py-3 px-4" style={{ color: 'rgb(var(--text-primary))' }}>Role</th>
                    <th className="text-left py-3 px-4" style={{ color: 'rgb(var(--text-primary))' }}>Joined</th>
                    <th className="text-right py-3 px-4" style={{ color: 'rgb(var(--text-primary))' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} style={{ borderBottom: '1px solid rgb(var(--border-primary))' }}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                          ) : (
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: 'rgb(var(--bg-secondary))' }}
                            >
                              <User size={20} style={{ color: 'rgb(var(--text-tertiary))' }} />
                            </div>
                          )}
                          <span className="font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span style={{ color: 'rgb(var(--text-secondary))' }}>{user.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}>
                          {user.role === 'admin' && <Shield size={14} />}
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm" style={{ color: 'rgb(var(--text-tertiary))' }}>
                          {(() => {
                            try {
                              return user.createdAt && !isNaN(new Date(user.createdAt).getTime()) 
                                ? format(new Date(user.createdAt), 'MMM d, yyyy') 
                                : 'N/A';
                            } catch (e) {
                              return 'N/A';
                            }
                          })()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRoleToggle(user._id, user.role)}
                          className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.05]"
                          style={{
                            backgroundColor: user.role === 'admin' 
                              ? 'rgba(var(--accent-error), 0.1)'
                              : 'rgba(var(--accent-success), 0.1)',
                            color: user.role === 'admin'
                              ? 'rgb(var(--accent-error))'
                              : 'rgb(var(--accent-success))',
                            border: `2px solid ${user.role === 'admin' ? 'rgb(var(--accent-error))' : 'rgb(var(--accent-success))'}`,
                          }}
                        >
                          {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <p style={{ color: 'rgb(var(--text-secondary))' }}>No users found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
