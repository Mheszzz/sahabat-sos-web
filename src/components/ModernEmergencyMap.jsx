import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation, Plus, Minus, RotateCcw, Eye, Phone,
  AlertTriangle, Shield, HeartPulse, Clock, X, Radio
} from 'lucide-react';

export default function ModernEmergencyMap({
  height = '300px',
  onOpenDetail,
  showFilterBar = true,
  showLegend = true,
  className = '',
  mapData = [],
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('semua');
  const [selectedItem, setSelectedItem] = useState(null);

  const activeMapData = mapData || [];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Jakarta Central & South (-6.215, 106.825)
    const map = L.map(mapContainerRef.current, {
      center: [-6.2150, 106.8250],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // Esri World Street Map — Desain Modern & Cocok untuk Command Center
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers whenever filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    
    const bounds = L.latLngBounds();

    const filtered = activeMapData.filter(item => {
      if (activeFilter === 'semua') return true;
      if (activeFilter === 'sos') return item.type === 'sos';
      if (activeFilter === 'relawan') return item.type === 'relawan';
      if (activeFilter === 'posko') return item.type === 'posko';
      if (activeFilter === 'laporan') return item.type === 'laporan';
      return true;
    });

    filtered.forEach(item => {
      let iconHtml = '';

      if (item.type === 'sos') {
        // 🔴 SOS Marker with subtle pulse/ripple animation
        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 38px; height: 38px;">
            <div class="emergency-beacon-ripple"></div>
            <div class="w-8 h-8 rounded-full bg-[#ef4444] border-2 border-white shadow-lg flex items-center justify-center text-white text-[11px] font-black z-10 transition-transform group-hover:scale-110">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#ef4444] text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap z-10">
              ${item.displayId || item.id}
            </div>
          </div>
        `;
      } else if (item.type === 'relawan') {
        // 🟢 Relawan Marker
        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px;">
            <div class="w-7 h-7 rounded-full bg-[#10b981] border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold z-10 transition-transform group-hover:scale-110">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          </div>
        `;
      } else if (item.type === 'posko') {
        // 🔵 Posko Marker
        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px;">
            <div class="w-7 h-7 rounded-lg bg-[#2563eb] border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold z-10 transition-transform group-hover:scale-110">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
          </div>
        `;
      } else {
        // 🟠 Laporan Pending Marker
        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px;">
            <div class="w-7 h-7 rounded-full bg-[#f97316] border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold z-10 transition-transform group-hover:scale-110">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-emergency-div-icon',
        html: iconHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedItem(item);
        mapInstanceRef.current?.flyTo([item.lat, item.lng], 14, { duration: 0.8 });
      });

      markersLayerRef.current.addLayer(marker);
      bounds.extend([item.lat, item.lng]);
    });

    if (filtered.length > 0 && bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [activeFilter, activeMapData]);

  // Map Navigation Functions
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([-6.2150, 106.8250], 13, { duration: 0.6 });
    setSelectedItem(null);
  };
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          mapInstanceRef.current?.flyTo([latitude, longitude], 14, { duration: 0.8 });
        },
        () => {
          handleResetView();
        }
      );
    } else {
      handleResetView();
    }
  };

  // Counts for legend & filters
  const countSos = activeMapData.filter(d => d.type === 'sos').length;
  const countRelawan = activeMapData.filter(d => d.type === 'relawan').length;
  const countLaporan = activeMapData.filter(d => d.type === 'laporan').length;

  return (
    <div className={`relative flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#eaedf1] bg-white shadow-xs ${className}`}>
      {/* ── Top Header Controls & Filter Bar ── */}
      {showFilterBar && (
        <div className="p-3.5 border-b border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3 bg-white z-10">
          {/* Filter Pills */}
          <div className="filter-pills flex-1">
            <button
              onClick={() => setActiveFilter('semua')}
              className={`filter-pill ${activeFilter === 'semua' ? 'is-active' : ''}`}
            >
              Semua ({activeMapData.length})
            </button>
            <button
              onClick={() => setActiveFilter('sos')}
              className={`filter-pill tone-danger ${activeFilter === 'sos' ? 'is-active' : ''}`}
            >
              <span className="status-dot bg-red-500 animate-pulse" />
              SOS Aktif ({countSos})
            </button>
            <button
              onClick={() => setActiveFilter('relawan')}
              className={`filter-pill tone-success ${activeFilter === 'relawan' ? 'is-active' : ''}`}
            >
              <span className="status-dot bg-emerald-500" />
              Relawan ({countRelawan})
            </button>
            <button
              onClick={() => setActiveFilter('laporan')}
              className={`filter-pill tone-warning ${activeFilter === 'laporan' ? 'is-active' : ''}`}
            >
              <span className="status-dot bg-amber-500" />
              Laporan ({countLaporan})
            </button>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
            <Radio size={12} className="animate-pulse" />
            <span className="hidden sm:inline">Command Center GIS Online</span>
            <span className="sm:hidden">GIS Online</span>
          </div>
        </div>
      )}

      {/* ── Map Canvas Container ── */}
      <div className="relative w-full overflow-hidden" style={{ height }}>
        {/* Leaflet container */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Map Controls Floating Right */}
        <div className="absolute right-4 top-4 flex flex-col bg-white border border-[#cbd5e1] rounded-xl shadow-md overflow-hidden z-20">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-100 cursor-pointer transition-colors"
            title="Perbesar"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-100 cursor-pointer transition-colors"
            title="Perkecil"
          >
            <Minus size={15} />
          </button>
          <button
            onClick={handleCurrentLocation}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-100 cursor-pointer transition-colors"
            title="Lokasi Anda"
          >
            <Navigation size={13} />
          </button>
          <button
            onClick={handleResetView}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
            title="Pusatkan Map"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* ── Interactive Popup / Detail Card when marker is clicked ── */}
        {selectedItem && (
          <div className="absolute left-4 bottom-4 z-[1000] max-w-[340px] w-[calc(100%-32px)] bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[13px] text-slate-900">{selectedItem.displayId || selectedItem.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                    selectedItem.type === 'sos' ? 'bg-red-500 text-white' :
                    selectedItem.type === 'relawan' ? 'bg-emerald-600 text-white' :
                    'bg-amber-500 text-white'
                  }`}>
                    {selectedItem.status}
                  </span>
                </div>
                <h4 className="text-[13px] font-bold text-slate-800 mt-1 leading-snug">{selectedItem.kategori}</h4>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Info Body */}
            <div className="py-2.5 text-[12px] text-slate-600 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Prioritas:</span>
                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px]">{selectedItem.prioritas}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Nama Pengguna / Pelapor:</span>
                <strong className="text-slate-800">{selectedItem.pelapor}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Lokasi:</span>
                <span className="text-slate-700">{selectedItem.lokasi}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500">Relawan: <strong className="text-slate-800">{selectedItem.relawan}</strong></span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">ETA {selectedItem.eta}</span>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenDetail?.(selectedItem.id, selectedItem.type);
                  setSelectedItem(null);
                }}
                className="btn-base btn-primary text-[12px] w-full py-1.5 h-8 rounded-lg"
              >
                <Eye size={12} />
                <span>Lihat Detail</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Legend ── */}
      {showLegend && (
        <div className="px-5 py-3 bg-[#f8fafc] border-t border-[#eaedf1] flex items-center justify-center text-[11px] font-semibold text-slate-600 flex-wrap gap-6 z-10">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#ef4444] border border-white shadow-sm flex items-center justify-center text-white">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <span>SOS Aktif ({countSos})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#10b981] border border-white shadow-sm flex items-center justify-center text-white">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <span>Relawan Aktif ({countRelawan})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#f97316] border border-white shadow-sm flex items-center justify-center text-white">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <span>Laporan Pending ({countLaporan})</span>
          </div>
        </div>
      )}
    </div>
  );
}
