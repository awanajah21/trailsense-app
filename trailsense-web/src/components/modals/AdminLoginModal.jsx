import React, { useState } from 'react';
import { ShieldCheck, Lock, User, X, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onLogin, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State Keamanan & Visibilitas
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showForgotMsg, setShowForgotMsg] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // STATE BARU UNTUK FITUR INTIP

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setShowForgotMsg(false);

    let isValid = true;

    // Validasi Hardcode (sementara sebelum ada backend Auth)
    if (username !== 'admin') {
      setUsernameError('Kredensial username tidak terdaftar.');
      isValid = false;
    } else if (password !== 'altidepok') {
      setPasswordError('Kata sandi tidak valid. Periksa kembali ketikan Anda.');
      isValid = false;
    }

    if (isValid) {
      onLogin();
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotMsg(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative zoom-in-95 animate-in">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#1E3A8A]/20 rounded-full flex items-center justify-center mb-4 border border-[#1E3A8A]/50">
            <ShieldCheck className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Otentikasi Kurator</h2>
          <p className="text-slate-400 text-sm text-center mb-8">
            Masukkan kredensial pelatih ALTI Depok untuk mengakses dasbor manajemen GPX.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            
            {/* Input Username */}
            <div className="flex flex-col gap-1.5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError('');
                  }}
                  className={`w-full bg-slate-950 border ${usernameError ? 'border-rose-500' : 'border-slate-700'} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#1E3A8A] transition-colors`}
                  autoFocus
                />
              </div>
              {usernameError && (
                <span className="text-rose-400 text-xs font-medium flex items-center gap-1 pl-1">
                  <AlertCircle className="w-3 h-3"/> {usernameError}
                </span>
              )}
            </div>

            {/* Input Password dengan Fitur Intip */}
            <div className="flex flex-col gap-1.5">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className={`w-full bg-slate-950 border ${passwordError ? 'border-rose-500' : 'border-slate-700'} rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-[#1E3A8A] transition-colors`}
                />
                
                {/* Tombol Toggle Mata */}
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <span className="text-rose-400 text-xs font-medium flex items-center gap-1 pl-1">
                  <AlertCircle className="w-3 h-3"/> {passwordError}
                </span>
              )}
            </div>

            {/* Tautan Lupa Password */}
            <div className="flex justify-end w-full -mt-1">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-medium text-slate-400 hover:text-[#1E3A8A] transition-colors"
              >
                Lupa Password?
              </button>
            </div>

            {/* Notifikasi Darurat Lupa Password */}
            {showForgotMsg && (
              <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-3 text-amber-400 text-xs text-center font-medium animate-in fade-in slide-in-from-top-2">
                Sistem otentikasi reset otomatis belum aktif. Harap hubungi Administrator IT ALTI Depok (Admin Utama) untuk memulihkan akses Anda.
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition-all shadow-lg mt-2"
            >
              Buka Brankas Data
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}