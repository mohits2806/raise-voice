"use client";

import {
  Github,
  Linkedin,
  Globe,
  Twitter,
  Instagram,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/github/stars")
      .then((res) => res.json())
      .then((data) => setStars(data.stars))
      .catch(() => setStars(null));
  }, []);

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/in/mohit-shaharwale",
      primary: true,
      color: "#0A66C2",
    },
    {
      name: "Portfolio",
      icon: Globe,
      href: "https://mohitshaharwale.netlify.app",
      primary: true,
      color: "rgb(var(--accent-primary))",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/mohits2806",
      color: "rgb(var(--text-primary))",
    },
    {
      name: "X (Twitter)",
      icon: Twitter,
      href: "https://x.com/mohitshaharwale",
      color: "#000000",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/mohit._.2806",
      color: "#E4405F",
    },
  ];

  return (
    <footer
      className="border-t mt-auto"
      style={{
        backgroundColor: "rgb(var(--bg-secondary))",
        borderColor: "rgb(var(--border-primary))",
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3
              className="text-lg font-bold font-display"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              About RaiseVoice
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgb(var(--text-secondary))" }}
            >
              A 100% anonymous civic engagement platform empowering communities
              to report and track local issues without fear of retaliation.
            </p>
            <Link
              href="https://github.com/mohits2806/raise-voice"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "rgb(var(--accent-primary))",
                color: "white",
              }}
            >
              <Star size={18} className="fill-current" />
              <span>Star on GitHub</span>
              {stars !== null && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  {stars.toLocaleString()}
                </span>
              )}
            </Link>
          </div>

          {/* Developer Section */}
          <div className="space-y-4">
            <h3
              className="text-lg font-bold font-display"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Designed & Developed by
            </h3>
            <div className="space-y-2">
              <p
                className="text-base font-semibold"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                Mohit Shaharwale
              </p>
              <p
                className="text-sm"
                style={{ color: "rgb(var(--text-secondary))" }}
              >
                Full Stack Developer passionate about building impactful tech
                solutions.
              </p>
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3
              className="text-lg font-bold font-display"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Connect
            </h3>
            <div className="space-y-3">
              {/* Primary Links */}
              {socialLinks
                .filter((link) => link.primary)
                .map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-[1.02] group"
                    style={{
                      backgroundColor: "rgb(var(--bg-tertiary))",
                      border: "2px solid rgb(var(--border-primary))",
                    }}
                  >
                    <link.icon
                      size={20}
                      className="transition-colors duration-300"
                      style={{ color: link.color }}
                    />
                    <span
                      className="font-medium group-hover:underline"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      {link.name}
                    </span>
                  </Link>
                ))}

              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                {socialLinks
                  .filter((link) => !link.primary)
                  .map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl transition-all duration-300 hover:scale-110"
                      style={{
                        backgroundColor: "rgb(var(--bg-tertiary))",
                        border: "2px solid rgb(var(--border-primary))",
                      }}
                      aria-label={link.name}
                    >
                      <link.icon
                        size={20}
                        className="transition-colors duration-300"
                        style={{ color: link.color }}
                      />
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: "rgb(var(--border-primary))" }}
        >
          <p className="text-sm" style={{ color: "rgb(var(--text-tertiary))" }}>
            © {currentYear} RaiseVoice. Built with ❤️ for the community.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/mohits2806/raise-voice/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline transition-colors duration-300"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              MIT License
            </Link>
            <span style={{ color: "rgb(var(--text-tertiary))" }}>•</span>
            <span
              className="text-sm"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              100% Anonymous Reporting
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
