import { useState, useEffect } from 'react';
import { Layers, ArrowRight, ArrowLeft, RefreshCcw, Rotate3D, Check, Star } from 'lucide-react';

const defaultFlashcards = [
  { id: '1', front_en: "What is Newton's First Law?", back_en: "An object remains at rest or in uniform motion unless acted upon by a net external force.", front_ur: "نیوٹن کا پہلا قانون کیا ہے؟", back_ur: "کوئی جسم اس وقت تک آرام یا یکساں حرکت کی حالت میں رہتا ہے جب تک اس پر کوئی بیرونی قوت عمل نہ کرے۔", mastered: false },
  { id: '2', front_en: "Define Inertia", back_en: "The tendency of an object to resist changes in its state of motion.", front_ur: "انرشیا (Inertia) کی تعریف کریں", back_ur: "کسی جسم کی وہ خاصیت جس کی وجہ سے وہ اپنی آرام یا حرکت کی حالت میں تبدیلی کی مخالفت کرے۔", mastered: false },
  { id: '3', front_en: "Formula for Force", back_en: "F = ma (Force = mass × acceleration)", front_ur: "قوت (Force) کا فارمولا", back_ur: "F = ma (قوت = کمیت × اسراع)", mastered: true }
];

export default function FlashcardsViewer({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";
  
  const [cards, setCards] = useState<any[]>(defaultFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetch('/api/flashcards')
      .then(res => res.json())
      .then(data => {
        if (data.flashcards && data.flashcards.length > 0) {
          setCards(data.flashcards);
        }
      })
      .catch(() => {});
  }, []);

  const card = cards[currentIndex] || defaultFlashcards[0];

  const toggleMastered = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedStatus = !card.mastered;
    setCards(prev => prev.map((c, i) => i === currentIndex ? { ...c, mastered: updatedStatus } : c));

    try {
      if (String(card.id).length > 10) {
        await fetch('/api/flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: card.id, mastered: updatedStatus })
        });
      }
    } catch {}
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col h-full animate-in fade-in">
        
        <div className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
               <Layers className="w-6 h-6 text-fuchsia-400" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white">{isUrdu ? 'فلیش کارڈز' : 'Smart Flashcards'}</h2>
               <p className="text-sm text-slate-400">{isUrdu ? 'اہم تصورات کو دہرائیں' : 'Spaced repetition for key concepts'}</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <button 
               onClick={toggleMastered}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${card.mastered ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
             >
               <Star className={`w-3.5 h-3.5 ${card.mastered ? 'fill-emerald-400 text-emerald-400' : ''}`} />
               {card.mastered ? 'Mastered' : 'Mark Mastered'}
             </button>
             <div className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono text-sm">
               {currentIndex + 1} / {cards.length}
             </div>
           </div>
        </div>

        {/* Flashcard Container */}
        <div className="flex-1 flex flex-col items-center justify-center relative perspective-[1000px] w-full max-w-xl mx-auto mb-8">
           <div 
             onClick={() => setIsFlipped(!isFlipped)}
             className={`w-full aspect-[4/3] sm:aspect-video rounded-3xl cursor-pointer transition-all duration-500 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
           >
              {/* Front side */}
              <div className="absolute inset-0 backface-hidden w-full h-full bg-slate-800 border-2 border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl hover:border-fuchsia-500/50 transition-colors">
                <span className="absolute top-6 left-6 text-xs uppercase tracking-widest font-bold text-fuchsia-400">Front (Question)</span>
                <Rotate3D className="absolute top-6 right-6 w-5 h-5 text-slate-500" />
                <h3 className={`text-2xl sm:text-3xl font-bold text-white leading-tight ${isUrdu ? 'font-urdu' : ''}`}>
                  {isUrdu ? card.front_ur : card.front_en}
                </h3>
              </div>

              {/* Back side */}
              <div className="absolute inset-0 backface-hidden w-full h-full bg-slate-900 border-2 border-fuchsia-500/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(217,70,239,0.15)] rotate-y-180">
                <span className="absolute top-6 left-6 text-xs uppercase tracking-widest font-bold text-emerald-400">Back (Answer)</span>
                <Rotate3D className="absolute top-6 right-6 w-5 h-5 text-slate-500" />
                <p className={`text-xl sm:text-2xl text-slate-200 leading-relaxed ${isUrdu ? 'font-urdu' : ''}`}>
                  {isUrdu ? card.back_ur : card.back_en}
                </p>
              </div>
           </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-6 mt-auto">
          <button 
            onClick={handlePrev}
            className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-8 py-3 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)] flex items-center gap-2"
          >
            <RefreshCcw className={`w-5 h-5 ${isFlipped ? 'rotate-180' : ''} transition-transform duration-500`} />
            {isUrdu ? 'پلٹائیں' : 'Flip Card'}
          </button>
          <button 
            onClick={handleNext}
            className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
}
