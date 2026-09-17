/** Design tokens — single source for status colors used in JS components. */
export const colors = {
  brand: '#0a271f',
  brandSoft: '#154d3e',
  primary: '#0b6f61',
  primaryHover: '#085d52',
  primaryLight: '#eaf8f5',
  emerald: '#1bb88d',
  danger: '#ef4444',
  success: '#12b76a',
  warning: '#f59e0b',
  info: '#2e90fa',
  bg: '#f5f7f7',
  surface: '#ffffff',
  border: '#e3e8ee',
  text: '#162033',
  muted: '#667085',
};

export const statusClassMap = {
  Online: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
  'Sedang Bertugas': 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
  Offline: 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]',
  Nonaktif: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
  'Tidak Aktif': 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
  Aktif: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
  'SOS Darurat': 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
  'Menunggu Respon': 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]',
  'Sedang Ditangani': 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
  Selesai: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
  Teratasi: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
  Dibatalkan: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
  Laporan: 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]',
  Terverifikasi: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
  Pending: 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]',
  'Pending Verifikasi': 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]',
  'Daksa (Kursi Roda)': 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
  Tunanetra: 'bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]',
  'Rungu & Wicara': 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]',
  'Disabilitas Rungu': 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]',
  Psikososial: 'bg-[#fdf2f8] text-[#be185d] border-[#fbcfe8]',
  Epilepsi: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
  'Disabilitas Ganda': 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]',
  default: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const statusDotMap = {
  Online: 'bg-[#059669]',
  'Sedang Bertugas': 'bg-[#2563eb]',
  Offline: 'bg-slate-400',
  Nonaktif: 'bg-red-500',
  'Tidak Aktif': 'bg-red-500',
  Aktif: 'bg-red-500',
  'SOS Darurat': 'bg-red-500',
  'Menunggu Respon': 'bg-amber-500',
  'Sedang Ditangani': 'bg-blue-500',
  Selesai: 'bg-green-600',
  Teratasi: 'bg-green-600',
  Dibatalkan: 'bg-red-500',
  Terverifikasi: 'bg-green-600',
  'Pending Verifikasi': 'bg-amber-500',
  Pending: 'bg-amber-500',
};

export function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'AD';
  return parts.map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}
