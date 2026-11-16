import React from 'react';
import { Bot, Lightbulb } from 'lucide-react';

export default function AIInsightCard({ routeData }) {
  if (!routeData || !routeData.ai_coach_summary) return null;

  // Mesin Pemindai Teks (Anti-Bocor & Netralisasi Warna Navigasi)
  const renderHighlightedText = (text) => {
    if (!text) return null;
    
    // Regex menangkap seluruh variabel krusial secara spesifik tanpa memecah kata
    const pattern = /(KM \d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?|-?\d+(?:\.\d+)?%|power-hiking|power hiking|zona merah|merah|zona kuning|kuning|zona hijau|hijau|zona 2|berbahaya|kolaps)/gi;
    const parts = text.split(pattern);

    return parts.map((part, index) => {
      if (!part) return null;
      
      // Pengaman Teks Biasa (Indeks Genap selalu dirender sebagai teks standar)
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>;
      }

      const lowerPart = part.toLowerCase();
      
      // === LOGIKA ZONA BAHAYA (Pewarnaan Kapsul Presisi Sesuai Tabel) ===
      if (lowerPart.includes('merah') || lowerPart.includes('berbahaya') || lowerPart.includes('kolaps')) {
        return <span key={index} className="inline-block text-red-500 bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 mx-0.5 my-0.5 rounded transition-colors">{part}</span>;
      }
      else if (lowerPart.includes('kuning') || lowerPart.includes('power-hiking') || lowerPart.includes('power hiking')) {
        return <span key={index} className="inline-block text-amber-500 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 mx-0.5 my-0.5 rounded transition-colors">{part}</span>;
      }
      else if (lowerPart.includes('hijau') || lowerPart.includes('zona 2')) {
        return <span key={index} className="inline-block text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 mx-0.5 my-0.5 rounded transition-colors">{part}</span>;
      }
      
      // === PERBAIKAN: WARNA NAVIGASI (NETRAL) ===
      else if (lowerPart.match(/^km /)) {
        // Jarak berwarna Sky Blue agar tidak disangka Zona Aman (Hijau)
        return <span key={index} className="inline-block text-sky-400 font-bold mx-0.5 my-0.5">{part}</span>;
      } 
      else if (lowerPart.match(/%$/)) {
        if (lowerPart.includes('-')) {
          // Turunan Biru
          return <span key={index} className="inline-block text-blue-400 font-bold mx-0.5 my-0.5">{part}</span>;
        } else {
          // Tanjakan Merah
          return <span key={index} className="inline-block text-red-500 font-bold mx-0.5 my-0.5">{part}</span>;
        }
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-sm border-2 border-[#1E3A8A]/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col relative overflow-hidden font-sans mt-4">
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E3A8A]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

      <div className="flex items-center gap-4 mb-5 relative z-10 border-b border-slate-700/50 pb-4">
        <div className="p-3 bg-[#1E3A8A] rounded-xl border border-blue-400/30 shadow-lg shadow-blue-900/20">
          <Bot className="w-6 h-6 text-blue-100" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">
            Instruksi Taktis Pelatih (AI)
          </h3>
          <p className="text-xs text-blue-300/80 font-medium tracking-wider uppercase mt-1 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" /> Ringkasan Mitigasi Cidera
          </p>
        </div>
      </div>
      
      <div className="relative z-10 pl-2 md:pl-4">
        {/* Kontainer teks utama: 'leading-loose' memberikan ruang vertikal lega antar baris */}
        <p className="text-slate-300 text-sm md:text-base leading-loose tracking-wide font-normal">
          {renderHighlightedText(routeData.ai_coach_summary)}
        </p>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#1E3A8A] to-transparent opacity-50"></div>
    </div>
  );
}