import { useState, useCallback } from 'react';
import {
  ArrowLeft, Phone, MapPin, Shield, CheckCircle2,
  AlertTriangle, Printer, ShieldAlert, Smartphone, Wifi, WifiOff,
  Battery, UserCheck, RefreshCw, Loader2, X, ChevronDown, ChevronUp,
  PhoneCall, MessageSquare, Volume2, Image as ImageIcon, FileText,
  ExternalLink, User, Maximize2, Clock, Navigation, Activity, Siren
} from 'lucide-react';
import Badge from '../../components/global/Badge';
import InitialsAvatar from '../../components/global/InitialsAvatar';
import DetailSosMap from '../../components/DetailSosMap';
import { useDetailKasus } from '../../hooks/detail-kasus/useDetailKasus';

// ─── Helper Format Tanggal & Waktu ───────────────────────────────────────────
function formatDateTime(dt) {
  if (!dt) return '—';
  try {
    return new Date(dt).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return String(dt);
  }
}

function formatRelativeTime(dt) {
  if (!dt) return '';
  try {
    const date = new Date(dt);
    const diffMs = Date.now() - date.getTime();
    if (Number.isNaN(diffMs) || diffMs < 0) return 'Baru saja';
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Baru saja';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay} hr lalu`;
    return '';
  } catch {
    return '';
  }
}

function getActivityMeta(log) {
  const action = String(log?.action || log?.jenis || '').toLowerCase();
  const desc = String(log?.description || log?.deskripsi || '').toLowerCase();

  // 1. Pemicu SOS / Status Darurat
  if (
    action.includes('sos_dipicu') ||
    action.includes('sos_triggered') ||
    action.includes('eskalasi') ||
    desc.includes('sinyal darurat sos') ||
    desc.includes('tombol darurat') ||
    desc.includes('darurat sos')
  ) {
    return {
      type: 'sos',
      nodeColor: 'bg-rose-500 text-white ring-4 ring-rose-100 shadow-xs shadow-rose-500/20',
      lineColor: 'bg-rose-200',
      cardClass: 'border-rose-200/90 bg-gradient-to-br from-rose-50/60 to-white hover:border-rose-300',
      headerClass: 'border-rose-100/80',
      icon: <Siren size={13} className="animate-pulse" />,
    };
  }

  // 2. Relawan Bertugas / Respon Lapangan
  if (
    action.includes('relawan') ||
    action.includes('dispatch') ||
    action.includes('tangani') ||
    desc.includes('menerima tugas') ||
    desc.includes('menuju lokasi') ||
    desc.includes('relawan')
  ) {
    return {
      type: 'relawan',
      nodeColor: 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-xs shadow-amber-500/20',
      lineColor: 'bg-amber-200',
      cardClass: 'border-amber-200/90 bg-gradient-to-br from-amber-50/50 to-white hover:border-amber-300',
      headerClass: 'border-amber-100/80',
      icon: <Navigation size={12} className="fill-white" />,
    };
  }

  // 3. Selesai / Tuntas
  if (
    action.includes('selesai') ||
    action.includes('tuntas') ||
    desc.includes('selesai') ||
    desc.includes('tuntas') ||
    desc.includes('dievakuasi')
  ) {
    return {
      type: 'selesai',
      nodeColor: 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-xs shadow-emerald-600/20',
      lineColor: 'bg-emerald-200',
      cardClass: 'border-emerald-200/90 bg-gradient-to-br from-emerald-50/50 to-white hover:border-emerald-300',
      headerClass: 'border-emerald-100/80',
      icon: <CheckCircle2 size={13} />,
    };
  }

  // 4. Panggilan Suara / Hubungi
  if (
    action.includes('telepon') ||
    action.includes('wa') ||
    action.includes('chat') ||
    desc.includes('telepon') ||
    desc.includes('whatsapp') ||
    desc.includes('hubungi')
  ) {
    return {
      type: 'kontak',
      nodeColor: 'bg-sky-500 text-white ring-4 ring-sky-100 shadow-xs shadow-sky-500/20',
      lineColor: 'bg-sky-200',
      cardClass: 'border-sky-200/90 bg-gradient-to-br from-sky-50/50 to-white hover:border-sky-300',
      headerClass: 'border-sky-100/80',
      icon: <PhoneCall size={12} />,
    };
  }

  // 5. Pembatalan
  if (action.includes('batal') || desc.includes('batal')) {
    return {
      type: 'batal',
      nodeColor: 'bg-slate-400 text-white ring-4 ring-slate-100',
      lineColor: 'bg-slate-200',
      cardClass: 'border-slate-200 bg-slate-50/60 hover:border-slate-300',
      headerClass: 'border-slate-200/60',
      icon: <X size={13} />,
    };
  }

  // 6. Default Aktivitas Sistem / Operasional
  return {
    type: 'default',
    nodeColor: 'bg-[#0b6f61] text-white ring-4 ring-emerald-100 shadow-xs shadow-[#0b6f61]/20',
    lineColor: 'bg-slate-200',
    cardClass: 'border-slate-200/90 bg-white hover:border-slate-300',
    headerClass: 'border-slate-100',
    icon: <Activity size={12} />,
  };
}

