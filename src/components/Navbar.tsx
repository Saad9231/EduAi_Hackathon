import { Bot, Bell, Settings, Languages, Menu, LogOut, User, CheckCircle2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { signOut, onAuthStateChanged } from "firebase/auth";
interface NavbarProps {
  onMenuToggle?: () => void;
  language: "EN" | "UR";
  setLanguage: (lang: "EN" | "UR") => void;
}

export default function Navbar({ onMenuToggle, language, setLanguage }: NavbarProps) {
  const router = useRouter();
  
  // Dropdown states
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // User state
  const [userName, setUserName] = useState("Guest");
  const [userInitials, setUserInitials] = useState("GU");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        setUserName(user.displayName);
        const initials = user.displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        setUserInitials(initials);
      } else {
        setUserName("Guest User");
        setUserInitials("GU");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("eduai_role");
      router.push("/auth");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-4 py-3 sm:px-6 lg:px-8 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center neon-border-blue">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
              EduAI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center bg-slate-800/50 rounded-full p-1 border border-slate-700/50">
            <button
              onClick={() => setLanguage("EN")}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                language === "EN" ? "bg-sky-500 text-white neon-border-blue" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("UR")}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors font-urdu ${
                language === "UR" ? "bg-sky-500 text-white neon-border-blue" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              اردو
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="p-2 text-slate-400 hover:text-sky-400 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/80">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors flex gap-3">
                    <div className="mt-0.5"><Bot className="w-4 h-4 text-sky-400" /></div>
                    <div>
                      <p className="text-sm text-slate-200">New AI assignment recommendations are ready.</p>
                      <p className="text-xs text-slate-400 mt-1">2 mins ago</p>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-slate-700/50 transition-colors flex gap-3">
                    <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
                    <div>
                      <p className="text-sm text-slate-200">Syllabus processed successfully.</p>
                      <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-400 hover:text-sky-400 transition-colors hidden sm:block"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative hidden sm:block">
            <div 
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden cursor-pointer hover:border-sky-400 transition-colors flex items-center justify-center text-xs font-bold text-white"
            >
              {userInitials}
            </div>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/80">
                  <p className="text-sm font-bold text-white">{userName}</p>
                  <p className="text-xs text-slate-400 truncate">{auth.currentUser?.email || 'No email'}</p>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-sky-400" /> Platform Settings
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Dark Mode</h4>
                  <p className="text-xs text-slate-400">Toggle dark theme</p>
                </div>
                <div className="w-10 h-5 bg-sky-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">AI Tutor Voice</h4>
                  <p className="text-xs text-slate-400">Enable voice responses</p>
                </div>
                <div className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-slate-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full mt-8 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
