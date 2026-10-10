import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/90 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info (2 Cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-indigo-100" />
              </div>
              <span className="font-display font-black text-slate-900 dark:text-slate-50 text-xl tracking-tight">EventFlow</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-sm">
              Platform modern manajemen event, distribusi tiket terotentikasi, dan verifikasi check-in berbasis QR code cepat untuk komunitas, workshop, dan konferensi berskala nasional.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Seluruh sistem operasional berjalan normal
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-display font-extrabold text-slate-900 dark:text-slate-50 text-xs tracking-wider uppercase mb-4">
              Untuk Peserta
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">Jelajahi Semua Event</Link></li>
              <li><Link to="/my-tickets" className="hover:text-indigo-600 transition-colors">Tiket Digital Saya</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 transition-colors">Masuk ke Akun</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-extrabold text-slate-900 dark:text-slate-50 text-xs tracking-wider uppercase mb-4">
              Penyelenggara
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard Organizer</Link></li>
              <li><Link to="/dashboard/events/create" className="hover:text-indigo-600 transition-colors">Buat Event Baru</Link></li>
              <li><Link to="/staff/scan" className="hover:text-indigo-600 transition-colors">Scanner Pintu Masuk</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-extrabold text-slate-900 dark:text-slate-50 text-xs tracking-wider uppercase mb-4">
              Keamanan Platform
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Anti-Duplicate QR Pass
              </li>
              <li>Enkripsi Token Server</li>
              <li>Otentikasi Multi-Role</li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium gap-4">
          <p>Ã‚Â© {new Date().getFullYear()} EventFlow SaaS. Hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 dark:text-slate-400">Kebijakan Privasi</a>
            <a href="#" className="hover:text-slate-600 dark:text-slate-400">Syarat Ketentuan</a>
            <a href="#" className="hover:text-slate-600 dark:text-slate-400">Pusat Bantuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
