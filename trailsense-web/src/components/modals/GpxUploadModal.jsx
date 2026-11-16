import React, { useRef } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

export default function GpxUploadModal({ isOpen, onUpload, onCancel }) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.gpx')) {
      onUpload(file);
    } else {
      alert("Please select a valid .gpx file");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 relative">
        
        <button onClick={onCancel} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="bg-[#1E3A8A] px-6 py-5 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">Import GPX</h2>
          <p className="text-blue-100 text-sm mt-1">Select your trail route file</p>
        </div>

        <div className="p-8">
          <input 
            type="file" 
            accept=".gpx" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          
          <div 
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group"
          >
            <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform duration-200">
              <UploadCloud className="w-8 h-8 text-[#1E3A8A]" />
            </div>
            <p className="text-slate-700 font-semibold text-lg mb-1">Drop file or tap to browse</p>
            <p className="text-slate-400 text-sm">(Max 10MB, .gpx format only)</p>
          </div>

          {/* <div className="mt-6 flex items-center justify-center">
            <div className="h-px bg-slate-200 flex-grow"></div>
            <span className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">OR</span>
            <div className="h-px bg-slate-200 flex-grow"></div>
          </div> */}

          {/* <button className="mt-6 w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] text-slate-600 font-semibold py-3 px-4 rounded-xl transition-all duration-200">
            <File className="w-4 h-4" /> Try GPX Example
          </button> */}
        </div>

      </div>
    </div>
  );
}