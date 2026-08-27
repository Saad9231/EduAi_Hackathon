import { useState } from 'react';
import { Bot, Send, Mic, BookText, Settings2, Sparkles, BrainCircuit, Image as ImageIcon, Paperclip } from 'lucide-react';

export default function AITutorChat({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";
  
  const [messages] = useState([
    {
      id: 1,
      role: 'tutor',
      type: 'reasoning',
      content: 'Analyzing student weakness in "Quadratic Equations"... Fetching PTB Math Chapter 4 context...',
      isUrdu: false
    },
    {
      id: 2,
      role: 'tutor',
      type: 'message',
      content: 'I noticed you struggled with factoring quadratic equations in the last quiz. Let\'s break it down step-by-step. The standard form is ax² + bx + c = 0.',
      urduContent: 'میں نے دیکھا کہ آپ کو پچھلے کوئز میں دو درجی مساوات (Quadratic Equations) کو حل کرنے میں مشکل پیش آئی۔ آئیے اسے آسان بناتے ہیں۔ اس کی معیاری شکل ax² + bx + c = 0 ہے۔',
      isUrdu: true
    },
    {
      id: 3,
      role: 'student',
      type: 'message',
      content: 'Can you explain how to find the factors of 12?',
      isUrdu: false
    }
  ]);

  return (
    <div className="flex gap-6 h-full min-h-[600px]">
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center neon-border-blue">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                Agentic Tutor <Sparkles className="w-4 h-4 text-sky-400" />
              </h3>
              <p className="text-xs text-sky-300">Diagnostic & Teaching Mode Active</p>
            </div>
          </div>
          
          <button className="p-2 text-slate-400 hover:text-sky-400 transition-colors">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'reasoning' ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 rounded-lg border border-slate-700/50 text-xs font-mono text-slate-400">
                  <BrainCircuit className="w-4 h-4 text-purple-400 animate-pulse" />
                  {msg.content}
                </div>
              ) : (
                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                  msg.role === 'student' 
                    ? 'bg-sky-600 text-white rounded-br-none' 
                    : 'bg-slate-800 border border-slate-700/50 text-slate-200 rounded-bl-none'
                }`}>
                  <p className="text-sm leading-relaxed">
                    {isUrdu && msg.urduContent ? msg.urduContent : msg.content}
                  </p>
                  
                  {msg.role === 'tutor' && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap gap-2">
                      <button className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
                        Show Example
                      </button>
                      <button className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
                        Give me a practice question
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-slate-800/30 border-t border-slate-700/50">
          <div className="relative flex items-center">
            <button className="absolute left-3 p-2 text-slate-400 hover:text-sky-400 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="absolute left-10 p-2 text-slate-400 hover:text-sky-400 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder={isUrdu ? "یہاں اپنا سوال لکھیں..." : "Ask your tutor or upload a picture..."}
              className={`w-full bg-slate-900 border border-slate-700/50 rounded-xl py-3 pl-20 pr-12 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${isUrdu ? 'font-urdu text-right pr-4 pl-20' : ''}`}
            />
            <button className={`absolute ${isUrdu ? 'left-3' : 'right-3'} p-2 text-sky-400 hover:text-sky-300 transition-colors`}>
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Drag & drop homework pictures directly into chat
            </span>
          </div>
        </div>

      </div>

      {/* Textbook Context Panel */}
      <div className="hidden lg:flex w-80 glass-card flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 bg-slate-800/30">
          <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
            <BookText className="w-4 h-4 text-sky-400" />
            Textbook Context
          </h3>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">PTB Math Class 10</span>
              <span className="text-xs text-slate-400">Chapter 4</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              "A quadratic equation in one variable is an equation that can be written in the form ax² + bx + c = 0, where a, b, and c are real numbers and a ≠ 0."
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested Concepts</h4>
             <ul className="flex flex-col gap-2">
                <li className="text-sm text-slate-300 flex items-center gap-2 cursor-pointer hover:text-sky-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Factoring Method
                </li>
                <li className="text-sm text-slate-300 flex items-center gap-2 cursor-pointer hover:text-sky-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Quadratic Formula
                </li>
             </ul>
          </div>
        </div>
      </div>
      
    </div>
  );
}
