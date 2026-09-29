// Badge.jsx — Unified status badge system
// Semantic colors follow: RED=emergency, GREEN=active/success, AMBER=pending/warning, BLUE=info, SLATE=neutral

const variantMap = {
  // Status operasional
  'Online':           { cls: 'badge badge-green',  dot: '#059669',  label: 'Online' },
  'Offline':          { cls: 'badge badge-slate',  dot: '#94A3B8',  label: 'Offline' },
  'Sedang Bertugas':  { cls: 'badge badge-blue',   dot: '#2563EB',  label: 'Bertugas' },
  'Bertugas':         { cls: 'badge badge-blue',   dot: '#2563EB',  label: 'Bertugas' },
  'Siaga':            { cls: 'badge badge-amber',  dot: '#D97706',  label: 'Siaga' },

  // Status akun / verifikasi
  'Aktif':            { cls: 'badge badge-green',  dot: '#059669',  label: 'Aktif' },
  'Nonaktif':         { cls: 'badge badge-slate',  dot: '#94A3B8',  label: 'Nonaktif' },
  'Terverifikasi':    { cls: 'badge badge-green',  dot: '#059669',  label: 'Terverifikasi' },
  'Ditolak':          { cls: 'badge badge-red',    dot: '#DC2626',  label: 'Ditolak' },
  'Pending Verifikasi': { cls: 'badge badge-amber', dot: '#D97706', label: 'Pending' },
  'Menunggu':         { cls: 'badge badge-amber',  dot: '#D97706',  label: 'Menunggu' },

  // Status laporan / kasus
  'SOS Darurat':      { cls: 'badge badge-red',    dot: '#DC2626',  label: 'SOS Darurat' },
  'Sedang Ditangani': { cls: 'badge badge-blue',   dot: '#2563EB',  label: 'Ditangani' },
  'Menunggu Respon':  { cls: 'badge badge-amber',  dot: '#D97706',  label: 'Menunggu Respon' },
  'Selesai':          { cls: 'badge badge-green',  dot: '#059669',  label: 'Selesai' },
  'Dibatalkan':       { cls: 'badge badge-slate',  dot: '#94A3B8',  label: 'Dibatalkan' },

  // Disabilitas types (netral)
  'default':          { cls: 'badge badge-slate',  dot: null,       label: null },
};

export default function Badge({
  variant = 'default',
  children,
  customColor,
  showDot = false,
  isPill = false,
  className = '',
}) {
  const config = variantMap[variant] || variantMap['default'];
  const label = children || config.label || variant;
  const cls = customColor
    ? `badge ${customColor}`
    : config.cls;

  return (
    <span
      className={`${cls} ${isPill ? 'rounded-full' : ''} ${className}`}
      style={{ fontSize: '11.5px' }}
    >
      {showDot && config.dot && (
        <span
          className="inline-block rounded-full flex-shrink-0"
          style={{ width: 6, height: 6, background: config.dot }}
        />
      )}
      {label}
    </span>
  );
}
