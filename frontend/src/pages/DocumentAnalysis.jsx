import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Share2, Download, BarChart2, Hash, Layers, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

const DocumentAnalysis = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [doc, setDoc] = useState(null);
  const [allDocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      try {
        if (docId === 'new') {
          const res = await axios.get('http://localhost:8000/documents');
          setAllDocs(res.data);
          setDoc(null);
        } else {
          const res = await axios.get(`http://localhost:8000/documents/${docId}`);
          setDoc(res.data);
          setAllDocs([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [docId]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this document? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await axios.post(`http://localhost:8000/documents/${id}/delete`);
      setAllDocs(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete document. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const flowData = useMemo(() => {
    if (!doc) return { nodes: [], edges: [] };

    const keywords = (doc.keywords || "").split(", ").filter(k => k);
    const topics = (doc.topics || "").split(", ").filter(t => t);

    const nodes = [
      {
        id: 'root',
        data: { label: doc.filename },
        position: { x: 250, y: 0 },
        style: { background: '#10b981', color: '#fff', borderRadius: '12px', fontWeight: 'bold' }
      }
    ];

    const edges = [];

    topics.forEach((topic, i) => {
      const id = `topic-${i}`;
      nodes.push({
        id,
        data: { label: topic },
        position: { x: i * 150, y: 150 },
        style: { background: '#8b5cf6', color: '#fff', borderRadius: '8px' }
      });
      edges.push({ id: `e-root-${id}`, source: 'root', target: id, animated: true });

      const keywordsPerTopic = 2;
      for (let j = 0; j < keywordsPerTopic; j++) {
        const kid = `k-${i}-${j}`;
        const kIdx = (i * keywordsPerTopic) + j;
        if (keywords[kIdx]) {
          nodes.push({
            id: kid,
            data: { label: keywords[kIdx] },
            position: { x: (i * 150) + (j * 70) - 35, y: 250 },
            style: { background: '#0d1410', color: '#6ee7b7', border: '1px solid #065f46', borderRadius: '6px', fontSize: '10px' }
          });
          edges.push({ id: `e-${id}-${kid}`, source: id, target: kid });
        }
      }
    });

    return { nodes, edges };
  }, [doc]);

  const chartData = useMemo(() => {
    if (!doc) return [];
    const topics = (doc.topics || "").split(", ").filter(t => t);
    return topics.map((t, i) => ({ name: t, value: 100 - (i * 10) }));
  }, [doc]);

  const COLORS = ['#10b981', '#8b5cf6', '#34d399', '#a78bfa', '#059669', '#7c3aed'];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0f0d] text-white">
      <Loader2 size={48} className="animate-spin text-emerald-500" />
    </div>
  );

  if (!doc) {
    if (docId === 'new') {
      return (
        <div className="p-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
              Select a Document to Analyze
            </h1>
            <p className="text-slate-400">Choose a document from your library to view detailed insights and visualizations.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allDocs.map((d, index) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/analysis/${d.id}`)}
                className="group p-6 bg-[#0d1410] border border-emerald-900/40 rounded-3xl hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Analyse icon (top-right) */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BarChart2 className="text-emerald-500" size={24} />
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, d.id)}
                  disabled={deletingId === d.id}
                  className="absolute bottom-4 right-4 p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  title="Delete document"
                >
                  {deletingId === d.id
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Trash2 size={16} />}
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{d.filename}</h3>
                    <p className="text-sm text-slate-500 italic">Analyzed on {new Date(d.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {allDocs.length === 0 && (
            <div className="text-center py-20 bg-[#0d1410]/50 rounded-3xl border border-emerald-900/30 border-dashed">
              <p className="text-slate-500 mb-4 font-medium">No documents uploaded yet.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline decoration-2 underline-offset-4"
              >
                Upload your first document
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0f0d] text-white font-bold text-2xl">
        Document Not Found
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-white transition-colors">
            <Share2 size={24} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{doc.filename}</h1>
            <p className="text-slate-400 text-sm">Analyzed on {new Date(doc.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-[#0d1410] border border-emerald-900/40 rounded-xl flex items-center gap-2 hover:bg-emerald-900/20 transition-all">
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => navigate(`/chat/${docId}`)}
            className="px-5 py-2.5 bg-emerald-600 rounded-xl flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
          >
            <MessageSquare size={18} /> Chat with Doc
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0d1410] border border-emerald-900/40 rounded-3xl overflow-hidden">
            <div className="flex border-b border-emerald-900/30">
              {['summary', 'content', 'mindmap'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all ${activeTab === tab ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5' : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-8 min-h-[500px]">
              {activeTab === 'summary' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
                      <Layers size={20} /> Executive Summary
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                      {doc.summary_short}
                    </p>
                  </div>
                  <div className="p-6 bg-emerald-900/10 rounded-2xl border border-emerald-900/30">
                    <h4 className="font-bold mb-4 text-violet-400">Detailed Analysis</h4>
                    <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {doc.summary_detailed}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-emerald-900/30">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <Hash size={16} className="text-emerald-400" /> Key Insights & Major Takeaways
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doc.key_points ? (
                        doc.key_points.split("||").map((point, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-emerald-900/5 border border-emerald-900/20 rounded-2xl text-sm text-slate-300 leading-relaxed hover:border-emerald-500/30 hover:bg-emerald-900/10 transition-all font-medium"
                          >
                            <span className="text-emerald-400 font-bold mr-2">{i + 1}.</span> {point}
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-slate-500 italic text-sm">No specific points extracted yet.</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'content' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#060a08] p-6 rounded-2xl border border-emerald-900/30 max-h-[600px] overflow-y-auto font-mono text-sm text-slate-400">
                  <p className="whitespace-pre-wrap">{doc.content}</p>
                </motion.div>
              )}

              {activeTab === 'mindmap' && (
                <div className="h-[500px] bg-[#060a08] rounded-2xl border border-emerald-900/30">
                  <ReactFlow
                    nodes={flowData.nodes}
                    edges={flowData.edges}
                    fitView
                  >
                    <Background color="#065f46" gap={20} />
                    <Controls />
                  </ReactFlow>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0d1410] border border-emerald-900/40 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart2 className="text-violet-400" size={24} /> Topic Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d1410', border: '1px solid #065f46', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Tags & Info */}
        <div className="space-y-8">

          <div className="bg-[#0d1410] border border-emerald-900/40 rounded-3xl p-8">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {(doc.keywords || "").split(", ").filter(k => k).map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 rounded-lg text-xs font-medium hover:border-emerald-500/50 transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/40 to-violet-900/40 border border-emerald-500/30 rounded-3xl p-8">
            <h4 className="font-bold text-emerald-300 mb-2 underline uppercase tracking-tighter">AI Focus Area</h4>
            <p className="text-emerald-100/80 leading-relaxed italic">
              "This document primarily centers around <span className="text-violet-400 font-bold">{ (doc.topics || "").split(", ")[0] || "Advanced Systems Analysis" }</span> and its related implications."
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default DocumentAnalysis;
