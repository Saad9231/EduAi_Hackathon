"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StudentDashboard from "@/components/StudentDashboard";
import AITutorChat from "@/components/AITutorChat";
import SmartQuizGenerator from "@/components/SmartQuizGenerator";
import AINotesGenerator from "@/components/AINotesGenerator";
import AssignmentViewer from "@/components/AssignmentViewer";
import FlashcardsViewer from "@/components/FlashcardsViewer";
import DigitalLibrary from "@/components/DigitalLibrary";
import AdminDashboard from "@/components/AdminDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import ParentDashboard from "@/components/ParentDashboard";
import { LayoutDashboard, MessageSquare, BookOpenCheck, Users, HeartHandshake, LogOut, FileText, ClipboardCheck, Layers, Library, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("student");
  const [language, setLanguage] = useState<"EN" | "UR">("EN");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("eduai_role");
    if (!savedRole) {
      router.push("/auth");
      return;
    }
    setRole(savedRole);
    if (savedRole === "teacher") setActiveTab("teacher");
    else if (savedRole === "parent") setActiveTab("parent");
    else if (savedRole === "admin") setActiveTab("admin");
    else setActiveTab("student");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!role) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }


  const handleLogout = () => {
    localStorage.removeItem("eduai_role");
    router.push("/auth");
  };

  const allTabs = [
    { id: "student", label: "Student Hub", icon: LayoutDashboard, roles: ["student"] },
    { id: "tutor", label: "AI Tutor", icon: MessageSquare, roles: ["student", "teacher"] },
    { id: "quiz", label: "Smart Quiz", icon: BookOpenCheck, roles: ["student"] },
    { id: "notes", label: "Smart Notes", icon: FileText, roles: ["student", "teacher"] },
    { id: "flashcards", label: "Flashcards", icon: Layers, roles: ["student"] },
    { id: "assignments", label: "Assignments", icon: ClipboardCheck, roles: ["student"] },
    { id: "library", label: "Digital Library", icon: Library, roles: ["student", "teacher", "parent"] },
    { id: "teacher", label: "Teacher Portal", icon: Users, roles: ["teacher"] },
    { id: "parent", label: "Parent Tracker", icon: HeartHandshake, roles: ["parent"] },
    { id: "admin", label: "Admin Panel", icon: Shield, roles: ["admin"] },
  ];

  const visibleTabs = allTabs.filter(t => t.roles.includes(role));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar language={language} setLanguage={setLanguage} />
      
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Sidebar Navigation (Desktop) / Horizontal Scroll (Mobile) */}
        <div className="w-full md:w-64 flex-shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal ${
                  isActive 
                    ? "bg-sky-500/10 text-sky-400 neon-border-blue border" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-sky-400" : ""}`} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
          
          <div className="md:mt-auto pt-4 md:border-t border-slate-700/50">
             <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout ({role})</span>
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="glass-card p-4 sm:p-6 h-full min-h-[500px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {activeTab === "student" && <StudentDashboard language={language} />}
            {activeTab === "tutor" && <AITutorChat language={language} />}
            {activeTab === "quiz" && <SmartQuizGenerator language={language} />}
            {activeTab === "notes" && <AINotesGenerator language={language} />}
            {activeTab === "flashcards" && <FlashcardsViewer language={language} />}
            {activeTab === "assignments" && <AssignmentViewer language={language} />}
            {activeTab === "library" && <DigitalLibrary language={language} />}
            {activeTab === "teacher" && <TeacherDashboard language={language} />}
            {activeTab === "parent" && <ParentDashboard language={language} />}
            {activeTab === "admin" && <AdminDashboard />}
          </div>
        </div>
      </main>
    </div>
  );
}
