# core/gpx_parser.py
import gpxpy
import gpxpy.gpx
import math
from io import BytesIO

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Menghitung jarak antara dua titik koordinat bumi dalam meter.
    Rumus ini memastikan jarak lari 100% akurat tanpa memperdulikan noise elevasi.
    """
    R = 6371000.0  # Jari-jari bumi dalam meter
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def parse_gpx_data(file_contents: bytes):
    """
    Membongkar data GPX menggunakan metode Moving Average dan Anchor Thresholding.
    """
    gpx_file = BytesIO(file_contents)
    gpx = gpxpy.parse(gpx_file)

    waypoints_data = []
    # 1. Ekstraksi Waypoints (Checkpoint / Water Station)
    for wp in gpx.waypoints:
        waypoints_data.append({
            "waypoint_id": wp.name or "WP_Unknown",
            "name": wp.name or "Checkpoint",
            "lat": wp.latitude,   # INJEKSI KOORDINAT WAJIB
            "lon": wp.longitude,  # INJEKSI KOORDINAT WAJIB
            "distance_km": 0.0,
            "elevation_m": wp.elevation or 0.0,
            "type": "checkpoint"
        })

    # 2. Tarik SEMUA titik GPS secara mentah agar jarak pelari tidak ada yang hilang
    all_points = []
    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                all_points.append(point)

    if not all_points:
        return [], waypoints_data

    # 3. PENYARINGAN 1: Moving Average Elevasi (Window = 15)
    # Meratakan gundukan palsu (noise satelit) agar Elevation Gain tidak meledak
    smoothed_elevs = []
    window_size = 15
    for i in range(len(all_points)):
        start = max(0, i - window_size // 2)
        end = min(len(all_points), i + window_size // 2 + 1)
        window_vals = [p.elevation for p in all_points[start:end] if p.elevation is not None]
        smoothed_elevs.append(sum(window_vals) / len(window_vals) if window_vals else 0.0)

    # 4. PENYARINGAN 2: Anchor Thresholding (Kalkulasi Jarak & Gradien)
    raw_coordinates = []
    cumulative_distance_m = 0.0
    
    # Titik Jangkar Awal (Reference Point)
    ref_dist_m = 0.0
    ref_elev = smoothed_elevs[0]
    current_gradient = 0.0

    raw_coordinates.append({
        "lat": all_points[0].latitude,
        "lon": all_points[0].longitude,
        "dist": 0.0,
        "elev": ref_elev,
        "gradient": 0.0
    })

    for i in range(1, len(all_points)):
        prev_point = all_points[i-1]
        curr_point = all_points[i]
        current_elev = smoothed_elevs[i]
        
        # Hitung jarak asli secara absolut (Point-to-Point)
        dist_m = haversine_distance(prev_point.latitude, prev_point.longitude, 
                                    curr_point.latitude, curr_point.longitude)
        cumulative_distance_m += dist_m

        # Anchor Logic: Tahan kalkulasi gradien sampai pelari maju minimal 20 meter!
        dist_from_ref = cumulative_distance_m - ref_dist_m
        
        if dist_from_ref >= 20.0:
            elev_diff = current_elev - ref_elev
            current_gradient = (elev_diff / dist_from_ref) * 100
            
            # Pindahkan jangkar (Anchor) ke titik saat ini setelah jarak terpenuhi
            ref_dist_m = cumulative_distance_m
            ref_elev = current_elev
        else:
            # Jika belum 20 meter, pelari dianggap masih berada di profil kemiringan yang sama
            current_gradient = raw_coordinates[-1]["gradient"]

        raw_coordinates.append({
            "lat": curr_point.latitude,
            "lon": curr_point.longitude,
            "dist": cumulative_distance_m / 1000.0,  # Konversi ke KM untuk frontend
            "elev": current_elev,
            "gradient": current_gradient
        })
        
    return raw_coordinates, waypoints_data