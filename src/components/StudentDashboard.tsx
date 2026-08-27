import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Timer, Zap, BookOpen, Clock, WifiOff, CalendarDays, CheckCircle2, X, Play, Loader2 } from 'lucide-react';

const mockChartData = [
  { name: 'Mon', physics: 40, math: 24, chemistry: 24 },
  { name: 'Tue', physics: 30, math: 13, chemistry: 22 },
  { name: 'Wed', physics: 20, math: 58, chemistry: 22 },
  { name: 'Thu', physics: 27, math: 39, chemistry: 20 },
  { name: 'Fri', physics: 18, math: 48, chemistry: 21 },
  { name: 'Sat', physics: 23, math: 38, chemistry: 25 },
  { name: 'Sun', physics: 34, math: 43, chemistry: 21 },
];

type TaskStatus = 'completed' | 'current' | 'upcoming';
interface Task {
  id: string;
  time: string;
  title: string;
  subject: string;
  status: TaskStatus;
  description: string;
}

const initialTasks: Task[] = [
  { id: '1', time: "09:00 AM", title: "Resolve Weak Topic: Trigonometry", subject: "Math", status: "completed", description: "You successfully completed the AI Tutor session on trigonometric identities." },
  { id: '2', time: "11:30 AM", title: "Take Adaptive Physics MCQ", subject: "Physics", status: "current", description: "A 15-question adaptive quiz focusing on Newtonian mechanics to test your recent learnings." },
  { id: '3', time: "02:00 PM", title: "Review Chemistry Bonds", subject: "Chemistry", status: "upcoming", description: "Review chapter 4 notes on covalent and ionic bonding provided by the AI." },
  { id: '4', time: "04:00 PM", title: "Urdu Grammar Practice", subject: "Urdu", status: "upcoming", description: "Complete the interactive exercise on Urdu sentence structure and idioms." },
];

