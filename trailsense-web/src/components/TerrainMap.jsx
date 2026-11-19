import React, { useState, useEffect, useRef, useMemo } from 'react';
import Map, { NavigationControl, Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, Mountain, Map as MapIcon, X } from 'lucide-react';

// 1. Impor instans maplibre-gl dan URL worker CSP[cite: 6]
import maplibregl from 'maplibre-gl';[cite: 6]
import workerUrl from 'maplibre-gl/dist/maplibre-gl-csp-worker.js?url';[cite: 6]

// 2. Kunci URL Web Worker secara eksplisit agar Vite memuatnya sebagai aset[cite: 6]
if (typeof maplibregl.setWorkerUrl === 'function') {[cite: 6]
  maplibregl.setWorkerUrl(workerUrl);[cite: 6]
} else {[cite: 6]
  maplibregl.workerUrl = workerUrl;[cite: 6]
        
export default function TerrainMap({ routeData, hoveredPoint, activeSegmentId }) {
  const mapRef = useRef();
  const [mapMode, setMapMode] = useState('topo-3d');
  
  // STATE BARU UNTUK KONTROL TOGGLE MENU MAP
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Menarik titik koordinat Start dan Finish dari data mentah
  const startPoint = routeData?.chart_profile?.[0];
  const endPoint = routeData?.chart_profile?.[routeData.chart_profile.length - 1];

  // Konversi data backend menjadi GeoJSON
  const geoJsonRoute = useMemo(() => {
    if (!routeData || !routeData.segments) return null;

    const features = routeData.segments.map((seg) => {
      const segmentPoints = routeData.chart_profile.filter(p => p.segment_id === seg.segment_id);
      const coordinates = segmentPoints.map(p => [p.lon, p.lat]);

      return {
        type: 'Feature',
        properties: {
          color: seg.color_hex || '#3B82F6',
          segment_id: seg.segment_id 
        },
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      };
    });

    return { type: 'FeatureCollection', features };
  }, [routeData]);

  // Styling Dinamis WebGL Murni
  const routeLayer = {
    id: 'route-line',
    type: 'line',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 6,
      'line-opacity': 0.85
    }
  };

  const freeStyles = {
    topo: {
      version: 8,
      sources: {
        'topo-tiles': {
          type: 'raster',
          tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap | OpenTopoMap'
        },
        'terrain-source': {
          type: 'raster-dem',
          tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
          encoding: 'terrarium',
          tileSize: 256,
          maxzoom: 14
        }
      },
      layers: [{ id: 'topo-layer', type: 'raster', source: 'topo-tiles', minzoom: 0, maxzoom: 17 }]
    },
    satellite: {
      version: 8,
      sources: {
        'sat-tiles': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: 'Tiles © Esri'
        },
        'terrain-source': {
          type: 'raster-dem',
          tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
          encoding: 'terrarium',
          tileSize: 256,
          maxzoom: 14
        }
      },
      layers: [{ id: 'sat-layer', type: 'raster', source: 'sat-tiles', minzoom: 0, maxzoom: 19 }]
    }
  };

  const is3D = mapMode.includes('3d');
  const baseStyle = mapMode.includes('topo') ? freeStyles.topo : freeStyles.satellite;

  const currentStyle = {
    ...baseStyle,
    terrain: is3D ? { source: 'terrain-source', exaggeration: 1.8 } : undefined
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({ pitch: is3D ? 65 : 0, duration: 1200 });
    }
  }, [is3D]);

  const initialLongitude = routeData?.chart_profile?.[0]?.lon || 106.90511;
  const initialLatitude = routeData?.chart_profile?.[0]?.lat || -6.59082;

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden group bg-slate-900">
      
      {/* PANEL KONTROL MAP COMPACT (MOBILE FRIENDLY) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        {/* Tombol Toggle Fab */}
        <button 
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 p-2.5 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md transition-colors flex items-center justify-center"
        >
          {isLayerMenuOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
        </button>

        {/* Kontainer Dropdown Peta */}
        <div className={`bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2 rounded-xl shadow-2xl flex flex-col gap-1 transition-all duration-200 origin-top-right ${isLayerMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 pt-1 pb-2">Topologi</div>
          <button onClick={() => { setMapMode('topo-2d'); setIsLayerMenuOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${mapMode === 'topo-2d' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <MapIcon className="w-4 h-4" /> Topo 2D
          </button>
          <button onClick={() => { setMapMode('topo-3d'); setIsLayerMenuOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${mapMode === 'topo-3d' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Mountain className="w-4 h-4" /> Topo 3D
          </button>
          <div className="h-px w-full bg-slate-700/50 my-2"></div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 pb-2">Satelit</div>
          <button onClick={() => { setMapMode('sat-2d'); setIsLayerMenuOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${mapMode === 'sat-2d' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Layers className="w-4 h-4" /> Satelit 2D
          </button>
          <button onClick={() => { setMapMode('sat-3d'); setIsLayerMenuOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${mapMode === 'sat-3d' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Mountain className="w-4 h-4" /> Satelit 3D
          </button>
        </div>
      </div>

      <Map
        ref={mapRef}
        initialViewState={{ longitude: initialLongitude, latitude: initialLatitude, zoom: 13, pitch: 65, bearing: 0 }}
        mapStyle={currentStyle}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" visualizePitch={true} />
        
        {geoJsonRoute && (
          <Source id="route-source" type="geojson" data={geoJsonRoute}>
            <Layer {...routeLayer} />
          </Source>
        )}

        {/* 1. PENANDA START */}
        {startPoint && (
          <Marker longitude={Number(startPoint.lon)} latitude={Number(startPoint.lat)} anchor="bottom" offset={[0, -8]}>
            <div className="flex flex-col items-center pointer-events-none drop-shadow-md">
              <div className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-lg border border-emerald-400 mb-0.5">START</div>
              <div className="w-1 h-4 bg-emerald-500"></div>
              <div className="w-3 h-3 bg-white border-[3px] border-emerald-600 rounded-full shadow-md"></div>
            </div>
          </Marker>
        )}

        {/* 2. PENANDA FINISH */}
        {endPoint && (
          <Marker longitude={Number(endPoint.lon)} latitude={Number(endPoint.lat)} anchor="bottom" offset={[0, -8]}>
            <div className="flex flex-col items-center pointer-events-none drop-shadow-md">
              <div className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-lg border border-rose-400 mb-0.5">FINISH</div>
              <div className="w-1 h-4 bg-rose-500"></div>
              <div className="w-3 h-3 bg-white border-[3px] border-rose-600 rounded-full shadow-md"></div>
            </div>
          </Marker>
        )}

        {/* 3. POINTER HOVER DARI GRAFIK */}
        {hoveredPoint?.lat && hoveredPoint?.lon && (
          <Marker 
            longitude={Number(hoveredPoint.lon)} 
            latitude={Number(hoveredPoint.lat)} 
            anchor="center"
          >
            <div className="relative flex items-center justify-center pointer-events-none" style={{ zIndex: 99999, transition: 'transform 75ms ease-out' }}>
              <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-pulse"></div>
              <div className="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]"></div>
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
}
