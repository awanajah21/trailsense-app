import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import GpxBankPage from "./pages/GpxBank";
import AdminDashboard from "./pages/AdminDashboard";
import HelpPage from "./pages/HelpPage";

import WelcomeModal from "./components/modals/WelcomeModal";
import GpxUploadModal from "./components/modals/GpxUploadModal";
import RaceDetailsModal from "./components/modals/RaceDetailsModal";
import AdminLoginModal from "./components/modals/AdminLoginModal";
// [BARU] Impor Feedback Modal (Sesuaikan path jika Anda menaruhnya di dalam folder modals)
import FeedbackModal from "./components//modals/FeedbackModal";
import { Loader2 } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [appStep, setAppStep] = useState("welcome");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // [BARU] State untuk mengontrol visibilitas Pos Masukan Komunitas
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [sessionData, setSessionData] = useState({
    userName: "",
    gpxFile: null,
    raceName: "",
    raceDate: "",
  });

  const updateSessionData = (key, value) => {
    setSessionData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setAppStep("welcome");
    setSessionData({ userName: "", gpxFile: null, raceName: "", raceDate: "" });
  };

  // Fungsi Ekstraktor GPX dari Cloud (Bypass Wizard)
  const handleOpenRouteFromBank = async (routeData) => {
    setIsDownloading(true);
    try {
      const response = await fetch(routeData.gpx_file_url);
      const blob = await response.blob();
      const file = new File([blob], `${routeData.route_name}.gpx`, {
        type: "application/gpx+xml",
      });

      setSessionData({
        userName: routeData.uploaded_by,
        gpxFile: file,
        raceName: routeData.route_name,
        raceDate: "Diambil dari Bank GPX",
      });

      setCurrentPage("app");
      setAppStep("dashboard");
    } catch (error) {
      console.error("Gagal memuat rute dari Bank GPX:", error);
      alert(
        "Gagal memuat file rute. Pastikan Anda terhubung ke internet dan URL valid.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (isDownloading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-slate-50 gap-4">
        <Loader2 className="w-12 h-12 text-[#1E3A8A] animate-spin" />
        <h2 className="text-xl font-bold">Mengekstrak Rute dari Cloud...</h2>
        <p className="text-slate-400 text-sm">
          Menyiapkan data geospasial untuk dianalisis oleh mesin AI.
        </p>
      </div>
    );
  }

  return (
    <>
      {currentPage === "home" && (
        <HomePage
          onNavigateToApp={() => setCurrentPage("app")}
          onNavigateToBank={() => setCurrentPage("bank")}
          onNavigateToAdmin={() => setShowAdminLogin(true)}
          onNavigateToHelp={() => setCurrentPage("help")}
          // [BARU] Injeksi pemicu modal ke beranda
          onOpenFeedback={() => setShowFeedbackModal(true)}
        />
      )}

      <AdminLoginModal
        isOpen={showAdminLogin}
        onLogin={() => {
          setShowAdminLogin(false);
          setCurrentPage("admin");
        }}
        onCancel={() => setShowAdminLogin(false)}
      />

      {currentPage === "app" && (
        <>
          {appStep !== "dashboard" && (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

              <WelcomeModal
                isOpen={appStep === "welcome"}
                onSubmit={(name) => {
                  updateSessionData("userName", name);
                  setAppStep("upload");
                }}
                onCancel={handleBackToHome}
              />

              <GpxUploadModal
                isOpen={appStep === "upload"}
                onUpload={(file) => {
                  updateSessionData("gpxFile", file);
                  setAppStep("race_details");
                }}
                onCancel={() => setAppStep("welcome")}
              />

              <RaceDetailsModal
                isOpen={appStep === "race_details"}
                defaultFileName={sessionData.gpxFile?.name || ""}
                onSubmit={(details) => {
                  updateSessionData("raceName", details.name);
                  updateSessionData("raceDate", details.date);
                  setAppStep("dashboard");
                }}
                onCancel={() => setAppStep("upload")}
              />
            </div>
          )}

          {appStep === "dashboard" && (
            <DashboardPage
              sessionData={sessionData}
              onBackHome={handleBackToHome}
            />
          )}
        </>
      )}

      {currentPage === "bank" && (
        <GpxBankPage
          onBackHome={handleBackToHome}
          onOpenRoute={handleOpenRouteFromBank}
        />
      )}

      {currentPage === "admin" && (
        <AdminDashboard onBackHome={handleBackToHome} />
      )}

      {currentPage === "help" && (
        <HelpPage
          onNavigateToHome={handleBackToHome}
          onNavigateToApp={() => {
            setCurrentPage("app");
            setAppStep("welcome");
          }}
          onNavigateToBank={() => setCurrentPage("bank")}
        />
      )}

      {/* [BARU] POS PENYELAMATAN ROOT-LEVEL */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </>
  );
}
