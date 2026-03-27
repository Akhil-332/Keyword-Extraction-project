import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, User, Bot, Paperclip, MoreVertical, Loader2, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AIChat = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [doc, setDoc] = useState(null);
  const [allDocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      if (docId !== 'new') {
        try {
          const res = await axios.get(`http://localhost:8000/documents/${docId}`);
          setDoc(res.data);
          setMessages([
            { 
              role: 'bot', 
              text: `Hello! I've analyzed your document: '${res.data.filename}'. You can ask me anything about its content, such as 'What are the main risks?' or 'Summarize the document'.` 
            }
          ]);
        } catch (err) {
          console.error("Error fetching document:", err);
          navigate('/chat/new');
        }
      } else {
        try {
          const res = await axios.get('http://localhost:8000/documents');
          setAllDocs(res.data);
          setDoc(null);
          setMessages([]);
        } catch (err) {
          console.error("Error fetching all documents:", err);
        }
      }
      setLoading(false);
    };
    initChat();
  }, [docId, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || !doc) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    try {
      const res = await axios.post('http://localhost:8000/chat', {
        doc_id: doc.id,
        query: input
      });
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: res.data.answer 
      }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0f0d] text-white">
      <Loader2 size={48} className="animate-spin text-emerald-500" />
    </div>
  );

  if (docId === 'new' && !doc) {
    return (
      <div className="p-12 max-w-4xl mx-auto h-screen flex flex-col">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent italic">Select a Document to Chat</h1>
          <p className="text-slate-400 text-lg">Choose one of your recently analyzed documents to start an intelligent conversation.</p>
        </header>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          {allDocs.length > 0 ? (
            allDocs.map((d) => (
              <motion.div 
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/chat/${d.id}`)}
                className="bg-[#0d1410] border border-emerald-900/40 p-6 rounded-3xl hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all cursor-pointer group flex items-center justify-between shadow-lg shadow-emerald-500/5"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-900/30 group-hover:bg-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-400 transition-colors">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-400 transition-colors">{d.filename}</h3>
                    <p className="text-slate-500 text-sm">{new Date(d.created_at).toLocaleDateString()} • {d.topics?.split(',').length || 0} Topics Identified</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0d1410] border border-emerald-900/40 flex items-center justify-center text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-[#0d1410]/30 rounded-3xl border border-emerald-900/30 border-dashed">
              <p className="text-slate-500">No documents found. Upload a document in the Dashboard first!</p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0f0d]">
      {/* Header */}
      <header className="p-6 border-b border-emerald-900/30 bg-[#0d1410] backdrop-blur-md flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-400">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold flex items-center gap-2">
              DocInsight Assistant
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </h2>
            <p className="text-xs text-slate-500">Document: {doc?.filename}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/chat/new')}
            className="text-xs px-3 py-1.5 bg-[#0a0f0d] hover:bg-emerald-900/20 text-slate-300 rounded-lg transition-colors border border-emerald-900/40"
          >
            Change Document
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-[#0d1410] text-emerald-400 border border-emerald-900/40'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-2xl px-6 py-4 rounded-3xl ${
                msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm shadow-xl shadow-emerald-600/10' : 'bg-[#0d1410] border border-emerald-900/40 text-slate-200 rounded-tl-sm shadow-xl shadow-black/20'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0d1410] text-emerald-400 border border-emerald-900/40 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="bg-[#0d1410] border border-emerald-900/40 px-6 py-4 rounded-3xl rounded-tl-sm">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-8 bg-gradient-to-t from-[#0a0f0d] via-[#0a0f0d] to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center bg-[#0d1410] border border-emerald-900/40 rounded-2xl p-2 pl-6">
            <button className="text-slate-500 hover:text-emerald-400 transition-colors p-2">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Ask a question about the document..." 
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-200 px-4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className={`w-12 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
