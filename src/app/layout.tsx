import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import { config } from "@/lib/config";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${config.appName} - Smart Learning Platform`,
    template: `%s | ${config.appName}`,
  },
  description:
    "AI-Powered Learning Platform for Pakistani Students. FBISE & PTB Board exam preparation with Agentic AI Tutoring, Smart Diagnostics, and Bilingual Support.",
  keywords: [
    "EduAI",
    "AI Tutor",
    "FBISE",
    "PTB",
    "Pakistan Education",
    "Smart Quiz",
    "Matric Exam",
    "Online Learning",
    "Urdu Education",
  ],
  authors: [{ name: "EduAI Team" }],
  creator: "EduAI",
  metadataBase: new URL(config.siteUrl),

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: config.siteUrl,
    siteName: config.appName,
    title: `${config.appName} - AI-Powered Learning for Pakistani Students`,
    description:
      "Personalized AI Tutoring, Smart Quizzes, and Board Exam Prep for FBISE & PTB students.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${config.appName} Dashboard Preview`,
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: `${config.appName} - Smart Learning Platform`,
    description:
      "AI-Powered Board Exam Preparation for Pakistani Students.",
    images: ["/og-image.png"],
  },

  // PWA Manifest
  manifest: "/manifest.json",

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoNastaliq.variable} dark`}>
      <head>
        {/* Structured Data (JSON-LD) for Educational Platform */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: config.appName,
              url: config.siteUrl,
              description:
                "AI-Powered Learning Platform for Pakistani Students with FBISE & PTB Board Exam Preparation.",
              sameAs: [],
              areaServed: {
                "@type": "Country",
                name: "Pakistan",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-950 text-slate-50 selection:bg-sky-600/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950 -z-10" />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid rgba(148,163,184,0.15)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#1e293b" },
              style: {
                background: "#1e293b",
                border: "1px solid rgba(16,185,129,0.3)",
                boxShadow: "0 8px 32px rgba(16,185,129,0.15)",
              },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#1e293b" },
              style: {
                background: "#1e293b",
                border: "1px solid rgba(239,68,68,0.3)",
                boxShadow: "0 8px 32px rgba(239,68,68,0.15)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
