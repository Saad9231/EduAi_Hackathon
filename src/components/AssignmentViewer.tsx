import { useState, useEffect } from 'react';
import { BookMarked, UploadCloud, CheckCircle2, Clock, Play, Loader2 } from 'lucide-react';

const defaultAssignments = [
  { id: '1', title: 'Physics: Force and Motion MCQ', subject: 'Physics', due: 'Tomorrow, 11:59 PM', status: 'pending', type: 'quiz' },
  { id: '2', title: 'Math: Quadratic Equations Worksheet', subject: 'Math', due: 'Friday, 5:00 PM', status: 'pending', type: 'upload' },
  { id: '3', title: 'Chemistry: Balancing Equations', subject: 'Chemistry', due: 'Last Week', status: 'completed', type: 'text', score: '8.5/10' },
];

export default function AssignmentViewer({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";
  
  const [assignmentsList, setAssignmentsList] = useState<any[]>(defaultAssignments);
  const [activeAssignment, setActiveAssignment] = useState<string | number | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/assignments')
      .then(res => res.json())
      .then(data => {
        if (data.assignments && data.assignments.length > 0) {
          const formatted = data.assignments.map((a: any) => ({
            id: a.id,
            title: a.title,
            subject: a.subject,
            due: a.due_date ? new Date(a.due_date).toLocaleDateString() : 'Upcoming',
            status: 'pending',
            type: a.type
          }));
          setAssignmentsList(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const assignment = assignmentsList.find(a => String(a.id) === String(activeAssignment));

  const handleSubmit = async () => {
    if (!assignment) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment_id: String(assignment.id).length > 10 ? assignment.id : '00000000-0000-0000-0000-000000000000',
          student_id: '00000000-0000-0000-0000-000000000000',
          content: answerContent || 'Submitted assignment via portal',
          status: 'submitted'
        })
      });
    } catch {}

    setAssignmentsList(prev => prev.map(a => String(a.id) === String(assignment.id) ? { ...a, status: 'completed', score: 'Pending Grade' } : a));
    setIsSubmitting(false);
    setActiveAssignment(null);
    setAnswerContent('');
    alert(isUrdu ? "اسائنمنٹ کامیابی سے جمع ہو گئی ہے!" : "Assignment submitted successfully!");
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-4">
      
      {!activeAssignment && (
        <div className="w-full max-w-4xl h-full flex flex-col animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center border border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                 <BookMarked className="w-6 h-6 text-sky-400" />
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-white">{isUrdu ? 'اسائنمنٹس اور ہوم ورک' : 'Assignments & Homework'}</h2>
                 <p className="text-sm text-slate-400">{isUrdu ? 'اپنے زیر التوا کام مکمل کریں' : 'Track and complete your pending tasks'}</p>
               </div>
             </div>
          </div>
          
          <div className="grid gap-4 mt-4">
             {assignmentsList.map(a => (
               <div key={a.id} className={`p-5 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:bg-slate-800/50 ${a.status === 'completed' ? 'bg-slate-800/30 border-slate-700/50 opacity-70' : 'bg-slate-800 border-slate-600'}`}>
                 <div className="flex gap-4">
                   <div className="mt-1 flex-shrink-0">
                     {a.status === 'completed' ? (
                       <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                     ) : (
                       <div className="w-6 h-6 rounded-full border-2 border-sky-400 relative flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-sky-400 rounded-full" />
                       </div>
                     )}
                   </div>
                   <div>
                     <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{a.subject}</span>
                     <h3 className={`text-lg font-bold ${a.status === 'completed' ? 'text-slate-300' : 'text-white'}`}>{a.title}</h3>
                     <div className="flex items-center gap-2 mt-1">
                       <Clock className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-xs text-slate-400">Due: {a.due}</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex flex-col sm:items-end">
                    {a.status === 'completed' ? (
                      <span className="text-emerald-400 font-bold px-3 py-1 bg-emerald-500/10 rounded-lg text-sm border border-emerald-500/20">
                        Score: {a.score}
                      </span>
                    ) : (
                      <button 
                        onClick={() => setActiveAssignment(a.id)}
                        className="px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" /> {isUrdu ? 'شروع کریں' : 'Start'}
                      </button>
                    )}
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeAssignment && assignment && (
         <div className="w-full max-w-2xl glass-card p-8 flex flex-col animate-in zoom-in-95 duration-300">
           <div className="flex justify-between items-center border-b border-slate-700/50 pb-4 mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">{assignment.subject}</span>
                <h2 className="text-2xl font-bold text-white mt-1">{assignment.title}</h2>
              </div>
              <button 
                onClick={() => setActiveAssignment(null)}
                className="text-sm text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 rounded-lg"
              >
                {isUrdu ? 'واپس' : 'Back'}
              </button>
           </div>
           
           <div className="flex-1 mb-8">
              <p className="text-slate-300 mb-6">
                Please submit your work below. You can either type your answer directly or upload a scanned image of your notebook.
              </p>
              
              {assignment.type === 'upload' ? (
                <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-800/30 hover:border-sky-500/50 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-sky-500/20 transition-colors">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-sky-400" />
                  </div>
                  <h4 className="text-white font-bold mb-1">Upload Homework File</h4>
                  <p className="text-sm text-slate-400 font-medium mb-1">Click to browse or drag & drop</p>
                  <p className="text-xs text-slate-500">PDF, JPG, PNG (Max 10MB)</p>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col h-48">
                  <textarea 
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    className="w-full h-full bg-transparent resize-none text-slate-200 focus:outline-none placeholder:text-slate-600"
                    placeholder="Type your answer here..."
                  ></textarea>
                </div>
              )}
           </div>
           
           <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {isSubmitting ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
               </>
             ) : (
               <>
                 <CheckCircle2 className="w-5 h-5" />
                 {isUrdu ? 'جمع کروائیں' : 'Submit Assignment'}
               </>
             )}
           </button>
         </div>
      )}
      
    </div>
  );
}
