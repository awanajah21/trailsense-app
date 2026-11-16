import React, { useState, useEffect } from 'react';
import { Map, TrendingUp, CheckCircle, Clock, XCircle, Home, ShieldCheck, Loader2, Check, X } from 'lucide-react';
import { supabase } from '../config/supabase'; // Pastikan path ini sesuai dengan letak konfigurasi Anda

export default function AdminDashboard({ onBackHome }) {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Menyedot data rute dari Supabase saat komponen dimuat
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('gpx_routes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setRoutes(data);
    setIsLoading(false);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setProcessingId(id);
    
    // Penambahan .select() memaksa Supabase mengembalikan baris yang berhasil diubah
    const { data, error } = await supabase
      .from('gpx_routes')
      .update({ status: newStatus })
      .eq('id', id)
      .select(); 
      
    // Validasi mutlak: Hanya ubah tampilan web jika database mengonfirmasi keberhasilan
    if (error || !data || data.length === 0) {
      alert("Pembaruan gagal: Akses ditolak atau rute tidak ditemukan di database.");
    } else {
      setRoutes(prev => prev.map(route => 
        route.id === id ? { ...route, status: newStatus } : route
      ));
    }
    
    setProcessingId(null);
  };

  const filteredRoutes = routes.filter(route => route.status === activeTab);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Admin */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#1E3A8A]" /> Kurasi Rute (Admin)
            </h1>
            <p className="text-slate-400 mt-2">Validasi keselamatan GPX kontribusi komunitas ALTI Depok sebelum rilis publik.</p>
          </div>
          <button onClick={onBackHome} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 shadow-md flex items-center gap-2">
            <Home className="w-4 h-4"/> Kembali
          </button>
        </div>

        {/* Tab Navigasi Karantina */}
        <div className="flex gap-4 border-b border-slate-800 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab('PENDING')} className={`flex items-center gap-2 pb-2 font-semibold whitespace-nowrap ${activeTab === 'PENDING' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
            <Clock className="w-4 h-4" /> Menunggu Audit
          </button>
          <button onClick={() => setActiveTab('APPROVED')} className={`flex items-center gap-2 pb-2 font-semibold whitespace-nowrap ${activeTab === 'APPROVED' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
            <CheckCircle className="w-4 h-4" /> Terpublikasi
          </button>
          <button onClick={() => setActiveTab('REJECTED')} className={`flex items-center gap-2 pb-2 font-semibold whitespace-nowrap ${activeTab === 'REJECTED' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-slate-500 hover:text-slate-300'}`}>
            <XCircle className="w-4 h-4" /> Ditolak / Karantina
          </button>
        </div>

        {/* Bento Grid: Daftar Kartu Rute */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#1E3A8A] animate-spin" />
            <p className="text-slate-400 font-medium">Menyinkronkan brankas rute...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            Tidak ada rute dalam kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-600 transition-all flex flex-col group">
                
                <div className="h-40 bg-slate-800/50 flex flex-col items-center justify-center relative">
                  <Map className="w-8 h-8 text-slate-600 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">Pratinjau Topografi</span>
                  
                  <span className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    route.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' :
                    route.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                  }`}>
                    {route.status}
                  </span>
                </div>
                
                <div className="p-4 flex flex-col gap-2">
                  <div>
                    <h3 className="font-bold text-white text-lg truncate group-hover:text-[#1E3A8A] transition-colors">{route.route_name}</h3>
                    <p className="text-xs text-slate-400">Kontributor: <span className="text-slate-300 font-semibold">{route.uploaded_by}</span></p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-sm">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-slate-300 font-medium"><Map className="w-4 h-4 text-emerald-400"/> {route.distance_km} km</span>
                      <span className="flex items-center gap-1 text-slate-300 font-medium"><TrendingUp className="w-4 h-4 text-rose-400"/> +{route.elevation_gain_m}m</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-700 text-slate-300 bg-slate-800">
                      AI: {route.ai_hazard_level}
                    </span>
                  </div>

                  {/* Tombol Aksi Kurasi untuk Rute PENDING */}
                  {route.status === 'PENDING' && (
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => handleUpdateStatus(route.id, 'APPROVED')}
                        disabled={processingId === route.id}
                        className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/50 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        {processingId === route.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Check className="w-3 h-3" />} Setujui
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(route.id, 'REJECTED')}
                        disabled={processingId === route.id}
                        className="flex-1 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-600/50 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <X className="w-3 h-3" /> Tolak
                      </button>
                    </div>
                  )}

                  {/* Tombol Tarik ke Karantina untuk Rute Terpublikasi */}
                  {route.status === 'APPROVED' && (
                    <button 
                      onClick={() => handleUpdateStatus(route.id, 'PENDING')}
                      disabled={processingId === route.id}
                      className="mt-4 w-full bg-slate-800 hover:bg-amber-600/20 text-slate-400 hover:text-amber-400 border border-slate-700 hover:border-amber-600/50 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {processingId === route.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Clock className="w-3 h-3" />} Tarik ke Karantina
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}