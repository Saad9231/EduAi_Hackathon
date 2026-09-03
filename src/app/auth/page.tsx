"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Users, HeartHandshake, ArrowRight, Bot, Sparkles, Mail, Lock, User, Github, MoveLeft, Shield } from "lucide-react";

type Role = "student" | "teacher" | "parent" | "admin" | null;
type AuthMode = "role-select" | "signup" | "login";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("role-select");
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isHovered, setIsHovered] = useState<Role>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: "student" as Role,
      title: "Student",
      description: "Access AI Tutor, take quizzes, and track your mastery.",
      icon: GraduationCap,
      color: "text-sky-400",
      bgHover: "hover:bg-sky-500/10 hover:border-sky-500/50",
      activeBg: "bg-sky-500/20 border-sky-500 neon-border-blue"
    },
    {
      id: "teacher" as Role,
      title: "Teacher",
      description: "Manage classes, assign homework, and view AI insights.",
      icon: Users,
      color: "text-purple-400",
      bgHover: "hover:bg-purple-500/10 hover:border-purple-500/50",
      activeBg: "bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
    },
    {
      id: "parent" as Role,
      title: "Parent",
      description: "Monitor progress with weekly executive AI summaries.",
      icon: HeartHandshake,
      color: "text-emerald-400",
      bgHover: "hover:bg-emerald-500/10 hover:border-emerald-500/50",
      activeBg: "bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
    },
    {
      id: "admin" as Role,
      title: "Admin",
      description: "Manage users, subscriptions, and platform settings.",
      icon: Shield,
      color: "text-amber-400",
      bgHover: "hover:bg-amber-500/10 hover:border-amber-500/50",
      activeBg: "bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
    }
  ];

  const handleRoleContinue = () => {
    if (selectedRole) {
      setMode("signup");
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      // For login, if no role was selected, default to student for the prototype
      const finalRole = selectedRole || "student";
      localStorage.setItem("eduai_role", finalRole);
      router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 p-4">
      {/* Animated Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 glass-card border border-slate-800/50 overflow-hidden relative z-10 shadow-2xl rounded-2xl">
        
        {/* Left Side: Branding */}
        <div className="p-8 lg:p-12 flex flex-col justify-between bg-slate-900/80 border-r border-slate-800/50 hidden md:flex relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-900/0 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center neon-border-blue shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                EduAI
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              Unlock Your <br/> <span className="text-sky-400">Learning Potential</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Experience the next generation of education powered by Agentic AI. Personalized tutoring, instant diagnostics, and seamless collaboration.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium text-sky-400 bg-sky-500/10 w-max px-4 py-2 rounded-full border border-sky-500/20 relative z-10 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
            <Sparkles className="w-4 h-4" /> Secure Auth Environment
          </div>
        </div>

        {/* Right Side: Auth State Machine */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-slate-900/40 relative">
          
          {mode === "role-select" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col h-full justify-center">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Join as...</h2>
                <p className="text-slate-400">Select your role to configure your dashboard experience.</p>
              </div>
              
              <div className="flex flex-col gap-4 mb-8">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isActive = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      onMouseEnter={() => setIsHovered(role.id)}
                      onMouseLeave={() => setIsHovered(null)}
                      className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${
                        isActive ? role.activeBg : `bg-slate-800/30 border-slate-700/50 ${role.bgHover}`
                      }`}
                    >
                      <div className={`p-3 rounded-lg bg-slate-900 border border-slate-700/50 transition-colors ${isActive || isHovered === role.id ? 'border-current shadow-lg' : ''} ${role.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg transition-colors ${isActive ? 'text-white' : 'text-slate-200'}`}>
                          {role.title}
                        </h3>
                        <p className={`text-sm mt-1 transition-colors ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                          {role.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-4 mt-auto">
                <button 
                  onClick={handleRoleContinue}
                  disabled={!selectedRole}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    selectedRole 
                      ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-sm text-slate-400">
                  Already have an account? <button onClick={() => setMode("login")} className="text-sky-400 hover:text-sky-300 font-semibold underline decoration-sky-500/30 underline-offset-4">Log in</button>
                </p>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col h-full justify-center">
              <button 
                onClick={() => setMode("role-select")}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 w-max"
              >
                <MoveLeft className="w-4 h-4" /> Back to roles
              </button>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
                <p className="text-slate-400 text-sm">Fill in your details to get started with EduAI.</p>
              </div>

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                  />
                </div>
                
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input 
                    type="email" 
                    required
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input 
                    type="password" 
                    required
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] flex items-center justify-center disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "Sign Up"}
                </button>
              </form>

              <div className="mt-8 flex items-center justify-between text-sm text-slate-500">
                <hr className="w-full border-slate-800" />
                <span className="px-3">or</span>
                <hr className="w-full border-slate-800" />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full py-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800 text-slate-300 font-medium transition-colors flex items-center justify-center gap-3 text-sm">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"></path><path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"></path><path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"></path><path d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z" fill="#34A853"></path></svg>
                  Continue with Google
                </button>
              </div>

              <p className="text-center text-sm text-slate-400 mt-8">
                Already have an account? <button onClick={() => setMode("login")} className="text-sky-400 hover:text-sky-300 font-semibold underline decoration-sky-500/30 underline-offset-4">Log in</button>
              </p>
            </div>
          )}

          {mode === "login" && (
            <div className="animate-in fade-in slide-in-from-left-8 duration-500 flex flex-col h-full justify-center">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-slate-400 text-sm">Enter your credentials to access your dashboard.</p>
              </div>

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input 
                    type="email" 
                    required
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                    <input 
                      type="password" 
                      required
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button type="button" className="text-xs text-sky-400 hover:text-sky-300">Forgot password?</button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] flex items-center justify-center disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "Log In"}
                </button>
              </form>

              <div className="mt-8 flex items-center justify-between text-sm text-slate-500">
                <hr className="w-full border-slate-800" />
                <span className="px-3">or</span>
                <hr className="w-full border-slate-800" />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full py-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800 text-slate-300 font-medium transition-colors flex items-center justify-center gap-3 text-sm">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"></path><path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"></path><path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"></path><path d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z" fill="#34A853"></path></svg>
                  Continue with Google
                </button>
              </div>

              <p className="text-center text-sm text-slate-400 mt-8">
                Don&apos;t have an account? <button onClick={() => setMode("role-select")} className="text-sky-400 hover:text-sky-300 font-semibold underline decoration-sky-500/30 underline-offset-4">Sign up</button>
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
