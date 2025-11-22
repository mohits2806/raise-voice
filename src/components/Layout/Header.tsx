'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="glass sticky top-0 z-40 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">📣</span>
            </div>
            <span className="text-xl font-bold text-white">RaiseVoice</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition font-medium"
            >
              Map
            </Link>
            {session && (
              <Link
                href="/profile"
                className="text-white/80 hover:text-white transition font-medium"
              >
                My Issues
              </Link>
            )}

            {status === 'loading' ? (
              <div className="w-24 h-10 bg-white/10 rounded-lg animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="font-medium">{session.user?.name}</span>
                </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg py-2 z-50 top-full">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-white/90 transition font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10 animate-slide-up">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Map
              </Link>
              {session && (
                <Link
                  href="/profile"
                  className="px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Issues
                </Link>
              )}
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 bg-white/10 rounded-lg text-white flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    {session.user?.name}
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition flex items-center gap-2"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-white/90 transition font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
