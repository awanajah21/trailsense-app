import React, { useState } from "react";
import {
  Map,
  Activity,
  BarChart3,
  Settings,
  ShieldCheck,
  Heart,
  Globe, 
  Menu,
  X,
  GitBranch,
  BookOpen,
  Home,
  Zap,
  Mountain,
} from "lucide-react";

export default function HomePage({
  onNavigateToApp,
  onNavigateToBank,
  onNavigateToAdmin,
  onNavigateToHelp,
  onOpenFeedback, // [PERBAIKAN]: Prop ini wajib ada untuk memicu modal
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-slate-50 font-sans selection:bg-primary-500/30">
      
      {/* NAVBAR */}
      <nav className="h-[72px] border-b border-slate-700/50 sticky top-0 z-50 bg-[#1E3A8A] shadow-md relative">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
    src="/favicon.png"
    alt="Logo TrailSense"
    className="w-7 h-7 object-contain rounded-md"
  />
            <a href="#" className="text-xl font-bold tracking-tight text-white">
              TrailSense
            </a>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" /> Home
            </a>
            <button
              onClick={onNavigateToApp}
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
            >
              <Map className="w-4 h-4" /> App
            </button>
            <button
              onClick={onNavigateToBank}
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
            >
              <Globe className="w-4 h-4" /> Bank GPX
            </button>
            
          </div>

          {/* TOMBOL KONTROL HAMBURGER */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white/80 hover:text-white transition-colors p-2 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* [PERBAIKAN]: DROPDOWN MENU MOBILE (Auto-Close) */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[72px] left-0 w-full bg-[#1E3A8A] border-b border-slate-700/50 shadow-2xl py-4 px-4 flex flex-col gap-4 z-40 animate-in slide-in-from-top-2">
            <a
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/90 hover:text-white font-medium flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Home className="w-5 h-5" /> Home
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigateToApp();
              }}
              className="text-white/90 hover:text-white font-medium flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
            >
              <Map className="w-5 h-5" /> App
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigateToBank();
              }}
              className="text-white/90 hover:text-white font-medium flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
            >
              <Globe className="w-5 h-5" /> Bank GPX
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigateToHelp();
              }}
              className="text-white/90 hover:text-white font-medium flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
            >
              <BookOpen className="w-5 h-5" /> Help
            </button>
          </div>
        )}
      </nav>

      <main className="flex-grow flex flex-col items-center">
        {/* SECTION 1: HERO & BIG MAP */}
        <section className="w-full max-w-6xl px-4 sm:px-8 pt-20 pb-16 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            the tactical GPX route analyzer
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mb-10">
            Extract, analyze, and visualize trail running routes with advanced
            AI clustering to support youth athlete safety and pacing strategies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onNavigateToApp}
              className="w-full sm:w-auto bg-slate-200 hover:bg-white text-slate-900 px-12 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Map className="w-5 h-5" /> App
            </button>
            <button
              onClick={onNavigateToHelp}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 px-12 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" /> Help
            </button>
          </div>

          <div className="w-full bg-[#1A1A1A] rounded-2xl border border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            <div className="absolute inset-0 bg-[#1E3A8A]/0 group-hover:bg-[#1E3A8A]/10 transition-colors duration-500 z-10 pointer-events-none"></div>
            <img
              src="/app-preview.jpg" 
              alt="TrailSense App Interface Preview"
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.01]"
              loading="lazy"
            />
          </div>
        </section>

        {/* SECTION 2: FEATURES GRID */}
        <section className="w-full max-w-6xl px-4 sm:px-8 py-24">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {/* KARTU 1: AI Hazard Clustering */}
            <div className="flex flex-col h-full text-left group">
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-amber-400" /> AI Hazard Clustering
              </h3>
              <p className="text-slate-400 text-base leading-relaxed mb-6 flex-grow">
                Dynamic K-Means algorithm analyzes elevation and gradient to
                objectively group terrain into safe, caution, or danger zones
                without rigid hardcoded rules.
              </p>

              <div className="bg-[#111111] rounded-xl border border-slate-800 h-80 flex flex-col p-4 group-hover:border-slate-600 transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                <div className="w-full h-full border border-slate-700/60 rounded-xl bg-[#0f141e] p-4 flex flex-col relative z-10 shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-start z-20 mb-auto">
                    <div className="bg-[#1e293b] px-3 py-1.5 rounded border border-slate-700/50 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
                      <Activity className="w-3.5 h-3.5 text-amber-400" /> AI
                      LOGIC
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto z-20 space-y-4 mb-10">
                    <div className="w-full h-10 bg-[#1e293b] rounded-md border border-slate-700 flex overflow-hidden shadow-lg">
                      <div className="h-full w-2/5 bg-emerald-500/20 border-r border-slate-700 flex items-center justify-center">
                        <span className="text-emerald-500 font-bold text-[10px] tracking-widest">
                          SAFE
                        </span>
                      </div>
                      <div className="h-full w-1/5 bg-amber-500/20 border-r border-slate-700 flex items-center justify-center">
                        <span className="text-amber-500 font-bold text-[10px] tracking-widest">
                          WARN
                        </span>
                      </div>
                      <div className="h-full w-2/5 bg-rose-500/20 flex items-center justify-center">
                        <span className="text-rose-500 font-bold text-[10px] tracking-widest">
                          DANGER
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>0.0 KM</span>
                      <span>12.5 KM</span>
                      <span>21.1 KM</span>
                    </div>
                  </div>
                  <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-amber-500 rounded-full opacity-20 blur-[1px]"></div>
                </div>
              </div>
            </div>

            {/* KARTU 2: 3D Tactical Rehearsal */}
            <div className="flex flex-col h-full text-left group">
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Mountain className="w-6 h-6 text-emerald-400" /> 3D Tactical
                Rehearsal
              </h3>
              <p className="text-slate-400 text-base leading-relaxed mb-6 flex-grow">
                A combination of MapLibre 3D terrain and real-time hover
                tracking markers allows athletes to visually perform mental
                rehearsals before race day.
              </p>

              <div className="bg-[#111111] rounded-xl border border-slate-800 h-80 flex flex-col p-4 group-hover:border-slate-600 transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                <div className="w-full h-full border border-slate-700/60 rounded-xl bg-[#0f141e] p-4 flex flex-col relative z-10 shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-start z-20">
                    <div className="bg-[#1e293b] px-3 py-1.5 rounded border border-slate-700/50 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
                      <Map className="w-3.5 h-3.5 text-blue-400" /> TOPO 3D
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-7 h-7 bg-[#1e293b] rounded border border-slate-700/50 flex items-center justify-center text-slate-400 text-sm font-medium shadow-sm hover:bg-slate-700 transition-colors cursor-pointer">
                        +
                      </div>
                      <div className="w-7 h-7 bg-[#1e293b] rounded border border-slate-700/50 flex items-center justify-center text-slate-400 text-sm font-medium shadow-sm hover:bg-slate-700 transition-colors cursor-pointer">
                        -
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                    <div className="w-14 h-14 border border-emerald-500/30 rounded-full flex items-center justify-center bg-emerald-500/5 relative">
                      <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399] absolute"></div>
                    </div>
                    <div className="mt-3 bg-[#1e293b] border border-slate-600/80 px-3 py-1 rounded text-xs text-slate-200 shadow-lg">
                      Elev: 1,452m
                    </div>
                  </div>
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-slate-500 rounded-full opacity-20"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-slate-500 rounded-full opacity-20"></div>
                </div>
              </div>
            </div>

            {/* KARTU 3: Actionable Pace Notes */}
            <div className="flex flex-col h-full text-left group">
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-400" /> Actionable Pace
                Notes
              </h3>
              <p className="text-slate-400 text-base leading-relaxed mb-6 flex-grow">
                Comprehensive macro-segmentation tables displaying precise
                elevation gains and gradients, enabling coaches to strategize
                nutrition and power-hiking points.
              </p>

              <div className="bg-[#111111] rounded-xl border border-slate-800 h-80 flex flex-col p-4 group-hover:border-slate-600 transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                <div className="w-full h-full border border-slate-700/60 rounded-xl bg-[#0f141e] p-4 flex flex-col relative z-10 shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-start z-20 mb-2">
                    <div className="bg-[#1e293b] px-3 py-1.5 rounded border border-slate-700/50 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
                      <BarChart3 className="w-3.5 h-3.5 text-blue-400" /> DATA
                      GRID
                    </div>
                  </div>

                  <div className="w-full bg-[#1e293b] border border-slate-700/80 rounded-lg shadow-xl overflow-hidden z-20 mx-auto mt-2 mb-auto">
                    <table className="w-full text-left text-[11px] text-slate-400">
                      <thead className="text-slate-500 uppercase bg-[#0f141e]/50 border-b border-slate-700/80">
                        <tr>
                          <th className="py-2 pl-4">Dist</th>
                          <th className="py-2">Grad</th>
                          <th className="py-2">Pace</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        <tr>
                          <td className="py-2 pl-4 text-white">1.0k</td>
                          <td className="py-2 text-emerald-400">2.5%</td>
                          <td className="py-2">
                            <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded text-[9px] uppercase border border-emerald-500/20 font-bold">
                              Run
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 pl-4 text-white">4.2k</td>
                          <td className="py-2 font-bold text-amber-400">
                            12.1%
                          </td>
                          <td className="py-2">
                            <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded text-[9px] uppercase border border-amber-500/20 font-bold">
                              Hike
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 pl-4 text-white">7.5k</td>
                          <td className="py-2 font-bold text-rose-400">
                            22.4%
                          </td>
                          <td className="py-2">
                            <span className="bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded text-[9px] uppercase border border-rose-500/20 font-bold">
                              Scramble
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* KARTU 4: Dynamic Thresholding */}
            <div className="flex flex-col h-full text-left group">
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-rose-400" /> Dynamic
                Thresholding
              </h3>
              <p className="text-slate-400 text-base leading-relaxed mb-6 flex-grow">
                An intelligent slicer engine that automatically adapts segment
                cuts based on route geometry, preventing cognitive overload on
                ultra-trail distances.
              </p>

              <div className="bg-[#111111] rounded-xl border border-slate-800 h-80 flex flex-col p-4 group-hover:border-slate-600 transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                <div className="w-full h-full border border-slate-700/60 rounded-xl bg-[#0f141e] p-4 flex flex-col relative z-10 shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-start z-20 mb-auto">
                    <div className="bg-[#1e293b] px-3 py-1.5 rounded border border-slate-700/50 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
                      <Settings className="w-3.5 h-3.5 text-rose-400" /> SLICER
                      ENGINE
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-center gap-6 z-20 my-auto pb-4">
                    <div className="w-full max-w-[200px] flex items-center gap-4 px-2">
                      <div className="h-1 flex-grow bg-slate-700 rounded-full relative">
                        <div className="absolute top-1/2 left-[25%] transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                        <div className="absolute top-1/2 left-[75%] transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-5 bg-rose-500 shadow-[0_0_8px_#f43f5e]"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-[#1e293b] border border-slate-700 px-3 py-2 rounded-md flex flex-col items-center shadow-md">
                        <span className="text-[9px] text-slate-400 font-bold uppercase mb-1">
                          Short Trail
                        </span>
                        <span className="text-white text-[11px] font-bold">
                          50m Cut
                        </span>
                      </div>
                      <GitBranch className="w-4 h-4 text-slate-600" />
                      <div className="bg-[#1e293b] border border-blue-900/50 px-3 py-2 rounded-md flex flex-col items-center shadow-[0_0_15px_rgba(30,58,138,0.2)]">
                        <span className="text-[9px] text-blue-400 font-bold uppercase mb-1">
                          Ultra Trail
                        </span>
                        <span className="text-white text-[11px] font-bold">
                          300m Cut
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: PHILOSOPHY & COMMUNITY */}
        <section className="w-full px-4 sm:px-8 py-24 border-t border-slate-800/50 flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold mb-16">Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left w-full max-w-4xl mb-12">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-slate-400" /> Free, ad-free
                and open source
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                This platform is strictly free to use, without ads, built
                specifically to support youth community engagement activities
                safely.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-slate-400" />{" "}
                Privacy-friendly
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your GPX files are analyzed securely. Track logs and personal
                metrics are never exposed without strict admin curation.
              </p>
            </div>
          </div>

          <div className="w-full max-w-4xl bg-[#1A1A1A] rounded-2xl border border-slate-800 p-12 flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold mb-6">
              Made possible by the community
            </h3>
            <p className="text-slate-400 text-base max-w-2xl mb-8">
              This injury mitigation platform relies on an amazing trail running
              community shaping the project through feature suggestions, field
              testing, and dedicated support.
            </p>
            <Heart className="w-12 h-12 text-pink-400 mb-8" />
            
            {/* [PERBAIKAN]: Penambahan event onClick={onOpenFeedback} */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onOpenFeedback} 
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" /> Send Feedback
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 4: FOOTER */}
      <footer className="w-full border-t border-slate-800/50 bg-[#0a0a0a] py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white">
              <Map className="w-6 h-6 text-[#1E3A8A]" />
              <span className="text-xl font-bold">TrailSense</span>
            </div>

            <div className="text-slate-400 hover:text-white transition-colors flex flex-col gap-1">
              <a href="https://www.instagram.com/alti.kotadepok/" className="text-slate-500 text-sm">
                ALTI DEPOK © 2026 TrailSense Project
              </a>

              <div className="flex flex-col mt-3">
                <span className="text-slate-600 text-[10px] uppercase font-bold tracking-widest mb-1.5">
                  Supported By:
                </span>
                <img
                  src="/alti-logo.png" 
                  alt="Logo ALTI Depok"
                  className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-6">
            <div className="flex flex-wrap gap-12 text-sm">
              <div className="flex flex-col gap-4">
                <span className="font-bold text-white mb-1 text-base">
                  Website
                </span>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4" /> Home
                </a>
                <button
                  onClick={onNavigateToApp}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Map className="w-4 h-4" /> App
                </button>
                <button
                  onClick={onNavigateToAdmin}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
