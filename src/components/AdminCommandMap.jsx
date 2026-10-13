import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, Users, Eye, X, Radio, MapPin } from 'lucide-react';

// Pusat Yogyakarta (Malioboro / Tugu / Depok Sleman)
const YOGYAKARTA_CENTER = [-7.7956, 110.3695];
const streetTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
const satelliteTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

export default function AdminCommandMap({
  height,
  className = '',
  onOpenDetail,
  mapData = [],
  relawanCount = 3,
  sosCount = 1,
  laporanCount = 0,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [mapMode, setMapMode] = useState('street'); // 'street' | 'satellite'
  const [selectedItem, setSelectedItem] = useState(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: YOGYAKARTA_CENTER,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    tileLayerRef.current = L.tileLayer(streetTileUrl, {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Invalidate size once rendered
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Container Resizing to auto-fit right column height
  useEffect(() => {
    if (!mapContainerRef.current || !mapInstanceRef.current) return;
    const observer = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle Layer Toggle (Peta Jalan vs Satelit)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newUrl = mapMode === 'satellite' ? satelliteTileUrl : streetTileUrl;
    tileLayerRef.current = L.tileLayer(newUrl, {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri',
    }).addTo(mapInstanceRef.current);
  }, [mapMode]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    const bounds = L.latLngBounds();
    const items = (mapData && mapData.length > 0) ? mapData : [
      // Default sample matching screenshot if mapData is empty
      {
        id: 4,
        displayId: '#SOS-4',
        type: 'sos',
        label: '#SOS-4 • Malioboro',
        pelapor: 'Ahmad Fauzi',
        kategori: 'Darurat SOS',
        status: 'ditangani',
        lokasi: 'Kawasan Malioboro, Kota Yogyakarta',
        lat: -7.7930,
        lng: 110.3658,
        eta: '3 mnt'
      },
      {
        id: 5,
        displayId: '#5',
        type: 'laporan',
        label: '#5 Medis',
        pelapor: 'Dewi Lestari',
        kategori: 'Kondisi Medis',
        status: 'ditangani',
        lokasi: 'Jl. Margo Utomo, Gowongan, Jetis',
        lat: -7.7850,
        lng: 110.3670,
        eta: '6 mnt'
      },
      {
        id: 101,
        displayId: 'REL-1',
        type: 'relawan',
        label: 'Dimas P. (1.2km)',
        pelapor: 'Dimas Pratama',
        kategori: 'Relawan Siaga Medis & P3K',
        status: 'siaga',
        lokasi: 'Depok, Sleman',
        lat: -7.7720,
        lng: 110.3850,
        eta: 'Tersedia'
      },
      {
        id: 102,
        displayId: 'REL-2',
        type: 'relawan',
        label: 'Rian H. (500m)',
        pelapor: 'Rian Hidayat',
        kategori: 'Relawan Siaga Lapangan',
        status: 'siaga',
        lokasi: 'Sultan Agung, Yogyakarta',
        lat: -7.8040,
        lng: 110.3730,
        eta: 'Tersedia'
      }
    ];

    items.forEach((item) => {
      if (!item.lat || !item.lng) return;

      let iconHtml = '';
      const isSos = item.type === 'sos';
      const isRelawan = item.type === 'relawan';

      if (isSos) {
        iconHtml = `
          <div class="command-map-marker sos-marker group">
            <div class="emergency-beacon-ripple"></div>
            <div class="marker-circle">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="marker-tag">${item.label || item.displayId || '#SOS'}</div>
          </div>
        `;
      } else if (isRelawan) {
        iconHtml = `
          <div class="command-map-marker relawan-marker group">
            <div class="marker-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="marker-tag">${item.label || item.pelapor || 'Relawan'}</div>
          </div>
        `;
      } else {
        // Laporan
        iconHtml = `
          <div class="command-map-marker laporan-marker group">
            <div class="marker-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="marker-tag">${item.label || item.displayId || '#Laporan'}</div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-command-center-icon',
        html: iconHtml,
        iconSize: [120, 60],
        iconAnchor: [60, 24],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedItem(item);
        mapInstanceRef.current?.flyTo([item.lat, item.lng], 14, { duration: 0.6 });
      });

      markersLayerRef.current.addLayer(marker);
      bounds.extend([item.lat, item.lng]);
    });

    if (items.length > 0 && bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [mapData]);

  // Zoom Helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Focus on Volunteers
  const handleFocusVolunteers = () => {
    const volunteers = (mapData || []).filter(i => i.type === 'relawan');
    if (volunteers.length > 0 && mapInstanceRef.current) {
      const vBounds = L.latLngBounds();
      volunteers.forEach(v => {
        if (v.lat && v.lng) vBounds.extend([v.lat, v.lng]);
      });
      if (vBounds.isValid()) {
        mapInstanceRef.current.fitBounds(vBounds, { padding: [70, 70], maxZoom: 14 });
        return;
      }
    }
    // Fallback to center
    mapInstanceRef.current?.flyTo(YOGYAKARTA_CENTER, 13);
  };

  return (
    <div className={`relative flex w-full h-full min-h-[480px] flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-xs ${className}`}>
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900">
              Peta Pemantauan Wilayah
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Segmented Button: Peta Jalan / Satelit */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-[11px] font-bold text-slate-600">
            <button
              onClick={() => setMapMode('street')}
              className={`rounded-lg px-3 py-1 transition-all ${
                mapMode === 'street'
                  ? 'bg-white font-extrabold text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Peta Jalan
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`rounded-lg px-3 py-1 transition-all ${
                mapMode === 'satellite'
                  ? 'bg-white font-extrabold text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Satelit
            </button>
          </div>

          {/* Button Relawan Terdekat */}
          <button
            onClick={handleFocusVolunteers}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-[#ecfdf5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#065f46] hover:bg-emerald-100/70 transition-colors cursor-pointer"
          >
            <Users size={13} className="text-[#059669]" />
            <span>{relawanCount} Relawan Terdekat</span>
          </button>
        </div>
      </div>

      {/* ── Map Canvas Container ── */}
      <div className="relative w-full flex-1 min-h-[380px]" style={height ? { minHeight: height } : undefined}>
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Floating Zoom Controls (Top Right inside map) */}
        <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
          <button
            onClick={handleZoomIn}
            className="flex h-8 w-8 items-center justify-center border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors"
            title="Perbesar"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={handleZoomOut}
            className="flex h-8 w-8 items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
            title="Perkecil"
          >
            <Minus size={15} />
          </button>
        </div>

        {/* Selected Marker Popup */}
        {selectedItem && (
          <div className="absolute bottom-4 left-4 z-30 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  selectedItem.type === 'sos' ? 'bg-red-100 text-red-600' :
                  selectedItem.type === 'relawan' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {selectedItem.type === 'sos' ? 'Darurat SOS' : selectedItem.type === 'relawan' ? 'Relawan Siaga' : 'Laporan Warga'}
                </span>
                <h4 className="mt-1 text-[13px] font-bold text-slate-900">
                  {selectedItem.label || selectedItem.displayId || `#${selectedItem.id}`}
                </h4>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X size={14} />
              </button>
            </div>

            <div className="py-2.5 text-[11px] text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                <span className="line-clamp-1">{selectedItem.lokasi || 'Wilayah D.I. Yogyakarta'}</span>
              </div>
              {selectedItem.pelapor && (
                <div className="text-slate-700">
                  <span className="text-slate-400">Nama:</span> <strong className="font-semibold">{selectedItem.pelapor}</strong>
                </div>
              )}
              {selectedItem.status && (
                <div className="text-slate-700">
                  <span className="text-slate-400">Status:</span> <span className="font-semibold capitalize">{selectedItem.status}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onOpenDetail?.(selectedItem.id, selectedItem.type);
                setSelectedItem(null);
              }}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0b6f61] py-1.5 text-[11px] font-bold text-white hover:bg-[#095c52] transition-colors"
            >
              <Eye size={12} />
              <span>Buka Detail Lengkap</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom Legend & Status Bar ── */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-100 bg-[#f8fafc]/90 px-5 py-3 text-[11px] font-semibold text-slate-600 gap-3">
        {/* Left: Legend Indicators */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444] shadow-xs" />
            <span className="text-slate-700">SOS Aktif ({sosCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] shadow-xs" />
            <span className="text-slate-700">Relawan Siaga ({relawanCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b] shadow-xs" />
            <span className="text-slate-700">Laporan Pending ({laporanCount})</span>
          </div>
        </div>

        {/* Right: GPS Satelit text in italics */}
        <div className="text-slate-400 italic text-[11px] flex items-center gap-1">
          <Radio size={12} className="text-slate-400 shrink-0 not-italic" />
          <span>Pembaruan GPS real-time via satelit</span>
        </div>
      </div>
    </div>
  );
}
