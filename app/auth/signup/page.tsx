'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Loader2, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        router.push('/auth/signin');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
            Create Account
          </h1>
          <p style={{ color: 'rgb(var(--text-secondary))' }}>Join RaiseVoice today</p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 rounded-lg flex items-center gap-2 animate-slide-down"
            style={{
              backgroundColor: 'rgba(var(--accent-error), 0.1)',
              border: '1px solid rgb(var(--accent-error))',
              color: 'rgb(var(--accent-error))',
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
              Name
            </label>
            <div className="relative">
              <User 
                className="absolute left-3 top-1/2 -translate-y-1/2" 
                size={20}
                style={{ color: 'rgb(var(--text-tertiary))' }}
              />
              <input
                type="text"
                required
                minLength={2}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl font-medium transition-all duration-300"
                style={{
                  backgroundColor: 'rgb(var(--bg-tertiary))',
                  border: '2px solid rgb(var(--border-primary))',
                  color: 'rgb(var(--text-primary))',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgb(var(--accent-primary))'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(var(--border-primary))'}
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
              Email
            </label>
            <div className="relative">
              <Mail 
                className="absolute left-3 top-1/2 -translate-y-1/2" 
                size={20}
                style={{ color: 'rgb(var(--text-tertiary))' }}
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl font-medium transition-all duration-300"
                style={{
                  backgroundColor: 'rgb(var(--bg-tertiary))',
                  border: '2px solid rgb(var(--border-primary))',
                  color: 'rgb(var(--text-primary))',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgb(var(--accent-primary))'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(var(--border-primary))'}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
              Password
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-1/2 -translate-y-1/2" 
                size={20}
                style={{ color: 'rgb(var(--text-tertiary))' }}
              />
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl font-medium transition-all duration-300"
                style={{
                  backgroundColor: 'rgb(var(--bg-tertiary))',
                  border: '2px solid rgb(var(--border-primary))',
                  color: 'rgb(var(--text-primary))',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgb(var(--accent-primary))'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(var(--border-primary))'}
                placeholder="••••••••"
              />
            </div>
            <p className="text-xs mt-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
              At least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-1/2 -translate-y-1/2" 
                size={20}
                style={{ color: 'rgb(var(--text-tertiary))' }}
              />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl font-medium transition-all duration-300"
                style={{
                  backgroundColor: 'rgb(var(--bg-tertiary))',
                  border: '2px solid rgb(var(--border-primary))',
                  color: 'rgb(var(--text-primary))',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgb(var(--accent-primary))'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(var(--border-primary))'}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgb(var(--border-primary))' }}></div>
          <span className="text-sm" style={{ color: 'rgb(var(--text-tertiary))' }}>OR</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgb(var(--border-primary))' }}></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02]"
          style={{
            backgroundColor: 'rgb(var(--bg-tertiary))',
            border: '2px solid rgb(var(--border-primary))',
            color: 'rgb(var(--text-primary))',
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-semibold hover:underline" style={{ color: 'rgb(var(--accent-primary))' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
