import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, ExternalLink, Plus, Minus, LocateFixed,
  Navigation, AlertTriangle, Users
} from 'lucide-react';

const YOGYAKARTA_CENTER = [-7.7956, 110.3695];
const streetTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
const satelliteTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

// Fallback koordinat relawan terdekat jika respon relawan belum memiliki lat/lng
const FALLBACK_NEARBY_RELAWAN = [
  {
    id: 8,
    nama: 'Annisa Putri (Relawan)',
    kompetensi: 'Penerjemah Bahasa Isyarat (BISINDO)',
    jarak_text: '150 m',
    status: 'siaga',
    no_telp: '085611110002',
    latitude: -7.810000,
    longitude: 110.380000,
  },
  {
    id: 9,
    nama: 'Dimas Anggara (Relawan)',
    kompetensi: 'Relawan Tanggap Darurat & SAR',
    jarak_text: '2.1 km',
    status: 'siaga',
    no_telp: '085611110003',
    latitude: -7.792500,
    longitude: 110.365800,
  },
  {
    id: 7,
    nama: 'Rian Hidayat (Relawan)',
    kompetensi: 'Paramedis / First Aid',
    jarak_text: '4.8 km',
    status: 'siaga',
    no_telp: '085611110001',
    latitude: -7.765000,
    longitude: 110.408000,
  },
];

