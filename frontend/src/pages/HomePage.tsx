import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { fallbackCategories, fallbackEvents } from '../services/mockData';
import { EventItem, EventCategory, TicketType } from '../types';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Video, 
  Search, 
  ArrowRight,
  Filter,
  Sparkles,
  Laptop,
  Briefcase,
  GraduationCap,
  Music,
  Heart,
  Tag,
  ShieldCheck,
  CheckCircle,
  Zap,
  Ticket,
  Clock
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [categories, setCategories] = useState<EventCategory[]>(fallbackCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnlineFilter, setIsOnlineFilter] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Backgrounds untuk pengguna yang BELUM login (Tampilan lebih komersial/public)
  const publicBackgrounds = [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80', // Seminar
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80', // Conference
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80', // Presentation
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80'  // Tech event
  ];

  // Backgrounds untuk pengguna yang SUDAH login (Tampilan lebih personal/dashboard-like)
  const loggedInBackgrounds = [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80', // Exhibition / art
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80', // Concert / crowd
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80', // Community gathering
    'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80'  // Event space
  ];

  const heroBackgrounds = user ? loggedInBackgrounds : publicBackgrounds;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, isOnlineFilter]);

  const fetchCategories = async () => {
    try {
      const res = await eventService.getCategories();
      if (res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      if (isOnlineFilter !== null) params.is_online = isOnlineFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await eventService.getPublicEvents(params);
      if (res.data) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Failed to fetch events', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const getLowestPrice = (event: EventItem) => {
    if (!event.ticket_types || event.ticket_types.length === 0) {
      return 'Gratis';
    }
    const prices = event.ticket_types.map((t: TicketType) => Number(t.price));
    const min = Math.min(...prices);
    if (min === 0) return 'Gratis';
    return `Rp${min.toLocaleString('id-ID')}`;
  };

  const getDateParts = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const day = d.getDate();
      const month = d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
      const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return { day, month, time };
    } catch {
      return { day: '15', month: 'OKT', time: '09:00' };
    }
  };

  const getCategoryIcon = (slug?: string) => {
    switch (slug) {
      case 'technology-it': return <Laptop className="w-3.5 h-3.5" />;
      case 'business-entrepreneurship': return <Briefcase className="w-3.5 h-3.5" />;
      case 'workshops-seminars': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'music-arts': return <Music className="w-3.5 h-3.5" />;
      case 'health-wellness': return <Heart className="w-3.5 h-3.5" />;
      default: return <Tag className="w-3.5 h-3.5" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-900 text-slate-900 dark:text-slate-50 dark:text-slate-50 min-h-screen transition-colors">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-16 min-h-[600px] flex items-center justify-center">
        
        {/* Background Slider */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          {heroBackgrounds.map((bg, idx) => (
            <motion.img
              key={bg}
              src={bg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ 
                opacity: idx === currentBgIndex ? 0.6 : 0,
                scale: idx === currentBgIndex ? 1 : 1.05
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          ))}
          {/* Overlay to ensure text readability & enhance photo quality */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-[#f8fafc]"></div>
        </div>

        {/* Subtle decorative glow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-indigo-500/20 via-transparent to-transparent pointer-events-none z-0 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center flex flex-col items-center mt-12 sm:mt-20"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white text-xs font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span>
              {user ? 'Akses Cepat ke Berbagai Event' : 'Platform Tiket & Manajemen Event Resmi'}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-5 drop-shadow-lg">
              {user ? (
                <>
                  Selamat Datang Kembali, <br/>
                  <span className="bg-gradient-to-r from-indigo-300 via-pink-300 to-violet-300 bg-clip-text text-transparent drop-shadow-sm">
                    {user.name}
                  </span>
                </>
              ) : (
                <>
                  Jelajahi Konferensi & Workshop{' '}
                  <span className="bg-gradient-to-r from-indigo-300 via-indigo-400 to-violet-300 bg-clip-text text-transparent drop-shadow-sm">
                    Kelas Dunia
                  </span>
                  .
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-slate-200 text-base sm:text-lg leading-relaxed mb-10 drop-shadow-md font-medium">
              {user 
                ? 'Temukan event terbaru yang cocok dengan minat Anda, beli tiket dengan aman, dan kelola pendaftaran Anda dalam satu tempat.'
                : 'Daftar tiket dalam sekejap, nikmati tiket digital instan berstandar keamanan tinggi dengan QR code unik, dan hadir tanpa antrean di gerbang masuk.'}
            </p>

            {/* Unified Search Card */}
            <div className="w-full max-w-3xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 dark:border-slate-700/80 p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center focus-within:ring-4 ring-indigo-600/10 transition-all"
              >
                {/* Search Text Input */}
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari event, workshop, pembicara, atau topik..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-50 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none"
                  />
                </div>

                {/* Type Filter Toggle Pills */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl shrink-0 self-stretch sm:self-auto justify-center">
                  <button
                    type="button"
                    onClick={() => setIsOnlineFilter(null)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isOnlineFilter === null
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOnlineFilter(false)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isOnlineFilter === false
                        ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50'
                    }`}
                  >
                    Onsite
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOnlineFilter(true)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isOnlineFilter === true
                        ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50'
                    }`}
                  >
                    Online
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  Temukan Event
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats Bar / Quick Access Band */}
      {!user ? (
        <section className="border-b border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-slate-200/80 text-center"
            >
              <div className="px-4">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50">100%</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Validasi QR Server</div>
              </div>
              <div className="px-4">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50">Instant</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Tiket Digital Resmi</div>
              </div>
              <div className="px-4">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50">Zero</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Overselling Protection</div>
              </div>
              <div className="px-4">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50">1 Detik</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Check-in Pintu Masuk</div>
              </div>
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="border-b border-slate-200 dark:border-slate-700/80 bg-indigo-50/50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">Akses Cepat ke Workspace Anda</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kelola tiket digital yang Anda beli atau pantau performa event yang Anda buat.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link to="/my-tickets" className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors">
                  Tiket Saya
                </Link>
                <Link to="/dashboard" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2">
                  Ke Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Section Kategori & Topik Pilihan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Kategori & Topik Pilihan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Pilih kategori yang sesuai dengan minat dan pengembangan karir Anda.
          </p>
        </div>

        {/* Category Pills Slider */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none items-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Semua Kategori ({fallbackEvents.length}+)
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/30'
              }`}
            >
              {getCategoryIcon(cat.slug)}
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Event Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Event Yang Sedang Berlangsung</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {events.length} Event Ditemukan
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 animate-pulse p-4" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xs"
          >
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">Tidak ada event untuk filter ini</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Coba sesuaikan pencarian atau gunakan tombol reset di bawah untuk melihat seluruh jadwal event.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setIsOnlineFilter(null);
                setEvents(fallbackEvents);
              }}
              className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Reset Filter Pencarian
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => {
              const dateInfo = getDateParts(event.start_at);
              return (
                <motion.div variants={itemVariants} key={event.id}>
                  <Link
                    to={`/events/${event.id}`}
                    className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/90 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800/50 overflow-hidden">
                      {event.cover_image ? (
                        <img
                          src={event.cover_image}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <Calendar className="w-12 h-12" />
                        </div>
                      )}

                      {/* Gradient Overlay for Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                      {/* Floating Date Badge (Top Left) */}
                      <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-slate-50 font-semibold rounded-xl px-2.5 py-1.5 shadow-sm text-center border border-white/80">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 leading-none">
                          {dateInfo.month}
                        </span>
                        <span className="block text-base font-black text-slate-900 dark:text-slate-50 leading-tight mt-0.5">
                          {dateInfo.day}
                        </span>
                      </div>

                      {/* Format Badge (Top Right) */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs border border-white/10 ${
                          event.is_online 
                            ? 'bg-blue-600/90 text-white' 
                            : 'bg-emerald-600/90 text-white'
                        }`}>
                          {event.is_online ? 'Webinar Online' : 'Onsite'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        {/* Meta header: Category chip + Time */}
                        <div className="flex items-center gap-2 text-xs">
                          {event.category && (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                              {event.category.name}
                            </span>
                          )}
                          <span className="text-slate-300">Ã‚Â·</span>
                          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium text-xs">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Pukul {dateInfo.time} WIB</span>
                          </div>
                        </div>

                        {/* Event Title */}
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug min-h-[3rem]">
                          {event.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[2.25rem]">
                          {event.description}
                        </p>
                      </div>

                      {/* Footer Info: Location & Price */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                          {event.is_online ? (
                            <>
                              <Video className="w-4 h-4 text-indigo-500 shrink-0" />
                              <span className="truncate text-xs font-medium">Online Stream</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                              <span className="truncate text-xs font-medium">{event.venue_name || 'Lokasi Fisik'}</span>
                            </>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Mulai</span>
                          <span className="font-extrabold text-slate-900 dark:text-slate-50 text-sm sm:text-base">
                            {getLowestPrice(event)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Link */}
                    <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-800/30/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <span>Lihat Detail & Beli Tiket</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </div>
  );
};

