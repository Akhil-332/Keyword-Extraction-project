import React, { useState, useEffect } from 'react';
import { Clock, Filter, Search, FileText, Download, MoreHorizontal, Trash2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this document from history? This cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:8000/documents/${id}/delete`);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('⚠️ CRITICAL: Clear all document history? This action is permanent and cannot be reversed.')) return;
    try {
      await axios.delete('http://localhost:8000/documents/clear');
      setDocuments([]);
      alert('All history cleared successfully.');
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Failed to clear history');
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.topics && doc.topics.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Clock size={32} className="text-emerald-400" />
            Document History
          </h1>
          <p className="text-slate-400 mt-1 font-medium italic">Manage and access your previously analyzed documents.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[#0d1410] border border-emerald-900/40 rounded-xl focus:ring-1 focus:ring-emerald-500 transition-all outline-none min-w-[300px]" 
            />
          </div>
          
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 rounded-xl transition-all font-bold text-sm"
            title="Clear All History"
          >
            <XCircle size={18} />
            Clear All
          </button>
        </div>
      </header>

      {filteredDocs.length === 0 ? (
        <div className="bg-[#0d1410] border border-emerald-900/40 rounded-3xl p-20 text-center">
          <FileText className="mx-auto text-emerald-900/20 mb-6" size={80} />
          <h2 className="text-2xl font-bold text-slate-300 mb-2">No History Found</h2>
          <p className="text-slate-500 max-w-sm mx-auto">Start analyzing documents to build your history workspace.</p>
        </div>
      ) : (
        <div className="bg-[#0d1410] border border-emerald-900/40 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-emerald-900/30 bg-emerald-900/5">
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Document Name</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Category / Topics</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Date Analyzed</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/10">
                <AnimatePresence>
                  {filteredDocs.map((doc, i) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => navigate(`/analysis/${doc.id}`)}
                      className="hover:bg-emerald-900/10 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/10 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                            <FileText size={20} />
                          </div>
                          <span className="font-bold text-slate-200">{doc.filename}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {doc.topics ? doc.topics.split(',').map(t => (
                            <span key={t} className="px-2.5 py-1 bg-emerald-900/40 text-[10px] font-black text-emerald-400 rounded-lg uppercase tracking-wider border border-emerald-500/10">
                              {t.trim()}
                            </span>
                          )) : (
                            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest italic">General</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-slate-400 text-sm font-medium">
                          {new Date(doc.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </div>
                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">
                          {new Date(doc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button 
                          className="p-2.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-900/20 rounded-xl transition-all" 
                          title="View Analysis"
                          onClick={(e) => { e.stopPropagation(); navigate(`/analysis/${doc.id}`); }}
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, doc.id)}
                          className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Remove Permanently"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2.5 text-slate-500 hover:text-white hover:bg-emerald-900/20 rounded-xl transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
