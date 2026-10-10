import React, { useState, useEffect } from 'react';
import { IssuedTicket } from '../types';
import { 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  UserCheck, 
  Sparkles,
  RefreshCw,
  Camera,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';

export const StaffCheckInPage: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'duplicate' | 'invalid';
    ticket?: IssuedTicket;
    message: string;
    timestamp?: string;
  } | null>(null);

  const [isScannerReady, setIsScannerReady] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState<IssuedTicket[]>([]);
  const lastScannedRef = React.useRef<string | null>(null);

  useEffect(() => {
    loadRecent();

    // Initialize scanner
    const initScanner = async () => {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5Qrcode = new Html5Qrcode("qr-reader");
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      try {
        await html5Qrcode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (lastScannedRef.current !== decodedText) {
              lastScannedRef.current = decodedText;
              handleVerify(decodedText);
              // Reset debounce after 3 seconds
              setTimeout(() => {
                lastScannedRef.current = null;
              }, 3000);
            }
          },
          (errorMessage) => {
            // ignore scan failures
          }
        );
        setIsScannerReady(true);
      } catch (err) {
        console.warn('Failed to start scanner', err);
        setIsScannerReady(true); // fall back to ready so manual input is unblocked
      }

      return () => {
        if (html5Qrcode.isScanning) {
          html5Qrcode.stop().catch(console.error);
        }
      };
    };

    const cleanup = initScanner();
    return () => {
      cleanup.then(clean => clean && clean());
    };
  }, []);

  const loadRecent = () => {
    // In a real app, this might fetch from an API like `/api/tickets/recent-checkins`
    // For now we just keep the array of recent checkins in memory for the current session
  };

  const handleVerify = async (inputToTest?: string) => {
    const raw = (inputToTest || tokenInput).trim();
    if (!raw) return;

    try {
      const api = (await import('../services/api')).default;
      const res = await api.post('/tickets/checkin', { token: raw });
      
      const ticket = res.data; // res is already the JSON body due to interceptor
      
      setScanResult({
        status: res.status || 'success',
        ticket,
        message: res.message,
        timestamp: ticket?.checked_in_at ? new Date(ticket.checked_in_at).toLocaleTimeString('id-ID') : new Date().toLocaleTimeString('id-ID'),
      });

      setRecentCheckIns((prev) => [ticket, ...prev]);
      setTokenInput('');
    } catch (err: any) {
      // err is already the parsed JSON error body due to the api.ts interceptor
      const data = err;
      
      setScanResult({
        status: data?.status || 'invalid',
        ticket: data?.data,
        message: data?.message || 'KODE TIKET TIDAK VALID. Terjadi kesalahan server.',
        timestamp: data?.data?.checked_in_at ? new Date(data.data.checked_in_at).toLocaleTimeString('id-ID') : undefined,
      });
    }
  };

  const sampleTicketToken = () => {
    return 'EVT-20260922-000088';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" /> Portal Operasional Lapangan
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            Scanner & Validasi Tiket
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Verifikasi keaslian tiket peserta event secara instan untuk mencegah duplikasi atau tiket palsu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: High-Tech Viewfinder & Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-50">
                Kamera Scanner QR Code
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Kamera Aktif & Siap
              </div>
            </div>

            {/* HTML5 QR Code Scanner Viewfinder */}
            <div className="relative rounded-2xl bg-slate-950 flex flex-col items-center justify-center p-4 text-white overflow-hidden shadow-2xl border border-slate-800">
              <div id="qr-reader" className="w-full max-w-sm rounded-xl overflow-hidden [&_video]:rounded-xl [&_#qr-shaded-region]:rounded-xl"></div>
              {!isScannerReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-xs font-bold text-slate-300">Memuat Kamera...</p>
                </div>
              )}
            </div>

            {/* Manual Token Verification Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
              className="space-y-3 pt-2"
            >
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Atau Masukkan Nomor Tiket / Kode Token Manual:
              </label>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="cth. EVT-2026... atau PASS-..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono uppercase tracking-wider focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 shrink-0 active:scale-[0.98] transition-all"
                >
                  Verifikasi Tiket
                </button>
              </div>

              {/* Quick test simulation pill */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Uji coba dengan tiket yang tersedia:</span>
                <button
                  type="button"
                  onClick={() => {
                    const token = sampleTicketToken();
                    setTokenInput(token);
                    handleVerify(token);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Tes Tiket Aktif ({sampleTicketToken()})
                </button>
              </div>
            </form>
          </div>

          {/* Validation Feedback Result Card */}
          {scanResult && (
            <div
              className={`rounded-3xl border p-7 transition-all shadow-xl ${
                scanResult.status === 'success'
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-emerald-500/10'
                  : scanResult.status === 'duplicate'
                  ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-amber-500/10'
                  : 'bg-red-50/90 border-red-300 text-red-950 shadow-red-500/10'
              }`}
            >
              <div className="flex items-start gap-5">
                {scanResult.status === 'success' && (
                  <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-600/30 shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                )}
                {scanResult.status === 'duplicate' && (
                  <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-600/30 shrink-0">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                )}
                {scanResult.status === 'invalid' && (
                  <div className="p-3 rounded-2xl bg-red-500 text-white shadow-md shadow-red-600/30 shrink-0">
                    <XCircle className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <h4 className="font-display font-black text-xl tracking-tight">
                    {scanResult.message}
                  </h4>

                  {scanResult.ticket && (
                    <div className="mt-4 p-5 bg-white/90 rounded-2xl border border-black/5 text-xs text-slate-800 dark:text-slate-200 space-y-2 shadow-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Nama Peserta:</span>
                        <span className="font-extrabold text-slate-900 dark:text-slate-50 text-sm">{scanResult.ticket.participant_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Kategori Tiket:</span>
                        <span className="font-bold text-indigo-700">{scanResult.ticket.ticket_type.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Nomor Tiket:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{scanResult.ticket.ticket_number}</span>
                      </div>
                      {scanResult.timestamp && (
                        <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold">
                          <span className="text-slate-500 dark:text-slate-400">Waktu Tercatat:</span>
                          <span className="text-indigo-600">{scanResult.timestamp}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Check-in Feed */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-900/5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-slate-50">
                  Riwayat Check-in
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Sesi scan aktif</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                {recentCheckIns.length} Masuk
              </span>
            </div>

            {recentCheckIns.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-10 font-medium">
                Belum ada peserta yang check-in pada sesi ini.
              </p>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {recentCheckIns.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-slate-50 truncate max-w-[140px]">
                        {item.participant_name}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
                        {item.checked_in_at || 'Selesai'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                      {item.ticket_number}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