export default function StudentDashboard({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";
  
  // State for Planner Agent
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  
  // State for Quick Actions
  const [showQuizModal, setShowQuizModal] = useState(false);

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setTasks(prev => [
        ...prev.map(t => ({ ...t, status: 'completed' as TaskStatus })),
        { id: `gen-${Date.now()}-1`, time: "09:00 AM", title: "Review Biology: Cell Structure", subject: "Biology", status: "current", description: "Tomorrow's first task generated based on your past performance." },
        { id: `gen-${Date.now()}-2`, time: "11:00 AM", title: "Math: Quadratic Equations", subject: "Math", status: "upcoming", description: "Tackling your identified weak areas in Algebra." }
      ]);
      setIsGeneratingPlan(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 h-full w-full overflow-y-auto scrollbar-hide relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold text-white ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu ? 'خوش آمدید، علی حسن!' : 'Welcome back, Ali Hassan!'}
          </h1>
          <p className={`text-slate-400 mt-1 ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu ? 'آپ کے سیکھنے کا سفر شاندار جا رہا ہے۔' : 'Your learning velocity is looking great today.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center gap-2 text-sm text-slate-300">
            <WifiOff className="w-4 h-4 text-emerald-400" />
            <span>Cached (Offline Ready)</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600/20 to-blue-600/20 border border-sky-500/30 flex items-center gap-2">
            <Timer className="w-5 h-5 text-sky-400" />
            <div className="flex flex-col">
              <span className="text-xs text-sky-200 uppercase font-semibold">FBISE Matric</span>
              <span className="font-mono font-bold text-white leading-none">42d 14h 23m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Chart */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Streak & Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-orange-400">
                <Zap className="w-5 h-5 fill-current" />
                <span className="font-bold">Streak</span>
              </div>
              <span className="text-3xl font-bold text-white">14<span className="text-lg text-slate-400 font-normal"> days</span></span>
            </div>
            
            <div className="glass-card p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sky-400">
                <BookOpen className="w-5 h-5" />
                <span className="font-bold">Mastery</span>
              </div>
              <span className="text-3xl font-bold text-white">78<span className="text-lg text-slate-400 font-normal">%</span></span>
            </div>
            
            <div className="glass-card p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-purple-400">
                <Clock className="w-5 h-5" />
                <span className="font-bold">Study Time</span>
              </div>
              <span className="text-3xl font-bold text-white">4<span className="text-lg text-slate-400 font-normal">h</span> 12<span className="text-lg text-slate-400 font-normal">m</span></span>
            </div>

            <button 
              onClick={() => setShowQuizModal(true)}
              className="glass-card p-4 flex flex-col gap-2 relative overflow-hidden group text-left transition-transform hover:scale-[1.02] active:scale-95"
            >
              <div className="absolute inset-0 bg-sky-500/10 group-hover:bg-sky-500/20 transition-colors" />
              <div className="relative z-10 flex flex-col justify-center h-full items-center text-center w-full">
                 <span className="font-bold text-sky-300">Take Daily Quiz</span>
                 <span className="text-xs text-slate-400 mt-1">+50 XP</span>
              </div>
            </button>
          </div>

          {/* Velocity Chart */}
          <div className="glass-card p-6 flex-1 min-h-[300px]">
            <h3 className="font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-sky-400" />
              Mastery Velocity
            </h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="physics" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0ea5e9' }} />
                  <Line type="monotone" dataKey="math" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Planner Agent */}
        <div className="glass-card p-6 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-sky-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-purple-400" />
              Planner Agent
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-sky-500/20 text-sky-300 rounded-full border border-sky-500/30">
              AI Optimized
            </span>
          </div>

          <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {tasks.map((task) => (
              <button 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-xl border flex gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                task.status === 'completed' ? 'bg-slate-800/30 border-slate-700/50 opacity-60 hover:opacity-100' :
                task.status === 'current' ? 'bg-sky-900/20 border-sky-500/40 neon-border-blue hover:bg-sky-900/30' :
                'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
              }`}>
                <div className="mt-1 flex-shrink-0">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : task.status === 'current' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-sky-400 flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 bg-sky-400 rounded-full" />
                      <div className="absolute inset-0 rounded-full border-2 border-sky-400 animate-ping opacity-75" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                  )}
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${task.status === 'current' ? 'text-sky-300' : 'text-slate-300'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{task.time}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">•</span>
                    <span className="text-xs font-medium text-slate-400">{task.subject}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className="w-full mt-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-colors border border-slate-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPlan ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                Generating Plan...
              </>
            ) : (
              "Generate Tomorrow's Plan"
            )}
          </button>
        </div>

      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${selectedTask.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : selectedTask.status === 'current' ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
                {selectedTask.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <CalendarDays className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{selectedTask.subject}</span>
                <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{selectedTask.title}</h3>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {selectedTask.description}
            </p>

            <div className="flex items-center justify-between mb-6 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
               <div className="flex flex-col">
                 <span className="text-xs text-slate-500">Scheduled Time</span>
                 <span className="text-sm font-medium text-slate-300">{selectedTask.time}</span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-xs text-slate-500">Status</span>
                 <span className={`text-sm font-medium capitalize ${selectedTask.status === 'completed' ? 'text-emerald-400' : selectedTask.status === 'current' ? 'text-sky-400' : 'text-slate-400'}`}>
                   {selectedTask.status}
                 </span>
               </div>
            </div>

            {selectedTask.status !== 'completed' && (
              <button 
                onClick={() => setSelectedTask(null)} // In a real app, this would route to the Quiz/Tutor tab
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Start Task Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Confirmation Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
            
            <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4 neon-border-blue">
              <BookOpen className="w-8 h-8 text-sky-400" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Ready for your Daily Quiz?</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              This is a 10-question adaptive quiz covering Physics and Math to test your recent knowledge. It will take approximately 15 minutes.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowQuizModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700"
              >
                Not Now
              </button>
              <button 
                onClick={() => setShowQuizModal(false)} // In a real app, this routes to the Smart Quiz tab
                className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Let's Go
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
