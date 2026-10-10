import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { laporanService } from '../../api/services/laporanService';
import { adminService } from '../../api/services/adminService';
import { kasusAktifService } from '../../api/services/kasusAktifService';

/**
 * Normalises different API response formats into a unified shape
 * expected by DetailKasusPage:
 *
 * From GET /laporan/{id}:
 *   raw.pengguna, raw.relawan, raw.kategori_laporan, raw.lokasi_laporan,
 *   raw.latitude, raw.longitude, raw.waktu_laporan, raw.status
 *
 * From GET /tugas-aktif/{tipe}/{id}:
 *   raw.pelapor (= pengguna), raw.relawan, raw.jenis_laporan, raw.lokasi.alamat,
 *   raw.lokasi.latitude, raw.lokasi.longitude, raw.waktu, raw.status_raw,
 *   raw.battery_level, raw.signal_strength, raw.device_info (SOS only)
 */
function normaliseKasus(raw, tipe) {
  if (!raw) return null;

  const isTugasAktifFormat = Boolean(raw.lokasi?.alamat !== undefined || raw.pelapor !== undefined || raw.jenis_laporan !== undefined);

  if (isTugasAktifFormat) {
    const pelapor = raw.pelapor ?? null;
    return {
      id:               raw.id,
      status:           raw.status_raw ?? raw.status,
      urgensi:          raw.urgensi ?? null,
      kategori_laporan: raw.jenis_laporan ?? raw.sub_judul ?? (tipe === 'sos' ? 'Darurat SOS' : 'Laporan'),
      deskripsi:        raw.deskripsi ?? '',
      lokasi_laporan:   raw.lokasi?.alamat ?? '',
      latitude:         raw.lokasi?.latitude ?? null,
      longitude:        raw.lokasi?.longitude ?? null,
      waktu_laporan:    raw.waktu ?? null,
      foto_laporan_url: raw.foto_laporan_url ?? null,
      rekam_suara_url:  raw.rekam_suara_url ?? null,
      pengguna: pelapor ? {
        id:                      pelapor.id,
        name:                    pelapor.name,
        email:                   pelapor.email ?? null,
        no_telp:                 pelapor.no_telp,
        foto_url:                pelapor.foto_profile ?? null,
        kategori_user:           pelapor.kategori_user ?? null,
        jenis_disabilitas:       pelapor.jenis_disabilitas ?? pelapor.kategori_user ?? null,
        metode_komunikasi:       pelapor.metode_komunikasi ?? null,
        kebutuhan_aksesibilitas: pelapor.kebutuhan_aksesibilitas ?? null,
        keterangan_medis:        pelapor.keterangan_medis ?? null,
        kontak_darurat:          Array.isArray(pelapor.kontak_darurat) ? pelapor.kontak_darurat : [],
      } : null,
      relawan: raw.relawan ? {
        id:       raw.relawan.id,
        name:     raw.relawan.name,
        no_telp:  raw.relawan.no_telp,
        foto_url: raw.relawan.foto_profile ?? null,
      } : null,
      // Device info: SOS hanya
      device_info: tipe === 'sos' ? {
        battery_level:       raw.battery_level ?? null,
        signal_strength:     raw.signal_strength ?? null,
        is_online:           raw.is_online ?? null,
        device_id:           raw.device_id ?? null,
        last_seen:           raw.last_seen ?? null,
        location_updated_at: raw.location_updated_at ?? null,
        ...(typeof raw.device_info === 'object' && raw.device_info !== null ? raw.device_info : {}),
      } : null,
      _tipe: tipe,
    };
  }

  // Format lama dari GET /laporan/{id} — Laporan Eloquent model langsung
  const pengguna = raw.pengguna ?? null;
  return {
    ...raw,
    pengguna: pengguna ? {
      ...pengguna,
      foto_url:          pengguna.foto_profile_url ?? pengguna.foto_url ?? null,
      jenis_disabilitas: pengguna.jenis_disabilitas ?? pengguna.kategori_user ?? null,
      kontak_darurat:    Array.isArray(pengguna.kontak_darurat) ? pengguna.kontak_darurat : [],
    } : null,
    relawan: raw.relawan ? {
      ...raw.relawan,
      foto_url: raw.relawan.foto_profile_url ?? raw.relawan.foto_url ?? null,
    } : null,
    _tipe: tipe ?? 'laporan',
  };
}

/**
 * useDetailKasus
 * Hook utama untuk halaman DetailKasusPage.
 * Mendukung dua tipe kasus:
 *   - 'laporan'  (default) → GET /laporan/{id}
 *   - 'sos'      (via ?tipe=sos) → GET /tugas-aktif/sos/{id}
 */
