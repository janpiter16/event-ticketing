import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Ticket, 
  LayoutDashboard, 
  QrCode, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, logout, isOrganizer, isStaff, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const isStrictParticipant = user && !isOrganizer && !isStaff && !isSuperAdmin;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isHome = location.pathname === '/';

  return (
    <header className={`z-50 w-full transition-all duration-300 ${isHome ? 'absolute top-0 bg-transparent border-none' : 'sticky top-0 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4 lg:gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-extrabold text-xl tracking-tight transition-colors ${isHome ? 'text-white group-hover:text-indigo-200' : 'text-slate-900 dark:text-slate-50 group-hover:text-indigo-600'}`}>
                EventFlow
              </span>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${isHome ? 'text-slate-300' : 'text-slate-400'}`}>
                Ticketing Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1.5 text-sm font-semibold">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive('/') && location.pathname === '/'
                  ? (isHome ? 'text-white bg-white/10 font-bold backdrop-blur-sm' : 'text-indigo-600 bg-indigo-50/80 font-bold shadow-2xs')
                  : (isHome ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-100/70 dark:bg-slate-800/70')
              }`}
            >
              <Compass className={`w-4 h-4 ${isHome ? 'text-indigo-300' : 'text-indigo-500'}`} />
              Jelajahi Event
            </Link>

            {isStrictParticipant && (
              <Link
                to="/my-tickets"
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  isActive('/my-tickets') 
                    ? (isHome ? 'text-white bg-white/10 font-bold backdrop-blur-sm' : 'text-indigo-600 bg-indigo-50/80 font-bold shadow-2xs')
                    : (isHome ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-100/70 dark:bg-slate-800/70')
                }`}
              >
                <Ticket className={`w-4 h-4 ${isHome ? 'text-indigo-300' : 'text-indigo-500'}`} />
                Tiket Saya
              </Link>
            )}

            {(isOrganizer || isSuperAdmin) && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  isActive('/dashboard') 
                    ? (isHome ? 'text-white bg-white/10 font-bold backdrop-blur-sm' : 'text-indigo-600 bg-indigo-50/80 font-bold shadow-2xs')
                    : (isHome ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-100/70 dark:bg-slate-800/70')
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${isHome ? 'text-indigo-300' : 'text-indigo-500'}`} />
                Organizer Portal
              </Link>
            )}

            {(isStaff || isOrganizer || isSuperAdmin) && (
              <Link
                to="/staff/scan"
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  isActive('/staff') 
                    ? (isHome ? 'text-white bg-white/10 font-bold backdrop-blur-sm' : 'text-indigo-600 bg-indigo-50/80 font-bold shadow-2xs')
                    : (isHome ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-100/70 dark:bg-slate-800/70')
                }`}
              >
                <QrCode className={`w-4 h-4 ${isHome ? 'text-indigo-300' : 'text-indigo-500'}`} />
                Scanner Staff
              </Link>
            )}
          </nav>
        </div>

        {/* User actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all text-sm ${
                  isHome 
                    ? 'border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className={`text-xs font-bold leading-tight truncate max-w-[130px] ${isHome ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {user.name}
                  </div>
                  <div className={`text-[10px] font-semibold uppercase tracking-wider ${isHome ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    {user.roles?.[0]?.slug || 'Peserta'}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 ${isHome ? 'text-white/70' : 'text-slate-400'}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/10 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] text-slate-400 font-medium">Masuk sebagai</p>
                    <p className="font-bold text-slate-900 dark:text-slate-50 truncate">{user.email}</p>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {isStrictParticipant && (
                      <Link
                        to="/my-tickets"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 font-medium transition-colors"
                      >
                        <Ticket className="w-4 h-4 text-indigo-500" />
                        Tiket Digital Saya
                      </Link>
                    )}

                    {(isOrganizer || isSuperAdmin) && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                        Dashboard Organizer
                      </Link>
                    )}

                    {(isStaff || isOrganizer || isSuperAdmin) && (
                      <Link
                        to="/staff/scan"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 font-medium transition-colors"
                      >
                        <QrCode className="w-4 h-4 text-indigo-500" />
                        Scanner Pintu Masuk
                      </Link>
                    )}
                  </div>

                  <div className="p-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-left font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Keluar dari Akun
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                  isHome 
                    ? 'text-white hover:bg-white/10'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-100/80 dark:bg-slate-800/80'
                }`}
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 ${
                  isHome
                    ? 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-indigo-500/50'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                }`}
              >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2.5 rounded-xl border focus:outline-none transition-colors ${
              isHome 
                ? 'border-white/20 text-white hover:bg-white/10'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800/50'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-5 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900/50"
          >
            <Compass className="w-5 h-5 text-indigo-600" />
            Jelajahi Event
          </Link>

          {isStrictParticipant && (
            <Link
              to="/my-tickets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900/50"
            >
              <Ticket className="w-5 h-5 text-indigo-600" />
              Tiket Digital Saya
            </Link>
          )}

          {(isOrganizer || isSuperAdmin) && (
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900/50"
            >
              <LayoutDashboard className="w-5 h-5 text-indigo-600" />
              Dashboard Organizer
            </Link>
          )}

          {(isStaff || isOrganizer || isSuperAdmin) && (
            <Link
              to="/staff/scan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900/50"
            >
              <QrCode className="w-5 h-5 text-indigo-600" />
              Scanner Pintu Masuk
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            {user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                Keluar ({user.name})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50"
                >
                  Masuk ke Akun
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 bg-indigo-600 rounded-xl text-sm font-bold text-white shadow-md shadow-indigo-600/20"
                >
                  Buat Akun Baru
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
