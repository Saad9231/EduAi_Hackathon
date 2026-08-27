import { Users, AlertTriangle, BookMarked, Search, Plus, UploadCloud, FileText } from 'lucide-react';

const mockStudents = [
  { id: 1, name: 'Ali Hassan', mastery: 78, weakTopic: 'Quadratic Eq.', status: 'improving' },
  { id: 2, name: 'Sara Khan', mastery: 92, weakTopic: 'None', status: 'exceling' },
  { id: 3, name: 'Ahmed Raza', mastery: 45, weakTopic: 'Trigonometry', status: 'at-risk' },
  { id: 4, name: 'Fatima Bilal', mastery: 67, weakTopic: 'Chemical Bonds', status: 'stable' },
  { id: 5, name: 'Usman Tariq', mastery: 55, weakTopic: 'Cell Biology', status: 'struggling' },
];

export default function TeacherDashboard({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";

  return (
    <div className="flex flex-col gap-6 h-full w-full overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Classroom Overview</h1>
          <p className="text-slate-400 mt-1">Class 10-A (Science Group) • 32 Students</p>
        </div>
        <button className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Auto-Assign Homework
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
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
                <p className="text-sm text-slate-300 mt-1">Ahmed Raza's mastery in Math dropped by 15% this week. AI suggests a 1-on-1 session.</p>
              </div>
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <span className="text-xs font-bold text-orange-400 uppercase">Warning</span>
                <p className="text-sm text-slate-300 mt-1">4 students are struggling with "Chemical Bonds". Consider reviewing in tomorrow's lecture.</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-5 flex-1">
             <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
               <BookMarked className="w-5 h-5 text-sky-400" />
               Automated Tasks
             </h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-300">Grade Physics Quiz</span>
                 <span className="text-emerald-400 font-medium">Done by AI</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-300">Generate Weekly Reports</span>
                 <span className="text-slate-500 font-medium">Scheduled</span>
               </div>
             </div>
          </div>
          
          {/* Resource Upload Section */}
          <div className="glass-card p-5">
             <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
               <UploadCloud className="w-5 h-5 text-purple-400" />
               Upload Syllabus / Books
             </h3>
             <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-800/30 hover:border-sky-500/50 transition-colors cursor-pointer group">
               <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-sky-500/20 transition-colors">
                 <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-sky-400" />
               </div>
               <p className="text-sm text-slate-300 font-medium mb-1">Click or drag files here</p>
               <p className="text-xs text-slate-500">PDF, JPG, PNG (Max 50MB)</p>
             </div>
             
             {/* Uploaded Resources List */}
             <div className="mt-4 flex flex-col gap-2">
               <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 flex items-center gap-3">
                 <FileText className="w-4 h-4 text-sky-400" />
                 <span className="text-sm text-slate-300 flex-1 truncate">PTB_Physics_10_Syllabus.pdf</span>
                 <span className="text-xs text-slate-500">2.4 MB</span>
               </div>
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
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {mockStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 font-medium text-slate-200">{student.name}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 justify-center">
                        <span className="text-sm font-bold text-white w-8">{student.mastery}%</span>
                        <div className="flex-1 max-w-[100px] h-2 bg-slate-800 rounded-full overflow-hidden">
                           <div 
                             className={`h-full rounded-full ${
                               student.mastery > 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                               student.mastery > 60 ? 'bg-sky-500' : 
                               student.mastery > 40 ? 'bg-orange-500' : 'bg-red-500'
                             }`}
                             style={{ width: `${student.mastery}%` }}
                           />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{student.weakTopic}</td>
                    <td className="p-4 text-right">
                      <button className="text-xs font-medium text-sky-400 hover:text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
