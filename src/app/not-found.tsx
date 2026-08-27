import { Bot, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-slate-950 to-slate-950 -z-10" />

      <div className="glass-card p-8 sm:p-12 max-w-lg w-full text-center">
        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-mono font-bold mb-8">
          <Search className="w-4 h-4" /> 404 — Page Not Found
        </div>

        {/* Illustration */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center relative">
          <Bot className="w-12 h-12 text-slate-500" />
          <div className="absolute -bottom-2 -right-2 text-3xl">🔍</div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Lost in the curriculum?
        </h1>
        <p className="text-slate-400 leading-relaxed mb-8 text-sm max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Our AI agents can&apos;t find this route in the syllabus.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
