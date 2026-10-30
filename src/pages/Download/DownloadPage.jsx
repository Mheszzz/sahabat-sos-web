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
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Volume2,
  Watch,
  Layers,
  Lock,
  MessageSquare,
  Signal,
  Wifi,
  Battery,
  Heart,
  Phone,
  Clock,
  Home,
  User,
  RotateCw
} from 'lucide-react';

export default function DownloadPage() {
  const [tuyaImgError, setTuyaImgError] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState('umum');

  return (
    <div className="min-h-screen bg-[#f2f5f4] text-[#0f172a] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-200 selection:text-emerald-950 flex flex-col">

      {/* ── MAIN HEADER / NAVBAR (Green Theme) ── */}
      <header className="sticky top-0 z-40 bg-[#062c26]/95 backdrop-blur-md border-b border-emerald-900/60 shadow-md text-white transition-all anim-fade-in-down">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Logo Sahabat SOS" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Sahabat SOS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-[#0b6f61] text-[#34d399] border border-emerald-500/30">
                  Mobile
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 font-medium -mt-0.5">Distribusi Aplikasi Resmi</p>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white/90 bg-white/10 hover:bg-white/15 hover:text-white border border-white/15 rounded-xl transition-all hover:border-emerald-400/40 cursor-pointer"
            >
              <Lock size={13} className="text-[#34d399]" />
              <span>Portal Admin</span>
            </Link>

            <a
              href="/SahabatSOS.apk"
              download="SahabatSOS.apk"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] rounded-xl shadow-md transition-all hover:shadow-red-600/30 hover:-translate-y-0.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Unduh APK</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION (Green, Red, White Theme with Dot Grid Pattern) ── */}
      <section className="relative overflow-hidden bg-[#0a2f28] text-white pt-12 pb-20 px-4 sm:px-6">
        {/* Deep ambient radial glow for rich depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% 30%, #0e443a 0%, #072620 100%)'
          }}
        />

        {/* Dot pattern grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.13) 1.25px, transparent 1.25px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0'
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 anim-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
              <span>Khusus Pengguna Android · Versi Rilis 1.0.0</span>
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
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 anim-glow-btn group"
              >
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                <span>Unduh Berkas SahabatSOS.apk</span>
              </a>
            </div>

            {/* Spec strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 max-w-lg text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 hover:bg-white/10 transition-colors">
                <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Format</span>
                <span className="font-bold text-white text-xs sm:text-sm">APK Android</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 hover:bg-white/10 transition-colors">
                <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Kompatibel</span>
                <span className="font-bold text-white text-xs sm:text-sm">Android 8.0+</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 hover:bg-white/10 transition-colors">
                <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Lisensi</span>
                <span className="font-bold text-[#34d399] text-xs sm:text-sm">Gratis / Inklusif</span>
              </div>
            </div>
          </div>

          {/* Mockup Preview Column with Gentle Floating Animation */}
          <div className="lg:col-span-5 flex justify-center anim-fade-in-up anim-delay-2">
            <div className="relative w-full max-w-[340px] bg-white rounded-2xl p-3 shadow-2xl border-4 border-[#0b6f61]/60 anim-float hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -top-2.5 -right-2.5 z-20 bg-[#dc2626] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                Siaga 24 Jam
              </div>

              {/* Smartphone Frame containing User Home Screen */}
              <div className="rounded-xl overflow-hidden bg-[#f5f6f8] border border-slate-200/90 shadow-inner text-slate-800">
                {/* Phone Status Bar */}
                <div className="bg-[#f5f6f8] px-3.5 pt-2 pb-1 flex items-center justify-between text-[10px] text-slate-600 font-semibold select-none">
                  <span>09:41</span>
                  {/* Speaker/Camera Pill */}
                  <div className="w-16 h-2.5 bg-slate-900 rounded-full" />
                  <div className="flex items-center gap-1 text-slate-700">
                    <Signal size={10} />
                    <Wifi size={10} />
                    <Battery size={11} className="fill-slate-700" />
                  </div>
                </div>

                {/* App Header */}
                <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-200/60 bg-[#f5f6f8]">
                  <div className="flex items-center gap-1.5">
                    <img src="/logo.png" alt="Sahabat SOS Logo" className="w-5 h-5 object-contain rounded" />
                    <div>
                      <p className="text-[11px] font-bold text-[#00695c] leading-tight">Halo, Budi Pratama</p>
                      <p className="text-[8px] text-slate-500 leading-none">Sahabat SOS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Segarkan status"
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[#00695c] hover:bg-[#00695c]/10 transition-colors"
                    >
                      <RotateCw size={11} />
                    </button>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#00695c]/10 border border-[#00695c]/25 text-[#00695c] text-[9px] font-bold">
                      <MapPin size={9} />
                      <span>Peta</span>
                    </div>
                  </div>
                </div>

                {/* Main Screen Content */}
                <div className="p-2.5 space-y-2">
                  {/* Big Circular SOS Button */}
                  <div className="flex flex-col items-center pt-1 pb-0.5">
                    <div className="relative group cursor-pointer">
                      {/* Pulse effect ring */}
                      <div className="absolute -inset-1.5 rounded-full bg-red-500/25 blur-xs animate-ping" />
                      <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#ef4444] via-[#dc2626] to-[#b91c1c] border-4 border-white/50 shadow-[0_6px_20px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center text-white transition-transform group-hover:scale-105 active:scale-95">
                        <AlertTriangle size={26} className="text-white drop-shadow-sm mb-0.5" />
                        <span className="text-xl font-black tracking-widest leading-none drop-shadow">SOS</span>
                        <span className="text-[9px] font-extrabold tracking-widest leading-none mt-0.5 drop-shadow opacity-95">DARURAT</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium text-center leading-snug mt-2 max-w-[200px]">
                      Tekan tombol 5 kali dengan cepat untuk meminta bantuan.
                    </p>
                  </div>

                  {/* Heart Rate Banner */}
                  <div className="bg-white rounded-xl px-2.5 py-1.5 border border-emerald-200/70 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Heart size={13} className="text-red-500 fill-red-500 animate-pulse" />
                      <span className="text-[11px] font-bold text-slate-800">76 BPM</span>
                      <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.2 rounded border border-emerald-200/50">Normal</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-slate-400">
                      <span>Smartband</span>
                      <ChevronRight size={10} />
                    </div>
                  </div>

                  {/* Tuya IoT / Device Status Card */}
                  <div className="bg-white rounded-xl py-1.5 px-1 border border-slate-200/80 shadow-2xs grid grid-cols-3 divide-x divide-slate-100 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-0.5">
                        <Battery size={10} className="fill-emerald-600" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 leading-tight">98%</span>
                      <span className="text-[8px] text-slate-500 font-medium">Baterai</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-teal-50 text-[#00695c] flex items-center justify-center mb-0.5">
                        <Wifi size={10} />
                      </div>
                      <span className="text-[10px] font-bold text-[#00695c] leading-tight">Online</span>
                      <span className="text-[8px] text-slate-500 font-medium">Koneksi</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-0.5">
                        <Radio size={10} />
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 leading-tight">Kuat</span>
                      <span className="text-[8px] text-slate-500 font-medium">Sinyal</span>
                    </div>
                  </div>

                  {/* Quick Action Menu (2x2 Grid) */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-red-50 text-[#dc2626] flex items-center justify-center shrink-0">
                        <MessageSquare size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-slate-800 truncate">Kirim Laporan</p>
                        <p className="text-[7.5px] text-slate-400 truncate">Foto &amp; Suara</p>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-teal-50 text-[#00695c] flex items-center justify-center shrink-0">
                        <Watch size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-slate-800 truncate">Perangkat</p>
                        <p className="text-[7.5px] text-slate-400 truncate">IoT Tuya Button</p>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Phone size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-slate-800 truncate">Kontak SOS</p>
                        <p className="text-[7.5px] text-slate-400 truncate">3 Siaga Aktif</p>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-slate-800 truncate">Riwayat</p>
                        <p className="text-[7.5px] text-slate-400 truncate">Log Bantuan</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Bottom Nav Bar */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm px-2.5 py-1 flex items-center justify-around select-none">
                    <div className="flex flex-col items-center text-[#00695c]">
                      <Home size={13} className="stroke-[2.5]" />
                      <span className="text-[7.5px] font-bold">Beranda</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400">
                      <MessageSquare size={13} />
                      <span className="text-[7.5px] font-medium">Laporan</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400">
                      <Radio size={13} />
                      <span className="text-[7.5px] font-medium">Alat</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400">
                      <Clock size={13} />
                      <span className="text-[7.5px] font-medium">Riwayat</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400">
                      <User size={13} />
                      <span className="text-[7.5px] font-medium">Profil</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-[#0b6f61] font-bold">
                  <Smartphone size={13} />
                  <span>Flutter Native Client</span>
                </span>
                <span className="font-semibold text-slate-600">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 ROLES / INTEGRATED ECOSYSTEM (User, Volunteer, Admin) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 w-full anim-fade-in-up anim-delay-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Pengguna Difabel */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#dc2626] flex items-center justify-center mb-3.5 border border-red-100 group-hover:scale-110 transition-transform duration-200">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#dc2626] bg-red-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
              Untuk Pengguna Difabel
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[#dc2626] transition-colors">
              Tombol SOS Aksesibel
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tombol darurat sentuh ekstra besar, pembaca suara Text-to-Speech Bahasa Indonesia, haptic getar, dan opsi kontras visual tinggi bagi ragam disabilitas.
            </p>
          </div>

          {/* Card 2: Relawan Siaga */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0b6f61] flex items-center justify-center mb-3.5 border border-emerald-100 group-hover:scale-110 transition-transform duration-200">
              <HeartHandshake size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b6f61] bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
              Untuk Relawan Lapangan
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[#0b6f61] transition-colors">
              Peta &amp; Penugasan Terdekat
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Algoritma proksimitas Haversine menyaring relawan paling dekat dengan lokasi kejadian darurat, lengkap dengan rute navigasi cepat menuju titik pelapor.
            </p>
          </div>

          {/* Card 3: Posko & Admin Command Center */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#062c26] flex items-center justify-center mb-3.5 border border-teal-100 group-hover:scale-110 transition-transform duration-200">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#062c26] bg-teal-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
              Terkoneksi Web Command
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[#062c26] transition-colors">
              Koordinasi Posko Pusat
            </h3>
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
              <div className="w-full max-w-[290px] bg-white rounded-2xl p-4 shadow-sm border border-slate-200 relative mb-4">
                <span className="absolute top-3 left-3 bg-[#dc2626] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md z-10">
                  Hardware IoT
                </span>

                {!tuyaImgError ? (
                  <img
                    src="/tuya.jpg"
                    alt="Perangkat Tuya Smart Panic Button dengan Tombol CALL Merah dan Tali Kalung"
                    onError={() => setTuyaImgError(true)}
                    className="w-full h-auto max-h-[290px] object-contain mx-auto block"
                  />
                ) : (
                  /* Ilustrasi persis perangkat Tuya Panic Button dengan tali lanyard biru */
                  <div className="py-2 flex flex-col items-center justify-center">
                    <svg viewBox="0 0 200 240" className="w-full max-h-[260px] mx-auto block" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Tali Lanyard Biru */}
                      <path d="M100 120 C 100 100, 70 60, 85 25 C 95 5, 115 5, 120 28 C 125 55, 100 95, 100 120" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" fill="none" />
                      <rect x="94" y="112" width="12" height="10" rx="2" fill="#1e293b" />
                      <line x1="100" y1="122" x2="100" y2="135" stroke="#94a3b8" strokeWidth="2" />

                      {/* Bodi Utama Tombol Putih */}
                      <rect x="52" y="135" width="96" height="96" rx="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />

                      {/* Tombol Merah CALL */}
                      <rect x="74" y="153" width="52" height="52" rx="14" fill="#dc2626" />

                      {/* Ikon Lonceng & Sinyal Radio */}
                      <path d="M100 162 C96 162 93 165 93 169 L91 176 H109 L107 169 C107 165 104 162 100 162 Z" fill="#ffffff" />
                      <circle cx="100" cy="178" r="1.5" fill="#ffffff" />
                      <path d="M96 160 C98 158.5 102 158.5 104 160" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M94 157.5 C98 155.5 102 155.5 106 157.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />

                      {/* Teks CALL */}
                      <text x="100" y="196" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.08em" fontFamily="system-ui, sans-serif">CALL</text>

                      {/* Titik Sensor Bawah */}
                      <circle cx="100" cy="217" r="1.5" fill="#64748b" />
                    </svg>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">Tuya Panic Button SOS</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#0b6f61]">
                <Radio size={14} className="text-[#0b6f61]" />
                <span>Terintegrasi Webhook API Backend</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Perangkat fisik tombol darurat Tuya yang dapat dikalungkan pada leher atau dipasang pada kursi roda.
              </p>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b6f61]">
                Integrasi Hardware Tuya Smart
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062c26] tracking-tight">
                Pemicu Darurat Fisik Tanpa Layar Ponsel
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Sahabat SOS mendukung integrasi perangkat keras eksternal <strong>Tuya Panic Button</strong>. Pengguna lansia atau individu dengan hambatan motorik cukup menekan tombol fisik sekali untuk langsung memicu protokol darurat pada server.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200">
                  <h4 className="font-bold text-xs text-[#062c26] mb-1">
                    Satu Tekanan Instan
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Memicu alert tanpa perlu membuka kunci layar atau menavigasi aplikasi smartphone.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200">
                  <h4 className="font-bold text-xs text-[#062c26] mb-1">
                    Transmisi Telemetri Cepat
                  </h4>
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
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-default">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#dc2626] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#dc2626] transition-colors">SOS Sekali Sentuh</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tombol pemicu darurat utama langsung merekam koordinat satelit GPS dan mendistribusikan sinyal bahaya ke sistem secara otomatis.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-default">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0b6f61] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <MapPin size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#0b6f61] transition-colors">Pencarian Relawan Haversine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kalkulasi proksimitas presisi mengukur jarak matematis antar relawan siaga untuk memprioritaskan penolong yang berada paling dekat.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-default">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#062c26] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#062c26] transition-colors">Pesan Otomatis WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tautan darurat otomatis disiapkan untuk kontak darurat keluarga pengguna, berisi rincian lokasi Google Maps dan keterangan kondisi.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-default">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <Volume2 size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-purple-700 transition-colors">Aksesibilitas Suara &amp; Getar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pemandu Text-to-Speech (TTS) berbahasa Indonesia dan getaran berkala membantu pengguna disabilitas sensorik saat mengoperasikan aplikasi.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-default">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <Watch size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">Telemetri BLE Smartwatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kompatibel dengan sensor jam tangan pintar Bluetooth Low Energy untuk memantau detak jantung dan status darurat medis berkala.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-default">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-amber-700 transition-colors">Verifikasi Relawan Ketat</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Relawan melalui peninjauan izin verifikasi keahlian khusus sebelum menerima penugasan aktif guna menjamin keamanan pengguna.
            </p>
          </div>
        </div>
      </section>

      {/* ── APK INSTALLATION GUIDE (Interactive Tab) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
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
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeGuideTab === 'umum' ? 'bg-white text-[#062c26] shadow-xs scale-102' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Langkah Cepat
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('izin')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeGuideTab === 'izin' ? 'bg-white text-[#062c26] shadow-xs scale-102' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Izin Keamanan
              </button>
            </div>
          </div>

          {activeGuideTab === 'umum' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 anim-fade-in">
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-emerald-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="w-7 h-7 rounded-lg bg-[#062c26] text-white font-bold text-xs flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  1
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Unduh Berkas APK</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tekan tombol unduh pada halaman ini. Berkas <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px]">SahabatSOS.apk</code> akan tersimpan di ponsel Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-emerald-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="w-7 h-7 rounded-lg bg-[#0b6f61] text-white font-bold text-xs flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  2
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Buka dan Setujui Instalasi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buka notifikasi unduhan atau pengelola berkas. Pilih berkas APK, lalu ketuk opsi Pasang atau Instal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-emerald-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="w-7 h-7 rounded-lg bg-[#dc2626] text-white font-bold text-xs flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  3
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Aktifkan Izin Lokasi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Saat aplikasi dibuka pertama kali, pilih Izinkan Akses Lokasi (GPS) agar fitur penjemputan darurat dapat beroperasi.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2 anim-fade-in">
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
        <div className="bg-[#0a2f28] rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg relative overflow-hidden">
          {/* Deep ambient radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 90% 70% at 50% 50%, #0e443a 0%, #072620 100%)'
            }}
          />

          {/* Dot pattern grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.13) 1.25px, transparent 1.25px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0'
            }}
          />

          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#34d399]">
              Mulai Siaga Bersama Sahabat SOS
            </p>
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
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white font-bold text-sm shadow-md transition-all hover:shadow-red-600/30 hover:-translate-y-0.5 anim-glow-btn group cursor-pointer"
              >
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                <span>Unduh SahabatSOS.apk</span>
              </a>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#062c26] hover:bg-slate-100 font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
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
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Paket: sahabat_sos_mobile</span>
          </div>
        </div>
      </footer>

      {/* ── EMBEDDED KEYFRAME ANIMATIONS ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatDevice {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25); }
          50% { box-shadow: 0 6px 22px rgba(220, 38, 38, 0.45); }
        }
        .anim-fade-in {
          animation: fadeIn 0.35s ease-out forwards;
        }
        .anim-fade-in-down {
          animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-float {
          animation: floatDevice 4.5s ease-in-out infinite;
        }
        .anim-glow-btn {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .anim-delay-2 {
          animation-delay: 0.15s;
        }
        .anim-delay-3 {
          animation-delay: 0.25s;
        }
      `}</style>
    </div>
  );
}
