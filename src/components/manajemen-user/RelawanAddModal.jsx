import { useState } from 'react';
import { UserPlus, X, Loader2, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { adminService } from '../../api/services/adminService';

export default function RelawanAddModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    no_telp: '',
    alamat: '',
    pekerjaan: '',
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setForm({ name: '', email: '', no_telp: '', alamat: '', pekerjaan: '' });
    setIsConfirming(false);
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    try {
      setLoading(true);
      setError('');
      await adminService.registerRelawan({
        name: form.name,
        email: form.email,
        no_telp: form.no_telp,
        alamat: form.alamat,
        pekerjaan: form.pekerjaan,
      });
      handleClose();
      onSave();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : '') ||
        'Gagal mendaftarkan relawan. Coba lagi.';
      setError(msg);
      setIsConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#eaedf1] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserPlus size={16} />
            </div>
            <h2 className="text-[17px] font-bold text-slate-900">Tambah Relawan Baru</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Info Google SSO */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 text-blue-800 text-[12px] leading-relaxed">
          <Info size={15} className="flex-shrink-0 mt-0.5 text-blue-600" />
          <span>
            Relawan akan login di aplikasi mobile menggunakan <strong>Masuk dengan Akun Google</strong> dengan email terdaftar. Kata sandi tidak diperlukan.
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-700 text-[12px] font-semibold">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Confirm Alert */}
        {isConfirming && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-amber-800 text-[12px] font-semibold">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span>
              Konfirmasi: Daftarkan relawan untuk <strong>{form.email}</strong>? Akun akan langsung berstatus terverifikasi.
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px] focus:outline-none focus:border-emerald-500"
              placeholder="Contoh: Siti Rahayu"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Email Google Relawan *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px] focus:outline-none focus:border-emerald-500"
              placeholder="contoh: relawan@gmail.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Pekerjaan / Keahlian
            </label>
            <input
              type="text"
              value={form.pekerjaan}
              onChange={(e) => setForm({ ...form, pekerjaan: e.target.value })}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px] focus:outline-none focus:border-emerald-500"
              placeholder="Contoh: Tim Medis, SAR, Mahasiswa"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              No. Telepon *
            </label>
            <input
              type="text"
              required
              value={form.no_telp}
              onChange={(e) => setForm({ ...form, no_telp: e.target.value })}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px] focus:outline-none focus:border-emerald-500"
              placeholder="08xxxxxxxxxx"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Alamat *
            </label>
            <input
              type="text"
              required
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px] focus:outline-none focus:border-emerald-500"
              placeholder="Jl. Contoh No. 1, Kota"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 h-10 rounded-xl bg-slate-100 text-slate-700 text-[13px] font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 h-10 rounded-xl bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /><span>Mendaftarkan...</span></>
              ) : isConfirming ? (
                <><CheckCircle2 size={14} /><span>Ya, Daftarkan</span></>
              ) : (
                <span>Lanjutkan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
