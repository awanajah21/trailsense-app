import React, { useState, useEffect } from 'react';
import { 
  Map as MapIcon, Activity, Mountain, Zap, 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Loader2, Maximize, Minimize, Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea 
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import TerrainMap from '../components/TerrainMap'; 
import AIInsightCard from '../components/AIInsightCard';

export default function DashboardPage({ sessionData, onBackHome }) {
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeSegmentId, setActiveSegmentId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  useEffect(() => {
    const processGpx = async () => {
      if (!sessionData?.gpxFile) {
        setError("File GPX tidak ditemukan. Silakan ulangi proses unggah.");
        setIsLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('file', sessionData.gpxFile); 
      formData.append('userName', sessionData.userName || "Anonim");
      formData.append('raceName', sessionData.raceName || "Misi Rute Tanpa Nama");
      formData.append('raceDate', sessionData.raceDate || "-");

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${API_URL}/api/analyze-route`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorPayload = await response.text(); 
          throw new Error(`Server Menolak (Status ${response.status}): ${errorPayload}`);
        }
        const data = await response.json();
        setRouteData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    processGpx();
  }, [sessionData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-slate-50 gap-4">
        <Loader2 className="w-12 h-12 text-[#1E3A8A] animate-spin" />
        <h2 className="text-xl font-bold">Mesin AI Sedang Membedah Rute...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-slate-50 gap-4 p-6 text-center">
        <h2 className="text-xl font-bold text-red-400">Analisis Gagal</h2>
        <p className="text-slate-400 text-sm">{error}</p>
        <button onClick={onBackHome} className="mt-4 px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 font-semibold transition-colors">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const meta = routeData?.route_metadata || {};
  const chartData = routeData?.chart_profile || [];
  const segments = routeData?.segments || [];
  const activePoints = activeSegmentId ? chartData.filter(p => p.segment_id === activeSegmentId) : [];
  const exactStartX = activePoints.length > 0 ? activePoints[0].dist : null;
  const exactEndX = activePoints.length > 0 ? activePoints[activePoints.length - 1].dist : null;
  const totalDist = meta.total_distance_km || (chartData.length > 0 ? chartData[chartData.length - 1].dist : 1);

  // === FUNGSI EKSPOR PDF TAKTIS ===
  const exportPaceNotesToPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Header Vektor
    doc.setFontSize(16);
    doc.text(
      `Pace Notes: ${sessionData?.raceName || "Rute TrailSense"}`,
      14,
      20,
    );
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Atlet: ${sessionData?.userName || "Anonim"} | Jarak Total: ${(meta.total_distance_km ?? 0).toFixed(2)} km`,
      14,
      28,
    );

    const tableColumn = [
      "KM",
      "Jarak",
      "Karakter Medan",
      "Gradien Rata-rata",
      "Elev Gain",
      "Tingkat Bahaya",
    ];
    const tableRows = segments.map((seg) => {
      const startKm = seg.start_km ?? seg.start_dist ?? 0;
      const endKm = seg.end_km ?? seg.end_dist ?? 0;
      const distKm = seg.distance_km ?? seg.distance ?? 0;
      const tag = seg.tag ?? seg.character ?? "-";
      const grad =
        seg.avg_gradient_percent ?? seg.avg_gradient_pct ?? seg.gradient ?? 0;
      const elevGain =
        seg.elevation_change_m ??
        seg.elevation_gain_m ??
        seg.elevation_gain ??
        seg.elev_gain ??
        0;
      const hazard = seg.ai_hazard_level ?? seg.hazard_level ?? "-";

      return [
        `${Number(startKm).toFixed(2)} - ${Number(endKm).toFixed(2)}`,
        `${Number(distKm).toFixed(2)} km`,
        tag,
        `${Number(grad).toFixed(1)}%`,
        Number(elevGain) > 0
          ? `+${Number(elevGain).toFixed(0)}m`
          : `${Number(elevGain).toFixed(0)}m`,
        hazard,
      ];
    });

    // Eksekusi Tabel Vektor dengan Pewarnaan Dinamis
    autoTable(doc, {
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 4 },
      didParseCell: function (data) {
        const hazard = data.row.raw[5] || "";
        if (hazard === "Bahaya" || hazard.includes("Merah")) {
          data.cell.styles.fillColor = [254, 226, 226];
          data.cell.styles.textColor = [153, 27, 27];
          data.cell.styles.fontStyle = "bold";
        } else if (hazard === "Waspada" || hazard.includes("Kuning")) {
          data.cell.styles.fillColor = [254, 243, 199];
          data.cell.styles.textColor = [146, 64, 14];
        }
      },
    });

    doc.save(`Pace_Notes_${sessionData?.userName || "Atlet"}.pdf`);
  };;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-slate-50 p-3 sm:p-4 md:p-8 pb-24 flex flex-col items-center">
      {/* HEADER DASHBOARD MOBILE-FRIENDLY */}
      <div className="w-full max-w-7xl flex flex-row items-center justify-between mb-6 pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight truncate">
            {sessionData?.raceName || "Misi Rute Tanpa Nama"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 truncate">
            Atlet:{" "}
            <span className="text-[#3B82F6] font-semibold">
              {sessionData?.userName || "Anonim"}
            </span>
          </p>
        </div>
        <button
          onClick={onBackHome}
          className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 whitespace-nowrap shadow-sm"
        >
          Tutup Rute
        </button>
      </div>

      <div className="w-full max-w-7xl flex flex-col gap-5 sm:gap-8">
        {/* STATISTIK MAKRO */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />{" "}
              Jarak Total
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1">
              {(meta.total_distance_km || 0).toFixed(2)}{" "}
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                km
              </span>
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />{" "}
              Elevasi Naik
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1">
              {(
                meta.total_elevation_gain_m ||
                meta.total_elevation_gain ||
                0
              ).toFixed(0)}{" "}
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                m
              </span>
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />{" "}
              Elevasi Turun
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1">
              {Math.abs(
                meta.elevation_loss || meta.total_elevation_loss_m || 0,
              ).toFixed(0)}{" "}
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                m
              </span>
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />{" "}
              Titik Tertinggi
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1">
              {(meta.max_elevation_m || meta.max_elevation || 0).toFixed(0)}{" "}
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                m
              </span>
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />{" "}
              Titik Terendah
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1">
              {(meta.min_elevation_m || meta.min_elevation || 0).toFixed(0)}{" "}
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                m
              </span>
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E3A8A]" /> Jml
              Segmen
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1">
              {meta.total_segments || 0}{" "}
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                blok
              </span>
            </span>
          </div>
        </div>

        {/* CONTAINER PETA & GRAFIK (MENDUKUNG ISOLASI FULLSCREEN) */}
        <div
          className={
            isFullscreen
              ? "fixed inset-0 z-99999 bg-[#0a0a0a] flex flex-col w-full h-full overflow-hidden"
              : "w-full flex flex-col gap-5 sm:gap-8"
          }
        >
          {/* PETA TAKTIS 3D */}
          <div
            className={
              isFullscreen
                ? "flex-1 relative w-full"
                : "w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col"
            }
          >
            {!isFullscreen ? (
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6]" />
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
                    Peta Taktis 3D (AI)
                  </h3>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center gap-1.5 bg-[#1E3A8A] hover:bg-blue-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />{" "}
                  <span className="hidden sm:inline">Perbesar Layar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 left-4 z-99999 bg-slate-900/90 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-600 flex items-center gap-2 backdrop-blur-md hover:bg-slate-800 shadow-xl"
              >
                <Minimize className="w-4 h-4" /> Keluar
              </button>
            )}

            <div
              className={
                isFullscreen
                  ? "w-full h-full relative"
                  : "w-full h-70 sm:h-105 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden"
              }
            >
              <TerrainMap
                routeData={routeData}
                hoveredPoint={hoveredPoint}
                activeSegmentId={activeSegmentId}
              />
            </div>
          </div>

          {/* GRAFIK ELEVASI */}
          <div
            className={
              isFullscreen
                ? "h-[30vh] min-h-55 w-full bg-[#0a0a0a] p-3 sm:p-4 border-t border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-10"
                : "w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col"
            }
          >
            {!isFullscreen && (
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Profil Ketinggian
                </h3>
              </div>
            )}

            <div
              className={
                isFullscreen ? "w-full h-full" : "w-full h-[220px] sm:h-[320px]"
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onMouseMove={(e) => {
                    if (
                      e?.activeTooltipIndex !== undefined &&
                      chartData[e.activeTooltipIndex]
                    ) {
                      const point = chartData[e.activeTooltipIndex];
                      if (point.lat !== undefined && point.lon !== undefined)
                        setHoveredPoint({ lat: point.lat, lon: point.lon });
                    } else setHoveredPoint(null);
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <defs>
                    <linearGradient
                      id="colorKMeans"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      {segments.map((seg, index) => {
                        const startKm = seg.start_km ?? seg.start_dist ?? 0;
                        const endKm = seg.end_km ?? seg.end_dist ?? 0;
                        const startOffset = Math.max(
                          0,
                          Math.min(100, (startKm / totalDist) * 100),
                        );
                        const endOffset = Math.max(
                          0,
                          Math.min(100, (endKm / totalDist) * 100),
                        );
                        const colorHex = seg.color_hex ?? "#10B981";
                        return (
                          <React.Fragment key={index}>
                            <stop
                              offset={`${startOffset}%`}
                              stopColor={colorHex}
                              stopOpacity={1}
                            />
                            <stop
                              offset={`${endOffset}%`}
                              stopColor={colorHex}
                              stopOpacity={1}
                            />
                          </React.Fragment>
                        );
                      })}
                    </linearGradient>
                    <linearGradient id="fillKMeans" x1="0" y1="0" x2="1" y2="0">
                      {segments.map((seg, index) => {
                        const startKm = seg.start_km ?? seg.start_dist ?? 0;
                        const endKm = seg.end_km ?? seg.end_dist ?? 0;
                        const startOffset = Math.max(
                          0,
                          Math.min(100, (startKm / totalDist) * 100),
                        );
                        const endOffset = Math.max(
                          0,
                          Math.min(100, (endKm / totalDist) * 100),
                        );
                        const colorHex = seg.color_hex ?? "#10B981";
                        return (
                          <React.Fragment key={index}>
                            <stop
                              offset={`${startOffset}%`}
                              stopColor={colorHex}
                              stopOpacity={0.2}
                            />
                            <stop
                              offset={`${endOffset}%`}
                              stopColor={colorHex}
                              stopOpacity={0.2}
                            />
                          </React.Fragment>
                        );
                      })}
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E293B"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="dist"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    stroke="#64748B"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${Number(val).toFixed(1)}km`}
                  />
                  <YAxis
                    dataKey="elev"
                    stroke="#64748B"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={["dataMin - 20", "dataMax + 20"]}
                    width={45}
                    tickFormatter={(val) => `${Number(val).toFixed(0)}m`}
                  />

                  <Tooltip
                    cursor={{
                      stroke: "#64748B",
                      strokeWidth: 1.5,
                      strokeDasharray: "4 4",
                    }}
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#3B82F6",
                      color: "#F8FAFC",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelFormatter={(label) => `KM ${Number(label).toFixed(2)}`}
                    formatter={(value) => [
                      `${Number(value).toFixed(0)}m`,
                      "Elevasi",
                    ]}
                  />

                  {exactStartX !== null && exactEndX !== null && (
                    <ReferenceArea
                      x1={exactStartX}
                      x2={exactEndX}
                      strokeOpacity={0}
                      fill="#3B82F6"
                      fillOpacity={0.25}
                    />
                  )}

                  <Area
                    type="monotone"
                    dataKey="elev"
                    stroke="url(#colorKMeans)"
                    strokeWidth={2.5}
                    fill="url(#fillKMeans)"
                    activeDot={{
                      r: 5,
                      fill: "#3B82F6",
                      stroke: "#0F172A",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TABEL PACE NOTES (OVERFLOW-X UNTUK MOBILE) */}
        <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide leading-tight">
                Pace Notes & Hazards
              </h3>
            </div>
            {/* TOMBOL CETAK PDF INJEKSI */}
            <button
              onClick={exportPaceNotesToPDF}
              className="relative z-50 flex items-center gap-2 bg-[#1E3A8A] hover:bg-blue-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-colors"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" /> Cetak PDF
            </button>
          </div>

          <div className="w-full border border-slate-800/80 rounded-xl overflow-x-auto overflow-y-auto max-h-[350px] sm:max-h-[400px] bg-slate-950/40 custom-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300 min-w-[600px]">
              <thead className="bg-slate-900 text-slate-400 text-[10px] sm:text-xs uppercase font-bold sticky top-0 z-10 shadow-sm border-b border-slate-800">
                <tr>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 rounded-tl-xl whitespace-nowrap">
                    KM
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    Jarak
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    Karakter Medan
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    Gradien Rata-rata
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    Elevasi
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 rounded-tr-xl whitespace-nowrap">
                    Bahaya (AI)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {segments.map((seg, idx) => {
                  const isActive = activeSegmentId === seg.segment_id;
                  const startKm = seg.start_km ?? seg.start_dist ?? 0;
                  const endKm = seg.end_km ?? seg.end_dist ?? 0;
                  const distKm = seg.distance_km ?? seg.distance ?? 0;
                  const tag = seg.tag ?? seg.character ?? "-";
                  const grad =
                    seg.avg_gradient_percent ??
                    seg.avg_gradient_pct ??
                    seg.gradient ??
                    0;
                  const elevGain =
                    seg.elevation_change_m ??
                    seg.elevation_gain_m ??
                    seg.elevation_gain ??
                    seg.elev_gain ??
                    0;
                  const hazard = seg.ai_hazard_level ?? seg.hazard_level ?? "-";
                  const colorHex = seg.color_hex ?? "#10B981";

                  return (
                    <tr
                      key={idx}
                      onClick={() =>
                        setActiveSegmentId(isActive ? null : seg.segment_id)
                      }
                      className={`cursor-pointer transition-colors border-l-2 sm:border-l-4 ${isActive ? "bg-[#1E3A8A]/30 border-[#3B82F6]" : "border-transparent hover:bg-slate-800/60"}`}
                    >
                      <td
                        className={`px-3 sm:px-4 py-2.5 sm:py-3 font-medium whitespace-nowrap ${isActive ? "text-white" : "text-slate-400"}`}
                      >
                        {Number(startKm).toFixed(2)} -{" "}
                        {Number(endKm).toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-white font-semibold whitespace-nowrap">
                        {Number(distKm).toFixed(2)} km
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                        {tag}
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                        {Number(grad).toFixed(1)}%
                      </td>
                      <td
                        className={`px-3 sm:px-4 py-2.5 sm:py-3 font-bold whitespace-nowrap ${Number(elevGain) > 0 ? "text-emerald-400" : "text-blue-400"}`}
                      >
                        {Number(elevGain) > 0 ? "+" : ""}
                        {Number(elevGain).toFixed(0)}m
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                        <span
                          className="px-2 py-1 sm:px-3 sm:py-1.5 rounded text-[10px] sm:text-xs font-bold"
                          style={{
                            backgroundColor: `${colorHex}15`,
                            color: colorHex,
                            border: `1px solid ${colorHex}30`,
                          }}
                        >
                          {hazard}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full drop-shadow-2xl">
          <AIInsightCard routeData={routeData} />
        </div>
      </div>
    </div>
  );
}