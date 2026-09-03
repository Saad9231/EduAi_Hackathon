"use client";

import { Bot, RefreshCw, Home } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("[EduAI Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-slate-950 to-slate-950 -z-10" />

      <div className="glass-card border border-red-500/20 p-8 sm:p-12 max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center relative">
          <Bot className="w-10 h-10 text-red-400" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
            !
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-slate-400 leading-relaxed mb-8 text-sm">
          Our AI agents encountered an unexpected issue. Don&apos;t worry, your
          progress is saved. Try refreshing, or head back to the dashboard.
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-slate-600 mb-6 bg-slate-900/50 rounded-lg px-4 py-2 inline-block">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
