import { useState } from 'react';
import { Users, AlertTriangle, BookMarked, Search, Plus, UploadCloud, FileText, CheckCircle2, ClipboardCheck, Calendar } from 'lucide-react';

const mockStudents = [
  { id: 1, name: 'Ali Hassan', mastery: 78, weakTopic: 'Quadratic Eq.', status: 'improving', present: true },
  { id: 2, name: 'Sara Khan', mastery: 92, weakTopic: 'None', status: 'exceling', present: true },
  { id: 3, name: 'Ahmed Raza', mastery: 45, weakTopic: 'Trigonometry', status: 'at-risk', present: false },
  { id: 4, name: 'Fatima Bilal', mastery: 67, weakTopic: 'Chemical Bonds', status: 'stable', present: true },
  { id: 5, name: 'Usman Tariq', mastery: 55, weakTopic: 'Cell Biology', status: 'struggling', present: false },
];

export default function TeacherDashboard({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";
  
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'attendance'>('overview');
  const [attendanceData, setAttendanceData] = useState(mockStudents);

  const toggleAttendance = (id: number) => {
    setAttendanceData(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  return (
    <div className="flex flex-col gap-6 h-full w-full overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Classroom Overview</h1>
          <p className="text-slate-400 mt-1">Class 10-A (Science Group) • {mockStudents.length} Students</p>
        </div>
        
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'assignments' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Assignments
          </button>
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'attendance' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Attendance
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Alerts & Insights */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="glass-card p-5">
              <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                AI Intervention Alerts
              </h3>
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-xs font-bold text-red-400 uppercase">Critical</span>
                  <p className="text-sm text-slate-300 mt-1">Ahmed Raza&apos;s mastery in Math dropped by 15% this week.</p>
                </div>
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <span className="text-xs font-bold text-orange-400 uppercase">Warning</span>
                  <p className="text-sm text-slate-300 mt-1">4 students are struggling with &quot;Chemical Bonds&quot;.</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-5 flex-1">
               <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                 <UploadCloud className="w-5 h-5 text-purple-400" />
                 Upload Syllabus / Books
               </h3>
               <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-800/30 hover:border-sky-500/50 transition-colors cursor-pointer group">
                 <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-sky-500/20 transition-colors">
                   <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-sky-400" />
                 </div>
                 <p className="text-sm text-slate-300 font-medium mb-1">Click or drag files here</p>
               </div>
            </div>
          </div>

          {/* Student Roster Heatmap */}
          <div className="glass-card p-0 flex flex-col lg:col-span-2 overflow-hidden">
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Student Roster & Heatmap
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search student..." 
                  className="bg-slate-900 border border-slate-700 rounded-lg py-1.5 pl-9 pr-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-xs uppercase tracking-wider text-slate-400">
                    <th className="p-4 font-medium">Student Name</th>
                    <th className="p-4 font-medium text-center">Mastery Level</th>
                    <th className="p-4 font-medium">Identified Weakness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {mockStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-medium text-slate-200">{student.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3 justify-center">
                          <span className="text-sm font-bold text-white w-8">{student.mastery}%</span>
                          <div className="flex-1 max-w-[100px] h-2 bg-slate-800 rounded-full overflow-hidden">
                             <div 
                               className={`h-full rounded-full ${
                                 student.mastery > 80 ? 'bg-emerald-500' : 
                                 student.mastery > 60 ? 'bg-sky-500' : 
                                 student.mastery > 40 ? 'bg-orange-500' : 'bg-red-500'
                               }`}
                               style={{ width: `${student.mastery}%` }}
                             />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{student.weakTopic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="glass-card p-6 animate-in fade-in h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-sky-400" />
              Active Assignments
            </h3>
            <button className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Assignment
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 transition-colors flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white">Physics: Force and Motion MCQ</h4>
                <p className="text-sm text-slate-400 mt-1">Due: Tomorrow • 25/32 Submitted</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">Auto-Grade</button>
                 <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">View Results</button>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 transition-colors flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white">Math: Quadratic Equations Worksheet</h4>
                <p className="text-sm text-slate-400 mt-1">Due: Friday • 10/32 Submitted</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">View Results</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="glass-card p-6 animate-in fade-in flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Daily Attendance
            </h3>
            <div className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              Today: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-xs uppercase tracking-wider text-slate-400">
                    <th className="p-4 font-medium">Student Name</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {attendanceData.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-medium text-slate-200">{student.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${student.present ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {student.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => toggleAttendance(student.id)}
                          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
          
          <div className="mt-6 flex justify-end">
             <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
               Save Attendance & Notify Parents
             </button>
          </div>
        </div>
      )}

    </div>
  );
}
