import { useState } from 'react';
import { FileText, Download, Loader2, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';

export default function AINotesGenerator({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";
  
  const [currentStep, setCurrentStep] = useState<'config' | 'generating' | 'notes'>('config');

  const handleGenerate = () => {
    setCurrentStep('generating');
    setTimeout(() => {
      setCurrentStep('notes');
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-4">
      
      {currentStep === 'config' && (
        <div className="w-full max-w-2xl glass-card p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isUrdu ? 'سمارٹ نوٹس جنریٹر' : 'Smart Notes Generator'}
          </h2>
          <p className="text-slate-400 mb-8 max-w-md">
            {isUrdu 
              ? 'اپنے نصاب کے مطابق خودکار طریقے سے نوٹس بنائیں۔' 
              : 'Auto-generate concise, curriculum-aligned notes for any subject or chapter.'}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
            <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 text-left cursor-pointer hover:border-purple-500/50 transition-colors">
               <h4 className="font-semibold text-slate-200">{isUrdu ? 'مضمون' : 'Subject'}</h4>
               <select className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500">
                 <option>Physics (Class 10)</option>
                 <option>Math (Class 10)</option>
                 <option>Chemistry (Class 10)</option>
               </select>
            </div>
            <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 text-left cursor-pointer hover:border-purple-500/50 transition-colors">
               <h4 className="font-semibold text-slate-200">{isUrdu ? 'باب / عنوان' : 'Chapter / Topic'}</h4>
               <select className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500">
                 <option>Chapter 2: Kinematics</option>
                 <option>Chapter 3: Dynamics</option>
                 <option>Chapter 4: Turning Effect of Forces</option>
               </select>
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {isUrdu ? 'نوٹس تیار کریں' : 'Generate Notes'}
          </button>
        </div>
      )}

      {currentStep === 'generating' && (
        <div className="w-full max-w-md flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
           <div className="relative mb-8">
             <div className="w-20 h-20 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin flex items-center justify-center">
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
               <FileText className="w-8 h-8 text-purple-400" />
             </div>
           </div>
           <h3 className="text-xl font-bold text-white mb-2">
             {isUrdu ? 'نوٹس تیار کیے جا رہے ہیں...' : 'Generating your notes...'}
           </h3>
           <p className="text-slate-400 text-sm">
             {isUrdu 
               ? 'ہم آپ کے لیے بہترین نصابی مواد مرتب کر رہے ہیں۔' 
               : 'Analyzing curriculum and synthesizing key concepts.'}
           </p>
        </div>
      )}

      {currentStep === 'notes' && (
        <div className="w-full max-w-4xl h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                 <BookOpen className="w-5 h-5 text-purple-400" />
               </div>
               <div>
                 <h2 className="text-lg font-bold text-white">Physics: Kinematics</h2>
                 <p className="text-xs text-slate-400">Class 10 • FBISE Syllabus</p>
               </div>
             </div>
             <div className="flex gap-2">
               <button 
                 onClick={() => setCurrentStep('config')}
                 className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-white font-medium transition-colors"
               >
                 {isUrdu ? 'واپس جائیں' : 'Back'}
               </button>
               <button 
                 className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
                 onClick={() => alert("Downloading PDF...")}
               >
                 <Download className="w-4 h-4" />
                 {isUrdu ? 'ڈاؤن لوڈ' : 'Download PDF'}
               </button>
             </div>
          </div>
          
          <div className="glass-card flex-1 p-6 sm:p-10 overflow-y-auto scrollbar-hide border border-slate-700/50 bg-slate-900/80 prose prose-invert max-w-none">
            {isUrdu ? (
              <div className="font-urdu text-right" dir="rtl">
                <h1 className="text-3xl font-bold text-purple-400 mb-6 border-b border-slate-700 pb-4">کائینی میٹکس (Kinematics)</h1>
                <h3 className="text-xl font-semibold text-white mb-3">1. آرام اور حرکت (Rest and Motion)</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  <strong>آرام (Rest):</strong> اگر کوئی جسم اپنے اردگرد کے لحاظ سے اپنی جگہ تبدیل نہ کر رہا ہو تو وہ آرام کی حالت میں ہوتا ہے۔<br/>
                  <strong>حرکت (Motion):</strong> اگر کوئی جسم اپنے اردگرد کے لحاظ سے اپنی جگہ تبدیل کر رہا ہو تو وہ حرکت کی حالت میں ہوتا ہے۔
                </p>
                <h3 className="text-xl font-semibold text-white mb-3">2. فاصلہ اور ہٹاؤ (Distance and Displacement)</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  <strong>فاصلہ:</strong> کسی راستے کی کل لمبائی جو جسم طے کرتا ہے۔ (سکیلر مقدار)<br/>
                  <strong>ہٹاؤ:</strong> دو مقامات کے درمیان کم از کم سیدھا فاصلہ۔ (ویکٹر مقدار)
                </p>
                <h3 className="text-xl font-semibold text-white mb-3">3. رفتار اور سمتی رفتار (Speed and Velocity)</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  رفتار ایکائی وقت میں طے کردہ فاصلہ ہے۔ جبکہ سمتی رفتار ایکائی وقت میں ہٹاؤ کی شرح ہے۔
                </p>
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg mt-8">
                  <p className="text-sm text-purple-200 m-0 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <strong>اہم نکتہ:</strong> بورڈ کے امتحانات میں سکیلر اور ویکٹر مقداروں کا فرق اکثر پوچھا جاتا ہے۔
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-purple-400 mb-6 border-b border-slate-700 pb-4">Chapter 2: Kinematics</h1>
                <h3 className="text-xl font-semibold text-white mb-3">1. Rest and Motion</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  <strong>Rest:</strong> A body is said to be at rest if it does not change its position with respect to its surroundings.<br/>
                  <strong>Motion:</strong> A body is said to be in motion if it changes its position with respect to its surroundings.
                </p>
                <h3 className="text-xl font-semibold text-white mb-3">2. Distance and Displacement</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  <strong>Distance:</strong> Length of a path between two points. (Scalar Quantity)<br/>
                  <strong>Displacement:</strong> The shortest distance between two points which has magnitude and direction. (Vector Quantity)
                </p>
                <h3 className="text-xl font-semibold text-white mb-3">3. Speed and Velocity</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  <strong>Speed:</strong> The distance covered by an object in unit time. (Formula: v = S/t)<br/>
                  <strong>Velocity:</strong> The rate of displacement of a body. (Formula: v = d/t)
                </p>
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg mt-8">
                  <p className="text-sm text-purple-200 m-0 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <strong>Pro Tip:</strong> Questions differentiating scalars and vectors are very common in FBISE objective sections.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}
