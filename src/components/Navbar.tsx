import { Bot, Bell, Settings, Languages, Menu } from "lucide-react";

interface NavbarProps {
  onMenuToggle?: () => void;
  language: "EN" | "UR";
  setLanguage: (lang: "EN" | "UR") => void;
}

export default function Navbar({ onMenuToggle, language, setLanguage }: NavbarProps) {
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

          <button className="p-2 text-slate-400 hover:text-sky-400 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow"></span>
          </button>
          
          <button className="p-2 text-slate-400 hover:text-sky-400 transition-colors hidden sm:block">
            <Settings className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden cursor-pointer hover:border-sky-400 transition-colors hidden sm:block">
            <img src={`https://ui-avatars.com/api/?name=Ali+Hassan&background=0284C7&color=fff`} alt="Profile" />
          </div>
        </div>
      </div>
    </nav>
  );
}
