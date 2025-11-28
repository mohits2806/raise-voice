import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import SessionProvider from "@/components/Providers/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "RaiseVoice - Report Community Issues",
  description:
    "Report and track community issues like water supply, potholes, garbage, and more on an interactive map.",
  keywords:
    "community issues, report problems, civic engagement, water supply, infrastructure",
  authors: [{ name: "RaiseVoice Team" }],
  openGraph: {
    title: "RaiseVoice - Report Community Issues",
    description: "Report and track community issues on an interactive map",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RaiseVoice - Report Community Issues",
    description: "Report and track community issues on an interactive map",
  },
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body
        className={`${inter.variable} ${inter.className} min-h-screen transition-colors duration-300`}
      >
        <SessionProvider session={session}>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
