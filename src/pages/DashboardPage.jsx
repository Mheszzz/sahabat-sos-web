import { useState, useEffect } from 'react';
import {
  RefreshCw, ArrowRight, AlertTriangle, Activity
} from 'lucide-react';
import StatCard from '../components/StatCard';
import SOSCard from '../components/SOSCard';
import MapPanel from '../components/MapPanel';
import VolunteerCard from '../components/VolunteerCard';
import DonutChart from '../components/DonutChart';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { kategoriLaporan } from '../data/dummyData';
import { adminService } from '../services/adminService';
import { laporanService } from '../services/laporanService';
import { relawanService } from '../services/relawanService';

export default function DashboardPage({ onOpenDetail }) {
  const [stats, setStats] = useState(null);
  const [activeCases, setActiveCases] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);

      // Fetch stats, kasus aktif, relawan secara paralel
      const [statsRes, kasusRes, relawanRes] = await Promise.allSettled([
        adminService.getDashboardStats(),
        laporanService.getLaporan('aktif'),
        relawanService.getRelawan(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.stats) {
        setStats(statsRes.value.stats);
      }

      if (kasusRes.status === 'fulfilled') {
        const raw = kasusRes.value?.data;
        const items = raw?.data ?? raw ?? [];
        setActiveCases(Array.isArray(items) ? items.slice(0, 4) : []);
      }

      if (relawanRes.status === 'fulfilled') {
        const raw = relawanRes.value?.data;
        const items = Array.isArray(raw) ? raw : [];
        // Normalize API relawan ke format VolunteerCard
        setVolunteers(
          items.slice(0, 5).map((r, i) => ({
            id: r.id,
            nama: r.name || r.nama || `Relawan #${r.id}`,
            peran: r.role_title || r.peran || 'Relawan',
            avatar: (r.name || r.nama || 'R').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
            avatarBg: ['bg-blue-600', 'bg-emerald-600', 'bg-amber-500', 'bg-purple-600', 'bg-pink-600'][i % 5],
            jarak: r.jarak || null,
            eta: r.eta || null,
            status: r.status === 'bertugas' ? 'Bertugas' : 'Online',
            kontak: r.no_telp || r.kontak || '',
          }))
        );
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Normalize kasus dari API ke format SOSCard
  const normalizedCases = activeCases.map(k => ({
    id: `#${k.id}`,
    kategori: k.kategori_laporan || 'Laporan Darurat',
    waktu: k.waktu_laporan
      ? new Date(k.waktu_laporan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      : '—',
    status: k.status === 'aktif' ? 'SOS Darurat' : k.status === 'proses' ? 'Sedang Ditangani' : 'Menunggu Respon',
    prioritas: k.prioritas || null,
    lokasi: k.lokasi_laporan || '',
    pelapor: {
      nama: k.pengguna?.name || '—',
      kontak: k.pengguna?.no_telp || '',
    },
    relawan: k.relawan ? { nama: k.relawan.name } : null,
    eta: null,
  }));

  const statCards = [
    {
      id: 'active-sos',
      label: 'SOS Aktif',
      value: stats?.active_sos ?? activeCases.length,
      trendLabel: 'Butuh respons segera',
      icon: 'AlertTriangle',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      isAlert: true,
    },
    {
      id: 'total-laporan',
      label: 'Total Laporan',
      value: stats?.total_laporan ?? '—',
      trendLabel: 'Laporan masuk',
      icon: 'FileText',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-500',
    },
    {
      id: 'relawan-aktif',
      label: 'Relawan Terdaftar',
      value: stats?.total_relawan ?? '—',
      valueSuffix: 'org',
      trendLabel: 'Total relawan aktif',
      icon: 'ShieldCheck',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'total-pengguna',
      label: 'Total Pengguna',
      value: stats?.total_pengguna ?? '—',
      trendLabel: 'Pengguna terdaftar',
      icon: 'Phone',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
  ];

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div className="page-shell space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-header-title">Dashboard Utama</h1>
          <p className="page-header-desc">
            Pantau kondisi SOS, laporan aktif, dan ketersediaan relawan secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success-border)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: 'pulseSoft 1.8s ease-in-out infinite' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--color-success)' }}>Live</span>
            {lastUpdated && (
              <span style={{ fontSize: 11, color: '#6EE7B7' }}>{timeStr}</span>
            )}
          </div>
          <button
            onClick={fetchAll}
            className="btn-icon"
            title="Segarkan Data"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-base p-5 h-[96px]">
                <div className="skeleton h-3 w-24 rounded mb-3" />
                <div className="skeleton h-7 w-16 rounded" />
              </div>
            ))
          : statCards.map(card => <StatCard key={card.id} card={card} />)
        }
      </div>

      {/* ── Main Operational Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-5 items-start">

        {/* LEFT — Kasus Aktif + Donut */}
        <div className="flex flex-col gap-5">
          <div className="card-base overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--color-border-soft)' }}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 pulse-soft" />
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Kasus Aktif</h2>
                  <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>Laporan SOS yang sedang berlangsung</p>
                </div>
              </div>
              <button
                onClick={() => onOpenDetail?.('all')}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                Semua <ArrowRight size={13} />
              </button>
            </div>

            <div className="p-4">
              {loading ? (
                <LoadingSpinner text="Memuat kasus aktif..." />
              ) : normalizedCases.length > 0 ? (
                <div className="space-y-3">
                  {normalizedCases.map(kasus => (
                    <SOSCard key={kasus.id} kasus={kasus} onOpenDetail={onOpenDetail} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={AlertTriangle}
                  title="Tidak ada kasus aktif"
                  description="Semua laporan sudah ditangani."
                />
              )}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="card-base p-5">
            <div className="mb-4" style={{ borderBottom: '1px solid var(--color-border-soft)', paddingBottom: 12 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Distribusi Kategori</h2>
              <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>Laporan berdasarkan jenis kejadian</p>
            </div>
            <DonutChart items={kategoriLaporan} total={stats?.total_laporan || 15} />
          </div>
        </div>

        {/* RIGHT — Map + Relawan */}
        <div className="flex flex-col gap-5">
          <MapPanel relawanCount={stats?.total_relawan || 0} onOpenDetail={onOpenDetail} showLegend={false} />

          {/* Relawan List */}
          <div className="card-base overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--color-border-soft)' }}
            >
              <div className="flex items-center gap-2">
                <Activity size={14} style={{ color: 'var(--color-success)' }} />
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Relawan Siap Beroperasi</h2>
                  <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>Tersedia dan sedang bertugas</p>
                </div>
              </div>
              <button
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                Semua <ArrowRight size={13} />
              </button>
            </div>

            {loading ? (
              <div className="px-4"><LoadingSpinner text="Memuat relawan..." /></div>
            ) : volunteers.length > 0 ? (
              <div className="divide-y divide-slate-100 px-4">
                {volunteers.map(vol => (
                  <VolunteerCard key={vol.id} relawan={vol} />
                ))}
              </div>
            ) : (
              <EmptyState title="Tidak ada relawan tersedia" description="Data relawan belum tersedia." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}