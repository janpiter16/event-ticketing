import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Sparkles, Shield, UserCheck, Eye, EyeOff, Check, X } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState<'participant' | 'organizer'>('participant');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValidations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Kata sandi belum memenuhi kriteria keamanan.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      navigate(role === 'organizer' ? '/dashboard' : '/');
    } catch (err: any) {
      const msg = err?.errors 
        ? Object.values(err.errors).flat().join(', ')
        : err?.message || 'Gagal melakukan pendaftaran akun.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-16 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
      
      {/* 3D Animated Background */}
      <AnimatedBackground />

      {/* Light/Dark Glassmorphism Card */}
      <div className="max-w-md w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden relative z-10 border border-white/60 dark:border-slate-700/60 p-8 sm:p-10 space-y-7">
        
        {/* Brand & Heading */}
        <div className="space-y-3 text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30 mb-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Mulai di EventFlow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Daftar untuk membeli tiket event atau publikasikan acara Anda sendiri.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-center gap-2.5 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Role switch pill */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Tipe Akun</label>
            <div className="grid grid-cols-2 gap-2.5 p-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/80">
              <button
                type="button"
                onClick={() => setRole('participant')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'participant'
                    ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-sm border border-slate-100 dark:border-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-white/40'
                }`}
              >
                <UserCheck className={`w-3.5 h-3.5 ${role === 'participant' ? 'text-indigo-500' : ''}`} />
                Peserta
              </button>
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'organizer'
                    ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-sm border border-slate-100 dark:border-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-white/40'
                }`}
              >
                <Shield className={`w-3.5 h-3.5 ${role === 'organizer' ? 'text-indigo-500' : ''}`} />
                Penyelenggara
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap / Organisasi</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. Budi Pratama"
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium backdrop-blur-sm"
            />
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ketik kata sandi"
                  className="w-full pl-4 pr-10 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 focus:outline-none p-1.5 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Ulangi Sandi</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Ketik ulang sandi"
                  className="w-full pl-4 pr-10 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 focus:outline-none p-1.5 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Validation Checklist */}
          {password.length > 0 && (
            <div className="bg-white/50 dark:bg-slate-900/50 border border-white/80 rounded-xl p-3.5 space-y-2 backdrop-blur-sm shadow-sm">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Kriteria Sandi Aman</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-2 ${passwordValidations.length ? 'text-green-600' : 'text-slate-400'}`}>
                  {passwordValidations.length ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Minimal 8 karakter</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordValidations.uppercase ? 'text-green-600' : 'text-slate-400'}`}>
                  {passwordValidations.uppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Minimal 1 huruf kapital</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordValidations.number ? 'text-green-600' : 'text-slate-400'}`}>
                  {passwordValidations.number ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Minimal 1 angka</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordValidations.special ? 'text-green-600' : 'text-slate-400'}`}>
                  {passwordValidations.special ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Minimal 1 tanda baca</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {isLoading ? 'Mendaftarkan Akun...' : 'Daftar Akun Sekarang'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium pt-2">
          Sudah memiliki akun sebelumnya?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
};
