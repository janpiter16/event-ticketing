import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { EventItem, TicketType, IssuedTicket } from '../types';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  MapPin, 
  Video, 
  CheckCircle2, 
  Ticket, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isOrganizer, isStaff, isSuperAdmin } = useAuth();
  
  const isStrictParticipant = !isOrganizer && !isStaff && !isSuperAdmin;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [attendeeName, setAttendeeName] = useState(user?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setAttendeeName(user.name);
      setAttendeeEmail(user.email);
    }
  }, [user]);

  const fetchEvent = async (eventId: string) => {
    setLoading(true);
    try {
      const res = await eventService.getEventById(eventId);
      if (res.data) {
        setEvent(res.data);
        if (res.data.ticket_types && res.data.ticket_types.length > 0) {
          setSelectedTicket(res.data.ticket_types[0]);
        }
      }
    } catch (err) {
      console.error('Event not found', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFullDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !event) return;

    setIsSubmitting(true);

    try {
      const api = (await import('../services/api')).default;
      const res = await api.post('/checkout', {
        event_id: event.id,
        ticket_type_id: selectedTicket.id,
        quantity: quantity,
        attendee_name: attendeeName || 'Peserta',
        attendee_email: attendeeEmail || 'peserta@eventflow.id',
      });

      if (res.success || res.data?.success) {
        // Karena Axios interceptor me-return response.data, kita cek 'res.data.payment_url'
        const paymentUrl = res.data?.payment_url || (res.data?.data && res.data.data.payment_url);
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          setCheckoutSuccess(true);
          toast.success('Pemesanan tiket berhasil!');
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal melakukan pemesanan. Pastikan Anda sudah login atau stok tiket masih tersedia.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-40 bg-slate-200 rounded-lg"></div>
          <div className="h-96 bg-slate-200 rounded-3xl"></div>
          <div className="h-12 w-2/3 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-200">Event Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Jadwal event yang Anda tuju mungkin telah dipindahkan atau dinonaktifkan.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Event
        </Link>
      </div>
    );
  }

  const ticketPrice = selectedTicket ? Number(selectedTicket.price) : 0;
  const totalPrice = ticketPrice * quantity;

  return (
    <div className="pb-28">
      {/* Top Breadcrumb Header */}
      <div className="border-b border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-3.5 sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Semua Event
          </Link>
          <span className="text-slate-400 font-medium hidden sm:inline">
            EventFlow Verified Listing
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Main Content (2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Immersive Cover Banner */}
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/5">
              {event.cover_image ? (
                <img src={event.cover_image} alt={event.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
                  <Calendar className="w-20 h-20 opacity-30" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              {/* Floating Status Badges */}
              <div className="absolute top-5 left-5 flex gap-2">
                {event.category && (
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-50 backdrop-blur-md shadow-md">
                    {event.category.name}
                  </span>
                )}
                <span className={`px-3.5 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md shadow-md ${
                  event.is_online ? 'bg-blue-600/90 text-white' : 'bg-emerald-600/90 text-white'
                }`}>
                  {event.is_online ? 'Webinar Online' : 'Onsite Event'}
                </span>
              </div>
            </div>

            {/* Event Title & Metadata Grid */}
            <div className="space-y-6">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.18]">
                {event.name}
              </h1>

              {/* Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/90 shadow-2xs flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                      Waktu & Tanggal
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug block mt-0.5">
                      {formatFullDate(event.start_at)}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/90 shadow-2xs flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                    {event.is_online ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                      Lokasi Acara
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug block mt-0.5 truncate">
                      {event.is_online ? 'Streaming Online (Tautan Zoom)' : (event.venue_name || 'Lokasi Fisik')}
                    </span>
                    {event.venue_address && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{event.venue_address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/90 p-8 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                  Deskripsi & Agenda Acara
                </h3>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-normal">
                {event.description}
              </p>
            </div>

            {/* Organizer Card */}
            {event.organizer && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/90 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-700 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-indigo-500/20 shrink-0">
                    {event.organizer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">
                      Penyelenggara Resmi
                    </span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-50">{event.organizer.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">{event.organizer.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start sm:self-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified Organizer
                </div>
              </div>
            )}
          </div>

          {/* Right Ticket Booking or Info Card (1 Column Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/90 shadow-xl shadow-slate-900/5 p-7 space-y-6">
              {!isStrictParticipant ? (
                <>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider block">
                      Informasi Ringkas
                    </span>
                    <h3 className="font-display text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">
                      Statistik Acara
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Status Publikasi</span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${event.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {event.status || 'DRAFT'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Kategori Event</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-50">{event.category?.name || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Tipe Tiket</span>
                      <span className="text-sm font-black text-indigo-600">{event.ticket_types?.length || 0}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mt-2">
                    <Link
                      to="/dashboard"
                      className="w-full py-3.5 px-5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      Kelola di Dashboard
                    </Link>
                    <p className="text-[11px] text-center text-slate-400 font-medium mt-3">
                      Halaman ini menampilkan pratinjau publik acara Anda.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider block">
                      Pemesanan Tiket
                    </span>
                    <h3 className="font-display text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">
                      Pilih Kategori Tiket
                    </h3>
                  </div>

                  {/* Ticket Cards */}
                  <div className="space-y-3.5">
                    {event.ticket_types && event.ticket_types.length > 0 ? (
                      event.ticket_types.map((ticket: TicketType) => {
                        const isSelected = selectedTicket?.id === ticket.id;
                        const priceNum = Number(ticket.price);
                        return (
                          <div
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/30 shadow-xs'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                                  }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                  </div>
                                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-50 truncate">{ticket.name}</h4>
                                </div>
                                {ticket.description && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-snug pl-6">{ticket.description}</p>
                                )}
                              </div>
                              <span className="font-display font-extrabold text-base text-indigo-700 whitespace-nowrap">
                                {priceNum === 0 ? 'Gratis' : `Rp${priceNum.toLocaleString('id-ID')}`}
                              </span>
                            </div>

                            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 pl-6">
                              <span className="font-medium">Sisa kuota: {ticket.quota} tiket</span>
                              {isSelected && <span className="font-bold text-indigo-600">Dipilih</span>}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-4">Tiket belum tersedia.</p>
                    )}
                  </div>

                  {/* Quantity selector */}
                  {selectedTicket && (
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Jumlah Tiket</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800/30 disabled:opacity-30 active:scale-95 transition-all"
                        >
                          -
                        </button>
                        <span className="font-display font-extrabold text-base text-slate-900 dark:text-slate-50 w-6 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(5, quantity + 1))}
                          disabled={quantity >= 5}
                          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800/30 disabled:opacity-30 active:scale-95 transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Total & Action Button */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Biaya:</span>
                      <span className="font-display text-2xl font-black text-slate-900 dark:text-slate-50">
                        {totalPrice === 0 ? 'Gratis' : `Rp${totalPrice.toLocaleString('id-ID')}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCheckoutOpen(true)}
                      disabled={!selectedTicket}
                      className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      <Ticket className="w-4 h-4" />
                      Lanjut ke Pemesanan
                    </button>
                    <p className="text-[11px] text-center text-slate-400 font-medium">
                      Tiket & QR code resmi langsung masuk ke akun Anda.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-7 space-y-6">
            {!checkoutSuccess ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-slate-50">Konfirmasi Pemesanan</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">{event.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/50 font-bold"
                  >
                    Ã¢Å“â€¢
                  </button>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Kategori Tiket:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTicket?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Jumlah:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{quantity} Tiket</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold text-slate-900 dark:text-slate-50">
                    <span>Total Tagihan:</span>
                    <span className="text-indigo-600 font-display text-sm">
                      {totalPrice === 0 ? 'Gratis' : `Rp${totalPrice.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Peserta</label>
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="Masukkan nama sesuai KTP / ID"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Alamat Email Konfirmasi</label>
                    <input
                      type="email"
                      required
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menerbitkan Tiket...' : totalPrice === 0 ? 'Klaim Tiket Gratis Sekarang' : 'Bayar & Konfirmasi Tiket'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl text-slate-900 dark:text-slate-50">Registrasi Berhasil!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                    Tiket digital resmi beserta kode QR unik Anda telah diterbitkan. Silakan buka halaman tiket untuk melihat pass digital Anda.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={() => navigate('/my-tickets')}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-md transition-colors"
                  >
                    Buka Tiket Saya Sekarang
                  </button>
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCheckoutSuccess(false);
                    }}
                    className="w-full py-2.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
