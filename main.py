import os
import uuid
import math
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client

from core.gpx_parser import parse_gpx_data
from core.segmenter import RouteSegmenter
from core.ai_model import HazardAnalyzer
from core.groq_coach import generate_ai_coach_summary

# INISIALISASI KLIEN SUPABASE
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ucoraoccxrbfxbnyyxnz.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjb3Jhb2NjeHJiZnhibnl5eG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODc1NjksImV4cCI6MjEwMzY2MzU2OX0.tb2HI2ft0nHzpPR2o6TifqqDmMQ4or5BTB4g6VC25V8") 
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="TrailSense AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0  
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.post("/api/analyze-route")
async def analyze_route(
    file: UploadFile = File(...),
    userName: str = Form("Anonim"),
    raceName: str = Form("Tanpa Nama"),
    raceDate: str = Form("-")
):
    if not file.filename.endswith('.gpx'):
        raise HTTPException(status_code=400, detail="File harus berformat .gpx")

    content = await file.read()
    file_size_mb = round(len(content) / (1024 * 1024), 2)
    
    try:
        raw_coordinates, waypoints_data = parse_gpx_data(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal memparsing GPX: {str(e)}")

    if not raw_coordinates:
        raise HTTPException(status_code=400, detail="Data koordinat tidak ditemukan.")

    # ==========================================
    # ALGORITMA DOWNSAMPLING (Pencegah Overload)
    # ==========================================
    MAX_POINTS = 1500
    if len(raw_coordinates) > MAX_POINTS:
        step = len(raw_coordinates) // MAX_POINTS
        downsampled = raw_coordinates[::step]
        if downsampled[-1] != raw_coordinates[-1]:
            downsampled.append(raw_coordinates[-1])
        raw_coordinates = downsampled

    # ==========================================
    # KALKULASI METADATA MAKRO (Disatukan agar tidak ganda)
    # ==========================================
    all_elevations = [p["elev"] for p in raw_coordinates]
    max_elev = max(all_elevations) if all_elevations else 0.0
    min_elev = min(all_elevations) if all_elevations else 0.0
    
    total_dist = raw_coordinates[-1]["dist"]
    macro_total_elev_gain = 0.0
    total_loss = 0.0
    
    for i in range(1, len(raw_coordinates)):
        elev_diff = raw_coordinates[i]["elev"] - raw_coordinates[i-1]["elev"]
        if elev_diff > 0:
            macro_total_elev_gain += elev_diff
        elif elev_diff < 0:
            total_loss += abs(elev_diff)

    for wp in waypoints_data:
        if raw_coordinates:
            closest_point = min(
                raw_coordinates, 
                key=lambda p: haversine(wp['lat'], wp['lon'], p['lat'], p['lon'])
            )
            wp['distance_km'] = closest_point['dist']

    # Parameter dinamis untuk Segmenter adaptif
    segmenter = RouteSegmenter()
    ai_analyzer = HazardAnalyzer(n_clusters=3)

    segments = segmenter.process_route(raw_coordinates)
    analyzed_segments = ai_analyzer.analyze_segments(segments)

    # Pemetaan warna
    color_map = {seg['segment_id']: seg.get('color_hex', '#10B981') for seg in analyzed_segments if 'segment_id' in seg}

       # ==========================================
    # UPLOAD & INJEKSI DATA (STRICT VALIDATION)
    # ==========================================
    highest_hazard = "Aman"
    for seg in analyzed_segments:
        # Ekstrak nilai secara aman dan ubah ke huruf kecil
        raw_hazard = str(seg.get("ai_hazard_level", "") or seg.get("hazard_level", "")).lower()
        
        # Pemindaian string parsial yang kebal terhadap format tambahan
        if "bahaya" in raw_hazard or "merah" in raw_hazard:
            highest_hazard = "Bahaya"
            break  # Berhenti mencari jika sudah menemukan tingkat tertinggi
        elif ("waspada" in raw_hazard or "kuning" in raw_hazard) and highest_hazard != "Bahaya":
            highest_hazard = "Waspada"
    
    unique_filename = f"{uuid.uuid4()}.gpx"
    public_url = ""
    
    try:
        supabase.storage.from_("gpx_files").upload(
            path=unique_filename,
            file=content,
            file_options={"content-type": "application/gpx+xml"}
        )
        public_url = supabase.storage.from_("gpx_files").get_public_url(unique_filename)
    except Exception as storage_err:
        raise HTTPException(status_code=500, detail=f"Gagal upload ke Storage: {storage_err}")

    try:
        supabase.table('gpx_routes').insert({
            "route_name": raceName,
            "uploaded_by": userName,
            "distance_km": round(total_dist, 2),
            "elevation_gain_m": round(macro_total_elev_gain, 0),
            "ai_hazard_level": highest_hazard,
            "gpx_file_url": public_url,
            "status": "PENDING",
            "file_size_mb": file_size_mb
        }).execute()
    except Exception as db_err:
        raise HTTPException(status_code=500, detail=f"Gagal merekam data ke Dasbor Admin: {db_err}")

    # === INJEKSI PELATIH GROQ LLAMA-3 ===
    ai_tactical_summary = generate_ai_coach_summary(analyzed_segments)
    
    # ==========================================
    # PENGEMASAN DATA VISUALISASI
    # ==========================================
    chart_profile_data = [
        {
            "dist": point["dist"],
            "elev": point["elev"],
            "lat": point["lat"], 
            "lon": point["lon"], 
            "segment_id": point.get("segment_id"),
            "color_hex": color_map.get(point.get("segment_id"), "#10B981") 
        }
        for point in raw_coordinates if "segment_id" in point
    ]

    # 8. Respons JSON Akhir (Sudah dibersihkan duplikatnya)
    return {
        "route_metadata": {
            "total_distance_km": round(total_dist, 2),
            "total_elevation_gain_m": round(macro_total_elev_gain, 0),
            "total_elevation_loss_m": round(total_loss, 0), 
            "max_elevation_m": round(max_elev, 0),          
            "min_elevation_m": round(min_elev, 0),          
            "total_segments": len(analyzed_segments)
        },
        "chart_profile": chart_profile_data,
        "segments": analyzed_segments,
        "waypoints": waypoints_data,
        "ai_coach_summary": ai_tactical_summary 
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)