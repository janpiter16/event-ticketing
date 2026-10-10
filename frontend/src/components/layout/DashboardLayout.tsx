import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  QrCode, 
  ArrowLeft, 
  LogOut,
  Sparkles,
  Compass,
  Bell,
  Ticket
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout, isOrganizer, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview & Event', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Buat Event Baru', path: '/dashboard/events/create', icon: CalendarPlus },
    { label: 'Scanner Pintu Masuk', path: '/staff/scan', icon: QrCode },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans transition-colors">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-indigo-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-50">EventFlow</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Workspace</span>
            </div>
          </Link>
          <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {isSuperAdmin ? 'Admin' : 'Organizer'}
          </span>
        </div>

        {/* Back to public link */}
        <div className="p-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:bg-slate-900/50 rounded-xl transition-all"
          >
            <Compass className="w-4 h-4 text-indigo-500" />
            Kembali ke Web Publik
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all overflow-hidden ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:bg-slate-900/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 z-10 relative ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="z-10 relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card in Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 m-3 rounded-2xl border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user?.name?.charAt(0).toUpperCase() || 'O'}
              </div>
              <div className="truncate">
                <div className="text-xs font-black text-slate-900 dark:text-slate-50 truncate">{user?.name || 'Organizer Demo'}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email || 'organizer@eventflow.id'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main dashboard content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">Organizer Workspace</h2>
            <p className="text-xs text-slate-400 font-medium">Pantau performa publikasi tiket dan peserta event Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/events/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:shadow-md hover:shadow-indigo-600/20 active:scale-[0.98] transition-all"
            >
              <CalendarPlus className="w-4 h-4" />
              Event Baru
            </Link>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 p-8 sm:p-10 overflow-y-auto"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};
