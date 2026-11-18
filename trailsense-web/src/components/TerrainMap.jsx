
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Map, {
  NavigationControl,
  Source,
  Layer,
  Marker
} from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';

import {
  Layers,
  Mountain,
  Map as MapIcon,
  X
} from 'lucide-react';

// ==========================================
// 1. STYLE PETA
// ==========================================

const freeStyles = {
  topo: {
    version: 8,
    sources: {
      'topo-tiles': {
        type: 'raster',
        tiles: [
          'https://tile.opentopomap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '© OpenStreetMap | © OpenTopoMap'
      },
      'terrain-source': {
        type: 'raster-dem',
        tiles: [
          'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
        ],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 14
      }
    },
    layers: [
      {
        id: 'topo-layer',
        type: 'raster',
        source: 'topo-tiles',
        minzoom: 0,
        maxzoom: 17
      }
    ]
  },

  satellite: {
    version: 8,
    sources: {
      'sat-tiles': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: 'Tiles © Esri'
      },
      'terrain-source': {
        type: 'raster-dem',
        tiles: [
          'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
        ],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 14
      }
    },
    layers: [
      {
        id: 'sat-layer',
        type: 'raster',
        source: 'sat-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  }
};

// ==========================================
// 2. KOMPONEN UTAMA
// ==========================================

export default function TerrainMap({
  routeData,
  hoveredPoint,
  activeSegmentId
}) {
  const mapRef = useRef(null);

  const [mapMode, setMapMode] = useState('topo-3d');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // ==========================================
  // 3. VALIDASI DATA GPX
  // ==========================================

  const chartProfile = useMemo(() => {
    return Array.isArray(routeData?.chart_profile)
      ? routeData.chart_profile.filter(point => {
          const lon = Number(point.lon);
          const lat = Number(point.lat);

          return (
            Number.isFinite(lon) &&
            Number.isFinite(lat) &&
            lon >= -180 &&
            lon <= 180 &&
            lat >= -90 &&
            lat <= 90
          );
        })
      : [];
  }, [routeData?.chart_profile]);

  const startPoint = chartProfile.length > 0
    ? chartProfile[0]
    : null;

  const endPoint = chartProfile.length > 0
    ? chartProfile[chartProfile.length - 1]
    : null;

  // ==========================================
  // 4. KONVERSI DATA GPX KE GEOJSON
  // ==========================================

  const geoJsonRoute = useMemo(() => {
    if (!routeData || !Array.isArray(routeData.segments)) {
      return {
        type: 'FeatureCollection',
        features: []
      };
    }

    const features = routeData.segments
      .map((seg) => {

        const segmentPoints = chartProfile.filter(
          point =>
            String(point.segment_id) === String(seg.segment_id)
        );

        const coordinates = segmentPoints.map(point => [
          Number(point.lon),
          Number(point.lat)
        ]);

        // LineString wajib memiliki minimal 2 koordinat.
        if (coordinates.length < 2) {
          return null;
        }

        return {
          type: 'Feature',
          properties: {
            color: seg.color_hex || '#3B82F6',
            segment_id: String(seg.segment_id)
          },
          geometry: {
            type: 'LineString',
            coordinates
          }
        };
      })
      .filter(Boolean);

    return {
      type: 'FeatureCollection',
      features
    };

  }, [routeData?.segments, chartProfile]);

  // ==========================================
  // 5. STYLE GARIS RUTE
  // ==========================================

  const routeCasingLayer = {
    id: 'route-casing',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#111827',
      'line-width': 9,
      'line-opacity': 0.85
    }
  };

  const routeLayer = {
    id: 'route-line',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': [
        'case',
        ['==', ['get', 'segment_id'], String(activeSegmentId ?? '')],
        8,
        6
      ],
      'line-opacity': 1
    }
  };

  // ==========================================
  // 6. PENGATURAN MODE 2D DAN 3D
  // ==========================================

  const is3D = mapMode.includes('3d');

  const currentStyle = useMemo(() => {
    const baseStyle = mapMode.includes('topo')
      ? freeStyles.topo
      : freeStyles.satellite;

    return {
      ...baseStyle,
      terrain: is3D
        ? {
            source: 'terrain-source',
            exaggeration: 1.8
          }
        : undefined
    };
  }, [mapMode, is3D]);

  // ==========================================
  // 7. ANIMASI PERUBAHAN SUDUT PETA
  // ==========================================

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      pitch: is3D ? 65 : 0,
      duration: 1200
    });

  }, [is3D]);

  // ==========================================
  // 8. KOORDINAT AWAL PETA
  // ==========================================

  const initialLongitude = startPoint
    ? Number(startPoint.lon)
    : 106.90511;

  const initialLatitude = startPoint
    ? Number(startPoint.lat)
    : -6.59082;

  const validHoveredPoint =
    hoveredPoint &&
    Number.isFinite(Number(hoveredPoint.lon)) &&
    Number.isFinite(Number(hoveredPoint.lat)) &&
    Number(hoveredPoint.lon) >= -180 &&
    Number(hoveredPoint.lon) <= 180 &&
    Number(hoveredPoint.lat) >= -90 &&
    Number(hoveredPoint.lat) <= 90;

  // ==========================================
  // 9. RENDER KOMPONEN
  // ==========================================

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden group bg-slate-900">

      {/* PANEL KONTROL PETA */}

      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">

        {/* Tombol Toggle */}

        <button
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 p-2.5 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md transition-colors flex items-center justify-center"
        >
          {isLayerMenuOpen
            ? <X className="w-5 h-5" />
            : <Layers className="w-5 h-5" />
          }
        </button>

        {/* Dropdown Mode Peta */}

        <div
          className={`bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2 rounded-xl shadow-2xl flex flex-col gap-1 transition-all duration-200 origin-top-right ${
            isLayerMenuOpen
              ? 'scale-100 opacity-100'
              : 'scale-95 opacity-0 pointer-events-none'
          }`}
        >

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 pt-1 pb-2">
            Topologi
          </div>

          <button
            onClick={() => {
              setMapMode('topo-2d');
              setIsLayerMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              mapMode === 'topo-2d'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Topo 2D
          </button>

          <button
            onClick={() => {
              setMapMode('topo-3d');
              setIsLayerMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              mapMode === 'topo-3d'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Mountain className="w-4 h-4" />
            Topo 3D
          </button>

          <div className="h-px w-full bg-slate-700/50 my-2" />

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 pb-2">
            Satelit
          </div>

          <button
            onClick={() => {
              setMapMode('sat-2d');
              setIsLayerMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              mapMode === 'sat-2d'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Satelit 2D
          </button>

          <button
            onClick={() => {
              setMapMode('sat-3d');
              setIsLayerMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              mapMode === 'sat-3d'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Mountain className="w-4 h-4" />
            Satelit 3D
          </button>

        </div>
      </div>

      {/* MAPLIBRE */}

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: initialLongitude,
          latitude: initialLatitude,
          zoom: 13,
          pitch: is3D ? 65 : 0,
          bearing: 0
        }}
        mapStyle={currentStyle}
        style={{
          width: '100%',
          height: '100%'
        }}
      >

        <NavigationControl
          position="bottom-right"
          visualizePitch={true}
        />

        {/* GARIS RUTE GPX */}

        {geoJsonRoute.features.length > 0 && (
          <Source
            id="route-source"
            type="geojson"
            data={geoJsonRoute}
            lineMetrics={true}
          >
            {/* Outline agar garis tidak menyatu dengan peta */}

            <Layer {...routeCasingLayer} />

            {/* Garis warna berdasarkan klasifikasi segmen */}

            <Layer {...routeLayer} />

          </Source>
        )}

        {/* MARKER START */}

        {startPoint && (
          <Marker
            longitude={Number(startPoint.lon)}
            latitude={Number(startPoint.lat)}
            anchor="bottom"
            offset={[0, -8]}
          >
            <div className="flex flex-col items-center pointer-events-none drop-shadow-md">

              <div className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-lg border border-emerald-400 mb-0.5">
                START
              </div>

              <div className="w-1 h-4 bg-emerald-500" />

              <div className="w-3 h-3 bg-white border-[3px] border-emerald-600 rounded-full shadow-md" />

            </div>
          </Marker>
        )}

        {/* MARKER FINISH */}

        {endPoint && (
          <Marker
            longitude={Number(endPoint.lon)}
            latitude={Number(endPoint.lat)}
            anchor="bottom"
            offset={[0, -8]}
          >
            <div className="flex flex-col items-center pointer-events-none drop-shadow-md">

              <div className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-lg border border-rose-400 mb-0.5">
                FINISH
              </div>

              <div className="w-1 h-4 bg-rose-500" />

              <div className="w-3 h-3 bg-white border-[3px] border-rose-600 rounded-full shadow-md" />

            </div>
          </Marker>
        )}

        {/* POINTER DARI GRAFIK ELEVASI */}

        {validHoveredPoint && (
          <Marker
            longitude={Number(hoveredPoint.lon)}
            latitude={Number(hoveredPoint.lat)}
            anchor="center"
          >
            <div
              className="relative flex items-center justify-center pointer-events-none"
              style={{
                zIndex: 99999,
                transition: 'transform 75ms ease-out'
              }}
            >

              <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-pulse" />

              <div className="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" />

            </div>
          </Marker>
        )}

      </Map>
    </div>
  );
}
