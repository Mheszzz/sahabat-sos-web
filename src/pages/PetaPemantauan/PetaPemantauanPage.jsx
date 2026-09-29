import { useState, useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;
import { Radio, AlertTriangle, Phone, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModernEmergencyMap, { emergencyMapData } from '../../components/ModernEmergencyMap';
import PageHeader from '../../components/global/PageHeader';
import Badge from '../../components/global/Badge';
import { adminService } from '../../api/services/adminService';

const metricCards = [
  { key: 'sos',     label: 'SOS Aktif',         colorNum: 'var(--color-danger)',   colorDot: 'bg-red-500',    ping: true },
  { key: 'relawan', label: 'Relawan Aktif',      colorNum: 'var(--color-success)', colorDot: 'bg-emerald-500', ping: false },
  { key: 'posko',   label: 'Posko Siaga',        colorNum: 'var(--color-info)',    colorDot: 'bg-blue-500',    ping: false },
  { key: 'laporan', label: 'Laporan Pending',    colorNum: 'var(--color-warning)', colorDot: 'bg-amber-500',   ping: false },
];

export default function PetaPemantauanPage({ onOpenDetail }) {
  const navigate = useNavigate();
  const handleOpenDetail = onOpenDetail || ((id) => navigate(`/detail-kasus/${id}`));
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState(emergencyMapData);
  const [counts, setCounts] = useState({ sos: 0, relawan: 0, posko: 0, laporan: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Ambil data statistik & peta
        const statsRes = await adminService.getDashboardStats().catch(() => null);
        if (statsRes && statsRes.data) {
          setCounts({
            sos: statsRes.data.sos_aktif ?? counts.sos,
            relawan: statsRes.data.relawan_aktif ?? counts.relawan,
            posko: statsRes.data.posko_siaga ?? counts.posko,
            laporan: statsRes.data.laporan_pending ?? counts.laporan,
          });
        }

        const mapRes = await adminService.getPetaKasus().catch(() => null);
        if (mapRes && mapRes.data && mapRes.data.length > 0) {
          setMapData(mapRes.data);
        }

        const volRes = await adminService.getQuickDispatchRelawan().catch(() => null);
        if (volRes && volRes.data) {
          const items = Array.isArray(volRes.data) ? volRes.data : [];
          setVolunteers(items.map((r, i) => ({
            id: r.id,
            nama: r.name || r.nama || `Relawan #${r.id}`,
            peran: r.role_title || r.peran || 'Relawan',
            avatar: (r.name || r.nama || 'R').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
            avatarBg: ['bg-blue-600','bg-emerald-600','bg-amber-500','bg-purple-600','bg-pink-600'][i % 5],
            jarak: r.jarak || '1.2 km',
            eta: r.eta || 'ETA 5 menit',
            status: r.status === 'bertugas' ? 'Bertugas' : 'Online',
            kontak: r.no_telp || r.kontak || '',
          })));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();

    // WebSocket Init (Pusher / Reverb)
    const echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY || 'sahabat-sos-key',
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
      wsHost: import.meta.env.VITE_PUSHER_HOST || window.location.hostname,
      wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
      forceTLS: false,
      disableStats: true,
    });

    // Listen relawan-channel
    echo.channel('relawan-channel')
      .listen('.LokasiDiperbarui', (e) => {
        console.log('Update Lokasi Realtime:', e);
        if (e && e.relawan_id) {
          setMapData(prev => prev.map(m => 
            (m.type === 'relawan' && m.id === e.relawan_id) ? { ...m, lat: e.lat, lng: e.lng } : m
          ));
        }
      });

    return () => {
      echo.leaveChannel('relawan-channel');
    };
  }, []);

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title="Peta Pemantauan Wilayah"
        description="Pemantauan geospasial real-time, koordinasi titik SOS, dan pelacakan unit relawan siaga."
        actions={
          <div
            className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success-border)' }}
          >
            <Radio size={13} style={{ color: 'var(--color-success)', flexShrink: 0, animation: 'pulseSoft 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)' }}>
              GPS Online · Akurasi ±3m
            </span>
          </div>
        }
      />

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metricCards.map(m => (
          <div key={m.key} className="card-base p-4 flex items-center justify-between">
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{m.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: m.colorNum, lineHeight: 1.2, marginTop: 4 }}>
                {counts[m.key]}
              </p>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full ${m.colorDot} flex-shrink-0`}
              style={{ animation: m.ping ? 'emergencyPulse 1.8s cubic-bezier(0,0,0.2,1) infinite' : 'none' }}
            />
          </div>
        ))}
      </div>

      {/* Mobile panel toggle */}
      <div className="xl:hidden">
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="btn-base btn-secondary w-full justify-between"
          style={{ height: 44 }}
        >
          <div className="flex items-center gap-2">
            <Users size={15} style={{ color: 'var(--color-success)' }} />
            <span>Unit Relawan Terdekat</span>
          </div>
          <Badge variant="Online" showDot>{volunteers.length} Tersedia</Badge>
        </button>
      </div>

      {/* ── Map + Dispatch Panel ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start">
        {/* Map */}
        <div className="card-base overflow-hidden">
          <ModernEmergencyMap
            height="520px"
            onOpenDetail={handleOpenDetail}
            showFilterBar={true}
            showLegend={true}
            mapData={mapData}
          />
        </div>

        {/* Dispatch Panel */}
        <div
          className={`card-base overflow-hidden ${isPanelOpen ? 'block' : 'hidden'} xl:block`}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid var(--color-border-soft)' }}
          >
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Unit Relawan Siaga</h2>
              <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>Tersedia dalam radius 10km</p>
            </div>
            <Badge variant="Online" showDot>Live GPS</Badge>
          </div>

          {/* Volunteer list */}
          <div className="divide-y divide-slate-100 px-4 max-h-[380px] overflow-y-auto">
            {loading ? (
               <div className="py-4 text-center text-sm text-slate-500">Memuat relawan...</div>
            ) : volunteers.length === 0 ? (
               <div className="py-4 text-center text-sm text-slate-500">Belum ada relawan terdekat.</div>
            ) : (
              volunteers.map(vol => (
                <div
                  key={vol.id}
                  className="flex items-start justify-between gap-3 py-3.5 hover:bg-slate-50 -mx-4 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${vol.avatarBg || 'bg-slate-500'}`}>
                      {vol.avatar}
                    </div>
                    <div className="min-w-0">
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>{vol.nama}</p>
                      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{vol.peran}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 11.5, color: 'var(--color-text-secondary)' }}>
                          <strong>{vol.jarak}</strong> · {vol.eta}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={vol.status === 'Bertugas' ? 'Sedang Bertugas' : 'Online'} showDot />
                    <button
                      onClick={e => { e.stopPropagation(); window.location.href = `tel:${vol.kontak}`; }}
                      className="btn-icon"
                      style={{ width: 30, height: 30 }}
                      title={`Panggil ${vol.nama}`}
                    >
                      <Phone size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Broadcast Action */}
          <div className="p-4" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
            <button
              onClick={() => alert('Sirene darurat dibunyikan di seluruh Posko Jabodetabek')}
              className="btn-base btn-danger w-full"
              style={{ fontSize: 13 }}
            >
              <AlertTriangle size={14} />
              Bunyikan Sirene Seluruh Posko
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
