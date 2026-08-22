import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Search, Clock, Plus, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/documents');
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDocuments(prev => [res.data, ...prev]);
      navigate(`/analysis/${res.data.id}`);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const filteredDocs = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">Welcome Back</h1>
          <p className="text-slate-400">Ready to extract some insights today?</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-[#0d1410] border border-emerald-900/40 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Upload Card */}
        <div className="lg:col-span-2">
          <div
            {...getRootProps()}
            className={`h-full min-h-[300px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 transition-all cursor-pointer relative overflow-hidden ${isDragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-emerald-900/40 bg-[#0d1410]/60 hover:bg-[#0d1410]/90 hover:border-emerald-700/50'
              }`}
          >
            <input {...getInputProps()} />

            {uploading ? (
              <div className="text-center">
                <Loader2 size={48} className="animate-spin text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Analyzing Document...</h3>
                <p className="text-slate-500 text-sm mt-2">Extracting keywords, topics and generating summary</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-emerald-600/20 rounded-full flex items-center justify-center mb-6 text-emerald-400">
                  <Upload size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center">Upload your document</h3>
                <p className="text-slate-400 text-center max-w-md">
                  Drag and drop your PDF, DOCX, or TXT file here.
                </p>
                <div className="mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20">
                  <Plus size={20} /> Browse Files
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats / Quick Info */}
        <div className="space-y-6">
          <div className="bg-[#0d1410] border border-emerald-900/40 rounded-3xl p-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Analysis</span>
                <span className="text-2xl font-bold text-emerald-400">{documents.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20 uppercase">Connected</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2">
                <div className="bg-gradient-to-r from-emerald-500 to-violet-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(documents.length * 10, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-violet-700 rounded-3xl p-8 relative overflow-hidden group cursor-pointer shadow-lg shadow-emerald-500/20">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 blur-3xl rounded-full transition-transform group-hover:scale-150"></div>
            <Plus className="mb-4" size={24} />
            <h3 className="text-xl font-bold mb-2">Custom NLP Models</h3>
            <p className="text-emerald-100 text-sm mb-4">Request specific entity extraction for your industry.</p>
            <span className="font-bold underline decoration-2 underline-offset-4">Coming Soon</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="text-emerald-400" size={24} />
        Recent Activity
      </h2>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="animate-spin text-slate-700" size={40} />
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/analysis/${doc.id}`)}
              className="bg-[#0d1410] border border-emerald-900/40 p-6 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-900/30 group-hover:bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-400 transition-colors">
                  <FileText size={24} />
                </div>
                <span className="text-xs text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</span>
              </div>
              <h4 className="font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors truncate">{doc.filename}</h4>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{doc.summary_short}</p>
              <div className="flex flex-wrap gap-2">
                {doc.topics?.split(", ").slice(0, 2).map(topic => (
                  <span key={topic} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded">{topic}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#0d1410]/60 rounded-3xl border border-emerald-900/30 border-dashed">
          <AlertCircle className="mx-auto text-slate-700 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-400">No documents found</h3>
          <p className="text-slate-600 mt-2">Upload your first document to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
