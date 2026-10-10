import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import { LogIn, AlertCircle, Sparkles, UserCheck, Shield, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setForgotPasswordSuccess(false);

    try {
      if (isForgotPasswordMode) {
        await authService.forgotPassword({ email });
        setForgotPasswordSuccess(true);
      } else {
        await login({ email, password });
        const from = (location.state as any)?.from?.pathname;
        if (from) {
          navigate(from);
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      if (isForgotPasswordMode) {
        setError(err?.errors?.email?.[0] || err?.message || 'Gagal mengirim tautan reset password.');
      } else {
        setError(err?.message || 'Email atau kata sandi yang Anda masukkan salah.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-16 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
      
      {/* 3D Animated Background */}
      <AnimatedBackground />

      {/* Light/Dark Glassmorphism Card */}
      <div className="max-w-md w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden relative z-10 border border-white/60 dark:border-slate-700/60 p-8 sm:p-10 space-y-7">
        
        {/* Brand & Heading */}
        <div className="space-y-3 text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30 mb-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isForgotPasswordMode ? 'Reset Sandi' : 'Selamat Datang'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isForgotPasswordMode
              ? 'Masukkan alamat email Anda yang terdaftar, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.'
              : 'Masuk untuk mengakses tiket digital atau mengelola event Anda.'}
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        {!isForgotPasswordMode && (
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/80 rounded-2xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Akses Demo Cepat:
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('organizer@eventflow.id')}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-200 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                Organizer
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('participant@eventflow.id')}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-200 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                Peserta
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-center gap-2.5 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {forgotPasswordSuccess && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-xs flex items-center gap-2.5 font-bold">
              <CheckCircle className="w-4 h-4 shrink-0 text-green-500" />
              <span>Tautan reset kata sandi telah dikirim ke email Anda. Silakan cek kotak masuk.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Alamat Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@domain.com"
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium backdrop-blur-sm"
            />
          </div>

          {!isForgotPasswordMode && (
            <>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Kata Sandi</label>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsForgotPasswordMode(true);
                      setError(null);
                      setForgotPasswordSuccess(false);
                    }} 
                    className="text-xs text-indigo-600 font-bold hover:underline transition-colors"
                  >
                    Lupa sandi?
                  </button>
                </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢"
                className="w-full pl-4 pr-11 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 focus:outline-none p-1 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 pb-1">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 bg-white dark:bg-slate-800 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              Ingat saya di peramban ini
            </label>
          </div>
          </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {!isForgotPasswordMode && <LogIn className="w-4 h-4" />}
            {isLoading 
              ? (isForgotPasswordMode ? 'Mengirim...' : 'Sedang Memverifikasi...') 
              : (isForgotPasswordMode ? 'Kirim Tautan Reset' : 'Masuk ke Akun')}
          </button>
          
          {isForgotPasswordMode && (
             <div className="text-center mt-3">
               <button 
                 type="button" 
                 onClick={() => {
                   setIsForgotPasswordMode(false);
                   setError(null);
                   setForgotPasswordSuccess(false);
                 }} 
                 className="text-xs text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 mx-auto"
               >
                 Kembali ke Login
               </button>
             </div>
          )}
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium pt-2">
          Belum memiliki akun?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Daftar akun gratis
          </Link>
        </div>
      </div>
    </div>
  );
};
