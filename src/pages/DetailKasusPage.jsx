import { ArrowLeft, Phone, MapPin, User, Shield, Ambulance, Clock, CheckCircle2, AlertTriangle, MessageSquare, Printer, ShieldAlert } from 'lucide-react';
import { sosCases, volunteers } from '../data/dummyData';

const timelineSteps = [
  { label: 'Sinyal SOS Diterima', time: '14:27:02', done: true, active: false },
  { label: 'Sistem Menetapkan Relawan', time: '14:27:45', done: true, active: false },
  { label: 'Relawan Mengonfirmasi (Dwi Riskianto)', time: '14:28:10', done: true, active: false },
  { label: 'Ambulans TBI Diberangkatkan', time: '14:29:05', done: true, active: false },
  { label: 'Relawan Menuju Lokasi (ETA 8 Menit)', time: '14:30:12', done: false, active: true },
  { label: 'Kasus Ditutup & Evaluasi Medis', time: '—', done: false, active: false },
];

export default function DetailKasusPage({ kasusId, onBack }) {
  const kasus = sosCases.find(c => c.id === kasusId) || sosCases[0];
  const relawan = volunteers[0];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] w-full mx-auto">
      {/* Top Bar with Back Button & Case Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-emerald-600">{kasus.id}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                kasus.type === 'darurat' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {kasus.tagType || 'DARURAT SOS'}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                {kasus.prioritas}
              </span>
            </div>
            <h1 className="text-[20px] font-black text-slate-900 mt-1">
              {kasus.kategori}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="btn-base btn-secondary text-[12px] h-9"
          >
            <Printer size={13} />
            <span>Cetak Laporan</span>
          </button>
          <button
            onClick={() => alert('Kasus dinyatakan selesai!')}
            className="btn-base btn-primary text-[12px] h-9"
          >
            <CheckCircle2 size={14} />
            <span>Selesaikan Kasus</span>
          </button>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 items-start">
        {/* LEFT: Incident Data & Timeline */}
        <div className="space-y-6">
          {/* Card: Pelapor Details */}
          <div className="bg-white border border-[#eaedf1] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
              <User size={16} className="text-slate-400" />
              <span>Profil Pelapor & Kebutuhan Khusus</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama Pelapor</p>
                <p className="text-[14px] font-bold text-slate-800 mt-0.5">{kasus.pelapor.nama}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Disabilitas / Kondisi</p>
                <p className="text-[14px] font-bold text-emerald-700 mt-0.5">{kasus.pelapor.disabilitas}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kontak Ponsel</p>
                <p className="text-[14px] font-bold text-slate-800 mt-0.5">{kasus.pelapor.kontak}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Waktu Masuk</p>
                <p className="text-[14px] font-bold text-slate-800 mt-0.5">{kasus.waktuFull || '2026-09-08 14:27'}</p>
              </div>
            </div>
          </div>

          {/* Card: Lokasi & Aksesibilitas */}
          <div className="bg-white border border-[#eaedf1] rounded-2xl p-6 shadow-xs space-y-3">
            <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" />
              <span>Titik Lokasi Kejadian</span>
            </h2>
            <p className="text-[13px] text-slate-700 font-medium">
              {kasus.lokasiFull || kasus.lokasi}
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[12px] text-emerald-800">
              <span className="font-bold">Panduan Akses Relawan:</span> Halte dilengkapi jalur landai ramp dan tactile paving guide. Area dapat dimasuki kursi roda standar.
            </div>
          </div>

          {/* Card: Timeline Penanganan */}
          <div className="bg-white border border-[#eaedf1] rounded-2xl p-6 shadow-xs">
            <h2 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span>Linimasa Tanggap Darurat</span>
            </h2>

            <div className="space-y-4">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                      step.done
                        ? 'bg-[#10b981] text-white'
                        : step.active
                        ? 'bg-[#2563eb] text-white animate-pulse'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {step.done ? '✓' : idx + 1}
                    </div>
                    {idx < timelineSteps.length - 1 && (
                      <div className="w-0.5 h-6 bg-slate-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[13px] font-bold leading-tight ${step.active ? 'text-blue-700' : 'text-slate-800'}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Assigned Volunteer & Quick Actions */}
        <div className="space-y-6">
          {/* Relawan Bertugas */}
          <div className="bg-white border border-[#eaedf1] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
              <Shield size={16} className="text-slate-400" />
              <span>Relawan Terdekat</span>
            </h2>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                DR
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-slate-900">Dwi Riskianto</p>
                <p className="text-[11px] text-slate-400">Relawan Siaga Difabel #14</p>
                <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Status: Menuju Lokasi (ETA 8 mnt)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => alert('Menghubungi relawan')}
                className="btn-base btn-primary text-[12px] h-9 w-full"
              >
                <Phone size={13} />
                <span>Telepon</span>
              </button>
              <button
                onClick={() => alert('Membuka chat relawan')}
                className="btn-base btn-secondary text-[12px] h-9 w-full"
              >
                <MessageSquare size={13} />
                <span>Kirim Pesan</span>
              </button>
            </div>
          </div>

          {/* Eskalasi Lanjutan */}
          <div className="bg-white border border-[#eaedf1] rounded-2xl p-6 shadow-xs space-y-3">
            <h2 className="text-[14px] font-bold text-slate-900">Eskalasi Cepat</h2>
            <p className="text-[12px] text-slate-400">Butuh bantuan medis darurat atau aparat lalu lintas tambahan?</p>
            <button
              onClick={() => alert('Menghubungi Call Center Ambulans 118...')}
              className="btn-base btn-danger w-full text-[12px] h-9"
            >
              <Ambulance size={14} />
              <span>Panggil Ambulans Tambahan</span>
            </button>
            <button
              onClick={() => alert('Menghubungi Kepolisian 110...')}
              className="btn-base btn-secondary w-full text-[12px] h-9"
            >
              <ShieldAlert size={14} />
              <span>Eskalasi ke Posko Polisi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
