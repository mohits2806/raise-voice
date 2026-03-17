"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, User, Sun, Moon, AlertTriangle, Mail, Phone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showUserMenu]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showSignOutConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSignOutConfirm]);

  const handleSignOutRequest = () => {
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    setShowSignOutConfirm(true);
  };

  const handleConfirmSignOut = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* ── Sign-Out Confirmation Modal ── */}
      {showSignOutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            // Close on backdrop click
            if (e.target === e.currentTarget) setShowSignOutConfirm(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 animate-fade-in shadow-2xl"
            style={{
              backgroundColor: "rgb(var(--bg-primary))",
              border: "1px solid rgb(var(--border-primary))",
            }}
          >
            {/* Icon */}
            <div
              className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(var(--accent-error), 0.12)" }}
            >
              <LogOut size={26} style={{ color: "rgb(var(--accent-error))" }} />
            </div>

            {/* Heading */}
            <h2
              className="text-xl font-bold font-display text-center mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Sign Out?
            </h2>
            <p
              className="text-sm text-center mb-6"
              style={{ color: "rgb(var(--text-secondary))" }}
            >
              Are you sure you want to sign out of your account?
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                disabled={signingOut}
                className="flex-1 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                style={{
                  backgroundColor: "rgb(var(--bg-tertiary))",
                  border: "2px solid rgb(var(--border-primary))",
                  color: "rgb(var(--text-primary))",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                disabled={signingOut}
                className="flex-1 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
                }}
              >
                {signingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing out…
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b ${
          scrolled ? "shadow-lg" : "bg-transparent border-transparent"
        }`}
        style={{
          backgroundColor: scrolled ? "rgb(var(--bg-primary))" : "transparent",
          borderColor: scrolled ? "rgb(var(--border-primary))" : "transparent",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <img src="/logo.webp" alt="logo" width={40} />
                </div>
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "var(--gradient-primary)",
                    filter: "blur(8px)",
                    zIndex: -1,
                  }}
                ></div>
              </div>
              <span className="text-xl font-bold text-gradient-primary sm:inline font-display">
                RaiseVoice
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {session && (
                <Link
                  href="/"
                  className="px-4 py-2 transition-all duration-300 font-medium rounded-lg hover:bg-opacity-10"
                  style={{ color: "rgb(var(--text-primary))" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgb(var(--bg-secondary))")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Map
                </Link>
              )}
              {session && (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 transition-all duration-300 font-medium rounded-lg hover:bg-opacity-10"
                    style={{ color: "rgb(var(--text-primary))" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgb(var(--bg-secondary))")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    My Issues
                  </Link>

                  {/* Admin Link */}
                  {session.user?.role === "admin" && (
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
                  backgroundColor: "rgb(var(--bg-secondary))",
                  color: "rgb(var(--text-primary))",
                }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon
                    size={20}
                    style={{ color: "rgb(var(--text-primary))" }}
                  />
                )}
              </button>

              {status === "loading" ? (
                <div className="w-24 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
              ) : session ? (
                <div className="flex items-center gap-3 relative" ref={userMenuRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${showUserMenu ? 'scale-110 shadow-md ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105 hover:shadow-md'}`}
                    style={{
                      backgroundColor: "rgba(var(--accent-primary), 0.1)",
                      borderColor: showUserMenu ? "rgb(var(--accent-primary))" : "rgb(var(--border-primary))",
                      color: "rgb(var(--accent-primary))",
                    }}
                    aria-label="User Menu"
                  >
                    <User size={20} />
                  </button>

                  {/* Enhanced Animated User Dropdown Menu */}
                  {showUserMenu && (
                    <div
                      className="absolute right-0 mt-3 top-full w-80 animate-slide-up origin-top-right z-50 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl transition-all duration-300 transform opacity-100 scale-100"
                      style={{
                        background: "rgba(var(--bg-primary), 0.95)",
                        border: "1px solid rgb(var(--border-primary))",
                      }}
                    >
                      {/* Gradient Header Area */}
                      <div 
                        className="px-6 pt-6 pb-4 flex flex-col items-center relative"
                        style={{
                          background: "linear-gradient(to bottom, rgba(var(--accent-primary), 0.1), transparent)",
                          borderBottom: "1px solid rgba(var(--border-primary), 0.5)"
                        }}
                      >
                         <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center shadow-md mb-3 bg-gradient-to-tr from-[rgba(var(--accent-primary),0.2)] to-[rgba(var(--accent-secondary),0.2)]"
                          style={{
                            border: "3px solid rgb(var(--bg-primary))",
                            color: "rgb(var(--accent-primary))",
                          }}
                        >
                          <User size={28} />
                        </div>
                        <h3 className="font-display font-bold text-lg leading-tight w-full text-center truncate" style={{ color: "rgb(var(--text-primary))" }}>
                          {session.user?.name || "User"}
                        </h3>
                        <p className="text-xs font-semibold px-2 py-0.5 mt-2 rounded-full w-fit bg-[rgba(var(--accent-primary),0.1)] text-[rgb(var(--accent-primary))]" >
                          {session.user?.role === 'admin' ? 'Administrator' : 'Community Member'}
                        </p>
                      </div>

                      {/* User Details Area */}
                      <div className="px-5 py-3 space-y-2">
                        <div className="flex items-center gap-3 text-sm px-2 py-1.5 rounded-lg transition-colors" style={{ color: "rgb(var(--text-secondary))" }}>
                           <Mail size={16} className="shrink-0 opacity-70" style={{ color: 'rgb(var(--accent-primary))' }} />
                           <span className="truncate">{session.user?.email}</span>
                        </div>
                        {session.user?.phone && (
                          <div className="flex items-center gap-3 text-sm px-2 py-1.5 rounded-lg transition-colors" style={{ color: "rgb(var(--text-secondary))" }}>
                             <Phone size={16} className="shrink-0 opacity-70" style={{ color: 'rgb(var(--accent-primary))' }} />
                             <span className="truncate">{session.user?.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Area */}
                      <div 
                        className="p-4 flex flex-col gap-2"
                        style={{
                          backgroundColor: "rgba(var(--bg-secondary), 0.5)",
                          borderTop: "1px solid rgba(var(--border-primary), 0.5)"
                        }}
                      >
                        <Link
                          href="/profile"
                          className="w-full btn-primary py-2.5 text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User size={16} />
                          View Profile
                        </Link>
                        <button
                          onClick={handleSignOutRequest}
                          className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                          style={{ 
                            color: "rgb(var(--accent-error))",
                            backgroundColor: "rgba(var(--accent-error), 0.1)",
                            border: "1px solid rgba(var(--accent-error), 0.2)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(var(--accent-error), 0.2)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(var(--accent-error), 0.1)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <LogOut size={16} />
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
                      color: "rgb(var(--text-primary))",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgb(var(--bg-secondary))")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="btn-primary">
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
                  backgroundColor: "rgb(var(--bg-secondary))",
                  color: "rgb(var(--text-primary))",
                }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon
                    size={20}
                    style={{ color: "rgb(var(--text-primary))" }}
                  />
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav
              className="md:hidden py-4 border-t animate-slide-down"
              style={{
                backgroundColor: "rgb(var(--bg-primary))",
                borderColor: "rgb(var(--border-primary))",
              }}
            >
              <div className="flex flex-col gap-2">
                {session && <Link
                  href="/"
                  className="px-4 py-3 rounded-lg transition-all duration-300"
                  style={{ color: "rgb(var(--text-primary))" }}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgb(var(--bg-secondary))")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Map
                </Link>}
                {session && (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-left font-medium rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      My Issues
                    </Link>

                    {/* Admin Link - Mobile */}
                    {session.user?.role === "admin" && (
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
                        backgroundColor: "rgb(var(--bg-secondary))",
                        color: "rgb(var(--text-primary))",
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={20} />
                      {session.user?.name}
                    </Link>
                    <button
                      onClick={handleSignOutRequest}
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
                      style={{ color: "rgb(var(--text-primary))" }}
                      onClick={() => setMobileMenuOpen(false)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgb(var(--bg-secondary))")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
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
    </>
  );
}
