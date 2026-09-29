import { useState, useEffect } from 'react';
import {
  Search, Download, Calendar, Filter,
  ChevronLeft, ChevronRight, Eye, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import PageHeader from '../../components/global/PageHeader';
import { laporanService } from '../../api/services/laporanService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const ITEMS_PER_PAGE = 6;

export default function RiwayatKasusPage({ onOpenDetail }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        setLoading(true);
        // Mengambil laporan yang sudah selesai atau ditangani. Untuk demo kita get semua, nanti di filter
        const res = await laporanService.getLaporan();
        if (res && res.data) {
           const items = res.data?.data ?? res.data ?? [];
           const raw = Array.isArray(items) ? items : [];
           
           setRiwayatData(raw.map(k => ({
             id: `#${k.id}`,
             rawId: k.id,
             tanggal: k.waktu_laporan ? new Date(k.waktu_laporan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
             kategori: k.kategori_laporan || 'Laporan Darurat',
             pelapor: k.pengguna?.name || '—',
             disabilitas: k.pengguna?.kategori_user || '—',
             lokasi: k.lokasi_laporan || '—',
             relawan: k.relawan?.name || '—',
             durasi: '—', // Jika API belum ada info durasi
             status: k.status === 'selesai' ? 'Selesai' : k.status === 'batal' ? 'Dibatalkan' : k.status,
           })));
        }
      } catch (err) {
        console.error('Gagal memuat riwayat kasus:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRiwayat();
  }, []);

  const filtered = riwayatData.filter(r => {
    const matchStatus = statusFilter === 'Semua' || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.id.toLowerCase().includes(q) ||
      r.kategori.toLowerCase().includes(q) ||
      r.pelapor.toLowerCase().includes(q) ||
      r.lokasi.toLowerCase().includes(q) ||
      r.relawan.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFilter = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title="Riwayat Kasus"
        description="Telusuri seluruh riwayat laporan dan penanganan insiden yang telah selesai."
        actions={
          <button
            onClick={() => alert('Mengekspor data riwayat ke CSV...')}
            className="btn-base btn-secondary"
          >
            <Download size={13} />
            Ekspor CSV
          </button>
        }
      />

      {/* ── Filter Bar ── */}
      <div className="card-base p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Cari ID, pelapor, relawan, lokasi..."
              className="form-input"
              style={{ paddingLeft: 36, width: 280 }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex items-center gap-2 rounded-xl px-3"
              style={{ height: 40, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)' }}
            >
              <Calendar size={13} className="text-slate-400" />
              <select className="bg-transparent border-none outline-none cursor-pointer" style={{ fontSize: 'inherit', color: 'inherit' }}>
                <option>30 Hari Terakhir</option>
                <option>7 Hari Terakhir</option>
                <option>3 Bulan Terakhir</option>
              </select>
            </div>
            <div
              className="flex items-center gap-2 rounded-xl px-3"
              style={{ height: 40, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)' }}
            >
              <Filter size={13} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={e => handleFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer"
                style={{ fontSize: 'inherit', color: 'inherit' }}
              >
                <option>Semua</option>
                <option>Selesai</option>
                <option>Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card-base overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Memuat riwayat kasus..." />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Tidak ada riwayat ditemukan"
            description={search ? 'Coba ubah kata kunci pencarian.' : 'Belum ada riwayat kasus sesuai filter.'}
          />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Kasus</th>
                  <th>Tanggal</th>
                  <th>Kategori</th>
                  <th>Pelapor</th>
                  <th>Lokasi</th>
                  <th>Relawan</th>
                  <th>Durasi</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(row => (
                  <tr key={row.rawId || row.id}>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '0.01em' }}>
                        {row.id}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.tanggal}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', display: 'block', maxWidth: 200 }} className="truncate" title={row.kategori}>
                        {row.kategori}
                      </span>
                    </td>
                    <td>
                      <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text)' }}>{row.pelapor}</p>
                      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{row.disabilitas}</p>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', maxWidth: 200 }} className="truncate" title={row.lokasi}>
                        {row.lokasi}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 500, color: row.relawan !== '—' ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                        {row.relawan}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}>{row.durasi}</span>
                    </td>
                    <td>
                      {row.status === 'Selesai' ? (
                        <span className="badge badge-green">
                          <CheckCircle2 size={11} />
                          Selesai
                        </span>
                      ) : (
                        <span className="badge badge-slate">
                          <XCircle size={11} />
                          Dibatalkan
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => onOpenDetail?.(row.rawId || row.id)}
                        className="btn-base btn-secondary"
                        style={{ height: 32, padding: '0 10px', fontSize: 12 }}
                      >
                        <Eye size={12} />
                        Arsip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid var(--color-border-soft)' }}
        >
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Menampilkan {paginated.length} dari {filtered.length} riwayat
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-icon"
              style={{ width: 32, height: 32 }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className="flex items-center justify-center rounded-lg font-semibold transition-colors"
                style={{
                  width: 32, height: 32, fontSize: 12.5,
                  background: currentPage === i + 1 ? 'var(--color-primary)' : 'transparent',
                  color: currentPage === i + 1 ? 'white' : 'var(--color-text-muted)',
                  border: currentPage === i + 1 ? 'none' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-icon"
              style={{ width: 32, height: 32 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