export default function DetailSosMap({
  kasus,
  relawanBertugas,
  relawanList = [],
  onSelectRelawan,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [mapMode, setMapMode] = useState('street'); // 'street' | 'satellite'

  const rawLat = kasus?.latitude ?? kasus?.lat;
  const rawLng = kasus?.longitude ?? kasus?.lng;
  const parsedLat = parseFloat(rawLat);
  const parsedLng = parseFloat(rawLng);
  const hasValidCoords = !Number.isNaN(parsedLat) && !Number.isNaN(parsedLng) && (parsedLat !== 0 || parsedLng !== 0);

  const sosLat = hasValidCoords ? parsedLat : YOGYAKARTA_CENTER[0];
  const sosLng = hasValidCoords ? parsedLng : YOGYAKARTA_CENTER[1];

  // Cari koordinat relawan bertugas jika ada
  const assignedInList = relawanList.find((r) => r.id === relawanBertugas?.id);
  const relawanLat = parseFloat(
    relawanBertugas?.latitude ?? relawanBertugas?.lat ?? assignedInList?.latitude ?? assignedInList?.lat
  );
  const relawanLng = parseFloat(
    relawanBertugas?.longitude ?? relawanBertugas?.lng ?? assignedInList?.longitude ?? assignedInList?.lng
  );
  const hasRelawanCoords = !Number.isNaN(relawanLat) && !Number.isNaN(relawanLng) && (relawanLat !== 0 || relawanLng !== 0);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [sosLat, sosLng],
      zoom: 15,
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

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle ResizeObserver for responsive container
  useEffect(() => {
    if (!mapContainerRef.current || !mapInstanceRef.current) return;
    const observer = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle Tile Layer Switch (Street vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newUrl = mapMode === 'satellite' ? satelliteTileUrl : streetTileUrl;
    tileLayerRef.current = L.tileLayer(newUrl, {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri',
    }).addTo(mapInstanceRef.current);
  }, [mapMode]);

  // Update Markers: SOS, Relawan Bertugas, & Relawan Siaga Terdekat
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    const bounds = L.latLngBounds();

    if (hasValidCoords) {
      // ── 1. Marker SOS Beacon (Merah) dengan Animasi Radar ──
      const victimName = kasus?.pengguna?.name || 'Korban';
      const sosMarkerHtml = `
        <div class="command-map-marker sos-marker group cursor-pointer">
          <div class="emergency-beacon-ripple"></div>
          <div class="marker-circle">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="marker-tag">#SOS-${kasus?.id || ''} &bull; ${victimName}</div>
        </div>
      `;

      const sosIcon = L.divIcon({
        className: 'custom-command-center-icon',
        html: sosMarkerHtml,
        iconSize: [120, 60],
        iconAnchor: [60, 24],
      });

      const sosMarker = L.marker([sosLat, sosLng], { icon: sosIcon, zIndexOffset: 1000 });
      sosMarker.bindPopup(`
        <div class="p-1 space-y-1 text-slate-800 text-[11px] leading-tight max-w-[220px]">
          <div class="flex items-center gap-1 font-bold text-rose-700 uppercase text-[10px]">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Panggilan Darurat SOS #${kasus?.id || ''}
          </div>
          <p class="font-black text-slate-900 text-[12px]">${victimName}</p>
          <p class="text-slate-500">${kasus?.lokasi_laporan || 'Lokasi SOS'}</p>
          <div class="font-mono text-[9.5px] text-slate-400">
            ${sosLat.toFixed(5)}, ${sosLng.toFixed(5)}
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${sosLat},${sosLng}"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-1.5 inline-flex items-center gap-1 bg-rose-600 text-white font-bold text-[10px] px-2 py-1 rounded-md hover:bg-rose-700 transition-colors"
          >
            Rute Google Maps &rarr;
          </a>
        </div>
      `);

      markersLayerRef.current.addLayer(sosMarker);
      bounds.extend([sosLat, sosLng]);

      // ── 2. Lingkaran Radius Akurasi Darurat (150m) ──
      const radiusCircle = L.circle([sosLat, sosLng], {
        radius: 150,
        color: '#dc2626',
        weight: 1.5,
        opacity: 0.8,
        dashArray: '4, 4',
        fillColor: '#ef4444',
        fillOpacity: 0.12,
      });
      markersLayerRef.current.addLayer(radiusCircle);

      // ── 3. Relawan Bertugas (Jika Sudah Ditugaskan) ──
      if (relawanBertugas && hasRelawanCoords) {
        const assignedHtml = `
          <div class="command-map-marker relawan-marker group cursor-pointer">
            <div class="marker-circle bg-emerald-600 border-2 border-white shadow-lg ring-2 ring-emerald-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="marker-tag bg-emerald-700 text-white font-bold">🛡️ ${relawanBertugas.name} (Bertugas)</div>
          </div>
        `;
        const assignedIcon = L.divIcon({
          className: 'custom-command-center-icon',
          html: assignedHtml,
          iconSize: [140, 60],
          iconAnchor: [70, 24],
        });
        const assignedMarker = L.marker([relawanLat, relawanLng], { icon: assignedIcon, zIndexOffset: 900 });
        assignedMarker.bindPopup(`
          <div class="p-1 space-y-1.5 text-slate-800 text-[11px] leading-tight max-w-[220px]">
            <div class="flex items-center gap-1 font-bold text-emerald-700 uppercase text-[10px]">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Relawan Sedang Menuju Lokasi
            </div>
            <p class="font-black text-slate-900 text-[12.5px]">${relawanBertugas.name}</p>
            <p class="text-slate-500">${relawanBertugas.kompetensi || 'Relawan Tanggap Darurat'}</p>
            ${relawanBertugas.no_telp ? `
              <div class="pt-1">
                <a href="tel:${relawanBertugas.no_telp}" class="inline-flex items-center gap-1 bg-[#0b6f61] text-white font-bold text-[10px] px-2.5 py-1 rounded-md hover:bg-[#085046]">
                  Hubungi: ${relawanBertugas.no_telp}
                </a>
              </div>
            ` : ''}
          </div>
        `);
        markersLayerRef.current.addLayer(assignedMarker);
        bounds.extend([relawanLat, relawanLng]);

        // Garis Rute Panduan Relawan -> Korban
        const routeLine = L.polyline([[relawanLat, relawanLng], [sosLat, sosLng]], {
          color: '#059669',
          weight: 3,
          dashArray: '6, 8',
          opacity: 0.9,
        });
        markersLayerRef.current.addLayer(routeLine);
      }

      // ── 4. Daftar Relawan Siaga di Sekitar Wilayah Kejadian ──
      // Gunakan relawanList dari API, atau fallback jika belum ada data koordinat
      const activeVolunteers = (relawanList && relawanList.length > 0)
        ? relawanList
        : FALLBACK_NEARBY_RELAWAN;

      activeVolunteers.forEach((vol) => {
        // Jangan duplikasi jika relawan ini sudah bertugas di atas
        if (relawanBertugas && vol.id === relawanBertugas.id) return;

        const vLat = parseFloat(vol.latitude ?? vol.lat);
        const vLng = parseFloat(vol.longitude ?? vol.lng);
        if (Number.isNaN(vLat) || Number.isNaN(vLng) || (vLat === 0 && vLng === 0)) return;

        const volName = vol.nama || vol.name || 'Relawan Siaga';
        const jarakLabel = vol.jarak_text || (vol.jarak_km ? `${vol.jarak_km} km` : 'Siaga');

        const volHtml = `
          <div class="command-map-marker relawan-marker group cursor-pointer">
            <div class="marker-circle">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="marker-tag">${volName} (${jarakLabel})</div>
          </div>
        `;

        const volIcon = L.divIcon({
          className: 'custom-command-center-icon',
          html: volHtml,
          iconSize: [120, 56],
          iconAnchor: [60, 24],
        });

        const volMarker = L.marker([vLat, vLng], { icon: volIcon });
        const popupContentId = `dispatch-btn-${vol.id}`;

        volMarker.bindPopup(`
          <div class="p-1 space-y-1 text-slate-800 text-[11px] leading-tight max-w-[210px]">
            <div class="flex items-center justify-between pb-1 border-b border-slate-100">
              <span class="font-bold text-emerald-700 uppercase text-[9.5px]">Relawan Siaga Terdekat</span>
              <span class="text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                ${jarakLabel}
              </span>
            </div>
            <p class="font-black text-slate-900 text-[12px] pt-0.5">${volName}</p>
            <p class="text-slate-500 text-[10.5px]">${vol.kompetensi || 'Relawan Tanggap Darurat'}</p>
            ${vol.no_telp ? `<p class="text-slate-600 font-mono text-[10px]">HP: ${vol.no_telp}</p>` : ''}
            ${!relawanBertugas && onSelectRelawan ? `
              <button
                id="${popupContentId}"
                type="button"
                class="mt-2 w-full inline-flex items-center justify-center gap-1 bg-[#0b6f61] hover:bg-[#085046] text-white font-bold text-[10.5px] py-1.5 px-2 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Tugaskan ke Kasus Ini
              </button>
            ` : ''}
          </div>
        `);

        // Event listener saat tombol dispatch di popup diklik
        volMarker.on('popupopen', () => {
          const btn = document.getElementById(popupContentId);
          if (btn && onSelectRelawan) {
            btn.onclick = () => onSelectRelawan(vol.id);
          }
        });

        markersLayerRef.current.addLayer(volMarker);
        bounds.extend([vLat, vLng]);
      });

      // ── 5. Auto Fit Bounds ──
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
      } else {
        mapInstanceRef.current.setView([sosLat, sosLng], 15);
      }
    } else {
      mapInstanceRef.current.setView(YOGYAKARTA_CENTER, 13);
    }
  }, [
    hasValidCoords,
    sosLat,
    sosLng,
    hasRelawanCoords,
    relawanLat,
    relawanLng,
    kasus,
    relawanBertugas,
    relawanList,
    onSelectRelawan,
  ]);

  // Map Controls Helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Recenter ke lokasi darurat SOS korban
  const handleRecenterSos = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([sosLat, sosLng], 16, { duration: 0.6 });
    }
  };

  const googleMapsUrl = hasValidCoords
    ? `https://www.google.com/maps?q=${sosLat},${sosLng}`
    : 'https://www.google.com/maps';

  const directionsUrl = hasValidCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${sosLat},${sosLng}`
    : null;

  const totalVolunteersCount = (relawanList && relawanList.length > 0)
    ? relawanList.length
    : FALLBACK_NEARBY_RELAWAN.length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex-1 min-h-[260px] flex flex-col overflow-hidden">
      {/* ── Subcard Header: Peta Lokasi SOS & Relawan ── */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin size={13} className="text-rose-600 flex-shrink-0" />
            Peta Lokasi Darurat &amp; Relawan
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
            Live GPS
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Users size={11} className="text-emerald-600" />
            {totalVolunteersCount} Relawan Siaga
          </span>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5">
          {/* Segmented Map Mode Switcher */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[10px] font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setMapMode('street')}
              className={`rounded px-2 py-0.5 transition-all ${
                mapMode === 'street'
                  ? 'bg-white font-extrabold text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Jalan
            </button>
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`rounded px-2 py-0.5 transition-all ${
                mapMode === 'satellite'
                  ? 'bg-white font-extrabold text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Satelit
            </button>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka di Google Maps"
            className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* ── Map Canvas Container ── */}
      <div className="relative flex-1 min-h-[200px] w-full rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-100">
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Floating Zoom & Recenter Controls (Top Right) */}
        <div className="absolute right-2.5 top-2.5 z-[400] flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white/95 backdrop-blur-xs shadow-md">
          <button
            type="button"
            onClick={handleZoomIn}
            className="flex h-7 w-7 items-center justify-center border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Perbesar"
          >
            <Plus size={12} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="flex h-7 w-7 items-center justify-center border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Perkecil"
          >
            <Minus size={12} />
          </button>
          <button
            type="button"
            onClick={handleRecenterSos}
            className="flex h-7 w-7 items-center justify-center text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Fokus ke Titik Darurat SOS"
          >
            <LocateFixed size={12} />
          </button>
        </div>

        {/* Floating Map Legend (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-[400] bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-lg px-2 py-1 shadow-xs flex items-center gap-2 text-[9.5px] font-bold text-slate-700">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
            Korban SOS
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            Relawan Siaga
          </span>
          {relawanBertugas && (
            <>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1 text-emerald-800">
                <span>🛡️</span>
                Bertugas
              </span>
            </>
          )}
        </div>

        {/* Warning Badge if Coords not available */}
        {!hasValidCoords && (
          <div className="absolute top-10 left-2.5 right-12 z-[400] bg-amber-50/95 border border-amber-300 text-amber-900 rounded-lg p-2 text-[10.5px] shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
            <AlertTriangle size={13} className="text-amber-600 flex-shrink-0" />
            <span>Koordinat GPS belum tercatat presisi. Menampilkan estimasi pusat wilayah siaga.</span>
          </div>
        )}

        {/* Floating Bottom Status Pill */}
        <div className="absolute bottom-2 left-2 right-2 z-[400] bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-md flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold text-slate-800 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block flex-shrink-0"></span>
              {kasus?.lokasi_laporan || 'Lokasi Panggilan Darurat'}
            </p>
            {hasValidCoords && (
              <p className="font-mono text-[9px] text-slate-500 truncate">
                Lat: {sosLat.toFixed(5)}, Lng: {sosLng.toFixed(5)}
              </p>
            )}
          </div>

          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-primary text-[10px] h-6 px-2 flex-shrink-0 flex items-center gap-1"
            >
              <Navigation size={10} />
              <span>Petunjuk Arah</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
