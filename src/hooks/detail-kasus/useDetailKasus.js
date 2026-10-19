import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { laporanService } from '../../api/services/laporanService';
import { adminService } from '../../api/services/adminService';
import { kasusAktifService } from '../../api/services/kasusAktifService';

/**
 * Helper memformat nomor HP ke format internasional WhatsApp (62xxx)
 */
function formatWhatsAppNumber(phone) {
  if (!phone) return null;
  const cleaned = String(phone).replace(/[^0-9]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('62')) return cleaned;
  if (cleaned.startsWith('0')) return '62' + cleaned.substring(1);
  return '62' + cleaned;
}

/**
 * Normalises different API response formats into a unified shape
 * expected by DetailKasusPage:
 *
 * Supports responses from:
 *   - GET /tugas-aktif/{tipe}/{id} (KasusAktifController::show)
 *   - GET /laporan/{id} (LaporanController::show fallback)
 */
function normaliseKasus(raw, tipe) {
  if (!raw) return null;

  const isTugasAktifFormat = Boolean(
    raw.lokasi?.alamat !== undefined ||
    raw.pelapor !== undefined ||
    raw.jenis_laporan !== undefined
  );

  if (isTugasAktifFormat) {
    const pelapor = raw.pelapor ?? null;
    const rawKontak = Array.isArray(pelapor?.kontak_darurat) ? pelapor.kontak_darurat : [];
    const formattedKontak = rawKontak.map((k) => {
      const waNumber = formatWhatsAppNumber(k.no_telp);
      return {
        id:           k.id,
        nama:         k.nama,
        no_telp:      k.no_telp,
        hubungan:     k.hubungan ?? 'Keluarga',
        email:        k.email ?? null,
        tipe:         k.tipe ?? 'utama',
        is_utama:     k.is_utama ?? (k.tipe === 'utama'),
        pesan_khusus: k.pesan_khusus ?? k.pesan ?? null,
        whatsapp_url: k.whatsapp_url || (waNumber ? `https://wa.me/${waNumber}` : null),
      };
    });

    const kontakUtama = pelapor?.kontak_darurat_utama ??
      formattedKontak.find((k) => k.is_utama) ??
      formattedKontak[0] ??
      null;

    const userWa = pelapor?.no_telp_wa || formatWhatsAppNumber(pelapor?.no_telp);

    const hasSosTelemetry = tipe === 'sos' && (
      raw.battery_level != null ||
      raw.signal_strength != null ||
      (typeof raw.device_info === 'object' && raw.device_info !== null)
    );

    return {
      id:               raw.id,
      status:           raw.status_raw ?? raw.status,
      urgensi:          raw.urgensi ?? null,
      kategori_laporan: raw.jenis_laporan ?? raw.sub_judul ?? (tipe === 'sos' ? 'Darurat SOS' : 'Laporan'),
      deskripsi:        raw.deskripsi ?? '',
      lokasi_laporan:   raw.lokasi?.alamat ?? '',
      latitude:         raw.lokasi?.latitude ?? raw.latitude ?? raw.lat ?? null,
      longitude:        raw.lokasi?.longitude ?? raw.longitude ?? raw.lng ?? null,
      waktu_laporan:    raw.waktu ?? null,
      foto_laporan_url: raw.foto_laporan_url ?? null,
      rekam_suara_url:  raw.rekam_suara_url ?? null,
      catatan_penanganan: Array.isArray(raw.catatan_penanganan) ? raw.catatan_penanganan : [],
      pengguna: pelapor ? {
        id:                      pelapor.id,
        name:                    pelapor.name,
        email:                   pelapor.email ?? null,
        no_telp:                 pelapor.no_telp,
        no_telp_wa:              userWa,
        whatsapp_url:            pelapor.whatsapp_url || (userWa ? `https://wa.me/${userWa}` : null),
        foto_url:                pelapor.foto_profile ?? null,
        kategori_user:           pelapor.kategori_user ?? null,
        jenis_disabilitas:       pelapor.jenis_disabilitas ?? pelapor.kategori_user ?? null,
        metode_komunikasi:       pelapor.metode_komunikasi ?? null,
        kebutuhan_aksesibilitas: pelapor.kebutuhan_aksesibilitas ?? null,
        keterangan_medis:        pelapor.keterangan_medis ?? null,
        kontak_darurat:          formattedKontak,
        kontak_darurat_utama:    kontakUtama,
      } : null,
      relawan: raw.relawan ? {
        id:        raw.relawan.id,
        name:      raw.relawan.name,
        no_telp:   raw.relawan.no_telp,
        foto_url:  raw.relawan.foto_profile ?? null,
        latitude:  raw.relawan.latitude !== null && raw.relawan.latitude !== undefined ? Number(raw.relawan.latitude) : null,
        longitude: raw.relawan.longitude !== null && raw.relawan.longitude !== undefined ? Number(raw.relawan.longitude) : null,
      } : null,
      device_info: hasSosTelemetry ? (() => {
        const rawDev = (typeof raw.device_info === 'object' && raw.device_info !== null) ? raw.device_info : {};
        const mobile = rawDev.mobile || {
          brand: rawDev.brand || 'Perangkat Mobile',
          model: rawDev.device_model || rawDev.model || 'Ponsel Korban',
          os_version: rawDev.os_version || 'Android/iOS',
          battery_level: raw.battery_level ?? rawDev.battery_level ?? 85,
          battery_status: rawDev.battery_status || ((raw.battery_level ?? 85) < 20 ? 'Kritis' : 'Baik'),
          is_charging: rawDev.is_charging ?? false,
          battery_state: rawDev.battery_state ?? 'discharging',
          signal_strength: raw.signal_strength ?? rawDev.signal_strength ?? '4G / Kuat',
          gps_accuracy: rawDev.gps_accuracy ?? null,
          device_id: rawDev.device_id ?? raw.device_id ?? null,
        };
        const tuya = rawDev.tuya ?? null;
        const smartwatch = rawDev.smartwatch ?? null;
        const triggerSource = rawDev.trigger_source || (tuya ? 'tuya_physical_button' : (smartwatch ? (smartwatch.fall_detected ? 'smartwatch_fall_detection' : 'smartwatch_button') : 'app_button'));
        const batLevel = mobile.battery_level ?? raw.battery_level ?? null;

        return {
          battery_level:       batLevel,
          battery_status:      mobile.battery_status,
          signal_strength:     mobile.signal_strength ?? raw.signal_strength ?? null,
          is_online:           rawDev.is_online ?? true,
          device_id:           mobile.device_id ?? rawDev.device_id ?? raw.device_id ?? null,
          device_model:        mobile.model ? `${mobile.brand || ''} ${mobile.model}`.trim() : (rawDev.device_model || 'Ponsel Korban'),
          last_seen:           raw.last_seen ?? rawDev.last_seen ?? null,
          location_updated_at: raw.location_updated_at ?? rawDev.location_updated_at ?? null,
          trigger_source:      triggerSource,
          is_warning:          (batLevel != null && batLevel < 20) || (tuya && tuya.is_battery_low) || (smartwatch && smartwatch.is_battery_low),
          mobile,
          tuya,
          smartwatch,
          ...rawDev,
        };
      })() : null,
      _tipe: tipe,
    };
  }

  // Fallback dari GET /laporan/{id} — Laporan Eloquent model langsung
  const pengguna = raw.pengguna ?? null;
  const rawKontak = Array.isArray(pengguna?.kontak_darurat ?? pengguna?.kontakDarurat)
    ? (pengguna.kontak_darurat ?? pengguna.kontakDarurat)
    : [];
  const formattedKontak = rawKontak.map((k) => {
    const waNumber = formatWhatsAppNumber(k.no_telp);
    return {
      id:           k.id,
      nama:         k.nama,
      no_telp:      k.no_telp,
      hubungan:     k.hubungan ?? 'Keluarga',
      email:        k.email ?? null,
      tipe:         k.tipe ?? 'utama',
      is_utama:     k.is_utama ?? (k.tipe === 'utama'),
      pesan_khusus: k.pesan_khusus ?? k.pesan ?? null,
      whatsapp_url: k.whatsapp_url || (waNumber ? `https://wa.me/${waNumber}` : null),
    };
  });

  const userWa = formatWhatsAppNumber(pengguna?.no_telp);

  return {
    ...raw,
    kategori_laporan: raw.kategori_laporan || 'Laporan',
    lokasi_laporan:   raw.lokasi_laporan || '',
    latitude:         raw.lokasi?.latitude ?? raw.latitude ?? raw.lat ?? null,
    longitude:        raw.lokasi?.longitude ?? raw.longitude ?? raw.lng ?? null,
    waktu_laporan:    raw.waktu_laporan ?? raw.created_at ?? null,
    foto_laporan_url: raw.foto_laporan_url ?? (raw.foto_laporan ? `/storage/${raw.foto_laporan}` : null),
    rekam_suara_url:  raw.rekam_suara_url ?? (raw.rekam_suara ? `/storage/${raw.rekam_suara}` : null),
    catatan_penanganan: Array.isArray(raw.catatan_penanganan ?? raw.catatanPenanganan)
      ? (raw.catatan_penanganan ?? raw.catatanPenanganan)
      : [],
    pengguna: pengguna ? {
      ...pengguna,
      foto_url:          pengguna.foto_profile_url ?? pengguna.foto_url ?? pengguna.foto_profile ?? null,
      jenis_disabilitas: pengguna.jenis_disabilitas ?? pengguna.kategori_user ?? null,
      no_telp_wa:        userWa,
      whatsapp_url:      userWa ? `https://wa.me/${userWa}` : null,
      kontak_darurat:    formattedKontak,
      kontak_darurat_utama: formattedKontak.find((k) => k.is_utama) ?? formattedKontak[0] ?? null,
    } : null,
    relawan: raw.relawan ? {
      ...raw.relawan,
      foto_url:  raw.relawan.foto_profile_url ?? raw.relawan.foto_url ?? raw.relawan.foto_profile ?? null,
      latitude:  raw.relawan.latitude !== null && raw.relawan.latitude !== undefined ? Number(raw.relawan.latitude) : null,
      longitude: raw.relawan.longitude !== null && raw.relawan.longitude !== undefined ? Number(raw.relawan.longitude) : null,
    } : null,
    device_info: null,
    _tipe: tipe ?? 'laporan',
  };
}