export function useDetailKasus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tipe = searchParams.get('tipe') ?? 'laporan'; // 'sos' | 'laporan'

  // --- Data State ---
  const [kasus, setKasus] = useState(null);
  const [relawanList, setRelawanList] = useState([]);
  const [activities, setActivities] = useState([]);

  // --- Loading State ---
  const [loadingKasus, setLoadingKasus] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingRelawan, setLoadingRelawan] = useState(false);
  const [loadingDispatch, setLoadingDispatch] = useState(false);
  const [loadingSelesai, setLoadingSelesai] = useState(false);

  // --- Error State ---
  const [errorKasus, setErrorKasus] = useState('');

  // --- UI State ---
  const [selectedRelawanId, setSelectedRelawanId] = useState(null);
  const [showDispatchPanel, setShowDispatchPanel] = useState(false);
  const [showSelesaiModal, setShowSelesaiModal] = useState(false);
  const [catatanSelesai, setCatatanSelesai] = useState('');

  // --- Feedback State ---
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // ─── Fetch Activities ──────────────────────────────────────────────────
  const fetchActivities = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingActivities(true);
      // Endpoint aktivitas tersedia untuk SOS; untuk laporan gunakan graceful fallback
      const res = await adminService.getSosActivities(id);
      const data = res?.data ?? res;
      setActivities(Array.isArray(data) ? data : []);
    } catch {
      // Laporan mungkin tidak punya endpoint activities — biarkan kosong
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, [id]);

  // ─── Fetch Detail Kasus ────────────────────────────────────────────────
  const fetchKasus = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingKasus(true);
      setErrorKasus('');

      let raw;
      if (tipe === 'sos') {
        // SOS: gunakan endpoint tugas-aktif agar dapat device_info & field lengkap
        const res = await kasusAktifService.getDetail('sos', id);
        raw = res?.data ?? res;
      } else {
        // Laporan: gunakan endpoint /laporan/{id} untuk field profil pengguna lengkap
        const res = await laporanService.getDetailLaporan(id);
        raw = res?.data ?? res;
      }

      setKasus(normaliseKasus(raw, tipe));
      await fetchActivities();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal memuat detail kasus.';
      setErrorKasus(msg);
      console.error('[useDetailKasus] fetchKasus:', err);
    } finally {
      setLoadingKasus(false);
    }
  }, [id, tipe, fetchActivities]);

  // ─── Fetch Relawan untuk Dispatch ─────────────────────────────────────
  const fetchRelawanDispatch = useCallback(async () => {
    try {
      setLoadingRelawan(true);
      const res = await adminService.getQuickDispatchRelawan();
      const items = res?.data ?? [];
      setRelawanList(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('[useDetailKasus] fetchRelawanDispatch:', err);
      setRelawanList([]);
    } finally {
      setLoadingRelawan(false);
    }
  }, []);

  // ─── Action: Dispatch Relawan ──────────────────────────────────────────
  const handleDispatch = async () => {
    if (!selectedRelawanId) return;
    try {
      setLoadingDispatch(true);
      // Gunakan endpoint /tugas-aktif/{tipe}/{id}/dispatch untuk handle SOS & Laporan
      await kasusAktifService.dispatchRelawan(tipe, id, selectedRelawanId);
      showFeedback('success', 'Relawan berhasil ditugaskan ke kasus ini.');
      setShowDispatchPanel(false);
      setSelectedRelawanId(null);
      await fetchKasus();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menugaskan relawan.';
      showFeedback('error', msg);
      console.error('[useDetailKasus] handleDispatch:', err);
    } finally {
      setLoadingDispatch(false);
    }
  };

  // ─── Action: Selesaikan Kasus ──────────────────────────────────────────
  const handleSelesai = async () => {
    try {
      setLoadingSelesai(true);
      // Endpoint ini butuh 'catatan' (required di backend)
      await kasusAktifService.selesaikanKasus(
        tipe,
        id,
        catatanSelesai || 'Kasus ditandai selesai oleh admin.'
      );
      showFeedback('success', 'Kasus berhasil ditandai selesai.');
      setShowSelesaiModal(false);
      setCatatanSelesai('');
      await fetchKasus();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menyelesaikan kasus.';
      showFeedback('error', msg);
      console.error('[useDetailKasus] handleSelesai:', err);
    } finally {
      setLoadingSelesai(false);
    }
  };

  // ─── Action: Log Aksi Kritis ───────────────────────────────────────────
  const handleLogAksi = async (actionType) => {
    try {
      await adminService.logAksiKritis(id, { action: actionType });
      showFeedback('success', `Aksi menghubungi ${actionType} telah dicatat ke log.`);
      await fetchActivities();
    } catch (err) {
      showFeedback('error', 'Gagal mencatat log aktivitas.');
      console.error('[useDetailKasus] handleLogAksi:', err);
    }
  };

  // ─── Action: Update Status Laporan ────────────────────────────────────
  const handleUpdateStatusLaporan = async (status) => {
    try {
      setLoadingSelesai(true);
      await laporanService.updateStatus(id, status);
      showFeedback('success', `Status laporan berhasil diubah menjadi "${status}".`);
      await fetchKasus();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal mengubah status laporan.';
      showFeedback('error', msg);
      console.error('[useDetailKasus] handleUpdateStatusLaporan:', err);
    } finally {
      setLoadingSelesai(false);
    }
  };

  // ─── Toggle Dispatch Panel ─────────────────────────────────────────────
  const handleOpenDispatchPanel = () => {
    setShowDispatchPanel(true);
    if (relawanList.length === 0) {
      fetchRelawanDispatch();
    }
  };

  useEffect(() => {
    fetchKasus();
  }, [fetchKasus]);

  return {
    id,
    tipe,
    kasus,
    activities,
    relawanList,
    loadingKasus,
    loadingActivities,
    loadingRelawan,
    loadingDispatch,
    loadingSelesai,
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
    handleSelesai,
    handleLogAksi,
    handleOpenDispatchPanel,
    handleUpdateStatusLaporan,
  };
}
