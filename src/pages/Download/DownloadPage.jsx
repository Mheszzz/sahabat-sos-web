import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  Radio,
  MapPin,
  HeartHandshake,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Volume2,
  Watch,
  Layers,
  Lock,
  MessageSquare
} from 'lucide-react';
import heroMockup from '../../assets/hero.png';

export default function DownloadPage() {
  const [copied, setCopied] = useState(false);
  const [tuyaImgError, setTuyaImgError] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState('umum');

  const handleCopyLink = () => {
    const downloadUrl = `${window.location.origin}/SahabatSOS.apk`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(downloadUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f5f4] text-[#0f172a] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-200 selection:text-emerald-950 flex flex-col">
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="bg-[#062c26] text-white text-xs py-2 px-4 border-b border-emerald-950/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse flex-shrink-0" />
            <span className="font-semibold text-[#34d399]">Ekosistem Terpadu:</span>
            <span className="text-white/80 truncate">
              Platform Siaga Darurat untuk Pengguna Difabel, Relawan Lapangan, dan Posko Komando.
            </span>
          </div>
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-white/90 hover:text-white font-medium text-[11px] underline underline-offset-2 transition-colors flex-shrink-0"
          >
            <span>Masuk Portal Admin</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── MAIN HEADER / NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs group-hover:border-emerald-500 transition-colors">
              <img src="/logo.png" alt="Logo Sahabat SOS" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#062c26]">Sahabat SOS</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-emerald-100 text-[#0b6f61]">
                  Mobile
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Distribusi Aplikasi Resmi</p>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl transition-colors"
            >
              <Lock size={13} className="text-slate-500" />
              <span>Portal Admin</span>
            </Link>

            <a
              href="/SahabatSOS.apk"
              download="SahabatSOS.apk"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] rounded-xl shadow-xs transition-colors"
            >
              <Download size={14} />
              <span>Unduh APK</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION (Green, Red, White Theme) ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#062c26] via-[#093c34] to-[#0b4d43] text-white pt-12 pb-16 px-4 sm:px-6">
        {/* Subtle patterned backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-emerald-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span>Khusus Pengguna Android · Versi Rilis 0.1.0</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              Aplikasi Tanggap Darurat <br />
              <span className="text-[#34d399]">Sahabat SOS</span> Mobile
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              Satu aplikasi untuk dua peran krusial: pendamping darurat penyandang disabilitas serta media penugasan cepat bagi relawan siaga. Terkoneksi otomatis dengan Posko Induk dan Tombol Panik IoT Tuya.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="/SahabatSOS.apk"
                download="SahabatSOS.apk"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download size={18} />
                <span>Unduh Berkas SahabatSOS.apk</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-colors cursor-pointer"
              >
                {copied ? <Check size={16} className="text-[#34d399]" /> : <Copy size={16} />}
                <span>{copied ? 'Tautan Tersalin' : 'Salin Tautan'}</span>
              </button>
            </div>

            {/* Spec strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 max-w-lg text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Format</span>
                <span className="font-bold text-white text-xs sm:text-sm">APK Android</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Kompatibel</span>
                <span className="font-bold text-white text-xs sm:text-sm">Android 8.0+</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Lisensi</span>
                <span className="font-bold text-[#34d399] text-xs sm:text-sm">Gratis / Inklusif</span>
              </div>
            </div>
          </div>

          {/* Mockup Preview Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] bg-white rounded-2xl p-3 shadow-2xl border-4 border-[#0b6f61]/60">
              <div className="absolute -top-3 -right-3 z-20 bg-[#dc2626] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>Siaga 24 Jam</span>
              </div>

              <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={heroMockup}
                  alt="Tampilan Antarmuka Aplikasi Sahabat SOS Mobile"
                  className="w-full h-auto block object-cover"
                />
              </div>

              <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-[#0b6f61] font-bold">
                  <Smartphone size={13} />
                  <span>Flutter Native Client</span>
                </span>
                <span>v0.1.0 Build</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 ROLES / INTEGRATED ECOSYSTEM (User, Volunteer, Admin) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Pengguna Difabel */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#dc2626] flex items-center justify-center mb-3.5 border border-red-100">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#dc2626] bg-red-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
              Untuk Pengguna Difabel
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Tombol SOS Aksesibel</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tombol darurat sentuh ekstra besar, pembaca suara Text-to-Speech Bahasa Indonesia, haptic getar, dan opsi kontras visual tinggi bagi ragam disabilitas.
            </p>
          </div>

          {/* Card 2: Relawan Siaga */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0b6f61] flex items-center justify-center mb-3.5 border border-emerald-100">
              <HeartHandshake size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b6f61] bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
              Untuk Relawan Lapangan
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Peta &amp; Penugasan Terdekat</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Algoritma proksimitas Haversine menyaring relawan paling dekat dengan lokasi kejadian darurat, lengkap dengan rute navigasi cepat menuju titik pelapor.
            </p>
          </div>

          {/* Card 3: Posko & Admin Command Center */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#062c26] flex items-center justify-center mb-3.5 border border-teal-100">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#062c26] bg-teal-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
              Terkoneksi Web Command
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Koordinasi Posko Pusat</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Status kasus dan pergerakan relawan tersinkronisasi dua arah via WebSocket Reverb ke dashboard operator posko untuk pengawasan menyeluruh.
            </p>
          </div>
        </div>
      </section>

      {/* ── TUYA PANIC BUTTON HARDWARE SECTION ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-b from-[#f8fafc] to-[#edf3f1] border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col items-center text-center">
              <div className="w-full max-w-[280px] bg-white rounded-2xl p-4 shadow-sm border border-slate-200 relative mb-4">
                <span className="absolute top-3 left-3 bg-[#dc2626] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  Hardware IoT
                </span>

                {!tuyaImgError ? (
                  <img
                    src="/tuya.jpg"
                    alt="Perangkat Tuya Smart Panic Button dengan Tombol CALL Merah"
                    onError={() => setTuyaImgError(true)}
                    className="w-full h-auto max-h-[260px] object-contain mx-auto block"
                  />
                ) : (
                  /* SVG Fallback jika file foto belum diletakkan di public/tuya.jpg */
                  <div className="py-6 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-200 shadow-md flex flex-col items-center justify-center p-2 relative">
                      <div className="w-16 h-16 rounded-xl bg-[#dc2626] text-white flex flex-col items-center justify-center shadow-inner">
                        <AlertTriangle size={24} />
                        <span className="text-[9px] font-extrabold tracking-wider mt-0.5">CALL</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-3">Tuya Panic Button SOS</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#0b6f61]">
                <Radio size={14} className="text-[#34d399] animate-pulse" />
                <span>Terintegrasi Webhook API Backend</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Perangkat fisik tombol darurat Tuya yang dapat dikalungkan pada leher atau dipasang pada kursi roda.
              </p>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-[#0b6f61] text-xs font-bold border border-emerald-100">
                <Radio size={14} />
                <span>Integrasi Hardware Tuya Smart</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062c26] tracking-tight">
                Pemicu Darurat Fisik Tanpa Layar Ponsel
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Sahabat SOS mendukung integrasi perangkat keras eksternal <strong>Tuya Panic Button</strong>. Pengguna lansia atau individu dengan hambatan motorik cukup menekan tombol fisik sekali untuk langsung memicu protokol darurat pada server.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#062c26] mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
                    <span>Satu Tekanan Instan</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Memicu alert tanpa perlu membuka kunci layar atau menavigasi aplikasi smartphone.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#062c26] mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#0b6f61]" />
                    <span>Transmisi Telemetri Cepat</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sinyal terusan langsung mengaktifkan notifikasi ke relawan siaga dalam radius terdekat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES GRID ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold text-[#0b6f61] uppercase tracking-wider">Fitur Unggulan Mobile</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062c26] tracking-tight">
            Kemampuan Lengkap Sistem Sahabat SOS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Didesain khusus untuk memastikan pertolongan darurat tiba tepat waktu dengan komunikasi yang inklusif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#dc2626] flex items-center justify-center mb-3">
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">SOS Sekali Sentuh</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tombol pemicu darurat utama langsung merekam koordinat satelit GPS dan mendistribusikan sinyal bahaya ke sistem secara otomatis.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0b6f61] flex items-center justify-center mb-3">
              <MapPin size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Pencarian Relawan Haversine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kalkulasi proksimitas presisi mengukur jarak matematis antar relawan siaga untuk memprioritaskan penolong yang berada paling dekat.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#062c26] flex items-center justify-center mb-3">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Pesan Otomatis WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tautan darurat otomatis disiapkan untuk kontak darurat keluarga pengguna, berisi rincian lokasi Google Maps dan keterangan kondisi.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <Volume2 size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Aksesibilitas Suara &amp; Getar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pemandu Text-to-Speech (TTS) berbahasa Indonesia dan getaran berkala membantu pengguna disabilitas sensorik saat mengoperasikan aplikasi.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Watch size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Telemetri BLE Smartwatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kompatibel dengan sensor jam tangan pintar Bluetooth Low Energy untuk memantau detak jantung dan status darurat medis berkala.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Verifikasi Relawan Ketat</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Relawan melalui peninjauan izin verifikasi keahlian khusus sebelum menerima penugasan aktif guna menjamin keamanan pengguna.
            </p>
          </div>
        </div>
      </section>

      {/* ── APK INSTALLATION GUIDE (Interactive Tab) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b6f61]">Panduan Praktis</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#062c26]">Cara Memasang Berkas APK di Android</h2>
            </div>

            {/* Quick switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveGuideTab('umum')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeGuideTab === 'umum' ? 'bg-white text-[#062c26] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Langkah Cepat
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('izin')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeGuideTab === 'izin' ? 'bg-white text-[#062c26] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Izin Keamanan
              </button>
            </div>
          </div>

          {activeGuideTab === 'umum' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-[#062c26] text-white font-bold text-xs flex items-center justify-center mb-2.5">
                  1
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Unduh Berkas APK</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tekan tombol unduh pada halaman ini. Berkas <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px]">SahabatSOS.apk</code> akan tersimpan di ponsel Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-[#0b6f61] text-white font-bold text-xs flex items-center justify-center mb-2.5">
                  2
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Buka dan Setujui Instalasi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buka notifikasi unduhan atau pengelola berkas. Pilih berkas APK, lalu ketuk opsi Pasang atau Instal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-[#dc2626] text-white font-bold text-xs flex items-center justify-center mb-2.5">
                  3
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Aktifkan Izin Lokasi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Saat aplikasi dibuka pertama kali, pilih Izinkan Akses Lokasi (GPS) agar fitur penjemputan darurat dapat beroperasi.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
              <h4 className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-[#dc2626]" />
                <span>Pemberitahuan Sumber Tidak Dikenal (Unknown Sources)</span>
              </h4>
              <p className="leading-relaxed">
                Karena berkas ini diunduh langsung di luar Google Play Store, Android mungkin menampilkan peringatan keamanan:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                <li>Buka <strong>Pengaturan &rarr; Keamanan &amp; Privasi</strong>.</li>
                <li>Pilih <strong>Instal Aplikasi dari Sumber Tidak Dikenal</strong>.</li>
                <li>Aktifkan perizinan untuk peramban (Chrome) atau File Manager yang Anda gunakan.</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL DOWNLOAD CALL TO ACTION ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full mb-8">
        <div className="bg-gradient-to-r from-[#062c26] to-[#0b6f61] rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
              Mulai Siaga Bersama Sahabat SOS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Unduh Sekarang dan Bergabung dalam Jaringan Tanggap Darurat
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Akses cepat bantuan darurat untuk rekan difabel dan peluang berkontribusi nyata bagi relawan kemanusiaan.
            </p>

            <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
              <a
                href="/SahabatSOS.apk"
                download="SahabatSOS.apk"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5"
              >
                <Download size={18} />
                <span>Unduh SahabatSOS.apk</span>
              </a>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#062c26] hover:bg-slate-100 font-bold text-sm shadow-sm transition-colors"
              >
                <Lock size={15} />
                <span>Portal Admin Posko</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo Sahabat SOS" className="w-5 h-5 object-contain" />
            <span className="font-bold text-slate-800">Sahabat SOS</span>
            <span>&copy; {new Date().getFullYear()} Inklusi &amp; Tanggap Darurat Difabel.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-emerald-700 font-medium transition-colors">
              Masuk Admin
            </Link>
            <span>&bull;</span>
            <span className="text-slate-400">Paket: sahabat_sos_mobile</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