/**
 * useDetailKasus
 * Hook utama untuk halaman DetailKasusPage.
 * Mendukung dua tipe kasus:
 *   - 'laporan'  (default)
 *   - 'sos'      (via ?tipe=sos)
 */
export function useDetailKasus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tipe = (searchParams.get('tipe') ?? 'laporan').toLowerCase(); // 'sos' | 'laporan'

  // --- Data State ---
  const [kasus, setKasus] = useState(null);
  const [relawanList, setRelawanList] = useState([]);
  const [activities, setActivities] = useState([]);
  const kasusRef = useRef(null);

  // --- Loading State ---
  const [loadingKasus, setLoadingKasus] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingRelawan, setLoadingRelawan] = useState(false);
  const [loadingDispatch, setLoadingDispatch] = useState(false);
  const [loadingSelesai, setLoadingSelesai] = useState(false);
  const [loadingTangani, setLoadingTangani] = useState(false);

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
      const res = await adminService.getSosActivities(id);
      const data = res?.data ?? res?.activities ?? (Array.isArray(res) ? res : []);
      setActivities(Array.isArray(data) ? data : []);
    } catch {
      // Graceful fallback jika bukan SOS atau belum ada log
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, [id]);

  // ─── Fetch Relawan untuk Dispatch & Peta ──────────────────────────────
  const fetchRelawanDispatch = useCallback(async (customLat, customLng) => {
    try {
      setLoadingRelawan(true);
      const latVal = customLat ?? kasusRef.current?.latitude;
      const lngVal = customLng ?? kasusRef.current?.longitude;
      const params = {
        id,
        tipe,
        lat: latVal,
        lng: lngVal,
      };
      const res = await adminService.getQuickDispatchRelawan(params);
      const items = res?.data ?? [];
      setRelawanList(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('[useDetailKasus] fetchRelawanDispatch:', err);
      setRelawanList([]);
    } finally {
      setLoadingRelawan(false);
    }
  }, [id, tipe]);

  // ─── Fetch Detail Kasus ────────────────────────────────────────────────
  const fetchKasus = useCallback(async (options = {}) => {
    if (!id) return;
    const isSilent = typeof options === 'boolean' ? options : Boolean(options?.silent);
    try {
      // Hanya aktifkan spinner jika data kasus belum ada di layar
      if (!isSilent && (!kasusRef.current || String(kasusRef.current.id) !== String(id))) {
        setLoadingKasus(true);
      }
      setErrorKasus('');

      let raw;
      try {
        const res = await kasusAktifService.getDetail(tipe, id);
        raw = res?.data ?? res;
      } catch (err) {
        // Fallback untuk laporan lama
        if (tipe === 'laporan') {
          const res = await laporanService.getDetailLaporan(id);
          raw = res?.data ?? res;
        } else {
          throw err;
        }
      }

      const normalized = normaliseKasus(raw, tipe);
      kasusRef.current = normalized;
      setKasus(normalized);
      await fetchActivities();
      fetchRelawanDispatch(normalized?.latitude, normalized?.longitude);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal memuat detail kasus.';
      setErrorKasus(msg);
      console.error('[useDetailKasus] fetchKasus:', err);
    } finally {
      setLoadingKasus(false);
    }
  }, [id, tipe, fetchActivities, fetchRelawanDispatch]);

  // ─── Action: Dispatch Relawan ──────────────────────────────────────────
  const handleDispatch = async () => {
    if (!selectedRelawanId) return;
    try {
      setLoadingDispatch(true);
      await kasusAktifService.dispatchRelawan(tipe, id, selectedRelawanId);
      showFeedback('success', 'Relawan berhasil ditugaskan ke kasus ini.');
      setShowDispatchPanel(false);
      setSelectedRelawanId(null);
      await fetchKasus({ silent: true });
      window.dispatchEvent(new CustomEvent('kasus-updated'));
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menugaskan relawan.';
      showFeedback('error', msg);
      console.error('[useDetailKasus] handleDispatch:', err);
    } finally {
      setLoadingDispatch(false);
    }
  };

  // ─── Action: Ambil Alih / Tangani Kasus ─────────────────────────────────
  const handleTanganiKasus = async (catatan = null) => {
    try {
      setLoadingTangani(true);
      await kasusAktifService.tanganiKasus(tipe, id, catatan);
      showFeedback('success', 'Kasus berhasil diambil alih dan ditangani.');
      await fetchKasus({ silent: true });
      window.dispatchEvent(new CustomEvent('kasus-updated'));
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal mengambil alih kasus.';
      showFeedback('error', msg);
      console.error('[useDetailKasus] handleTanganiKasus:', err);
    } finally {
      setLoadingTangani(false);
    }
  };

  // ─── Action: Selesaikan Kasus ──────────────────────────────────────────
  const handleSelesai = async () => {
    try {
      setLoadingSelesai(true);
      await kasusAktifService.selesaikanKasus(
        tipe,
        id,
        catatanSelesai || 'Kasus ditandai selesai oleh admin.'
      );
      showFeedback('success', 'Kasus berhasil ditandai selesai.');
      setShowSelesaiModal(false);
      setCatatanSelesai('');
      await fetchKasus({ silent: true });
      window.dispatchEvent(new CustomEvent('kasus-updated'));
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
      await fetchKasus({ silent: true });
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
    fetchRelawanDispatch();
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
    handleUpdateStatusLaporan,
  };
}
