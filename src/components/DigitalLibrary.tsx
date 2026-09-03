import { useState, useEffect } from 'react';
import { Library, Download, Search, BookOpen, FileText, CheckCircle2 } from 'lucide-react';

const defaultBooks = [
  { id: '1', title: 'Physics (Class 10)', board: 'PTB', size: '15 MB', type: 'book', file_url: '#' },
  { id: '2', title: 'Mathematics (Class 10)', board: 'FBISE', size: '22 MB', type: 'book', file_url: '#' },
  { id: '3', title: 'Chemistry (Class 10)', board: 'PTB', size: '18 MB', type: 'book', file_url: '#' },
  { id: '4', title: 'Urdu Grammar (Class 10)', board: 'FBISE', size: '8 MB', type: 'book', file_url: '#' },
  { id: '5', title: 'Past Paper 2024 (Physics)', board: 'FBISE', size: '2 MB', type: 'resource', file_url: '#' },
  { id: '6', title: 'Past Paper 2024 (Math)', board: 'PTB', size: '3 MB', type: 'resource', file_url: '#' },
];

export default function DigitalLibrary({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'book' | 'resource'>('all');
  const [books, setBooks] = useState<any[]>(defaultBooks);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('type', filter);
    if (searchTerm.trim()) params.append('query', searchTerm.trim());

    fetch(`/api/library?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setBooks(data.items);
        } else if (!searchTerm.trim() && filter === 'all') {
          setBooks(defaultBooks);
        } else {
          // Local filter fallback
          const filtered = defaultBooks.filter(b => 
            b.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            (filter === 'all' || b.type === filter)
          );
          setBooks(filtered);
        }
      })
      .catch(() => {
        const filtered = defaultBooks.filter(b => 
          b.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          (filter === 'all' || b.type === filter)
        );
        setBooks(filtered);
      });
  }, [filter, searchTerm]);

  const handleDownload = (id: string, title: string) => {
    setDownloadedId(id);
    setTimeout(() => {
      setDownloadedId(null);
    }, 2500);
    alert(isUrdu ? `"${title}" آف لائن استعمال کے لیے کامیابی سے ڈاؤن لوڈ ہو گئی۔` : `"${title}" downloaded successfully for offline study!`);
  };

  return (
    <div className="flex flex-col h-full items-center p-4">
      <div className="w-full max-w-5xl flex flex-col h-full animate-in fade-in">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
               <Library className="w-6 h-6 text-amber-400" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white">{isUrdu ? 'ڈیجیٹل لائبریری' : 'Digital Library'}</h2>
               <p className="text-sm text-slate-400">{isUrdu ? 'نصابی کتابیں اور وسائل ڈاؤن لوڈ کریں' : 'Download official PTB & FBISE textbooks and resources'}</p>
             </div>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative w-full sm:w-64">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder={isUrdu ? 'تلاش کریں...' : 'Search library...'}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
               />
             </div>
             <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
               <button 
                 onClick={() => setFilter('all')}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 All
               </button>
               <button 
                 onClick={() => setFilter('book')}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'book' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 Books
               </button>
               <button 
                 onClick={() => setFilter('resource')}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'resource' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 Past Papers
               </button>
             </div>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 overflow-y-auto pr-2 pb-4 scrollbar-hide">
           {books.length > 0 ? books.map((book) => (
             <div key={book.id} className="glass-card p-5 flex flex-col group hover:border-amber-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${book.type === 'book' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'}`}>
                    {book.type === 'book' ? <BookOpen className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-slate-800 rounded-md text-slate-300">
                    {book.board}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 min-h-[3.5rem]">{book.title}</h3>
                <p className="text-xs text-slate-400 mb-6">{book.size} • PDF Format</p>
                
                <button 
                  onClick={() => handleDownload(book.id, book.title)}
                  className={`w-full mt-auto py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
                    downloadedId === book.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 group-hover:border-amber-500/30 group-hover:bg-amber-500/10 group-hover:text-amber-400'
                  }`}
                >
                  {downloadedId === book.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved Offline
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Download Offline
                    </>
                  )}
                </button>
             </div>
           )) : (
             <div className="col-span-full py-12 text-center flex flex-col items-center justify-center text-slate-400">
               <Library className="w-12 h-12 mb-4 opacity-20" />
               <p>No resources found matching your search.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
