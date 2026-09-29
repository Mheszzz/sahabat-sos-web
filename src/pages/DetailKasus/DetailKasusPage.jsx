import { useState, useEffect } from 'react';
import {
  ArrowLeft, Phone, MapPin, User, Shield, Ambulance,
  Clock, CheckCircle2, AlertTriangle, MessageSquare, Printer, ShieldAlert,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { laporanService } from '../../api/services/laporanService';

const timelineSteps = [
  { label: 'Sinyal SOS Diterima', time: '14:27:02', done: true, active: false },
  { label: 'Sistem Menetapkan Relawan', time: '14:27:45', done: true, active: false },
  { label: 'Relawan Mengonfirmasi', time: '14:28:10', done: true, active: false },
  { label: 'Ambulans Diberangkatkan', time: '14:29:05', done: true, active: false },
  { label: 'Relawan Menuju Lokasi', time: '14:30:12', done: false, active: true },
  { label: 'Kasus Ditutup & Evaluasi Medis', time: '—', done: false, active: false },
];

function InfoRow({ label, value, valueColor = 'var(--color-text)' }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-text-muted)', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 13.5, fontWeight: 600, color: valueColor }}>{value || '—'}</p>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="card-base overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
        {Icon && <Icon size={15} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />}
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function DetailKasusPage({ kasusId, onBack }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseId = kasusId ?? id;
  const handleBack = onBack ?? (() => navigate(-1));
  const [kasus, setKasus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!caseId) { setLoading(false); return; }
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError('');
        // kasusId bisa berformat "#123" atau "123" atau integer
        const normalizedId = String(caseId).replace(/^#/, '');
        const res = await laporanService.getDetailLaporan(normalizedId);
        const data = res?.data ?? res;
        setKasus(data);
      } catch (err) {
        console.error('Gagal mengambil detail kasus:', err);
        setError('Gagal memuat detail kasus. Coba lagi atau periksa koneksi backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [caseId]);

  const handleSelesaikan = async () => {
    if (!kasus) return;
    const id = String(caseId).replace(/^#/, '');
    if (!window.confirm('Tandai kasus ini sebagai selesai?')) return;
    try {
      setResolving(true);
      await laporanService.updateStatus(id, 'selesai');
      setKasus(prev => ({ ...prev, status: 'selesai' }));
      alert('Kasus berhasil diselesaikan.');
    } catch (err) {
      alert('Gagal memperbarui status kasus.');
    } finally {
      setResolving(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="page-shell flex items-center justify-center" style={{ minHeight: 400 }}>
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={28} className="animate-spin" />
          <p style={{ fontSize: 13, fontWeight: 500 }}>Memuat detail kasus...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !kasus) {
    return (
      <div className="page-shell space-y-4">
        <button onClick={handleBack} className="btn-base btn-secondary">
          <ArrowLeft size={14} /> Kembali
        </button>
        <div className="card-base p-6 flex items-center gap-3"
          style={{ border: '1px solid var(--color-danger-border)', background: 'var(--color-danger-light)' }}>
          <AlertTriangle size={16} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-danger)' }}>
            {error || 'Data kasus tidak ditemukan.'}
          </p>
        </div>
      </div>
    );
  }

  // ── Normalize data dari API ──
  const pelapor = {
    nama:       kasus.pengguna?.name        || kasus.pelapor?.nama   || '—',
    disabilitas:kasus.pengguna?.kategori_user || kasus.pelapor?.disabilitas || '—',
    kontak:     kasus.pengguna?.no_telp     || kasus.pelapor?.kontak  || '—',
  };
  const relawan = {
    nama:  kasus.relawan?.name   || kasus.relawan?.nama  || null,
    peran: kasus.relawan?.role_title || 'Relawan',
    kontak:kasus.relawan?.no_telp || '—',
  };
  const kasusId_clean  = `#${String(caseId).replace(/^#/, '')}`;
  const kategori       = kasus.kategori_laporan || kasus.kategori || 'Laporan Darurat';
  const lokasi         = kasus.lokasi_laporan   || kasus.lokasi   || '—';
  const waktuMasuk     = kasus.waktu_laporan
    ? new Date(kasus.waktu_laporan).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  const statusLabel = kasus.status === 'aktif' ? 'SOS Aktif'
    : kasus.status === 'proses'   ? 'Ditangani'
    : kasus.status === 'selesai'  ? 'Selesai'
    : kasus.status || 'Aktif';

  const statusCls = kasus.status === 'aktif' || kasus.status === 'SOS Darurat'
    ? 'badge badge-red'
    : kasus.status === 'selesai' ? 'badge badge-green'
    : 'badge badge-blue';

  const isSelesai = kasus.status === 'selesai';

  return (
    <div className="page-shell space-y-5">

      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={handleBack} className="btn-icon flex-shrink-0" title="Kembali">
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
                {kasusId_clean}
              </span>
              <span className={statusCls}>{statusLabel}</span>
              {kasus.prioritas && (
                <span className="badge" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', border: '1px solid var(--color-danger-border)' }}>
                  {kasus.prioritas}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginTop: 4, lineHeight: 1.25 }}>
              {kategori}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => window.print()} className="btn-base btn-secondary">
            <Printer size={13} /> Cetak
          </button>
          {!isSelesai && (
            <button
              onClick={handleSelesaikan}
              disabled={resolving}
              className="btn-base btn-primary"
            >
              {resolving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Selesaikan Kasus
            </button>
          )}
        </div>
      </div>

      {/* ── Two Column Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-5 items-start">

        {/* LEFT */}
        <div className="space-y-5">
          <SectionCard title="Profil Pelapor & Kebutuhan Khusus" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow label="Nama Pelapor" value={pelapor.nama} />
              <InfoRow label="Disabilitas / Kondisi" value={pelapor.disabilitas} valueColor="var(--color-primary)" />
              <InfoRow label="Kontak Ponsel" value={pelapor.kontak} />
              <InfoRow label="Waktu Masuk" value={waktuMasuk} />
            </div>
          </SectionCard>

          <SectionCard title="Titik Lokasi Kejadian" icon={MapPin}>
            <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--color-text)', marginBottom: 12 }}>
              {lokasi}
            </p>
            {kasus.catatan_lokasi && (
              <div className="rounded-xl p-3" style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-light)' }}>
                <p style={{ fontSize: 12, color: 'var(--color-primary-dark)' }}>
                  <strong>Catatan Akses:</strong> {kasus.catatan_lokasi}
                </p>
              </div>
            )}
          </SectionCard>

          {/* Timeline */}
          <SectionCard title="Linimasa Tanggap Darurat" icon={Clock}>
            <div className="space-y-0">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center" style={{ width: 24, flexShrink: 0 }}>
                    <div
                      className="flex items-center justify-center rounded-full text-white font-bold"
                      style={{
                        width: 22, height: 22, flexShrink: 0, fontSize: 9,
                        background: step.done ? 'var(--color-success)' : step.active ? 'var(--color-info)' : 'var(--color-border)',
                        color: step.done || step.active ? 'white' : 'var(--color-text-muted)',
                        animation: step.active ? 'pulseSoft 1.5s ease-in-out infinite' : 'none',
                      }}
                    >
                      {step.done ? '✓' : idx + 1}
                    </div>
                    {idx < timelineSteps.length - 1 && (
                      <div style={{ width: 1.5, flex: 1, minHeight: 20, margin: '2px 0', background: step.done ? 'var(--color-success-border)' : 'var(--color-border)' }} />
                    )}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <p style={{
                      fontSize: 13, fontWeight: 600,
                      color: step.active ? 'var(--color-info)' : step.done ? 'var(--color-text)' : 'var(--color-text-muted)',
                    }}>
                      {step.label}
                    </p>
                    <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          <SectionCard title="Relawan Terdekat" icon={Shield}>
            {relawan.nama ? (
              <>
                <div className="flex items-center gap-3 rounded-xl p-3 mb-4"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                    style={{ background: 'var(--color-info)' }}>
                    {relawan.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{relawan.nama}</p>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{relawan.peran}</p>
                    <span className="badge badge-green" style={{ marginTop: 6, display: 'inline-flex' }}>
                      Ditugaskan
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => alert(`Menghubungi ${relawan.nama} (${relawan.kontak})`)} className="btn-base btn-primary w-full" style={{ fontSize: 12.5 }}>
                    <Phone size={13} /> Telepon
                  </button>
                  <button onClick={() => alert(`Membuka chat ${relawan.nama}`)} className="btn-base btn-secondary w-full" style={{ fontSize: 12.5 }}>
                    <MessageSquare size={13} /> Pesan
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-xl p-3 text-center" style={{ background: 'var(--color-warning-light)', border: '1px solid var(--color-warning-border)' }}>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: '#92400E' }}>Belum ada relawan yang ditugaskan</p>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Eskalasi Darurat" icon={AlertTriangle}>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginBottom: 12 }}>
              Butuh bantuan medis atau aparat tambahan?
            </p>
            <div className="space-y-2">
              <button onClick={() => alert('Menghubungi Ambulans 118...')} className="btn-base btn-danger w-full" style={{ fontSize: 12.5 }}>
                <Ambulance size={14} /> Panggil Ambulans (118)
              </button>
              <button onClick={() => alert('Menghubungi Polisi 110...')} className="btn-base btn-secondary w-full" style={{ fontSize: 12.5 }}>
                <ShieldAlert size={14} /> Eskalasi ke Polisi (110)
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
