import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, HelpCircle, User, Home, Upload, History, MessageSquare, FileText } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { icon: <Home size={18} />, label: 'Home', path: '/' },
    { icon: <Upload size={18} />, label: 'Upload', path: '/dashboard' },
    { icon: <FileText size={18} />, label: 'Analysis', path: '/analysis/new' },
    { icon: <MessageSquare size={18} />, label: 'AI Chat', path: '/chat/new' },
    { icon: <History size={18} />, label: 'History', path: '/history' },
  ];

  return (
    <header className="h-20 bg-[#0a0f0d]/80 backdrop-blur-xl border-b border-emerald-900/30 flex items-center justify-between px-10 sticky top-0 z-50">
      {/* Left Area: Branding */}
      <div className="flex items-center gap-8 shrink-0">
        <NavLink to="/" className="flex items-center gap-3 font-bold text-2xl text-emerald-400 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
            D
          </div>
          <span className="tracking-tight">DocInsight</span>
        </NavLink>
      </div>

      {/* Center Area: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 bg-[#0d1410] border border-emerald-900/20 p-1.5 rounded-2xl">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide ${isActive
                ? 'bg-emerald-500/10 text-emerald-400 shadow-sm border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-emerald-900/10'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-5 shrink-0">
        {/* Status Indicator */}
        <div className="hidden xl:flex items-center gap-2.5 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Engine Online</span>
        </div>

        {/* Global Icons */}
        <div className="flex items-center gap-1 border-l border-emerald-900/30 pl-5 ml-1">
          <button className="p-2.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-900/20 rounded-xl transition-all" title="Search">
            <Search size={20} />
          </button>
          <button className="p-2.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-900/20 rounded-xl transition-all" title="Notifications">
            <Bell size={20} />
          </button>
        </div>

        {/* User Module */}
        <button className="flex items-center gap-4 pl-4 border-l border-emerald-900/30 group">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-black text-slate-200 uppercase tracking-wider">Doc Master</div>
            <div className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest">Premium AI</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center p-[2px] shadow-xl shadow-emerald-500/10 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0a0f0d] flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <User size={20} />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
