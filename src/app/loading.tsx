import { Bot } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950 -z-10" />

      {/* Animated Logo */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center neon-border-blue animate-pulse">
          <Bot className="w-8 h-8 text-sky-400" />
        </div>
        {/* Orbiting dot */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-sky-400 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
          EduAI
        </span>
        <span className="text-sm text-slate-500 animate-pulse">
          Loading your dashboard...
        </span>
      </div>

      {/* Skeleton shimmer bar */}
      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent rounded-full animate-[shimmer_1.5s_infinite]" />
      </div>
    </div>
  );
}
