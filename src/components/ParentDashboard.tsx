import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HeartHandshake, TrendingUp, Award, Calendar, FileText, Download, CheckCircle2 } from 'lucide-react';

const initialChartData = [
  { week: 'W1', score: 65 },
  { week: 'W2', score: 68 },
  { week: 'W3', score: 74 },
  { week: 'W4', score: 78 },
];

export default function ParentDashboard({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";

  const [parentData, setParentData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/parent-dashboard?student_id=00000000-0000-0000-0000-000000000000')
      .then(res => res.json())
      .then(data => {
        if (data) setParentData(data);
      })
      .catch(() => {});
  }, []);

  const chartData = parentData?.trendData || initialChartData;
  const grade = parentData?.grade || 'A-';
  const attendanceRate = parentData?.attendanceRate != null ? `${parentData.attendanceRate}%` : '98%';

  return (
    <div className="flex flex-col gap-6 h-full w-full overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
           <div className="flex items-center gap-2 text-sky-400 mb-1">
             <HeartHandshake className="w-5 h-5" />
             <span className="font-semibold uppercase tracking-wider text-xs">Parent Portal</span>
           </div>
           <h1 className={`text-3xl font-bold text-white ${isUrdu ? 'font-urdu text-right' : ''}`}>
             {isUrdu ? 'علی کی ہفتہ وار کارکردگی' : 'Ali\'s Weekly Performance'}
           </h1>
        </div>
        <button className={`px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors border border-slate-700 flex items-center gap-2 ${isUrdu ? 'flex-row-reverse font-urdu' : ''}`}>
          <Download className="w-4 h-4" /> {isUrdu ? 'رپورٹ ڈاؤن لوڈ کریں' : 'Download Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        
        {/* Executive Summary */}
        <div className="glass-card p-6 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full -z-10" />
           <h3 className={`font-semibold text-slate-200 mb-4 flex items-center gap-2 ${isUrdu ? 'flex-row-reverse text-right font-urdu' : ''}`}>
             <FileText className="w-5 h-5 text-emerald-400" />
             {isUrdu ? 'اے آئی کی ایگزیکٹو سمری' : 'AI Executive Summary'}
           </h3>
           
           <div className={`flex-1 flex flex-col gap-4 text-slate-300 leading-relaxed ${isUrdu ? 'text-right font-urdu text-lg' : ''}`}>
             <p>
               {isUrdu 
                 ? (parentData?.summaryUr || 'علی نے اس ہفتے پڑھائی میں شاندار بہتری دکھائی ہے۔ خاص طور پر فزکس میں ان کی کارکردگی بہتر ہوئی ہے جہاں انہوں نے پچھلے ہفتے کی نسبت 15 فیصد زیادہ نمبر حاصل کیے۔')
                 : (parentData?.summaryEn || 'Ali has shown excellent improvement in his studies this week. His performance in Physics has particularly improved, scoring 15% higher than last week.')}
             </p>
             <p>
               {isUrdu 
                 ? 'تاہم، ریاضی میں "کواڈریٹک مساوات" پر مزید توجہ کی ضرورت ہے۔ ہمارے اے آئی ٹیوٹر نے اس کے لیے کل ایک خصوصی سیشن شیڈول کیا ہے۔' 
                 : 'However, Mathematics requires more attention, specifically on "Quadratic Equations". Our AI Tutor has scheduled a special review session for him tomorrow.'}
             </p>
             <div className={`mt-4 p-4 rounded-xl bg-sky-900/20 border border-sky-500/30 flex items-start gap-3 ${isUrdu ? 'flex-row-reverse' : ''}`}>
               <Award className="w-6 h-6 text-sky-400 shrink-0 mt-1" />
               <div>
                 <h4 className="font-bold text-sky-300">{isUrdu ? 'ہفتے کی کامیابی' : 'Achievement of the Week'}</h4>
                 <p className="text-sm mt-1 text-sky-100">
                   {isUrdu ? 'مسلسل 14 دن تک روزانہ پڑھائی کا ہدف پورا کیا۔' : 'Completed daily study goals for 14 consecutive days.'}
                 </p>
               </div>
             </div>
           </div>
        </div>

        {/* Progress Metrics */}
        <div className="flex flex-col gap-6">
           
           {/* Quick Stats Grid */}
           <div className="grid grid-cols-2 gap-4">
             <div className="glass-card p-5">
                <div className="flex items-center gap-2 text-slate-400 mb-2 justify-center sm:justify-start">
                  <TrendingUp className="w-4 h-4" /> {isUrdu ? 'اوسط درجہ' : 'Avg. Grade'}
                </div>
                <div className="text-3xl font-bold text-white text-center sm:text-left">
                  {grade}
                </div>
             </div>
             <div className="glass-card p-5">
                <div className="flex items-center gap-2 text-slate-400 mb-2 justify-center sm:justify-start">
                  <Calendar className="w-4 h-4" /> {isUrdu ? 'حاضری' : 'Attendance'}
                </div>
                <div className="text-3xl font-bold text-white text-center sm:text-left">
                  {attendanceRate}
                </div>
             </div>
           </div>

           {/* Trend Chart */}
           <div className="glass-card p-6 flex-1 min-h-[250px]">
             <h3 className={`font-semibold text-slate-200 mb-6 flex items-center gap-2 ${isUrdu ? 'flex-row-reverse text-right font-urdu' : ''}`}>
               <TrendingUp className="w-5 h-5 text-purple-400" />
               {isUrdu ? 'مجموعی کارکردگی کا رجحان' : 'Overall Performance Trend'}
             </h3>
             <div className="w-full h-[150px]">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                   <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                     itemStyle={{ color: '#e2e8f0' }}
                   />
                   <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}
