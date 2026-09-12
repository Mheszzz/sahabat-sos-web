import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation, Plus, Minus, RotateCcw, Eye, Phone,
  AlertTriangle, Shield, HeartPulse, Clock, X, Radio
} from 'lucide-react';

export const emergencyMapData = [
  {
    id: 'SOS-5022',
    type: 'sos',
    label: 'SOS-5022',
    kategori: 'Kecelakaan Lalu Lintas & Bantuan Difabel',
    prioritas: 'DARURAT',
    pelapor: 'Ahmad Fauzi (Tunanetra)',
    lokasi: 'Jl. Sudirman No. 45, Dekat Dukuh Atas',
    status: 'SOS Darurat',
    relawan: 'Dwi Riskianto',
    eta: '4 menit',
    lat: -6.2008,
    lng: 106.8230,
    waktu: '5 menit lalu',
  },
  {
    id: 'SOS-5021',
    type: 'sos',
    label: 'SOS-5021',
    kategori: 'Pendampingan Kursi Roda Halte Transit',
    prioritas: 'Prioritas Sedang',
    pelapor: 'Sari Indah (Kursi Roda)',
    lokasi: 'Halte CSW, Jl. Sisingamangaraja',
    status: 'Sedang Ditangani',
    relawan: 'Budi Santoso',
    eta: '12 menit',
    lat: -6.2300,
    lng: 106.8100,
    waktu: '18 menit lalu',
  },
  {
    id: 'SOS-6020',
    type: 'laporan',
    label: 'SOS-6020',
    kategori: 'Disorientasi / Tersesat di Peron',
    prioritas: 'Menunggu Respon',
    pelapor: 'Rizky Pratama (Disabilitas Rungu)',
    lokasi: 'Stasiun Manggarai, Peron 3',
    status: 'Laporan Pending',
    relawan: 'Menunggu Penugasan',
    eta: '—',
    lat: -6.2143,
    lng: 106.8502,
    waktu: '32 menit lalu',
  },
  {
    id: 'SOS-5019',
    type: 'laporan',
    label: 'SOS-5019',
    kategori: 'Bantuan Medis Darurat',
    prioritas: 'Prioritas Rendah',
    pelapor: 'Siti Aminah (Psikososial)',
    lokasi: 'Jl. Melawai Raya No. 12, Kebayoran Baru',
    status: 'Laporan Pending',
    relawan: 'Rama',
    eta: '15 menit',
    lat: -6.2420,
    lng: 106.8020,
    waktu: '1 jam lalu',
  },
  {
    id: 'REL-014',
    type: 'relawan',
    label: 'Dwi Riskianto',
    kategori: 'Relawan Siaga Difabel',
    prioritas: 'Bertugas',
    pelapor: 'Unit #14',
    lokasi: 'Dukuh Atas (0.8 km dari target)',
    status: 'Menuju Lokasi',
    relawan: 'Dwi Riskianto',
    eta: '4 menit',
    lat: -6.2050,
    lng: 106.8260,
    waktu: 'Real-time GPS',
  },
  {
    id: 'REL-007',
    type: 'relawan',
    label: 'Budi Santoso',
    kategori: 'Relawan Aksesibilitas',
    prioritas: 'Bertugas',
    pelapor: 'Unit #07',
    lokasi: 'Kebayoran Baru (1.2 km)',
    status: 'Menuju Lokasi',
    relawan: 'Budi Santoso',
    eta: '7 menit',
    lat: -6.2280,
    lng: 106.8130,
    waktu: 'Real-time GPS',
  },
  {
    id: 'REL-028',
    type: 'relawan',
    label: 'Nia Kurniasih',
    kategori: 'Relawan Medis Dasar',
    prioritas: 'Siaga',
    pelapor: 'Unit #28',
    lokasi: 'Menteng (2.1 km)',
    status: 'Siaga di Posko',
    relawan: 'Nia Kurniasih',
    eta: '11 menit',
    lat: -6.2120,
    lng: 106.8400,
    waktu: 'Real-time GPS',
  },
  {
    id: 'REL-041',
    type: 'relawan',
    label: 'Reza Mahendra',
    kategori: 'Relawan Transport',
    prioritas: 'Siaga',
    pelapor: 'Unit #41',
    lokasi: 'Thamrin (3.4 km)',
    status: 'Siaga di Posko',
    relawan: 'Reza Mahendra',
    eta: '15 menit',
    lat: -6.1950,
    lng: 106.8200,
    waktu: 'Real-time GPS',
  },
  {
    id: 'POS-01',
    type: 'posko',
    label: 'Posko Darurat Utama Dukuh Atas',
    kategori: 'Posko Pusat & Ambulans 24 Jam',
    prioritas: 'Operasional Penuh',
    pelapor: 'Pusat Komando',
    lokasi: 'Jl. Jend. Sudirman Kav. 21',
    status: 'Siaga 24 Jam',
    relawan: '12 Relawan Standby',
    eta: 'Siaga',
    lat: -6.2015,
    lng: 106.8200,
    waktu: 'Pusat Logistik',
  },
  {
    id: 'POS-02',
    type: 'posko',
    label: 'Posko Wilayah Selatan CSW',
    kategori: 'Posko Transit Disabilitas',
    prioritas: 'Operasional Penuh',
    pelapor: 'Pusat Komando',
    lokasi: 'Simpang CSW, Kebayoran Baru',
    status: 'Siaga 24 Jam',
    relawan: '8 Relawan Standby',
    eta: 'Siaga',
    lat: -6.2440,
    lng: 106.8000,
    waktu: 'Pusat Logistik',
  },
];

