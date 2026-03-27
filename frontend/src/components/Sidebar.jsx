import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, MessageSquare, FileText, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FileText size={20} />, label: 'Analysis', path: '/analysis/new' },
    { icon: <MessageSquare size={20} />, label: 'AI Chat', path: '/chat/new' },
    { icon: <History size={20} />, label: 'History', path: '/history' },
  ];

  return (
    <aside className="w-64 bg-[#0d1410] border-r border-emerald-900/40 flex flex-col">
      <div className="p-6">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-2xl text-emerald-400">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            D
          </div>
          <span>DocInsight</span>
        </NavLink>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500' 
                  : 'text-slate-400 hover:bg-emerald-900/20 hover:text-slate-200'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-900/30 mt-auto">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
