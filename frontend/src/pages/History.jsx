import React, { useState } from 'react';
import { Clock, Filter, Search, FileText, Download, MoreHorizontal, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const [documents, setDocuments] = useState([
    { name: 'Financial_Analysis_Q1.pdf', size: '1.2 MB', date: 'March 14, 2026', topics: ['Finance', 'Quarterly'], id: '1' },
    { name: 'Research_Paper_Quantum.pdf', size: '4.5 MB', date: 'March 12, 2026', topics: ['Physics', 'Quantum'], id: '2' },
    { name: 'Meeting_Notes_AI.docx', size: '256 KB', date: 'March 10, 2026', topics: ['AI', 'Product'], id: '3' },
    { name: 'Budget_Draft_2026.txt', size: '45 KB', date: 'March 08, 2026', topics: ['Budget', 'Planning'], id: '4' },
    { name: 'Market_Trends_Summary.pdf', size: '3.1 MB', date: 'March 05, 2026', topics: ['Market', 'Analysis'], id: '5' },
  ]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this document from history? This cannot be undone.')) return;
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Clock size={28} className="text-emerald-400" />
            Document History
          </h1>
          <p className="text-slate-400 mt-1">Manage and access your previously analyzed documents.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
             <input type="text" placeholder="Filter history..." className="pl-10 pr-4 py-2.5 bg-[#0d1410] border border-emerald-900/40 rounded-xl focus:ring-1 focus:ring-emerald-500 transition-all outline-none" />
          </div>
          <button className="p-2.5 bg-[#0d1410] border border-emerald-900/40 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="bg-[#0d1410] border border-emerald-900/40 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-emerald-900/30">
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Name</th>
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</th>
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Analyzed</th>
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/20">
              {documents.map((doc, i) => (
                <motion.tr 
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-emerald-900/10 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-600/10 rounded-lg flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                      </div>
                      <span className="font-bold text-slate-200">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                       {doc.topics.map(t => (
                         <span key={t} className="px-2 py-1 bg-emerald-900/20 text-[10px] font-bold text-emerald-400 rounded uppercase tracking-tighter border border-emerald-900/40">
                           {t}
                         </span>
                       ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-400 text-sm">{doc.size}</td>
                  <td className="px-8 py-6 text-slate-400 text-sm">{doc.date}</td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button className="p-2 text-slate-500 hover:text-emerald-400 transition-colors" title="Download">
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
