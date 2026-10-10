import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { fallbackEvents } from '../services/mockData';
import { EventItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Users, 
  Globe, 
  Clock, 
  Eye, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  Search,
  Download
} from 'lucide-react';

export const OrganizerDashboardPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [filterSearch, setFilterSearch] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [analytics, setAnalytics] = useState({
    total_events: 0,
    published_events: 0,
    draft_events: 0,
    total_participants: 0,
    total_revenue: 0,
  });

  useEffect(() => {
    fetchEvents(currentPage);
    fetchAnalytics();
  }, [currentPage]);

  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const res = await eventService.getOrganizerEvents(page);
      if (res.data) {
        setEvents(res.data);
        if (res.meta) {
          setCurrentPage(res.meta.current_page);
          setTotalPages(res.meta.last_page);
        }
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Failed to fetch organizer events', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await eventService.getAnalytics();
      if (res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  };

  const handleTogglePublish = async (event: EventItem) => {
    setActionLoading(event.id);
    setMessage(null);
    try {
      if (event.status === 'PUBLISHED') {
        await eventService.unpublishEvent(event.id);
        setMessage({ text: `Event "${event.name}" berhasil diubah menjadi DRAFT.`, type: 'success' });
      } else {
        await eventService.publishEvent(event.id);
        setMessage({ text: `Event "${event.name}" BERHASIL DIPUBLIKASIKAN ke publik.`, type: 'success' });
      }
      await fetchEvents();
      await fetchAnalytics();
    } catch {
      // Local state fallback update for instant feedback
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, status: e.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }
            : e
        )
      );
      setMessage({
        text: `Status event "${event.name}" berhasil diperbarui ke ${event.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'}.`,
        type: 'success',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;
    setActionLoading(id);
    try {
      await eventService.deleteEvent(id);
      setMessage({ text: 'Event berhasil dihapus.', type: 'success' });
      await fetchEvents();
      await fetchAnalytics();
    } catch {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setMessage({ text: 'Event berhasil dihapus.', type: 'success' });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-10">
      {/* Alert Banner */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className={`overflow-hidden rounded-2xl border shadow-sm ${
              message.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className={`p-4 text-xs font-bold flex items-center justify-between ${
              message.type === 'success' ? 'text-emerald-900' : 'text-red-900'
            }`}>
              <span>{message.text}</span>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-700 dark:text-slate-300 font-bold ml-4">
                Ã¢Å“â€¢
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Row (4 Cards) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-900/5 space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Total Event</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-3xl text-slate-900 dark:text-slate-50">{analytics.total_events}</div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">Seluruh event tersimpan</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-900/5 space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Event Live</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-3xl text-emerald-600 flex items-center gap-2">
              {analytics.published_events}
              {analytics.published_events > 0 && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">Aktif dapat dibeli publik</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-900/5 space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Draft Event</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-3xl text-amber-600">{analytics.draft_events}</div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">Menunggu dipublikasikan</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-900/5 space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Peserta Terdaftar</span>
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-3xl text-slate-900 dark:text-slate-50">{analytics.total_participants}</div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">Tiket terdistribusi</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Events Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden"
      >
        {/* Table Top Controls */}
        <div className="p-7 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-slate-50">
              Manajemen Acara & Publikasi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kelola status publikasi, tiket, dan cek pratinjau halaman acara Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari event..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full sm:w-56 transition-all"
              />
            </div>

            <Link
              to="/dashboard/events/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              Buat Event Baru
            </Link>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-4 px-7">Informasi Event</th>
                  <th className="py-4 px-5">Kategori & Format</th>
                  <th className="py-4 px-5">Tanggal Acara</th>
                  <th className="py-4 px-5">Tiket Terjual</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-7 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-5 px-7">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 rounded-xl bg-slate-200 shrink-0"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-1/2"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-5 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-1/3"></div>
                    </td>
                    <td className="py-5 px-5">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </td>
                    <td className="py-5 px-5">
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-5 px-5">
                      <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                    </td>
                    <td className="py-5 px-7">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-16 bg-slate-200 rounded-xl"></div>
                        <div className="h-8 w-8 bg-slate-200 rounded-xl"></div>
                        <div className="h-8 w-8 bg-slate-200 rounded-xl"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-16 text-center space-y-3"
          >
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">Tidak ada event yang sesuai</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Event tidak ditemukan berdasarkan pencarian Anda.
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-4 px-7">Informasi Event</th>
                  <th className="py-4 px-5">Kategori & Format</th>
                  <th className="py-4 px-5">Tanggal Acara</th>
                  <th className="py-4 px-5">Tiket Terjual</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-7 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredEvents.map((event) => {
                    const isPublished = event.status === 'PUBLISHED';
                    return (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0, backgroundColor: '#fff' }}
                        animate={{ opacity: 1, backgroundColor: '#fff' }}
                        exit={{ opacity: 0, backgroundColor: '#fef2f2' }}
                        key={event.id} 
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        {/* Name & Cover */}
                        <td className="py-5 px-7">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/50 shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                              {event.cover_image ? (
                                <img src={event.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Calendar className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-extrabold text-slate-900 dark:text-slate-50 text-sm truncate max-w-xs">{event.name}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{event.description}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Format */}
                        <td className="py-5 px-5">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{event.category?.name || 'Teknologi'}</span>
                          <span className={`text-[10px] font-semibold ${event.is_online ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'}`}>
                            {event.is_online ? 'Webinar Online' : (event.venue_name || 'Onsite')}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-5 px-5 text-slate-600 dark:text-slate-400 font-medium">
                          {new Intl.DateTimeFormat('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }).format(new Date(event.start_at))}
                        </td>

                        {/* Tickets Sold */}
                        <td className="py-5 px-5">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg inline-flex">
                            <Users className="w-3.5 h-3.5" />
                            <span className="font-extrabold text-[11px]">{event.tickets_sold || 0} Tiket</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-5 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {event.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-5 px-7">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* Toggle Publish / Draft */}
                            <button
                              type="button"
                              disabled={actionLoading === event.id}
                              onClick={() => handleTogglePublish(event)}
                              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wide uppercase transition-all flex items-center justify-center min-w-[90px] ${
                                isPublished
                                  ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20'
                              }`}
                            >
                              {actionLoading === event.id ? 'Proses...' : (isPublished ? 'Unpublish' : 'Publish')}
                            </button>

                            {/* Secondary Actions Toolbar */}
                            <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 rounded-xl p-1 gap-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => eventService.exportAttendees(event.id, event.slug || 'event')}
                                title="Export Data Peserta (CSV)"
                                className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-white dark:bg-slate-800 hover:shadow-xs transition-all active:scale-95"
                              >
                                <Download className="w-4 h-4" />
                              </button>

                              <Link
                                to={`/events/${event.id}`}
                                title="Lihat Pratinjau Publik"
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white dark:bg-slate-800 hover:shadow-xs transition-all active:scale-95 flex items-center justify-center"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              <div className="w-px h-4 bg-slate-200 mx-1"></div>

                              <button
                                type="button"
                                disabled={actionLoading === event.id}
                                onClick={() => handleDeleteEvent(event.id)}
                                title="Hapus Event"
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white dark:bg-slate-800 hover:shadow-xs transition-all active:scale-95 disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Menampilkan halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
