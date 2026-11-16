import React, { useState, useEffect } from "react";
import {
  Search,
  Rocket,
  Globe,
  Zap,
  Mountain,
  Save,
  HelpCircle,
  Map,
  Home,
  Activity,
  BookOpen,
  ArrowLeft,
  Download,
  ShieldCheck,
  Menu,
  Compass,
  PlayCircle,
  X,
} from "lucide-react";

export default function HelpPage({
  onNavigateToHome,
  onNavigateToApp,
  onNavigateToBank,
}) {
  const [activeDoc, setActiveDoc] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeDoc]);

  const renderDocContent = () => {
    switch (activeDoc) {
      case "tutorial":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <button
              onClick={() => setActiveDoc("grid")}
              className="text-[#1E3A8A] hover:text-blue-400 font-semibold mb-6 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Induk
            </button>
            <h1 className="text-4xl font-extrabold text-white mb-6">
              Tutorial Penggunaan TrailSense
            </h1>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Platform ini dirancang tanpa hambatan (<em>frictionless</em>).
              Ikuti 4 tahapan taktis berikut untuk menerjemahkan data mentah
              rute Anda menjadi strategi mitigasi cedera di lapangan.
            </p>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-700/50 p-5 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                  <PlayCircle className="w-5 h-5 text-blue-400" /> 1. Inisiasi
                  Rute (Unggah GPX)
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Navigasikan ke halaman <strong>App</strong>. Klik area unggah
                  untuk memasukkan file <code>.gpx</code> dari{" "}
                  <em>sportwatch</em> Anda. Sistem akan mem-<em>parsing</em>{" "}
                  titik koordinat dan elevasi secara instan tanpa jeda *server*
                  yang membebani memori.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-700/50 p-5 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-amber-400" /> 2. Analisis Pace
                  Notes & K-Means
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  Setelah rute diproses, perhatikan tabel{" "}
                  <strong>Actionable Pace Notes</strong>. Mesin K-Means AI
                  secara dinamis telah memotong rute menjadi blok-blok taktis.
                </p>
                <ul className="list-disc pl-5 text-slate-400 text-sm space-y-1">
                  <li>
                    Fokuskan atensi pada baris berwarna{" "}
                    <strong className="text-rose-400">Merah (Bahaya)</strong>.
                    Ini adalah area dengan kemiringan ekstrem (&gt; 25%).
                  </li>
                  <li>
                    Rencanakan untuk mengubah gaya lari menjadi{" "}
                    <em>power hiking</em> pada kilometer tersebut guna menghemat
                    cadangan glikogen otot.
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-700/50 p-5 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                  <Mountain className="w-5 h-5 text-emerald-400" /> 3. Gladi
                  Resik Peta 3D (Mental Rehearsal)
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Arahkan kursor (<em>hover</em>) pada profil elevasi atau tabel
                  Pace Notes. Titik selancar (<em>gliding marker</em>) akan
                  otomatis tersinkronisasi dan menyorot lokasi persisnya di Peta
                  Taktis 3D. Gunakan mode <strong>Satelit 3D</strong> dengan
                  sudut kamera (<em>pitch</em>) 60° untuk memvisualisasikan
                  dinding bukit yang akan Anda hadapi.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-700/50 p-5 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-indigo-400" /> 4. Kurasi Bank
                  GPX
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Jika Anda pelatih, masuk ke <strong>Admin Login</strong> untuk
                  meninjau rute berstatus <em>PENDING</em>. Verifikasi metrik
                  bahayanya, lalu ubah menjadi <em>APPROVED</em> agar rute aman
                  dapat diunduh oleh para atlet muda untuk navigasi{" "}
                  <em>offline</em> di lapangan.
                </p>
              </div>
            </div>
          </div>
        );
      case "getting-started":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <button
              onClick={() => setActiveDoc("grid")}
              className="text-[#1E3A8A] hover:text-blue-400 font-semibold mb-6 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Induk
            </button>
            <h1 className="text-4xl font-extrabold text-white mb-6">
              Mulai Menggunakan TrailSense
            </h1>
            <p className="text-slate-300 mb-6 leading-relaxed">
              TrailSense adalah platform analitik dan mitigasi risiko lari
              lintas alam yang dirancang khusus untuk atlet dan pelatih ALTI
              Depok. Sistem ini mengubah data rekaman GPS mentah menjadi wawasan
              taktis yang dapat menyelamatkan Anda dari cedera.
            </p>
            <h3 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">
              Alur Kerja Utama
            </h3>
            <ul className="space-y-4 text-slate-300 list-disc pl-5">
              <li>
                <strong>Unggah GPX:</strong> Masukkan file rute Anda tanpa perlu
                login ke sistem utama. Sistem akan langsung memproses data
                secara lokal di peramban dan backend Python Anda.
              </li>
              <li>
                <strong>Dashboard Analitik:</strong> Mesin AI akan secara
                otomatis memecah rute menjadi segmen-segmen taktis (Blok Taktis)
                berdasarkan perubahan tren elevasi (Directional Merging).
              </li>
              <li>
                <strong>Route Reconnaissance:</strong> Evaluasi titik pos air
                dan persentase kemiringan ekstrem sebelum Anda menyusun strategi{" "}
                <em>pacing</em> di lapangan.
              </li>
            </ul>
          </div>
        );
      case "bank-gpx":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <button
              onClick={() => setActiveDoc("grid")}
              className="text-[#1E3A8A] hover:text-blue-400 font-semibold mb-6 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Induk
            </button>
            <h1 className="text-4xl font-extrabold text-white mb-6">
              Bank GPX & Kurasi Komunitas
            </h1>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Bank GPX adalah brankas logistik yang menyimpan koleksi rute
              lintas alam yang telah divalidasi aman oleh pelatih. Ini bertindak
              sebagai <em>Safety Check</em> layaknya seorang{" "}
              <em>Race Director</em> untuk mencegah rute <em>bushwhacking</em>{" "}
              (menerobos semak liar tanpa jalur) terekspos ke atlet pemula.
            </p>
            <div className="bg-[#1E3A8A]/10 border border-[#1E3A8A]/30 p-4 rounded-xl mb-8 flex gap-3 text-blue-200 text-sm">
              <ShieldCheck className="w-5 h-5 shrink-0 text-blue-400" />
              Setiap rute yang diunggah ke Bank GPX berstatus PENDING secara
              default. Hanya rute dengan status APPROVED dari Dasbor Admin yang
              akan muncul di etalase publik.
            </div>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">
              Fitur Taktis Bank GPX
            </h3>
            <ul className="space-y-4 text-slate-300 list-disc pl-5">
              <li>
                <strong>Bypass Wizard (Reconnaissance Instan):</strong> Klik
                kartu rute di Bank GPX untuk melompat langsung ke Dashboard
                analisis tanpa harus mengunduh dan mengunggah ulang file.
              </li>
              <li>
                <strong>Unduh Offline:</strong> Gunakan tombol{" "}
                <Download className="w-4 h-4 inline mx-1" /> untuk memindahkan
                file <code>.gpx</code> ke <em>smartwatch</em> (Garmin/Coros)
                agar Anda tetap bisa melakukan navigasi rute di area tanpa
                sinyal (<em>blank spot</em>).
              </li>
            </ul>
          </div>
        );
      case "ai-pacenotes":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <button
              onClick={() => setActiveDoc("grid")}
              className="text-[#1E3A8A] hover:text-blue-400 font-semibold mb-6 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Induk
            </button>
            <h1 className="text-4xl font-extrabold text-white mb-6">
              Pace Notes & AI K-Means
            </h1>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Jantung dari TrailSense adalah algoritma{" "}
              <strong>K-Means Clustering</strong>. Sistem tidak menebak bahaya
              secara kaku, melainkan menggunakan <em>K = 3</em> untuk
              mengelompokkan segmen rute ke dalam 3 zona secara dinamis
              berdasarkan <em>centroid</em> kemiringannya.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-900 border border-emerald-900 p-4 rounded-xl">
                <h4 className="text-emerald-400 font-bold mb-2">
                  Zona Hijau (Aman)
                </h4>
                <p className="text-sm text-slate-400">
                  Medan landai (&lt; 10%). Maksimalkan kecepatan, jaga{" "}
                  <em>cadence</em>, dan lakukan pemulihan napas aktif.
                </p>
              </div>
              <div className="bg-slate-900 border border-amber-900 p-4 rounded-xl">
                <h4 className="text-amber-400 font-bold mb-2">
                  Zona Kuning (Waspada)
                </h4>
                <p className="text-sm text-slate-400">
                  Tanjakan/turunan menengah (10% - 25%). Mulai atur detak
                  jantung dan pantau kelelahan otot.
                </p>
              </div>
              <div className="bg-slate-900 border border-rose-900 p-4 rounded-xl">
                <h4 className="text-rose-400 font-bold mb-2">
                  Zona Merah (Bahaya)
                </h4>
                <p className="text-sm text-slate-400">
                  Kecuraman ekstrem (&gt; 25%). Risiko tinggi cedera lutut.
                  Simpan energi dan gunakan teknik <em>power hiking</em>.
                </p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 text-sm leading-relaxed">
              <strong>Sinkronisasi Interaktif:</strong> Saat Anda melakukan{" "}
              <em>hover</em> atau mengklik salah satu baris segmen pada tabel
              Pace Notes, grafik profil elevasi dan Peta 3D di Dashboard akan
              secara otomatis menyorot area tersebut untuk memudahkan{" "}
              <em>mental rehearsal</em>.
            </p>
          </div>
        );
      case "map-controls":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <button
              onClick={() => setActiveDoc("grid")}
              className="text-[#1E3A8A] hover:text-blue-400 font-semibold mb-6 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Induk
            </button>
            <h1 className="text-4xl font-extrabold text-white mb-6">
              Peta Taktis 3D (MapLibre)
            </h1>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Visualisasi lapangan TrailSense didukung oleh mesin WebGL MapLibre
              yang menyediakan 4 mode observasi krusial bagi pelatih dan atlet:
            </p>
            <ul className="space-y-4 text-slate-300 list-disc pl-5">
              <li>
                <strong>Topo 2D:</strong> Untuk membaca kerapatan garis kontur
                murni. Jika garis saling berdempetan, Anda sedang berhadapan
                dengan "dinding" vertikal.
              </li>
              <li>
                <strong>Topo 3D (Pitch 60°):</strong> Menghilangkan distraksi
                vegetasi, murni melihat bentuk tulang punggung gunung (
                <em>ridge</em>) yang harus dipanjat.
              </li>
              <li>
                <strong>Satelit 2D:</strong> Sangat penting untuk mitigasi cuaca
                dan perbekalan. Ketahui apakah rute melintasi sabana terbuka
                (butuh cadangan air ekstra) atau hutan kanopi rapat.
              </li>
              <li>
                <strong>Satelit 3D:</strong> Mode optimal untuk{" "}
                <em>mental rehearsal</em>. Lakukan simulasi rute dan lihat wujud
                tebing persis seperti aslinya.
              </li>
            </ul>
          </div>
        );
      case "gpx-format":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <button
              onClick={() => setActiveDoc("grid")}
              className="text-[#1E3A8A] hover:text-blue-400 font-semibold mb-6 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Induk
            </button>
            <h1 className="text-4xl font-extrabold text-white mb-6">
              Spesifikasi Format GPX
            </h1>
            <p className="text-slate-300 mb-6 leading-relaxed text-sm">
              GPX (GPS Exchange Format) adalah skema data berbasis XML. Mesin
              *parser* Python TrailSense mewajibkan file Anda memiliki tag{" "}
              <code>&lt;trkpt&gt;</code> (Trackpoints) yang berisikan koordinat
              lintang/bujur sekaligus parameter elevasi <code>&lt;ele&gt;</code>
              . Tanpa data elevasi, formula Gradient dan Haversine sistem tidak
              akan bisa mengkalkulasi tingkat bahaya (K-Means).
            </p>
          </div>
        );
      case "faq":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <button
              onClick={() => setActiveDoc("grid")}
              className="text-[#1E3A8A] hover:text-blue-400 font-semibold mb-6 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Induk
            </button>
            <h1 className="text-4xl font-extrabold text-white mb-6">
              Pertanyaan Umum (FAQ)
            </h1>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Mengapa rute saya tidak muncul di Bank GPX setelah diunggah?
                </h3>
                <p className="text-slate-400 text-sm mt-2">
                  Semua rute masuk ke status karantina (PENDING) secara default.
                  Pengurus ALTI Depok perlu mengevaluasinya di Dasbor Admin dan
                  mengubah statusnya menjadi APPROVED sebelum terpublikasi.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Mengapa grafik elevasi saya dulunya terlihat bergerigi
                  (Sawtooth Effect)?
                </h3>
                <p className="text-slate-400 text-sm mt-2">
                  Sinyal GPS sering merekam dua titik dengan koordinat hampir
                  sama namun elevasinya meleset. TrailSense telah mengatasinya
                  menggunakan algoritma <em>Terrain Smoothing</em> (Moving
                  Average) untuk meratakan <em>noise</em> tersebut.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-50 font-sans selection:bg-[#1E3A8A]/50 flex flex-col relative">
      {/* NAVBAR */}
      <nav className="h-[72px] border-b border-slate-700/50 sticky top-0 z-50 bg-[#1E3A8A] shadow-md relative">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={onNavigateToHome}
          >
            <Map className="w-6 h-6 text-white" />
            <span className="text-xl font-bold tracking-tight text-white">
              TrailSense
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={onNavigateToHome}
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" /> Home
            </button>
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
            <button className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Help
            </button>
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-slate-300 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* DROPDOWN MENU MOBILE */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[72px] left-0 w-full bg-[#1E3A8A] border-b border-slate-700/50 shadow-2xl py-4 px-4 flex flex-col gap-4 z-40 animate-in slide-in-from-top-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigateToHome();
              }}
              className="text-white/90 hover:text-white font-medium flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
            >
              <Home className="w-5 h-5" /> Home
            </button>
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
                if (typeof onNavigateToBank === "function") {
                  onNavigateToBank();
                } else {
                  console.error(
                    "Fungsi onNavigateToBank belum disuntikkan dari App.jsx!",
                  );
                  alert("Rute navigasi ke Bank GPX terputus. Periksa App.jsx.");
                }
              }}
              className="text-white/90 hover:text-white font-medium flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
            >
              <Globe className="w-5 h-5" /> Bank GPX
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveDoc("grid"); // Me-reset tampilan bantuan ke menu utama
              }}
              className="text-white/90 hover:text-white font-medium flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
            >
              <BookOpen className="w-5 h-5" /> Help
            </button>
          </div>
        )}
      </nav>

      {/* MAIN LAYOUT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6 md:sticky md:top-[104px]">
        

          {/* Menghapus h-[calc(100vh-200px)] pada mobile agar sidebar dapat digulir natural seperti di image_fec097.png */}
          <nav className="flex flex-col gap-1 text-sm h-auto md:h-[calc(100vh-200px)] md:overflow-y-auto pr-2 custom-scrollbar">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2 px-3">
              Modul Utama
            </div>
            <button
              onClick={() => setActiveDoc("tutorial")}
              className={`text-left px-3 py-2 rounded-md transition-colors ${activeDoc === "tutorial" ? "bg-[#1E3A8A]/20 text-[#1E3A8A] font-bold" : "hover:bg-slate-800 text-slate-300"}`}
            >
              Tutorial Interaktif
            </button>
            <button
              onClick={() => setActiveDoc("getting-started")}
              className={`text-left px-3 py-2 rounded-md transition-colors ${activeDoc === "getting-started" ? "bg-[#1E3A8A]/20 text-[#1E3A8A] font-bold" : "hover:bg-slate-800 text-slate-300"}`}
            >
              Getting Started
            </button>
            <button
              onClick={() => setActiveDoc("bank-gpx")}
              className={`text-left px-3 py-2 rounded-md transition-colors ${activeDoc === "bank-gpx" ? "bg-[#1E3A8A]/20 text-[#1E3A8A] font-bold" : "hover:bg-slate-800 text-slate-300"}`}
            >
              Bank GPX & Kurasi
            </button>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-3">
              Taktis & Analitik
            </div>
            <button
              onClick={() => setActiveDoc("ai-pacenotes")}
              className={`text-left px-3 py-2 rounded-md transition-colors ${activeDoc === "ai-pacenotes" ? "bg-[#1E3A8A]/20 text-[#1E3A8A] font-bold" : "hover:bg-slate-800 text-slate-300"}`}
            >
              Pace Notes & AI K-Means
            </button>
            <button
              onClick={() => setActiveDoc("map-controls")}
              className={`text-left px-3 py-2 rounded-md transition-colors ${activeDoc === "map-controls" ? "bg-[#1E3A8A]/20 text-[#1E3A8A] font-bold" : "hover:bg-slate-800 text-slate-300"}`}
            >
              Peta Taktis 3D
            </button>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-3">
              Sistem
            </div>
            <button
              onClick={() => setActiveDoc("gpx-format")}
              className={`text-left px-3 py-2 rounded-md transition-colors ${activeDoc === "gpx-format" ? "bg-[#1E3A8A]/20 text-[#1E3A8A] font-bold" : "hover:bg-slate-800 text-slate-300"}`}
            >
              Format File GPX
            </button>
            <button
              onClick={() => setActiveDoc("faq")}
              className={`text-left px-3 py-2 rounded-md transition-colors ${activeDoc === "faq" ? "bg-[#1E3A8A]/20 text-[#1E3A8A] font-bold" : "hover:bg-slate-800 text-slate-300"}`}
            >
              FAQ
            </button>
          </nav>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 w-full min-h-[500px]">
          {activeDoc === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              {/* Card 0: Tutorial */}
              <div
                onClick={() => setActiveDoc("tutorial")}
                className="bg-[#131313] border border-blue-800/50 rounded-2xl p-8 hover:border-[#1E3A8A] hover:bg-slate-900/50 transition-all cursor-pointer flex flex-col items-center text-center group min-h-[200px] shadow-[0_0_15px_rgba(30,58,138,0.3)] md:col-span-2"
              >
                <Compass className="w-12 h-12 text-blue-400 mb-4 group-hover:-translate-y-2 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#1E3A8A] transition-colors">
                  Tutorial Penggunaan Web
                </h3>
                <p className="text-sm text-slate-400 max-w-md">
                  Alur lengkap penggunaan platform: dari unggah GPX hingga gladi
                  resik navigasi 3D.
                </p>
              </div>

              {/* Card 1: Getting Started */}
              <div
                onClick={() => setActiveDoc("getting-started")}
                className="bg-[#131313] border border-slate-800/80 rounded-2xl p-8 hover:border-[#1E3A8A]/50 hover:bg-slate-900/50 transition-all cursor-pointer flex flex-col items-center text-center group min-h-[200px] shadow-lg"
              >
                <Rocket className="w-12 h-12 text-rose-400 mb-4 group-hover:-translate-y-2 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#1E3A8A] transition-colors">
                  Getting Started
                </h3>
                <p className="text-sm text-slate-400">
                  Pengenalan sistem analitik TrailSense.
                </p>
              </div>

              {/* Card 2: Bank GPX */}
              <div
                onClick={() => setActiveDoc("bank-gpx")}
                className="bg-[#131313] border border-slate-800/80 rounded-2xl p-8 hover:border-[#1E3A8A]/50 hover:bg-slate-900/50 transition-all cursor-pointer flex flex-col items-center text-center group min-h-[200px] shadow-lg"
              >
                <Globe className="w-12 h-12 text-[#1E3A8A] mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#1E3A8A] transition-colors">
                  Bank GPX & Kurasi
                </h3>
                <p className="text-sm text-slate-400">
                  Pusat rute ALTI Depok dan sistem audit PENDING/APPROVED.
                </p>
              </div>

              {/* Card 3: AI Pace Notes */}
              <div
                onClick={() => setActiveDoc("ai-pacenotes")}
                className="bg-[#131313] border border-slate-800/80 rounded-2xl p-8 hover:border-[#1E3A8A]/50 hover:bg-slate-900/50 transition-all cursor-pointer flex flex-col items-center text-center group min-h-[200px] shadow-lg"
              >
                <Zap className="w-12 h-12 text-amber-400 mb-4 group-hover:-translate-y-2 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#1E3A8A] transition-colors">
                  Pace Notes & AI K-Means
                </h3>
                <p className="text-sm text-slate-400">
                  Pemetaan zona Bahaya, Waspada, dan Aman secara otonom.
                </p>
              </div>

              {/* Card 4: Map Controls */}
              <div
                onClick={() => setActiveDoc("map-controls")}
                className="bg-[#131313] border border-slate-800/80 rounded-2xl p-8 hover:border-[#1E3A8A]/50 hover:bg-slate-900/50 transition-all cursor-pointer flex flex-col items-center text-center group min-h-[200px] shadow-lg"
              >
                <Mountain className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#1E3A8A] transition-colors">
                  Peta Taktis 3D
                </h3>
                <p className="text-sm text-slate-400">
                  Kontrol mode Topo/Satelit dan elevasi kamera 60°.
                </p>
              </div>

              {/* Card 5: GPX Format */}
              <div
                onClick={() => setActiveDoc("gpx-format")}
                className="bg-[#131313] border border-slate-800/80 rounded-2xl p-8 hover:border-[#1E3A8A]/50 hover:bg-slate-900/50 transition-all cursor-pointer flex flex-col items-center text-center group min-h-[180px] shadow-lg"
              >
                <Save className="w-10 h-10 text-indigo-400 mb-4 group-hover:-translate-y-2 transition-transform duration-300" />
                <h3 className="text-lg font-bold text-white group-hover:text-[#1E3A8A] transition-colors">
                  Format GPX
                </h3>
              </div>

              {/* Card 6: FAQ */}
              <div
                onClick={() => setActiveDoc("faq")}
                className="bg-[#131313] border border-slate-800/80 rounded-2xl p-8 hover:border-[#1E3A8A]/50 hover:bg-slate-900/50 transition-all cursor-pointer flex flex-col items-center text-center group min-h-[180px] shadow-lg"
              >
                <HelpCircle className="w-10 h-10 text-purple-400 mb-4 group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-lg font-bold text-white group-hover:text-[#1E3A8A] transition-colors">
                  FAQ
                </h3>
              </div>
            </div>
          ) : (
            renderDocContent()
          )}
        </div>
      </main>
    </div>
  );
}
