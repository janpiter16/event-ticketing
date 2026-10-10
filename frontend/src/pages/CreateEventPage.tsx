import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { EventCategory } from '../types';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Video, 
  Image, 
  AlertCircle,
  Sparkles,
  Building,
  Check
} from 'lucide-react';

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [onlineUrl, setOnlineUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await eventService.getCategories();
      if (res.data && res.data.length > 0) {
        setCategories(res.data);
        setCategoryId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: any = {
        name,
        category_id: categoryId,
        description,
        cover_image: coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        start_at: startAt,
        end_at: endAt,
        is_online: isOnline,
        venue_name: isOnline ? null : venueName,
        venue_address: isOnline ? null : venueAddress,
        online_url: isOnline ? onlineUrl : null,
      };

      await eventService.createEvent(payload);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.errors 
        ? Object.values(err.errors).flat().join(', ')
        : err?.message || 'Gagal menyimpan event.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-slate-50">
            Publikasikan Event Baru
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Lengkapi formulir di bawah ini untuk menyusun jadwal acara dan penjualan tiket.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5 font-bold shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xl shadow-slate-900/5 space-y-8">
        {/* Section 1 */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center">1</span>
            <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-slate-50">
              Identitas & Informasi Utama
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Judul Acara / Event *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. Southeast Asia Cloud & AI Summit 2026"
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Kategori Event</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi Lengkap Acara *</label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan agenda, para pembicara, fasilitas peserta, dan gambaran umum event..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Gambar Sampul / Banner *</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="URL Gambar atau Upload File"
                className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
              />
              <label className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800/50 cursor-pointer transition-colors whitespace-nowrap">
                <Image className="w-4 h-4" />
                Upload File
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const res = await eventService.uploadImage(file);
                        setCoverImage(res.url);
                      } catch (err) {
                        alert('Gagal mengunggah gambar. Pastikan ukuran di bawah 5MB.');
                      }
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-5 pt-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center">2</span>
            <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-slate-50">
              Jadwal Waktu Pelaksanaan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Waktu Mulai *</label>
              <input
                type="datetime-local"
                required
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Waktu Selesai *</label>
              <input
                type="datetime-local"
                required
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-5 pt-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center">3</span>
            <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-slate-50">
              Format & Lokasi Acara
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setIsOnline(false)}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                !isOnline
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                !isOnline ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
              }`}>
                {!isOnline && <Check className="w-3 h-3" />}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-50 block">Acara Onsite (Tatap Muka)</span>
                <span className="text-[11px] text-slate-400 font-medium">Di gedung, hotel, atau ruang seminar</span>
              </div>
            </div>

            <div
              onClick={() => setIsOnline(true)}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                isOnline
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isOnline ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
              }`}>
                {isOnline && <Check className="w-3 h-3" />}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-50 block">Webinar / Acara Online</span>
                <span className="text-[11px] text-slate-400 font-medium">Via Zoom, YouTube Live, atau GMeet</span>
              </div>
            </div>
          </div>

          {!isOnline ? (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nama Gedung / Tempat</label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="cth. Grand Ballroom Pullman Central Park"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Alamat Lengkap</label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="Jl. Letjen S. Parman No. Kav 28, Jakarta Barat"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
                />
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tautan Pertemuan Daring (Zoom / GMeet)</label>
              <input
                type="url"
                value={onlineUrl}
                onChange={(e) => setOnlineUrl(e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3.5">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan & Masuk ke Dashboard'}
          </button>
        </div>
      </form>
    </div>
  );
};
