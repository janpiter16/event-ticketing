import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const PaymentSimulationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      await api.post(`/simulate-payment/${orderNumber}`);
      navigate('/my-tickets');
    } catch (err) {
      alert('Simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800 p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
          <CreditCard className="w-8 h-8" />
        </div>
        
        <div>
          <h2 className="font-display font-black text-2xl text-slate-900 dark:text-slate-50 mb-2">Simulasi Pembayaran</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Anda dialihkan ke halaman ini karena API Key Payment Gateway (Xendit) belum dikonfigurasi. 
            Klik tombol di bawah untuk mensimulasikan pembayaran berhasil.
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Nomor Order</span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{orderNumber}</span>
        </div>

        <button
          onClick={handleSimulatePayment}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <CheckCircle2 className="w-5 h-5" />
          {loading ? 'Memproses...' : 'Simulasikan Bayar Sukses'}
        </button>
      </div>
    </div>
  );
};
