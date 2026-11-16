import React, { useState } from 'react';
import { X, Globe, AlertTriangle, User, Mail, CheckCircle2, Loader2 } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  
  // State untuk mengontrol alur pengiriman dan notifikasi kustom
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (feedbackText.trim() && reporterName.trim() && reporterEmail.trim()) {
      setIsSubmitting(true);
      
      // === LOGIKA PENGIRIMAN API (FORMSPREE) ===
      // GANTI URL DI BAWAH DENGAN ENDPOINT FORMSPREE ANDA
      const formspreeEndpoint = "https://formspree.io/f/xkjgevza"; 

      try {
        const response = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: reporterName,
            email: reporterEmail,
            message: feedbackText,
            subject: "[TrailSense Feedback] Laporan Taktis Baru"
          })
        });

        if (response.ok) {
          // Sukses: Tampilkan UI centang hijau
          setIsSuccess(true);
          // Bersihkan form
          setFeedbackText('');
          setReporterName('');
          setReporterEmail('');
          
          // Tutup otomatis setelah 2.5 detik
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
          }, 2500);
        } else {
          setErrorMessage("Gagal mengirim laporan. Periksa koneksi internet Anda.");
        }
      } catch (error) {
        setErrorMessage("Terjadi kesalahan jaringan.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className="w-full max-w-lg bg-[#111111] border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden relative flex flex-col items-center text-center p-8 sm:p-10 transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* Tombol Silang (Batal/Tutup) */}
        {!isSubmitting && !isSuccess && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-700 p-2 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* TAMPILAN 1: PESAN SUKSES (KUSTOM NOTIFIKASI) */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Laporan Diterima!</h2>
            <p className="text-slate-400 text-sm">Terima kasih atas dedikasi Anda. Intelijen lapangan Anda akan dievaluasi oleh Pelatih Kepala.</p>
          </div>
        ) : (
          
        /* TAMPILAN 2: FORM INPUT UTAMA */
        <>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 flex flex-col items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-amber-500 mb-1" />
            Report a Trail Hazard
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            Apakah K-Means kami melewatkan zona bahaya? Punya ide fitur untuk mempermudah <em>pacing</em>? Kirimkan laporan intelijen lapangan Anda langsung ke meja pelatih.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#1E3A8A] transition">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-slate-700 rounded-xl focus:ring-1 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-slate-200 placeholder-slate-500 transition outline-none text-sm disabled:opacity-50"
                  placeholder="Nama Anda"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#1E3A8A] transition">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-slate-700 rounded-xl focus:ring-1 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] text-slate-200 placeholder-slate-500 transition outline-none text-sm disabled:opacity-50"
                  placeholder="Email Anda"
                />
              </div>
            </div>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tulis detail rute yang meleset, laporan bug, atau fitur yang Anda butuhkan..."
              disabled={isSubmitting}
              className="w-full h-32 bg-[#1A1A1A] border border-slate-700 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-colors resize-none custom-scrollbar mt-1 disabled:opacity-50"
              required
            ></textarea>
            
            {/* Pesan Error Internal */}
            {errorMessage && (
              <p className="text-red-400 text-xs text-center font-medium mt-1">{errorMessage}</p>
            )}

            <button 
              type="submit"
              disabled={!feedbackText.trim() || !reporterName.trim() || !reporterEmail.trim() || isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-[#1E3A8A] border border-slate-700 hover:border-[#1E3A8A] text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
              ) : (
                <><Globe className="w-4 h-4" /> Kirim Laporan Taktis</>
              )}
            </button>
          </form>
        </>
        )}
      </div>
    </div>
  );
}