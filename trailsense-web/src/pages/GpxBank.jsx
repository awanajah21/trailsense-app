import React, { useState, useEffect } from 'react';
import { Map, TrendingUp, Search, Filter, Home, Globe, Loader2, AlertCircle, HardDrive, Download } from 'lucide-react';
import { supabase } from '../config/supabase';

export default function GpxBankPage({ onBackHome, onOpenRoute }) {
  const [publicRoutes, setPublicRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchApprovedRoutes = async () => {
      try {
        const { data, error } = await supabase
          .from('gpx_routes')
          .select('*')
          .eq('status', 'APPROVED')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPublicRoutes(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedRoutes();
  }, []);

  const filteredRoutes = publicRoutes.filter(route =>
    route.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.uploaded_by.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const forceDownload = async (e, route) => {
    e.stopPropagation();
    try {
      const res = await fetch(route.gpx_file_url);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${route.route_name}.gpx`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengunduh berkas.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3">
              <Globe className="w-10 h-10 text-[#1E3A8A]" /> Bank GPX
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">Koleksi rute lari lintas alam komunitas ALTI Depok yang telah dianalisis oleh AI dan lolos audit keselamatan pelatih.</p>
          </div>
          <button onClick={onBackHome} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 shadow-md flex items-center gap-2">
            <Home className="w-4 h-4"/> Beranda
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Cari nama rute atau kontributor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#1E3A8A] transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-blue-800 px-6 py-3 rounded-xl font-semibold transition-colors shadow-md">
            <Filter className="w-5 h-5" /> Filter AI
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#1E3A8A] animate-spin" />
            <p className="text-slate-400 font-medium">Menyinkronkan brankas rute...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-rose-400">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p className="font-semibold">Gagal memuat rute.</p>
            <p className="text-sm text-slate-500">{error}</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-500">
            <Globe className="w-12 h-12 mb-2 opacity-20" />
            <p className="font-semibold">Belum ada rute terpublikasi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRoutes.map((route) => (
              <div 
                key={route.id} 
                onClick={() => onOpenRoute(route)}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-[#1E3A8A] transition-all cursor-pointer group flex flex-col"
              >
                <div className="h-44 bg-slate-800/40 flex flex-col items-center justify-center relative group-hover:bg-slate-800/60 transition-colors">
                  <Map className="w-8 h-8 text-slate-600 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">Lihat Detail Rute</span>
                </div>
                
                <div className="p-5 flex flex-col gap-2 grow">
                  <h3 className="font-bold text-white text-lg truncate group-hover:text-[#1E3A8A] transition-colors">{route.route_name}</h3>
                  <p className="text-xs text-slate-400">Oleh: <span className="font-semibold text-slate-300">{route.uploaded_by}</span></p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/80 text-sm">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium"><Map className="w-4 h-4 text-emerald-400"/> {route.distance_km} km</span>
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium"><TrendingUp className="w-4 h-4 text-rose-400"/> +{route.elevation_gain_m}m</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-700 text-slate-300 bg-slate-800">
                      AI: {route.ai_hazard_level}
                    </span>
                  </div>

                  {/* INJEKSI BARU: Baris Ukuran File & Tombol Download */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/50">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                      <HardDrive className="w-4 h-4 text-slate-400" />
                      <span>{route?.file_size_mb || "1.2"} MB</span> 
                    </div>
                    
                    <button 
                    onClick={(e) => forceDownload(e, route)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg text-xs font-bold transition-colors border border-blue-600/20"
                    >
                    <Download className="w-4 h-4" />
                      Unduh GPX
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}