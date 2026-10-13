import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Settings,
  CheckCheck,
  Trash2,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  Volume2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { kasusAktifService } from '../../api/services/kasusAktifService';

const DEFAULT_SOS_NOTIFICATIONS = [
  {
    id: 4,
    type: 'sos',
    title: 'Darurat SOS #4 - Ahmad Fauzi',
    message: 'Kawasan Kota Yogyakarta • Butuh respon segera',
    time: '10 Okt • 14:20 WIB',
    read: false,
    path: '/detail-kasus/4?tipe=sos',
  },
];

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_SOS_NOTIFICATIONS);
  const [viewSettings, setViewSettings] = useState(false);

  // Settings for SOS
  const [settings, setSettings] = useState({
    soundSos: true,
    popupAlert: true,
    vibrateAlert: true,
  });

  const dropdownRef = useRef(null);

  // Fetch real active SOS from backend
  const fetchActiveSos = async () => {
    try {
      const res = await kasusAktifService.getSOS({ per_page: 10 });
      const rawSos = res?.data?.data || (Array.isArray(res?.data) ? res.data : []);
      const activeSos = rawSos.filter(s => {
        const st = (s.status_raw || s.status || '').toLowerCase();
        return st !== 'selesai' && st !== 'batal';
      });

      if (activeSos.length > 0) {
        const mapped = activeSos.map(s => ({
          id: s.id,
          type: 'sos',
          title: `Darurat SOS #${s.id} - ${s.pelapor?.nama || s.pelapor?.name || 'Ahmad Fauzi'}`,
          message: `${s.lokasi?.alamat || 'Kawasan Kota Yogyakarta'} • Butuh respon segera`,
          time: s.waktu ? formatWaktu(s.waktu) : 'Baru saja',
          read: false,
          path: `/detail-kasus/${s.id}?tipe=sos`,
        }));
        setNotifications(mapped);
      }
    } catch {
      // Keep DEFAULT_SOS_NOTIFICATIONS on network error
    }
  };

  const formatWaktu = (dateStr) => {
    if (!dateStr) return 'Baru saja';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const month = monthNames[d.getMonth()];
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} • ${hours}:${minutes} WIB`;
    } catch {
      return 'Baru saja';
    }
  };

  useEffect(() => {
    fetchActiveSos();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle click outside & Esc key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setViewSettings(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setViewSettings(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleReset = () => {
    setNotifications(DEFAULT_SOS_NOTIFICATIONS);
  };

  const handleItemClick = (item) => {
    setNotifications(prev =>
      prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
    );
    setIsOpen(false);
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bell Trigger Button ── */}
      <button
        onClick={() => {
          setIsOpen(prev => !prev);
          setViewSettings(false);
        }}
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
          isOpen
            ? 'border-slate-300 bg-slate-100 text-slate-800 shadow-xs'
            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`}
        aria-label="Notifikasi SOS Aktif"
        title="Notifikasi Darurat SOS Aktif"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
            {unreadCount}
          </span>
        )}
      </button>

      {/* ── Pop-up Dropdown (Inspired by YouTube's Notification Pop-up) ── */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-[360px] sm:w-[410px] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden z-[1000] animate-in fade-in zoom-in-95 duration-150 flex flex-col font-sans">
          {/* ════ Header Bar ════ */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 bg-white">
            {viewSettings ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewSettings(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                  title="Kembali"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-[15px] font-bold text-slate-900">
                  Setelan Notifikasi SOS
                </h2>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-slate-900">
                  Notifikasi
                </h2>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-600">
                    {unreadCount} SOS Aktif
                  </span>
                )}
              </div>
            )}

            {/* Header Right Actions */}
            <div className="flex items-center gap-1">
              {!viewSettings && notifications.length > 0 && (
                <>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Tandai semua sudah dibaca"
                    >
                      <CheckCheck size={13} />
                      <span className="hidden sm:inline">Tandai Dibaca</span>
                    </button>
                  )}
                  <button
                    onClick={handleClearAll}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    title="Bersihkan notifikasi"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}

              {/* Settings Gear Icon (Identik dengan YouTube) */}
              <button
                onClick={() => setViewSettings(prev => !prev)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewSettings
                    ? 'bg-slate-100 text-slate-800'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                }`}
                title="Setelan Notifikasi"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* ════ Content Body ════ */}
          {viewSettings ? (
            /* ── SETTINGS VIEW ── */
            <div className="p-4 space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <Volume2 size={16} />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-slate-800">
                      Suara Sirine SOS
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Alarm audio otomatis saat ada SOS aktif
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundSos}
                  onChange={e => setSettings(s => ({ ...s, soundSos: e.target.checked }))}
                  className="h-4 w-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-[#dc2626]">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-slate-800">
                      Peringatan Prioritas Tinggi
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Tampilkan lencana merah darurat di navbar
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.popupAlert}
                  onChange={e => setSettings(s => ({ ...s, popupAlert: e.target.checked }))}
                  className="h-4 w-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setViewSettings(false)}
                  className="w-full rounded-xl bg-slate-900 py-2 text-[12px] font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : notifications.length > 0 ? (
            /* ── DAFTAR NOTIFIKASI SOS AKTIF SAJA ── */
            <div>
              <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                {notifications.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                      item.read ? 'bg-white hover:bg-slate-50' : 'bg-red-50/25 hover:bg-red-50/45'
                    }`}
                  >
                    {/* SOS Red Icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-[#dc2626]">
                      <AlertTriangle size={17} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="text-[12.5px] font-bold text-slate-900 truncate">
                            {item.title}
                          </h4>
                          <span className="rounded bg-red-100 px-1.5 py-0.2 text-[9px] font-black text-red-600 uppercase tracking-wider">
                            DARURAT
                          </span>
                        </div>
                        {!item.read && (
                          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[10.5px] font-medium text-slate-400">
                          {item.time}
                        </span>
                        <span className="text-[10.5px] font-bold text-red-600 hover:underline">
                          Buka Kasus &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Footer */}
              <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-center flex items-center justify-between">
                <button
                  onClick={handleClearAll}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Bersihkan
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/kasus-aktif');
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#dc2626] hover:underline"
                >
                  <span>Lihat Kasus Darurat SOS</span>
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          ) : (
            /* ── EMPTY STATE (TAMPILAN IDENTIK DENGAN GAMBAR 2 / YOUTUBE) ── */
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              {/* Icon Lonceng Besar Outlined */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-2">
                <Bell size={52} strokeWidth={1.3} className="text-slate-400" />
              </div>

              {/* Judul Teks */}
              <h3 className="mt-3 text-[16px] font-bold text-slate-900 tracking-tight">
                Notifikasi Anda ada di sini
              </h3>

              {/* Sub-judul Penjelas */}
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500 max-w-[280px]">
                Tidak ada panggilan darurat SOS aktif saat ini. Semua panggilan darurat baru akan muncul di sini secara real-time.
              </p>

              {/* Tombol Simulasikan Notifikasi Baru */}
              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-[11.5px] font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
                title="Tampilkan kembali notifikasi simulasi SOS"
              >
                <RotateCcw size={13} className="text-slate-500" />
                <span>Simulasikan SOS Aktif (+1)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
