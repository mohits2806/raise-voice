'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        scrolled 
          ? 'shadow-lg' 
          : 'bg-transparent border-transparent'
      }`}
      style={{
        backgroundColor: scrolled ? 'rgb(var(--bg-primary))' : 'transparent',
        borderColor: scrolled ? 'rgb(var(--border-primary))' : 'transparent'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white text-xl">📣</span>
              </div>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'var(--gradient-primary)', filter: 'blur(8px)', zIndex: -1 }}></div>
            </div>
            <span className="text-xl font-bold text-gradient-primary hidden sm:inline font-display">
              RaiseVoice
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 transition-all duration-300 font-medium rounded-lg hover:bg-opacity-10"
              style={{ color: 'rgb(var(--text-primary))' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--bg-secondary))'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Map
            </Link>
            {session && (
              <>
                <Link
                  href="/profile"
                  className="px-4 py-2 transition-all duration-300 font-medium rounded-lg hover:bg-opacity-10"
                  style={{ color: 'rgb(var(--text-primary))' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--bg-secondary))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  My Issues
                </Link>
                
                {/* Admin Link - Only visible to admins */}
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-white bg-purple-600 hover:bg-purple-700"
                    title="Admin Dashboard"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: 'rgb(var(--bg-secondary))',
                color: 'rgb(var(--text-primary))'
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} style={{ color: 'rgb(var(--text-primary))' }} />
              )}
            </button>

            {status === 'loading' ? (
              <div className="w-24 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgb(var(--bg-secondary))',
                    color: 'rgb(var(--text-primary))'
                  }}
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
                  <div className="absolute right-0 mt-2 w-48 top-full animate-slide-down"
                    style={{
                      background: 'rgb(var(--bg-tertiary))',
                      border: '1px solid rgb(var(--border-primary))',
                      boxShadow: 'var(--shadow-xl)',
                      borderRadius: '0.75rem',
                    }}>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 transition-colors duration-200"
                        style={{ color: 'rgb(var(--text-primary))' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--accent-primary), 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => setShowUserMenu(false)}
                      >
                        👤 Profile
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left px-4 py-2 transition-colors duration-200 flex items-center gap-2"
                        style={{ color: 'rgb(var(--text-primary))' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--accent-error), 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                  style={{ 
                    color: 'rgb(var(--text-primary))',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--bg-secondary))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: 'rgb(var(--bg-secondary))',
                color: 'rgb(var(--text-primary))'
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} style={{ color: 'rgb(var(--text-primary))' }} />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
              style={{ color: 'rgb(var(--text-primary))' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t animate-slide-down"
            style={{ 
              backgroundColor: 'rgb(var(--bg-primary))',
              borderColor: 'rgb(var(--border-primary))'
            }}
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-3 rounded-lg transition-all duration-300"
                style={{ color: 'rgb(var(--text-primary))' }}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--bg-secondary))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Map
              </Link>
              {session && (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-left font-medium rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10"
                    style={{ color: 'rgb(var(--text-primary))' }}
                  >
                    My Issues
                  </Link>
                  
                  {/* Admin Link - Mobile */}
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-left font-semibold rounded-lg transition-all duration-300 text-white bg-purple-600 hover:bg-purple-700"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-3 rounded-lg flex items-center gap-2"
                    style={{ 
                      backgroundColor: 'rgb(var(--bg-secondary))',
                      color: 'rgb(var(--text-primary))'
                    }}
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
                    className="px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-3 rounded-lg transition-all duration-300"
                    style={{ color: 'rgb(var(--text-primary))' }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--bg-secondary))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="btn-primary text-center"
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