export default function ModernEmergencyMap({
  height = '300px',
  onOpenDetail,
  showFilterBar = true,
  showLegend = true,
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('semua');
  const [selectedItem, setSelectedItem] = useState(null);

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

    // High-end clean muted emergency basemap: CartoDB Positron / Voyager
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
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

    const filtered = emergencyMapData.filter(item => {
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
              ${item.id}
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
    });
  }, [activeFilter]);

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
  const countSos = emergencyMapData.filter(d => d.type === 'sos').length;
  const countRelawan = emergencyMapData.filter(d => d.type === 'relawan').length;
  const countPosko = emergencyMapData.filter(d => d.type === 'posko').length;
  const countLaporan = emergencyMapData.filter(d => d.type === 'laporan').length;

  return (
    <div className={`relative flex flex-col bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs ${className}`}>
      {/* ── Top Header Controls & Filter Bar ── */}
      {showFilterBar && (
        <div className="p-3.5 border-b border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3 bg-white z-10">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setActiveFilter('semua')}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'semua'
                  ? 'bg-[#0a271f] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({emergencyMapData.length})
            </button>

            <button
              onClick={() => setActiveFilter('sos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'sos'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>SOS Aktif ({countSos})</span>
            </button>

            <button
              onClick={() => setActiveFilter('relawan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'relawan'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Relawan ({countRelawan})</span>
            </button>

            <button
              onClick={() => setActiveFilter('posko')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'posko'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Posko ({countPosko})</span>
            </button>

            <button
              onClick={() => setActiveFilter('laporan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'laporan'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Laporan ({countLaporan})</span>
            </button>
          </div>

          {/* Real-time Indicator */}
          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex-shrink-0">
            <Radio size={12} className="animate-pulse" />
            <span>Command Center GIS Online</span>
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
          <div className="absolute left-4 bottom-4 z-30 max-w-[340px] w-[calc(100%-32px)] bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[13px] text-slate-900">{selectedItem.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                    selectedItem.type === 'sos' ? 'bg-red-500 text-white' :
                    selectedItem.type === 'relawan' ? 'bg-emerald-600 text-white' :
                    selectedItem.type === 'posko' ? 'bg-blue-600 text-white' :
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
                  onOpenDetail?.(selectedItem.id);
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
        <div className="px-5 py-2.5 bg-[#f8fafc] border-t border-[#eaedf1] flex items-center justify-between text-[11px] font-semibold text-slate-600 flex-wrap gap-2.5 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse" />
            <span>🔴 SOS Aktif ({countSos})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span>🟢 Relawan Aktif ({countRelawan})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
            <span>🔵 Posko ({countPosko})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
            <span>🟠 Laporan Pending ({countLaporan})</span>
          </div>
        </div>
      )}
    </div>
  );
}
