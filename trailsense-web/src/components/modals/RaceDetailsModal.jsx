import React, { useState } from 'react';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

export default function RaceDetailsModal({ isOpen, onSubmit, onCancel, defaultFileName = '' }) {
  const [raceName, setRaceName] = useState(defaultFileName.replace('.gpx', ''));
  const [raceDate, setRaceDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (raceName.trim() && raceDate) {
      onSubmit({ name: raceName.trim(), date: raceDate });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        <div className="bg-[#1E3A8A] px-6 py-5 text-left">
          <h2 className="text-2xl font-bold text-white tracking-tight">Race Details</h2>
          <p className="text-blue-100 text-sm mt-1">Please provide information about this route.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 text-left">
          <div className="mb-5">
            <label htmlFor="raceName" className="block text-sm font-semibold text-slate-700 mb-2">
              Race Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                id="raceName"
                value={raceName}
                onChange={(e) => setRaceName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] focus:bg-white transition-colors duration-200 text-sm text-slate-900 font-medium"
                placeholder="e.g. Abah Donny - Paniisan"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="raceDate" className="block text-sm font-semibold text-slate-700 mb-2">
              Race Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="date"
                id="raceDate"
                value={raceDate}
                onChange={(e) => setRaceDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] focus:bg-white transition-colors duration-200 text-sm text-slate-900 font-medium"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!raceName.trim() || !raceDate}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#152b66] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}