import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Zap className="text-yellow-400" />, title: 'Fast Analysis', description: 'Extract insights from documents in seconds.' },
    { icon: <ShieldCheck className="text-emerald-400" />, title: 'Secure & Private', description: 'Your documents are processed with highest security.' },
    { icon: <BarChart3 className="text-violet-400" />, title: 'Smart Charts', description: 'Visualize topic distributions and keyword trends.' },
    { icon: <Globe className="text-teal-400" />, title: 'Multi-Format', description: 'Supports PDF, DOCX, and TXT files seamlessly.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-violet-500/8 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            Turn Documents into <br /> <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">Intelligent Insights</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            The world's most advanced AI platform for document intelligence. 
            Upload, analyze, and chat with your files in real-time.
          </motion.p>
          
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-emerald-600/20"
            >
              Get Started for Free <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-[#0d1410] border border-emerald-900/40 text-slate-200 rounded-2xl font-bold text-lg hover:bg-emerald-900/20 transition-all">
              Watch Demo
            </button>
          </motion.div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-8 bg-[#0d1410]/70 border border-emerald-900/30 rounded-3xl backdrop-blur-sm hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
