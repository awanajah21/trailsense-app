import React, { useState } from 'react';
import { User, ArrowRight, X } from 'lucide-react'; // Mengimpor ikon X untuk tombol tutup

export default function WelcomeModal({ isOpen, onSubmit, onCancel }) { // Menerima prop onCancel
  const [name, setName] = useState('');

  // Mencegah modal dirender jika state isOpen false
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    // Backdrop overlay dengan efek blur elegan
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Modal Card */}
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 relative"
      >
        {/* Tombol Silang (Kembali ke Basecamp) */}
        <button 
          onClick={onCancel}
          type="button"
          className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-all duration-200 focus:outline-none"
          title="Batalkan dan kembali ke Beranda"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal dengan warna Biru Detrac */}
        <div className="bg-[#1E3A8A] px-6 py-5">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Welcome
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Please enter your name to start
          </p>
        </div>

        {/* Body Modal: Form Input */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="userName" className="block text-sm font-semibold text-slate-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                id="userName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] focus:bg-white transition-colors duration-200 sm:text-sm text-slate-900 font-medium"
                placeholder="e.g. Coach Fandhi"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#152b66] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Begin
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}