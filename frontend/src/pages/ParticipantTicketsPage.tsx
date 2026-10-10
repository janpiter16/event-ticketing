import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IssuedTicket } from '../types';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Download, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Share2,
  Printer
} from 'lucide-react';

export const ParticipantTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<IssuedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const api = (await import('../services/api')).default;
      const res = await api.get('/my-tickets');
      if (res.data) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
      setError('Gagal memuat daftar tiket Anda.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-200 dark:border-slate-700/80 pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Ticket className="w-3.5 h-3.5" />
            Digital Boarding Pass
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            Tiket Digital Saya
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Bawa dan tunjukkan tiket digital resmi ini pada petugas saat tiba di lokasi acara.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all self-start sm:self-auto hover:bg-slate-50 dark:bg-slate-800/30"
        >
          Cari Event Lainnya
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-16 text-center space-y-4 shadow-xs"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mx-auto text-slate-400">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-200 text-xl">Belum Ada Tiket Terdaftar</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Anda belum memiliki tiket event. Jelajahi jadwal event terbaru dan pesan tiket pilihan Anda sekarang.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md transition-all"
            >
              Jelajahi Katalog Event
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-8"
        >
          {tickets.map((t) => {
            const isCheckedIn = t.status === 'CHECKED_IN';
            return (
              <motion.div
                variants={item}
                key={t.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/90 shadow-lg shadow-slate-900/5 overflow-hidden transition-all relative flex flex-col lg:flex-row hover:shadow-xl hover:shadow-indigo-900/10 hover:border-indigo-200"
              >
                {/* Left Side: Ticket Event Information */}
                <div className="flex-1 p-7 sm:p-9 flex flex-col justify-between space-y-6">
                  {/* Top Bar Ribbon */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        OFFICIAL VERIFIED PASS
                      </span>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                      isCheckedIn 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isCheckedIn ? 'SUDAH CHECK-IN' : 'SIAP DIGUNAKAN'}
                    </div>
                  </div>

                  {/* Main Event Data */}
                  <div className="space-y-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
                      {t.ticket_type.name}
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-slate-50 leading-tight">
                      {t.event.name}
                    </h3>
                  </div>

                  {/* Schedule & Venue Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-indigo-600 shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                          Jadwal Pelaksanaan
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug block mt-0.5">
                          {formatDate(t.event.start_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-indigo-600 shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                          Lokasi / Akses
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug block mt-0.5">
                          {t.event.venue_name || (t.event.is_online ? 'Akses Online Webinar' : 'Lokasi Fisik')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attendee Footnote */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nama Peserta</span>
                      <span className="font-black text-slate-900 dark:text-slate-50 text-sm">{t.participant_name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nomor Registrasi</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">{t.ticket_number}</span>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const newTab = window.open('', '_blank');
                        if (newTab) {
                          newTab.document.write('<div style="font-family:sans-serif;padding:20px;">Memuat PDF Tiket Anda...</div>');
                        }
                        
                        try {
                          const api = (await import('../services/api')).default;
                          const response = await api.get(`/tickets/${t.ticket_number}/pdf`, { 
                            responseType: 'blob',
                            headers: { 'Accept': 'application/pdf' }
                          });
                          const blob = new Blob([response as any], { type: 'application/pdf' });
                          const url = window.URL.createObjectURL(blob);
                          
                          if (newTab) {
                            newTab.location.href = url;
                          } else {
                            window.open(url, '_blank');
                          }
                        } catch (err) {
                          if (newTab) newTab.close();
                          const toast = (await import('react-hot-toast')).default;
                          toast.error('Gagal memuat tiket PDF. Silakan coba lagi.');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors shadow-2xs"
                    >
                      <Printer className="w-4 h-4 text-indigo-500" />
                      Lihat PDF
                    </button>
                  </div>
                </div>

                {/* Perforation Divider Line (Hidden on mobile, vertical on desktop) */}
                <div className="relative border-t lg:border-t-0 lg:border-l border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30/80 flex flex-col items-center justify-center p-8 lg:w-72 shrink-0">
                  {/* Circular Notches (Ticket cutout effect) */}
                  <div className="hidden lg:block absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#f8fafc] border border-slate-200 dark:border-slate-700"></div>
                  <div className="hidden lg:block absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-[#f8fafc] border border-slate-200 dark:border-slate-700"></div>

                  {/* QR Code Frame */}
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/90 shadow-md shadow-slate-900/5 text-center space-y-3">
                    <svg
                      className="w-36 h-36 mx-auto"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="100" height="100" fill="white" />
                      {/* Top-left marker */}
                      <rect x="8" y="8" width="26" height="26" rx="4" fill="#0f172a" />
                      <rect x="12" y="12" width="18" height="18" fill="white" />
                      <rect x="16" y="16" width="10" height="10" fill="#4f46e5" />

                      {/* Top-right marker */}
                      <rect x="66" y="8" width="26" height="26" rx="4" fill="#0f172a" />
                      <rect x="70" y="12" width="18" height="18" fill="white" />
                      <rect x="74" y="16" width="10" height="10" fill="#4f46e5" />

                      {/* Bottom-left marker */}
                      <rect x="8" y="66" width="26" height="26" rx="4" fill="#0f172a" />
                      <rect x="12" y="70" width="18" height="18" fill="white" />
                      <rect x="16" y="74" width="10" height="10" fill="#4f46e5" />

                      {/* Pattern cells */}
                      <rect x="42" y="10" width="8" height="8" fill="#0f172a" />
                      <rect x="52" y="18" width="8" height="8" fill="#4f46e5" />
                      <rect x="42" y="28" width="8" height="8" fill="#0f172a" />
                      <rect x="10" y="42" width="8" height="8" fill="#0f172a" />
                      <rect x="22" y="48" width="8" height="8" fill="#0f172a" />
                      <rect x="36" y="42" width="14" height="14" fill="#0f172a" />
                      <rect x="54" y="42" width="8" height="8" fill="#4f46e5" />
                      <rect x="68" y="46" width="14" height="6" fill="#0f172a" />
                      <rect x="44" y="64" width="6" height="14" fill="#0f172a" />
                      <rect x="58" y="70" width="12" height="12" fill="#4f46e5" />
                      <rect x="78" y="64" width="8" height="14" fill="#0f172a" />
                    </svg>

                    <div className="space-y-1">
                      <span className="font-mono text-[11px] font-extrabold text-slate-600 dark:text-slate-400 block">
                        {t.qr_token.slice(0, 15)}...
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Scan QR di pintu masuk acara
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
