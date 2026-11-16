# models/schemas.py
from pydantic import BaseModel
from typing import List, Optional

# 1. Schema untuk Metadata (Header Bento UI)
class RouteMetadata(BaseModel):
    name: str
    total_distance_km: float
    total_elevation_gain_m: float
    total_segments: int

# 2. Schema untuk Tabel Segmentasi
class Segment(BaseModel):
    segment_id: int
    tag: str                 # "Flat", "Uphill", "Climb", dll.
    start_km: float
    end_km: float
    distance_km: float
    avg_gradient_percent: float
    elevation_gain_m: float
    color_hex: str           # Warna UI langsung di-inject dari backend

# 3. Schema untuk Waypoints (Titik Air / Medis)
class Waypoint(BaseModel):
    waypoint_id: str
    name: str
    distance_km: float
    elevation_m: float
    type: str                # "water", "medical", "checkpoint"

# 4. Schema untuk Titik Koordinat Grafik Elevasi
class ChartProfilePoint(BaseModel):
    dist: float
    elev: float
    segment_id: int          # Kunci untuk sinkronisasi hover UI

# 5. Schema Utama (Master Payload) - Ini yang dikirim ke Frontend!
class RouteAnalysisResponse(BaseModel):
    route_metadata: RouteMetadata
    segments: List[Segment]
    waypoints: List[Waypoint]
    chart_profile: List[ChartProfilePoint]
    ai_coach_summary: Optional[str] = None