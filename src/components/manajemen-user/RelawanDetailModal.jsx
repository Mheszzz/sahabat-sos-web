import { useState } from 'react';
import { X, Check, ShieldAlert, Phone, MapPin, Briefcase, Heart, Calendar, Loader2 } from 'lucide-react';
import InitialsAvatar from '../global/InitialsAvatar';

export default function RelawanDetailModal({ isOpen, onClose, relawan, onVerify }) {
  const [loadingAction, setLoadingAction] = useState(null);

  if (!isOpen || !relawan) return null;

  const handleAction = async (status) => {
    try {
      setLoadingAction(status);
      await onVerify(relawan.id, status);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedf1] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 leading-tight">
                {relawan.status_verifikasi === 'pending' ? 'Detail Pengajuan Relawan' : 'Detail Data Relawan'}
              </h2>
              <p className="text-[12px] text-slate-500">
                {relawan.status_verifikasi === 'pending' 
                  ? 'Tinjau informasi pendaftaran relawan sebelum verifikasi' 
                  : 'Informasi profil dan ketersediaan relawan'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-150">
          {relawan.foto_profile ? (
            <img
              src={relawan.foto_profile.startsWith('http') ? relawan.foto_profile : `/storage-file/${relawan.foto_profile}`}
              alt={relawan.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
            />
          ) : (
            <InitialsAvatar name={relawan.name || 'Relawan'} size={56} bgClass="bg-[#006D77]" />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-slate-900 truncate">{relawan.name}</h3>
            <p className="text-[12px] text-slate-500 truncate">{relawan.email || 'Email tidak tersedia'}</p>
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                relawan.status_verifikasi === 'terverifikasi'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {relawan.status_verifikasi === 'terverifikasi' ? 'Terverifikasi' : 'Menunggu Verifikasi'}
              </span>

              {relawan.is_active !== undefined && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  (relawan.is_active === true || relawan.is_active === 1)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {(relawan.is_active === true || relawan.is_active === 1) ? 'Aktif' : 'Nonaktif'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Data List */}
        <div className="space-y-3 text-[13px]">
          <div className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-slate-100">
            <Phone size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">No. Telepon / WhatsApp</p>
              <p className="font-semibold text-slate-800">{relawan.no_telp || '—'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-slate-100">
            <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Alamat Domisili</p>
              <p className="font-semibold text-slate-800">{relawan.alamat || '—'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-slate-100">
            <Briefcase size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pekerjaan</p>
              <p className="font-semibold text-slate-800">{relawan.pekerjaan || '—'}</p>
            </div>
          </div>

          {relawan.alasan_relawan && (
            <div className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-slate-100">
              <Heart size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Alasan Menjadi Relawan</p>
                <p className="font-medium text-slate-700 whitespace-pre-line text-[12.5px] leading-relaxed">
                  {relawan.alasan_relawan}
                </p>
              </div>
            </div>
          )}

          {relawan.created_at && (
            <div className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-slate-100">
              <Calendar size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Waktu Pendaftaran</p>
                <p className="font-semibold text-slate-800">
                  {new Date(relawan.created_at).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          {relawan.status_verifikasi === 'pending' ? (
            <>
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleAction('ditolak')}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {loadingAction === 'ditolak' ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                <span>Tolak Relawan</span>
              </button>

              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleAction('terverifikasi')}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                {loadingAction === 'terverifikasi' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                <span>Setujui Relawan</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-[13px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
