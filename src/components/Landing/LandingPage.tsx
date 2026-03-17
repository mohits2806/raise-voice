"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import {
  MapPin,
  Camera,
  Bell,
  Shield,
  Smartphone,
  Moon,
  Mail,
  ChevronDown,
  ArrowRight,
  Droplets,
  Zap,
  TrafficCone,
  Trash2,
  Lightbulb,
  Waves,
} from "lucide-react";

// Dynamic import for Leaflet map to avoid SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/Map/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-3xl flex items-center justify-center border"
        style={{
          backgroundColor: "rgb(var(--bg-tertiary))",
          borderColor: "rgb(var(--border-primary))",
        }}
      >
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(var(--accent-primary), 0.3)", borderTopColor: "rgb(var(--accent-primary))" }}
        />
      </div>
    ),
  }
);

/* ─────────────────────── helpers ─────────────────────── */

function Section({
  children,
  className = "",
  id,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

function FloatingIcon({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{ y: [0, -14, 0] }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────── MAIN ─────────────────────── */

export default function LandingPage() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    // Fetch issues for the live map
    const fetchIssues = async () => {
      try {
        const response = await fetch("/api/issues");
        const data = await response.json();
        setIssues(data.issues || []);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      }
    };
    fetchIssues();
  }, []);

  const scrollDown = () =>
    document
      .getElementById("story-start")
      ?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="overflow-hidden">
      {/* ══════════════════════════════════════════════════
          1 — HERO: Full-viewport cinematic intro
      ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center px-4 overflow-hidden"
      >
        {/* Parallax background layer */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Gradient blobs */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-400/25 dark:bg-indigo-600/20 blur-[140px] animate-blob" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-purple-400/25 dark:bg-purple-600/20 blur-[140px] animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-pink-400/20 dark:bg-pink-600/15 blur-[140px] animate-blob animation-delay-4000" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgb(var(--text-primary)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--text-primary)) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>

        {/* Floating category icons */}
        <FloatingIcon delay={0} className="top-[18%] left-[8%] md:left-[15%]">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-sm border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg">
            <Droplets size={26} />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={0.5} className="top-[25%] right-[6%] md:right-[12%]">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-500/20 backdrop-blur-sm border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg">
            <TrafficCone size={22} />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={1} className="bottom-[28%] left-[10%] md:left-[18%]">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 dark:bg-green-500/20 backdrop-blur-sm border border-green-500/20 flex items-center justify-center text-green-500 shadow-lg">
            <Trash2 size={22} />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={1.5} className="bottom-[22%] right-[8%] md:right-[16%]">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 dark:bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-lg">
            <Zap size={26} />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={2} className="top-[45%] left-[3%] md:left-[6%] hidden md:flex">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur-sm border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg">
            <Lightbulb size={20} />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={2.5} className="top-[12%] right-[30%] hidden lg:flex">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/20 flex items-center justify-center text-cyan-500 shadow-lg">
            <Waves size={20} />
          </div>
        </FloatingIcon>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight mb-6 leading-[1.05]"
          >
            <span style={{ color: "rgb(var(--text-primary))" }}>
              Your City.
            </span>
            <br />
            <span className="text-gradient">Your Voice.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            Report civic issues in Solapur—potholes, leaks, broken streetlights—and watch the
            Corporation fix them. Completely anonymous. Completely real-time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => router.push("/auth/signup")}
              className="btn-primary text-lg flex items-center gap-2.5 group"
            >
              Get Started Free
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={() => router.push("/auth/signin")}
              className="px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: "rgb(var(--bg-tertiary))",
                border: "2px solid rgb(var(--border-primary))",
                color: "rgb(var(--text-primary))",
              }}
            >
              I have an account
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2 — THE PROBLEM
      ══════════════════════════════════════════════════ */}
      <Section
        id="story-start"
        className="py-24 md:py-36 px-4"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <p
            className="text-sm font-bold tracking-[0.2em] uppercase mb-6"
            style={{ color: "rgb(var(--accent-primary))" }}
          >
            The Problem
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight mb-8"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Every day, citizens of Solapur see issues
            <span className="text-gradient"> that nobody reports.</span>
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed font-medium max-w-3xl mx-auto"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            A broken water pipe at Laxmi Chowk. A pothole on Hotgi Road. A streetlight out in
            Sadar Bazaar. Everyone notices—but who tells the Corporation? Where do you even call?
            Who follows up?
          </p>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════
          3 — THE SOLUTION
      ══════════════════════════════════════════════════ */}
      <Section
        className="py-24 md:py-36 px-4"
        style={{ backgroundColor: "rgb(var(--bg-secondary))" }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <p
            className="text-sm font-bold tracking-[0.2em] uppercase mb-6"
            style={{ color: "rgb(var(--accent-secondary))" }}
          >
            The Solution
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight mb-8"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            RaiseVoice turns every citizen into a
            <span className="text-gradient"> civic superhero.</span>
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed font-medium max-w-3xl mx-auto mb-16"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            Just open the map, drop a pin, and add a photo. The Solapur Municipal Corporation 
            receives it instantly. You stay anonymous. The issue gets tracked until resolved.
          </p>

          {/* Issue categories showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Droplets size={24} />, label: "Water Supply", color: "text-blue-500", bg: "bg-blue-500/10 dark:bg-blue-500/20", border: "border-blue-500/20" },
              { icon: <Waves size={24} />, label: "Drainage", color: "text-cyan-500", bg: "bg-cyan-500/10 dark:bg-cyan-500/20", border: "border-cyan-500/20" },
              { icon: <TrafficCone size={24} />, label: "Roads", color: "text-red-500", bg: "bg-red-500/10 dark:bg-red-500/20", border: "border-red-500/20" },
              { icon: <Trash2 size={24} />, label: "Garbage", color: "text-green-500", bg: "bg-green-500/10 dark:bg-green-500/20", border: "border-green-500/20" },
              { icon: <Zap size={24} />, label: "Electricity", color: "text-yellow-500", bg: "bg-yellow-500/10 dark:bg-yellow-500/20", border: "border-yellow-500/20" },
              { icon: <Lightbulb size={24} />, label: "Streetlights", color: "text-amber-500", bg: "bg-amber-500/10 dark:bg-amber-500/20", border: "border-amber-500/20" },
            ].map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border backdrop-blur-sm cursor-default ${cat.bg} ${cat.border}`}
              >
                <span className={cat.color}>{cat.icon}</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  {cat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════
          4 — HOW IT WORKS (3 Steps — Storytelling)
      ══════════════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-4">
        <div className="container mx-auto max-w-6xl">
          <Section>
            <p
              className="text-sm font-bold tracking-[0.2em] uppercase mb-6 text-center"
              style={{ color: "rgb(var(--accent-primary))" }}
            >
              How It Works
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-center mb-20"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Three taps. That&apos;s all it takes.
            </h2>
          </Section>

          {/* Step 1 */}
          <Section className="mb-24 md:mb-36">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "white",
                  }}
                >
                  Step 1
                </div>
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  Drop a pin on the map
                </h3>
                <p
                  className="text-lg leading-relaxed font-medium"
                  style={{ color: "rgb(var(--text-secondary))" }}
                >
                  See a problem? Open the live map of Solapur—it&apos;s geo-fenced to our 
                  city boundaries—and tap the exact spot. A new report opens instantly.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden border shadow-2xl"
                  style={{
                    background: "var(--gradient-primary)",
                    borderColor: "rgb(var(--border-primary))",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin size={80} className="text-white/80" strokeWidth={1.5} />
                  </div>
                </div>
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 md:-right-6 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md"
                  style={{
                    backgroundColor: "rgb(var(--bg-primary))",
                    borderColor: "rgb(var(--border-primary))",
                  }}
                >
                  <span className="text-2xl mr-2">📍</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "rgb(var(--text-primary))" }}
                  >
                    Pin dropped!
                  </span>
                </motion.div>
              </div>
            </div>
          </Section>

          {/* Step 2 */}
          <Section className="mb-24 md:mb-36">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden border shadow-2xl"
                  style={{
                    background: "var(--gradient-secondary)",
                    borderColor: "rgb(var(--border-primary))",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={80} className="text-white/80" strokeWidth={1.5} />
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-4 -left-4 md:-left-6 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md"
                  style={{
                    backgroundColor: "rgb(var(--bg-primary))",
                    borderColor: "rgb(var(--border-primary))",
                  }}
                >
                  <span className="text-2xl mr-2">📸</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "rgb(var(--text-primary))" }}
                  >
                    Photo attached
                  </span>
                </motion.div>
              </div>
              <div className="order-1 md:order-2">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
                  style={{
                    background: "var(--gradient-secondary)",
                    color: "white",
                  }}
                >
                  Step 2
                </div>
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  Describe it & snap a photo
                </h3>
                <p
                  className="text-lg leading-relaxed font-medium"
                  style={{ color: "rgb(var(--text-secondary))" }}
                >
                  Add a title, description, and up to 5 photos. Choose the category—water, road,
                  garbage—and hit submit. Your report goes directly to SMC authorities.
                </p>
              </div>
            </div>
          </Section>

          {/* Step 3 */}
          <Section>
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #3b82f6)",
                    color: "white",
                  }}
                >
                  Step 3
                </div>
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  Sit back & get notified
                </h3>
                <p
                  className="text-lg leading-relaxed font-medium"
                  style={{ color: "rgb(var(--text-secondary))" }}
                >
                  The Corporation updates the status: Open → In Progress → Resolved. You get a
                  push notification and email at every step. Zero phone calls. Zero follow-ups.
                </p>
              </div>
              <div className="relative">
                <div
                  className="aspect-[4/3] rounded-3xl overflow-hidden border shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #3b82f6)",
                    borderColor: "rgb(var(--border-primary))",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Bell size={80} className="text-white/80" strokeWidth={1.5} />
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -right-4 md:-right-6 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md"
                  style={{
                    backgroundColor: "rgb(var(--bg-primary))",
                    borderColor: "rgb(var(--border-primary))",
                  }}
                >
                  <span className="text-2xl mr-2">🟢</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "rgb(var(--accent-success))" }}
                  >
                    Issue resolved!
                  </span>
                </motion.div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4.5 — LIVE MAP SECION
      ══════════════════════════════════════════════════ */}
      <Section className="py-24 px-4 relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Live from <span className="text-gradient">Solapur</span>
          </h2>
          <p
            className="text-lg md:text-xl font-medium max-w-2xl mx-auto"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            Every pin is a citizen&apos;s voice. See what&apos;s happening in real-time across the city.
          </p>
        </div>

        {/* Map Container with Glow */}
        <div className="relative group rounded-3xl p-2 sm:p-4 backdrop-blur-xl border z-10"
          style={{
            backgroundColor: "rgba(var(--bg-tertiary), 0.5)",
            borderColor: "rgb(var(--border-primary))",
          }}
        >
          {/* Animated border glow */}
          <div className="absolute -inset-0.5 rounded-3xl blur-md opacity-30 group-hover:opacity-60 transition duration-1000 -z-10"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="rounded-2xl overflow-hidden border shadow-xl bg-white dark:bg-gray-900"
            style={{ borderColor: "rgb(var(--border-primary))" }}
          >
            <InteractiveMap
              issues={issues}
              onMapClick={() => {
                // Redirect unauthenticated users to signup if they try to click the landing map
                router.push("/auth/signup");
              }}
              selectedLocation={null}
              userLocation={null}
              height="550px"
            />
          </div>
          
          {/* Map Overlay CTA */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none w-full px-4 z-[400]">
            <div className="px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border pointer-events-auto"
              style={{
                backgroundColor: "rgba(var(--bg-primary), 0.9)",
                borderColor: "rgb(var(--border-primary))",
              }}
            >
               <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "rgb(var(--text-primary))" }}>
                 📍 Join {issues.length}+ reported issues today. <button onClick={() => router.push("/auth/signup")} className="ml-2 font-bold hover:underline" style={{ color: "rgb(var(--accent-primary))" }}>Sign up to report</button>
               </span>
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════
          5 — FEATURES
      ══════════════════════════════════════════════════ */}
      <Section
        className="py-24 md:py-36 px-4"
        style={{ backgroundColor: "rgb(var(--bg-secondary))" }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p
              className="text-sm font-bold tracking-[0.2em] uppercase mb-6"
              style={{ color: "rgb(var(--accent-primary))" }}
            >
              Features
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Built different. Built for Solapur.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <MapPin size={24} />, title: "Geo-fenced Map", desc: "The map is restricted to Solapur city. No noise from other cities." },
              { icon: <Shield size={24} />, title: "100% Anonymous", desc: "Your identity is never visible. Report without fear of retaliation." },
              { icon: <Bell size={24} />, title: "Push Notifications", desc: "Instant alerts when your issue status changes—even on mobile." },
              { icon: <Smartphone size={24} />, title: "Installable PWA", desc: "Add to your home screen. Works like a native app—no App Store needed." },
              { icon: <Mail size={24} />, title: "Email Updates", desc: "Status change emails keep you informed even when you're offline." },
              { icon: <Moon size={24} />, title: "Dark Mode", desc: "A beautiful, eye-friendly dark theme for comfortable nighttime use." },
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 rounded-2xl border cursor-default"
                style={{
                  backgroundColor: "rgb(var(--bg-tertiary))",
                  borderColor: "rgb(var(--border-primary))",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "white",
                  }}
                >
                  {feat.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-2 font-display"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-sm leading-relaxed font-medium"
                  style={{ color: "rgb(var(--text-secondary))" }}
                >
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════
          6 — FINAL CTA
      ══════════════════════════════════════════════════ */}
      <Section className="py-28 md:py-40 px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/15 dark:bg-indigo-500/10 blur-[160px]" />
        </div>

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Solapur deserves
            <span className="text-gradient"> better infrastructure.</span>
          </h2>
          <p
            className="text-lg md:text-xl mb-10 font-medium leading-relaxed"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            You can make it happen. Join thousands of Solapurkars who are already
            making their voices heard. It takes 30 seconds and zero rupees.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/auth/signup")}
            className="btn-primary text-lg md:text-xl px-10 py-4 inline-flex items-center gap-3"
          >
            Start Reporting Now
            <ArrowRight size={22} />
          </motion.button>
          <p
            className="mt-6 text-sm font-medium"
            style={{ color: "rgb(var(--text-tertiary))" }}
          >
            Free forever · No app download needed · 100% anonymous
          </p>
        </div>
      </Section>
    </div>
  );
}
