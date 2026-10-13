import { useState } from 'react';
import {
  X, Check, ShieldAlert, Phone, MapPin, Briefcase, Heart, Calendar,
  Loader2, MessageSquare, Copy, CheckCheck, Power, ShieldCheck, UserCheck
} from 'lucide-react';
import InitialsAvatar from '../global/InitialsAvatar';

export default function RelawanDetailModal({
  isOpen,
  onClose,
  relawan,
  onVerify,
  onToggleStatus,
}) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !relawan) return null;

  const isPending = relawan.status_verifikasi === 'pending';
  const isActive = relawan.is_active === true || relawan.is_active === 1;

  const handleAction = async (status) => {
    try {
      setLoadingAction(status);
      await onVerify(relawan.id, status);
      onClose();
    } catch {
      // Handled by hook
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCopyPhone = () => {
    if (!relawan.no_telp) return;
    navigator.clipboard.writeText(relawan.no_telp);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const getWaUrl = () => {
    if (!relawan.no_telp) return null;
    let clean = relawan.no_telp.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    const msg = encodeURIComponent(
      `Halo ${relawan.name || relawan.nama || 'Relawan'}, kami dari Tim Posko Koordinasi Sahabat SOS.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const waUrl = getWaUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#eaedf1] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isPending ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-[#0b6f61]'
              }`}
            >
              {isPending ? <ShieldAlert size={18} /> : <UserCheck size={18} />}
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 leading-tight">
                {isPending ? 'Tinjau Pengajuan Relawan' : 'Profil Lengkap Relawan'}
              </h2>
              <p className="text-[12px] text-slate-500">
                {isPending ? 'Verifikasi data pendaftar baru' : 'Informasi identitas dan keaktifan personil'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Profile Card Banner */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100/60 rounded-2xl border border-slate-200/70">
            {relawan.foto_profile ? (
              <img
                src={
                  relawan.foto_profile.startsWith('http')
                    ? relawan.foto_profile
                    : `/storage-file/${relawan.foto_profile}`
                }
                alt={relawan.name || 'Relawan'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm flex-shrink-0"
              />
            ) : (
              <InitialsAvatar
                name={relawan.name || relawan.nama || 'Relawan'}
                size={64}
                bgClass="bg-[#0b6f61]"
              />
            )}

            <div className="min-w-0 flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 truncate">
                {relawan.name || relawan.nama || '—'}
              </h3>
              <p className="text-[12.5px] text-slate-500 truncate">{relawan.email || 'Email tidak tersedia'}</p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {isPending ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Menunggu Verifikasi
                  </span>
                ) : (
                  <>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      />
                      {isActive ? 'Aktif & Siaga' : 'Nonaktif'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                      <ShieldCheck size={11} />
                      Terverifikasi
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Communication Bar */}
          <div className="flex items-center gap-2">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold transition-all shadow-xs"
              >
                <MessageSquare size={15} />
                <span>Hubungi via WhatsApp</span>
              </a>
            ) : null}

            {relawan.no_telp && (
              <button
                type="button"
                onClick={handleCopyPhone}
                className="flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[12.5px] font-semibold transition-colors cursor-pointer"
                title="Salin nomor telepon"
              >
                {copiedPhone ? (
                  <>
                    <CheckCheck size={14} className="text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-slate-400" />
                    <span>Salin No.</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Information Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            {/* Phone */}
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                <Phone size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No. Telepon / WA</p>
                <p className="font-semibold text-slate-900 mt-0.5">{relawan.no_telp || '—'}</p>
              </div>
            </div>

            {/* Occupation */}
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                <Briefcase size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pekerjaan / Keahlian</p>
                <p className="font-semibold text-slate-900 mt-0.5">{relawan.pekerjaan || 'Relawan Umum'}</p>
              </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2 flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                <MapPin size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Alamat Domisili</p>
                <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">{relawan.alamat || '—'}</p>
              </div>
            </div>

            {/* Registration Date */}
            {relawan.created_at && (
              <div className="sm:col-span-2 flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Calendar size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Waktu Pendaftaran</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {new Date(relawan.created_at).toLocaleString('id-ID', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Reason / Bio */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Heart size={14} className="text-rose-500" />
              <p className="text-[11.5px] font-bold uppercase tracking-wider text-slate-600">
                Motivasi / Alasan Menjadi Relawan
              </p>
            </div>
            <p className="font-medium text-slate-700 whitespace-pre-line text-[13px] leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200/60">
              &ldquo;{relawan.alasan_relawan || 'Tidak mencantumkan pesan khusus saat mendaftar.'}&rdquo;
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          {isPending ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleAction('ditolak')}
                className="px-4 h-10 rounded-xl text-[13px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {loadingAction === 'ditolak' ? <Loader2 size={14} className="animate-spin" /> : <X size={15} />}
                <span>Tolak Pengajuan</span>
              </button>

              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleAction('terverifikasi')}
                className="px-4 h-10 rounded-xl text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {loadingAction === 'terverifikasi' ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
                <span>Setujui Relawan</span>
              </button>
            </div>
          ) : (
            typeof onToggleStatus === 'function' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onToggleStatus(relawan, !isActive);
                }}
                className={`px-4 h-10 rounded-xl text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Power size={14} />
                <span>{isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
