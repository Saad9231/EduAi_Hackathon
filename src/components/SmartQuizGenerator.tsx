import { useState } from 'react';
import { Target, CheckCircle2, XCircle, BrainCircuit, ArrowRight, Activity } from 'lucide-react';

export default function SmartQuizGenerator({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";
  
  const [currentStep, setCurrentStep] = useState<'config' | 'quiz' | 'results'>('config');

  return (
    <div className="flex flex-col h-full items-center justify-center p-4">
      
      {currentStep === 'config' && (
        <div className="w-full max-w-2xl glass-card p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-6 neon-border-blue">
            <Target className="w-8 h-8 text-sky-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Smart Diagnostic Quiz</h2>
          <p className="text-slate-400 mb-8 max-w-md">
            Generate an adaptive test based on your recent weak areas. Questions are calibrated to FBISE and PTB standards.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
            <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 text-left cursor-pointer hover:border-sky-500/50 transition-colors">
               <h4 className="font-semibold text-slate-200">Subject</h4>
               <select className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:outline-none focus:border-sky-500">
                 <option>Physics (Class 10)</option>
                 <option>Math (Class 10)</option>
                 <option>Chemistry (Class 10)</option>
               </select>
            </div>
            <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 text-left cursor-pointer hover:border-sky-500/50 transition-colors">
               <h4 className="font-semibold text-slate-200">Difficulty Focus</h4>
               <select className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:outline-none focus:border-sky-500">
                 <option>Adaptive (AI Recommended)</option>
                 <option>Hard (Exam Prep)</option>
                 <option>Basic (Concept Review)</option>
               </select>
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentStep('quiz')}
            className="px-8 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center gap-2"
          >
            <BrainCircuit className="w-5 h-5" />
            Generate & Start Quiz
          </button>
        </div>
      )}

      {currentStep === 'quiz' && (
        <div className="w-full max-w-3xl flex flex-col h-full animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-sky-900/50 flex items-center justify-center border border-sky-500/30 text-sky-400 font-bold">
                 3
               </div>
               <span className="text-slate-400 font-medium">of 15 Questions</span>
             </div>
             <div className="px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-sm font-mono text-slate-300 flex items-center gap-2">
               <Activity className="w-4 h-4 text-emerald-400" /> AI Calibrating...
             </div>
          </div>
          
          <div className="glass-card p-8 flex-1 flex flex-col">
            <h3 className={`text-xl font-medium text-white mb-8 leading-relaxed ${isUrdu ? 'text-right font-urdu' : ''}`}>
              {isUrdu 
                ? 'اگر ایک جسم کو سیدھا اوپر پھینکا جائے، تو سب سے اونچے مقام پر اس کی رفتار (velocity) کیا ہوگی؟' 
                : 'If a body is thrown vertically upward, what will be its velocity at the highest point?'}
            </h3>
            
            <div className="flex flex-col gap-4 mt-auto">
              {[
                { id: 'a', text: isUrdu ? 'زیادہ سے زیادہ (Maximum)' : 'Maximum' },
                { id: 'b', text: isUrdu ? 'صفر (Zero)' : 'Zero', correct: true },
                { id: 'c', text: isUrdu ? '9.8 m/s' : '9.8 m/s' },
                { id: 'd', text: isUrdu ? 'ابتدائی رفتار کے برابر' : 'Equal to initial velocity' },
              ].map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setCurrentStep('results')}
                  className={`w-full p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-700 hover:border-sky-500/50 transition-all flex items-center gap-4 ${isUrdu ? 'flex-row-reverse text-right font-urdu' : 'text-left'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 font-bold uppercase">
                    {opt.id}
                  </div>
                  <span className="text-slate-200">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === 'results' && (
        <div className="w-full max-w-2xl glass-card p-8 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500">
           <div className="relative mb-6">
             <div className="w-24 h-24 rounded-full bg-slate-900 border-[6px] border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
               <span className="text-3xl font-bold text-white">85%</span>
             </div>
           </div>
           
           <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
           <p className="text-slate-400 mb-8 text-center">
             Great job! Your mastery in Physics has increased. You accurately answered most of the conceptual questions.
           </p>
           
           <div className="w-full bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 mb-8">
              <h4 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" /> AI Diagnostic Feedback
              </h4>
              <div className="space-y-3">
                 <div className="flex gap-3 text-sm">
                   <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                   <p className="text-slate-300">Strong grasp of <strong>Kinematics equations</strong>. You solved numerical problems 30% faster than average.</p>
                 </div>
                 <div className="flex gap-3 text-sm">
                   <XCircle className="w-5 h-5 text-orange-400 shrink-0" />
                   <p className="text-slate-300">Needs review on <strong>Projectile Motion</strong> angles. The AI Tutor has automatically scheduled a 10-minute review for tomorrow.</p>
                 </div>
              </div>
           </div>
           
           <button 
             onClick={() => setCurrentStep('config')}
             className="px-6 py-2.5 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors flex items-center gap-2"
           >
             Return to Dashboard <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      )}
      
    </div>
  );
}
