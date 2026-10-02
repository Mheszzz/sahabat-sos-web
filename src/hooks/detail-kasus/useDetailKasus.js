import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { laporanService } from '../../api/services/laporanService';
import { adminService } from '../../api/services/adminService';

/**
 * useDetailKasus
 * Custom hook yang mengelola seluruh logika dan state untuk halaman DetailKasusPage.
 * Dipisahkan agar file Page tetap bersih dan fokus pada rendering UI.
 */
export function useDetailKasus() {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message: string }

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // ─── Fetch Detail Kasus ───────────────────────────────────────────────
  const fetchKasus = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingKasus(true);
      setErrorKasus('');
      const res = await laporanService.getDetailLaporan(id);
      const data = res?.data ?? res;
      setKasus(data ?? null);
      
      // Also fetch activities
      fetchActivities();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal memuat detail kasus.';
      setErrorKasus(msg);
      console.error('[useDetailKasus] fetchKasus:', err);
    } finally {
      setLoadingKasus(false);
    }
  }, [id]);

  // ─── Fetch Activities ───────────────────────────────────────────────
  const fetchActivities = async () => {
    if (!id) return;
    try {
      setLoadingActivities(true);
      const res = await adminService.getSosActivities(id);
      setActivities(res?.data || res || []);
    } catch (err) {
      console.error('[useDetailKasus] fetchActivities:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  // ─── Fetch Relawan Dispatch ───────────────────────────────────────────
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

  // ─── Action: Dispatch Relawan ─────────────────────────────────────────
  const handleDispatch = async () => {
    if (!selectedRelawanId) return;
    try {
      setLoadingDispatch(true);
      await adminService.dispatchRelawan(id, selectedRelawanId);
      showFeedback('success', 'Relawan berhasil ditugaskan ke kasus ini.');
      setShowDispatchPanel(false);
      setSelectedRelawanId(null);
      await fetchKasus(); // refresh data kasus tanpa reload
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menugaskan relawan.';
      showFeedback('error', msg);
      console.error('[useDetailKasus] handleDispatch:', err);
    } finally {
      setLoadingDispatch(false);
    }
  };

  // ─── Action: Selesaikan Kasus ─────────────────────────────────────────
  const handleSelesai = async () => {
    try {
      setLoadingSelesai(true);
      await adminService.selesaiSOS(id);
      showFeedback('success', 'Kasus berhasil ditandai selesai.');
      setShowSelesaiModal(false);
      setCatatanSelesai('');
      await fetchKasus(); // refresh tanpa reload
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menyelesaikan kasus.';
      showFeedback('error', msg);
      console.error('[useDetailKasus] handleSelesai:', err);
    } finally {
      setLoadingSelesai(false);
    }
  };

  // ─── Action: Log Aksi Kritis (SOS-122) ────────────────────────────────
  const handleLogAksi = async (actionType) => {
    try {
      await adminService.logAksiKritis(id, { action: actionType });
      showFeedback('success', `Aksi menghubungi ${actionType} telah dicatat ke log.`);
      
      // Jika menggunakan Mock API, kita bisa tambahkan dummy activity secara lokal ke state 
      // agar terlihat di UI tanpa harus refresh dari backend yang belum punya API-nya.
      const mockLog = {
        id: Date.now(),
        aktor: 'Admin (Mock)',
        role_aktor: 'admin',
        deskripsi: `Admin menghubungi pihak ${actionType}`,
        created_at: new Date().toISOString()
      };
      setActivities(prev => [...prev, mockLog]);
      
      // TODO: Buka komentar ini jika API sudah rilis, untuk refresh log asli dari DB:
      // await fetchActivities();
    } catch (err) {
      showFeedback('error', 'Gagal mencatat log aktivitas.');
      console.error('[useDetailKasus] handleLogAksi:', err);
    }
  };

  // ─── Toggle Dispatch Panel ────────────────────────────────────────────
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
  };
}