function getRoleMeta(role, actorName) {
  const r = String(role || '').toLowerCase().trim();
  const a = String(actorName || '').toLowerCase().trim();

  if (r.includes('relawan') || a.includes('relawan')) {
    return {
      label: 'Relawan',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      avatarBg: 'bg-emerald-700',
    };
  }

  if (r.includes('pengguna') || r.includes('user') || r.includes('korban') || r.includes('pelapor')) {
    return {
      label: 'Pengguna',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      avatarBg: 'bg-sky-600',
    };
  }

  if (r.includes('admin') || a.includes('admin') || r.includes('petugas')) {
    return {
      label: 'Admin',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      avatarBg: 'bg-purple-600',
    };
  }

  return {
    label: role ? (String(role).charAt(0).toUpperCase() + String(role).slice(1)) : 'Sistem',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    avatarBg: 'bg-slate-500',
  };
}

// ─── Sub-component: Feedback Toast ───────────────────────────────────────────
function FeedbackToast({ feedback }) {
  if (!feedback) return null;
  const isSuccess = feedback.type === 'success';
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-xl border text-[12px] font-bold transition-all animate-fade-in
      ${isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}
    >
      {isSuccess ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
      <span>{feedback.message}</span>
    </div>
  );
}

// ─── Sub-component: Modal Konfirmasi Selesai ──────────────────────────────────
function SelesaiModal({ kasus, catatanSelesai, setCatatanSelesai, loadingSelesai, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-4 animate-scale-up">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-black text-slate-900">Selesaikan Kasus?</h3>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              Tindakan ini akan menandai kasus tuntas dan mencatat hasil penanganan ke riwayat.
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer">
            <X size={14} />
          </button>
        </div>

        {/* Ringkasan Kasus */}
        <div className="bg-slate-50 rounded-xl p-3 space-y-1 text-[11.5px] border border-slate-100">
          <p className="font-bold text-slate-800">Kasus #{kasus?.id} &middot; {kasus?.kategori_laporan || 'Darurat'}</p>
          <p className="text-slate-500">Pelapor: <span className="font-semibold text-slate-700">{kasus?.pengguna?.name || '—'}</span></p>
          <p className="text-slate-500">Relawan: <span className="font-semibold text-slate-700">{kasus?.relawan?.name || 'Admin Langsung'}</span></p>
        </div>

        {/* Catatan Selesai */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Catatan Penanganan Petugas
          </label>
          <textarea
            rows={3}
            value={catatanSelesai}
            onChange={(e) => setCatatanSelesai(e.target.value)}
            placeholder="Contoh: Korban berhasil dievakuasi ke RSUD terdekat dalam kondisi stabil."
            className="w-full text-[12px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0b6f61] outline-none resize-none"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="btn-base btn-secondary text-[12px] h-8.5 flex-1">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loadingSelesai}
            className="btn-base btn-primary text-[12px] h-8.5 flex-1"
          >
            {loadingSelesai ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
            <span>{loadingSelesai ? 'Menyimpan...' : 'Tandai Selesai'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Lightbox Foto Bukti ────────────────────────────────────────
function ImageLightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-zoom-out"
    >
      <div className="relative max-w-4xl max-h-[90vh] bg-black/40 rounded-2xl overflow-hidden p-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer"
        >
          <X size={16} />
        </button>
        <img src={src} alt="Bukti Laporan Penuh" className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain mx-auto" />
      </div>
    </div>
  );
}

// ─── Sub-component: Panel Quick Dispatch Relawan ──────────────────────────────
function QuickDispatchInline({
  relawanList, loadingRelawan, selectedRelawanId, setSelectedRelawanId,
  loadingDispatch, onConfirm, onClose
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 animate-fade-in">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
        <span>Pilih Relawan Terdekat:</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
          <X size={12} />
        </button>
      </div>

      {loadingRelawan ? (
        <div className="flex items-center gap-2 py-3 text-slate-500 text-[11px]">
          <Loader2 size={13} className="animate-spin text-[#0b6f61]" />
          <span>Mencari relawan di sekitar lokasi...</span>
        </div>
      ) : relawanList.length === 0 ? (
        <p className="text-[11px] text-slate-400 italic py-1">Tidak ada relawan yang terdeteksi di radius tugas.</p>
      ) : (
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {relawanList.map(vol => {
            const isSelected = selectedRelawanId === vol.id;
            const name = vol.name || vol.nama || `Relawan #${vol.id}`;
            const jarak = vol.jarak_text && vol.jarak_text !== '-'
              ? vol.jarak_text
              : (vol.jarak_km ? `${vol.jarak_km} km` : 'Area Siaga');

            return (
              <button
                key={vol.id}
                type="button"
                onClick={() => setSelectedRelawanId(vol.id)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer text-[11px]
                  ${isSelected
                    ? 'border-[#0b6f61] bg-emerald-50/80 ring-1 ring-[#0b6f61]'
                    : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <InitialsAvatar name={name} src={vol.foto_profile || vol.foto_url} size={24} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{vol.kompetensi || 'Relawan Siaga'} &middot; {jarak}</p>
                </div>
                <Badge
                  variant={vol.status === 'sedang_bertugas' || vol.status === 'bertugas' ? 'Sedang Bertugas' : 'Online'}
                  isPill
                  className="scale-90"
                />
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onConfirm}
        disabled={!selectedRelawanId || loadingDispatch}
        className="btn-base btn-primary text-[11px] h-7.5 w-full justify-center disabled:opacity-50"
      >
        {loadingDispatch ? <Loader2 size={12} className="animate-spin" /> : <UserCheck size={12} />}
        <span>{loadingDispatch ? 'Menugaskan...' : 'Konfirmasi Penugasan'}</span>
      </button>
    </div>
  );
}

// ─── Main Component: Detail Kasus Command Center ──────────────────────────────
export default function DetailKasusPage() {
  const {
    kasus,
    activities,
    relawanList,
    loadingKasus,
    loadingActivities,
    loadingRelawan,
    loadingDispatch,
    loadingSelesai,
    loadingTangani,
    errorKasus,
    selectedRelawanId,
    setSelectedRelawanId,
    showDispatchPanel,
    setShowDispatchPanel,
    showSelesaiModal,
    setShowSelesaiModal,
    catatanSelesai,
    setCatatanSelesai,
    feedback,
    navigate,
    fetchKasus,
    handleDispatch,
    handleTanganiKasus,
    handleSelesai,
    handleLogAksi,
    handleOpenDispatchPanel,
  } = useDetailKasus();

  const [previewImage, setPreviewImage] = useState(null);
  const [rightTab, setRightTab] = useState('log'); // 'log' | 'catatan'

  const handleSelectRelawan = useCallback((volId) => {
    setSelectedRelawanId(volId);
    setShowDispatchPanel(true);
  }, [setSelectedRelawanId, setShowDispatchPanel]);

  const isSos = kasus?._tipe === 'sos' ||
    kasus?.kategori === 'SOS' ||
    kasus?.kategori_laporan?.toLowerCase().includes('sos') ||
    kasus?.jenis_laporan?.toLowerCase().includes('sos');
  const pengguna = kasus?.pengguna ?? null;
  const kontakDarurat = Array.isArray(pengguna?.kontak_darurat) ? pengguna.kontak_darurat : [];
  const relawanBertugas = kasus?.relawan ?? null;
  const isSelesai = kasus?.status === 'selesai' || kasus?.status === 'batal';

  // Tema warna dinamis header berdasarkan status kasus:
  // - Ditangani: Kuning (Amber)
  // - Belum Ditangani: Merah (Rose)
  // - Selesai: Hijau (Emerald)
  const statusRaw = (kasus?.status || '').toLowerCase().trim();
  const isDitangani = statusRaw === 'ditangani' || statusRaw === 'proses' || statusRaw === 'sedang ditangani';
  const isBelumDitangani = statusRaw === 'belum ditangani' || statusRaw === 'menunggu';
  const isKasusSelesai = statusRaw === 'selesai' || statusRaw === 'batal';

  const headerTheme = (() => {
    if (isBelumDitangani) {
      return {
        card: 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-xs shadow-rose-500/5',
        backBtn: 'border-rose-200 bg-white hover:bg-rose-100/70 text-rose-700',
        divider: 'bg-rose-200/80',
        title: 'text-rose-950',
        time: 'text-rose-700/80',
        printBtn: 'border-rose-200 bg-white hover:bg-rose-100/70 text-rose-800',
      };
    }
    if (isDitangani) {
      return {
        card: 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs shadow-amber-500/5',
        backBtn: 'border-amber-200 bg-white hover:bg-amber-100/70 text-amber-800',
        divider: 'bg-amber-200/80',
        title: 'text-amber-950',
        time: 'text-amber-800/80',
        printBtn: 'border-amber-200 bg-white hover:bg-amber-100/70 text-amber-800',
      };
    }
    if (isKasusSelesai) {
      return {
        card: 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-xs shadow-emerald-500/5',
        backBtn: 'border-emerald-200 bg-white hover:bg-emerald-100/70 text-emerald-700',
        divider: 'bg-emerald-200/80',
        title: 'text-emerald-950',
        time: 'text-emerald-700/80',
        printBtn: 'border-emerald-200 bg-white hover:bg-emerald-100/70 text-emerald-800',
      };
    }
    return {
      card: 'bg-white border-slate-200 text-slate-900 shadow-xs',
      backBtn: 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600',
      divider: 'bg-slate-200',
      title: 'text-slate-900',
      time: 'text-slate-400',
      printBtn: 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700',
    };
  })();

  // ─── Loading Screen ─────────────────────────────────────────────────────────
  if (loadingKasus) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] gap-3 text-slate-500">
        <Loader2 size={26} className="animate-spin text-[#0b6f61]" />
        <p className="text-[13px] font-bold">Memuat konsol komando kasus...</p>
      </div>
    );
  }

  // ─── Error Screen ───────────────────────────────────────────────────────────
  if (errorKasus || !kasus) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] gap-4 text-slate-500 p-6">
        <AlertTriangle size={36} className="text-rose-500" />
        <p className="text-[14px] font-bold text-slate-800">{errorKasus || 'Data kasus tidak ditemukan.'}</p>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="btn-base btn-secondary text-[12px] h-8.5">
            <ArrowLeft size={13} /> Kembali
          </button>
          <button onClick={fetchKasus} className="btn-base btn-primary text-[12px] h-8.5">
            <RefreshCw size={13} /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-h-[calc(100vh-130px)] min-h-[580px] w-full gap-2.5 overflow-hidden text-slate-800 animate-fade-in">
      <FeedbackToast feedback={feedback} />
      {previewImage && <ImageLightbox src={previewImage} onClose={() => setPreviewImage(null)} />}
      {showSelesaiModal && (
        <SelesaiModal
          kasus={kasus}
          catatanSelesai={catatanSelesai}
          setCatatanSelesai={setCatatanSelesai}
          loadingSelesai={loadingSelesai}
          onConfirm={handleSelesai}
          onClose={() => setShowSelesaiModal(false)}
        />
      )}

      {/* ── ROW 1: Command Bar Header (Height: ~52px) ────────────────────────── */}
      <header className={`flex-shrink-0 border rounded-2xl px-4 py-2.5 transition-colors flex items-center justify-between gap-3 ${headerTheme.card}`}>
        {/* Left: Identitas & Status */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${headerTheme.backBtn}`}
            title="Kembali ke Daftar Kasus Aktif"
          >
            <ArrowLeft size={15} />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1.5 flex-shrink-0 ${
              isSos
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-sky-100 text-sky-700 border border-sky-200'
            }`}>
              {isSos && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />}
              {kasus.id_kasus || kasus.nomor_kasus || (isSos ? `SOS #${kasus.id}` : `LAPORAN #${kasus.id}`)}
            </span>

            <Badge variant={kasus.status} isPill showDot />

            {kasus.urgensi && (
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Urgensi: {kasus.urgensi}
              </span>
            )}

            <div className={`h-4 w-px hidden md:block ${headerTheme.divider}`} />

            <h1 className={`text-[14px] font-black truncate hidden md:block ${headerTheme.title}`}>
              {kasus.kategori_laporan || (isSos ? 'Panggilan Darurat SOS' : 'Laporan Kejadian')}
            </h1>

            <span className={`text-[11px] hidden xl:inline truncate ${headerTheme.time}`}>
              &middot; {formatDateTime(kasus.waktu_laporan)}
            </span>
          </div>
        </div>

        {/* Right: Quick Operational Action Toolbar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => window.print()}
            className={`btn-base text-[11px] h-8 px-2.5 hidden sm:inline-flex ${headerTheme.printBtn}`}
            title="Cetak Berkas Kasus"
          >
            <Printer size={12} />
            <span>Cetak</span>
          </button>

          {!isSelesai && !relawanBertugas && (
            <button
              onClick={() => handleTanganiKasus('Kasus diambil alih penanganannya oleh Admin.')}
              disabled={loadingTangani}
              className="btn-base btn-secondary text-[11px] h-8 px-2.5 text-[#0b6f61] border-emerald-200 hover:bg-emerald-50"
            >
              {loadingTangani ? <Loader2 size={12} className="animate-spin" /> : <UserCheck size={12} />}
              <span>Ambil Alih Kasus</span>
            </button>
          )}

          {!isSelesai && (
            <button
              onClick={() => setShowSelesaiModal(true)}
              className="btn-base btn-primary text-[11px] h-8 px-3"
            >
              <CheckCircle2 size={12} />
              <span>Selesaikan Kasus</span>
            </button>
          )}
        </div>
      </header>

      {/* ── ROW 2: 3-Column Command Grid (Takes All Remaining Height) ───────── */}
      <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-2.5">

        {/* ═════════ KOLOM 1: KORBAN & AKSESIBILITAS (4 cols) ═════════ */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-2.5 min-h-0 overflow-hidden">

          {/* Subcard 1: Identitas & Kebutuhan Korban */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User size={13} className="text-[#0b6f61]" />
                Profil Pelapor / Korban
              </span>
              {pengguna?.kategori_user && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  {pengguna.kategori_user}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <InitialsAvatar name={pengguna?.name || 'Korban'} src={pengguna?.foto_url} size={42} />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-black text-slate-900 truncate">{pengguna?.name || 'Anonim'}</p>
                <p className="text-[11px] text-slate-400 truncate">{pengguna?.email || 'Tidak ada email'}</p>
                <p className="text-[11px] font-semibold text-slate-600 mt-0.5">{pengguna?.no_telp || 'No HP —'}</p>
              </div>
            </div>

            {/* Inklusi: Metode Komunikasi & Disabilitas */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Metode Komunikasi</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {pengguna?.metode_komunikasi || 'Standar (Suara/Teks)'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Kebutuhan Akses</span>
                <span className="font-semibold text-slate-800">
                  {pengguna?.kebutuhan_aksesibilitas || 'Bantuan umum'}
                </span>
              </div>
            </div>

            {/* Riwayat Medis Korban (Penting untuk Penanganan) */}
            {pengguna?.keterangan_medis && (
              <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl text-[11px]">
                <span className="font-bold text-rose-800 flex items-center gap-1 text-[10px] uppercase">
                  <ShieldAlert size={12} />
                  Catatan Medis Khusus:
                </span>
                <p className="text-rose-900 font-semibold mt-0.5 leading-snug">
                  {pengguna.keterangan_medis}
                </p>
              </div>
            )}
          </div>

          {/* Subcard 2: Kontak Darurat & Eskalasi Cepat */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex-1 min-h-0 flex flex-col justify-between">
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <PhoneCall size={13} className="text-emerald-600" />
                  Kontak Darurat Keluarga ({kontakDarurat.length})
                </span>
              </div>

              {/* Scrollable list kontak keluarga */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 py-2">
                {kontakDarurat.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic py-2">
                    Tidak ada kontak darurat keluarga yang didaftarkan korban.
                  </p>
                ) : (
                  kontakDarurat.map((k, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 truncate">{k.nama || 'Keluarga'}</span>
                          {k.is_utama && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{k.hubungan || 'Kerabat'} &middot; {k.no_telp || '—'}</p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        {k.whatsapp_url && (
                          <a
                            href={k.whatsapp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleLogAksi(`WhatsApp Kontak Darurat (${k.nama})`)}
                            className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                            title={`Chat WhatsApp ke ${k.nama}`}
                          >
                            <MessageSquare size={12} />
                          </a>
                        )}
                        {k.no_telp && (
                          <a
                            href={`tel:${k.no_telp}`}
                            onClick={() => handleLogAksi(`Telepon Kontak Darurat (${k.nama})`)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                            title={`Panggil Telepon ${k.nama}`}
                          >
                            <Phone size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Eskalasi Cepat ke Medis/Ambulans */}
            <div className="pt-2 border-t border-slate-100 flex-shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Eskalasi Hotline Darurat:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => { handleLogAksi('Eskalasi Medis (119)'); window.location.href = 'tel:119'; }}
                  className="btn-base btn-danger text-[11px] h-7.5 justify-center"
                >
                  <ShieldAlert size={12} />
                  <span>Medis (119)</span>
                </button>
                <button
                  onClick={() => { handleLogAksi('Ambulans (118)'); window.location.href = 'tel:118'; }}
                  className="btn-base btn-secondary text-[11px] h-7.5 justify-center"
                >
                  <PhoneCall size={12} />
                  <span>Ambulans (118)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════ KOLOM 2: INSIDEN, LOKASI & BUKTI MEDIA (4 cols) ════════ */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-2.5 min-h-0 overflow-hidden">

          {/* Subcard 1: Lokasi & Deskripsi Kejadian */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex-shrink-0 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin size={13} className="text-rose-500" />
                Lokasi &amp; Informasi Kejadian
              </span>
              {(kasus.latitude || kasus.lat) && (kasus.longitude || kasus.lng) && (
                <a
                  href={`https://www.google.com/maps?q=${kasus.latitude ?? kasus.lat},${kasus.longitude ?? kasus.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10.5px] font-bold text-[#0b6f61] hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={10} />
                  Buka Maps
                </a>
              )}
            </div>

            <div>
              <p className="text-[12.5px] font-black text-slate-900 leading-snug">
                {kasus.lokasi_laporan || kasus.lokasi?.alamat || 'Lokasi Panggilan Darurat'}
              </p>
              {(kasus.latitude || kasus.lat) && (
                <p className="font-mono text-[10.5px] text-slate-400 mt-0.5">
                  Koordinat: {kasus.latitude ?? kasus.lat}, {kasus.longitude ?? kasus.lng}
                </p>
              )}
            </div>

            {kasus.deskripsi && (
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11.5px] text-slate-700 leading-relaxed max-h-20 overflow-y-auto">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Deskripsi Masalah:</span>
                {kasus.deskripsi}
              </div>
            )}
          </div>

          {/* Subcard 2: Peta Lokasi (Khusus SOS) ATAU Bukti Media Foto & Audio (Laporan Biasa) */}
          {isSos ? (
            <DetailSosMap
              kasus={kasus}
              relawanBertugas={relawanBertugas}
              relawanList={relawanList}
              onSelectRelawan={handleSelectRelawan}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText size={13} className="text-[#0b6f61]" />
                  Bukti Kejadian (Foto &amp; Audio)
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 py-2">
                {/* Foto Bukti Kejadian */}
                {kasus.foto_laporan_url ? (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <ImageIcon size={11} /> Foto Tempat Kejadian:
                    </span>
                    <div
                      onClick={() => setPreviewImage(kasus.foto_laporan_url)}
                      className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-28 cursor-pointer"
                    >
                      <img
                        src={kasus.foto_laporan_url}
                        alt="Bukti Kejadian"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1.5">
                        <Maximize2 size={13} />
                        <span>Perbesar Foto</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-[11px]">
                    Tidak ada foto bukti terlampir
                  </div>
                )}

                {/* Rekaman Suara Pelapor */}
                {kasus.rekam_suara_url ? (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <Volume2 size={11} /> Rekaman Suara Pelapor:
                    </span>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <audio controls className="w-full h-8 outline-none">
                        <source src={kasus.rekam_suara_url} />
                        Audio tidak didukung di browser ini.
                      </audio>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-[11px]">
                    Tidak ada rekaman audio terlampir
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subcard 3 (Khusus SOS): Telemetri Perangkat Korban */}
          {isSos && kasus.device_info && (
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex-shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <Smartphone size={12} className="text-[#0b6f61]" />
                Telemetri Ponsel Korban
              </span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <Battery size={13} className="text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Baterai</span>
                    <span className="font-black text-slate-800">
                      {kasus.device_info.battery_level != null ? `${kasus.device_info.battery_level}%` : '85%'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  {kasus.device_info.is_online ? (
                    <Wifi size={13} className="text-emerald-600 flex-shrink-0" />
                  ) : (
                    <WifiOff size={13} className="text-rose-500 flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Sinyal</span>
                    <span className={`font-black ${kasus.device_info.is_online ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {kasus.device_info.is_online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Perangkat</span>
                  <span className="font-mono font-bold text-slate-800 truncate block text-[10px]">
                    {kasus.device_info.device_id || 'Android POS'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═════════ KOLOM 3: RESPON RELAWAN & LINIMASA KONSOL (4 cols) ═══════ */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-2.5 min-h-0 overflow-hidden">

          {/* Subcard 1: Unit Relawan Bertugas / Dispatch Inline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex-shrink-0 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield size={13} className="text-[#0b6f61]" />
                Penugasan Relawan
              </span>
              {relawanBertugas && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Sedang Menuju Lokasi
                </span>
              )}
            </div>

            {relawanBertugas ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <InitialsAvatar name={relawanBertugas.name} src={relawanBertugas.foto_url} size={36} bgClass="bg-emerald-700" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-black text-slate-900 truncate">{relawanBertugas.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{relawanBertugas.kompetensi || relawanBertugas.role_title || 'Relawan Tanggap Darurat'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {relawanBertugas.no_telp && (
                    <a
                      href={`tel:${relawanBertugas.no_telp}`}
                      onClick={() => handleLogAksi(`Telepon Relawan (${relawanBertugas.name})`)}
                      className="btn-base btn-primary text-[11px] h-7.5 flex-1 justify-center"
                    >
                      <Phone size={12} />
                      <span>Hubungi Relawan</span>
                    </a>
                  )}
                  {!isSelesai && (
                    <button
                      onClick={() => setShowDispatchPanel(!showDispatchPanel)}
                      className="btn-base btn-secondary text-[11px] h-7.5 px-2.5 justify-center"
                    >
                      {showDispatchPanel ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      <span>Ganti</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11.5px] text-amber-800 flex items-center justify-between">
                  <span>Belum ada relawan ditugaskan</span>
                  {!isSelesai && (
                    <button
                      onClick={handleOpenDispatchPanel}
                      className="btn-base btn-primary text-[10.5px] h-6 px-2"
                    >
                      <UserCheck size={11} />
                      Tugaskan
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Dispatch Panel Drawer */}
            {showDispatchPanel && !isSelesai && (
              <QuickDispatchInline
                relawanList={relawanList}
                loadingRelawan={loadingRelawan}
                selectedRelawanId={selectedRelawanId}
                setSelectedRelawanId={setSelectedRelawanId}
                loadingDispatch={loadingDispatch}
                onConfirm={handleDispatch}
                onClose={() => { setShowDispatchPanel(false); setSelectedRelawanId(null); }}
              />
            )}
          </div>

          {/* Subcard 2: Tabbed Console Panel (Log Aktivitas & Catatan Petugas) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Tab Header Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl flex-shrink-0 mb-2">
              <button
                onClick={() => setRightTab('log')}
                className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                  rightTab === 'log' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Log Aktivitas ({activities.length})
              </button>
              <button
                onClick={() => setRightTab('catatan')}
                className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                  rightTab === 'catatan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Catatan Tim ({kasus.catatan_penanganan?.length || 0})
              </button>
            </div>

            {/* Tab 1: Activity Log Timeline (Internal Scroll) */}
            {rightTab === 'log' && (
              <div className="flex-1 min-h-0 overflow-y-auto pl-2 pr-1.5 py-1.5 space-y-0">
                {loadingActivities ? (
                  <div className="flex items-center gap-2 py-8 text-slate-400 text-[11px] justify-center">
                    <Loader2 size={14} className="animate-spin text-[#0b6f61]" />
                    <span>Memuat linimasa aktivitas...</span>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="py-8 text-center space-y-1">
                    <Activity size={20} className="mx-auto text-slate-300" />
                    <p className="text-[11px] text-slate-400 italic">
                      Belum ada riwayat aktivitas yang tercatat untuk kasus ini.
                    </p>
                  </div>
                ) : (
                  activities.map((log, idx) => {
                    const actor = log.actor || log.aktor || 'Sistem';
                    const role = log.role || log.role_aktor;
                    const description = log.description || log.deskripsi || log.action || log.jenis;
                    const timestamp = log.created_at || log.waktu;
                    const meta = getActivityMeta(log);
                    const roleMeta = getRoleMeta(role, actor);
                    const relativeTime = formatRelativeTime(timestamp);
                    const isLast = idx === activities.length - 1;

                    return (
                      <div key={idx} className="relative flex items-start gap-2.5 text-[11px] group">
                        {/* Timeline Left Track: Node + Vertical Connector */}
                        <div className="w-8 flex flex-col items-center flex-shrink-0 self-stretch pt-0.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${meta.nodeColor}`}>
                            {meta.icon}
                          </div>
                          {!isLast && (
                            <div className="w-0.5 bg-slate-200 flex-1 my-1" style={{ minHeight: 18 }} />
                          )}
                        </div>

                        {/* Timeline Right: Polished Event Card */}
                        <div className={`flex-1 min-w-0 rounded-xl p-2.5 border shadow-2xs transition-all hover:shadow-xs mb-2.5 ${meta.cardClass}`}>
                          {/* Top Row: Actor Avatar + Name + Role Badge + Relative Time */}
                          <div className={`flex items-center justify-between gap-1.5 pb-1.5 border-b ${meta.headerClass}`}>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <InitialsAvatar
                                name={actor}
                                size={18}
                                bgClass={roleMeta.avatarBg}
                              />
                              <span className="font-bold text-slate-800 text-[11.5px] truncate" title={actor}>
                                {actor}
                              </span>
                              <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap leading-none ${roleMeta.badgeClass}`}>
                                {roleMeta.label}
                              </span>
                            </div>

                            {relativeTime && (
                              <span className="text-[9.5px] font-medium text-slate-400 whitespace-nowrap flex-shrink-0">
                                {relativeTime}
                              </span>
                            )}
                          </div>

                          {/* Event Message */}
                          <p className="text-slate-700 text-[11px] font-medium leading-relaxed mt-1.5">
                            {description}
                          </p>

                          {/* Event Timestamp */}
                          <div className="flex items-center gap-1 text-[9.5px] text-slate-400 mt-2 pt-1 border-t border-slate-100/80">
                            <Clock size={10} className="text-slate-400 flex-shrink-0" />
                            <span>{formatDateTime(timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 2: Catatan Penanganan Tim Petugas (Internal Scroll) */}
            {rightTab === 'catatan' && (
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 py-1">
                {!kasus.catatan_penanganan || kasus.catatan_penanganan.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-6">
                    Belum ada catatan penanganan yang ditulis petugas.
                  </p>
                ) : (
                  kasus.catatan_penanganan.map((catatan, i) => (
                    <div key={i} className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-1.5 text-[11px] hover:border-slate-300 transition-all shadow-2xs">
                      <div className="flex items-center justify-between gap-1 pb-1 border-b border-slate-100">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <InitialsAvatar
                            name={catatan.admin?.name || 'Petugas Admin'}
                            size={18}
                            bgClass="bg-[#0b6f61]"
                          />
                          <span className="font-bold text-slate-800 text-[11px] truncate">
                            {catatan.admin?.name || 'Petugas Admin'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[9.5px] text-slate-400 flex-shrink-0">
                          <Clock size={10} />
                          <span>{formatDateTime(catatan.created_at)}</span>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-snug whitespace-pre-wrap text-[11px]">
                        {catatan.catatan}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

