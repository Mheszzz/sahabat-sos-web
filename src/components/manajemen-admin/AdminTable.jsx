import { Eye, Shield, Power, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import InitialsAvatar from '../global/InitialsAvatar';

/**
 * Komponen untuk menampilkan badge permission secara ringkas.
 * Berdasarkan key yang datang dari backend: verifikasi_relawan, kelola_laporan
 */
function PermissionChip({ perm }) {
  const labels = {
    verifikasi_relawan: 'Verifikasi Relawan',
    kelola_laporan: 'Kelola Laporan',
  };
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">
      <CheckCircle2 size={9} />
      {labels[perm] || perm}
    </span>
  );
}

/**
 * Memformat tanggal dari ISO string ke format lokal Indonesia.
 * Mengembalikan null jika tanggal tidak valid.
 */
function formatTanggal(isoString) {
  if (!isoString) return null;
  try {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

// ─── Loading Skeleton Row ─────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-[#eaedf1]">
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-3/4" />
          <div className="h-3 bg-slate-100 rounded-lg animate-pulse w-1/2 mt-2" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminTable({ admins, isLoading, error, onDetail, onPermissions, onToggleStatus }) {
  // ── Loading State ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white border border-[#eaedf1] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-[#eaedf1]">
                <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-[280px]">Profil Admin</th>
                <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Hak Akses</th>
                <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Info Akun</th>
                <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedf1]">
              {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-white border border-red-100 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
          <XCircle size={24} className="text-red-500" />
        </div>
        <p className="text-[14px] font-bold text-red-600">{error}</p>
        <p className="text-[12px] text-slate-400 mt-1">Periksa koneksi jaringan atau coba muat ulang halaman.</p>
      </div>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────────
  if (!Array.isArray(admins) || admins.length === 0) {
    return (
      <div className="bg-white border border-[#eaedf1] rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
          <AlertCircle size={24} className="text-slate-400" />
        </div>
        <p className="text-[14px] font-bold text-slate-700">Tidak ada admin ditemukan</p>
        <p className="text-[12px] text-slate-400 mt-1">Coba ubah kata kunci pencarian atau filter yang aktif.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#eaedf1] rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-[#eaedf1]">
              {/* Kolom 1: Profil */}
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[280px]">
                Profil Admin
              </th>
              {/* Kolom 2: Hak Akses — data tersedia dari backend (field permissions) */}
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Hak Akses (Permissions)
              </th>
              {/* Kolom 3: Info Akun — data dari created_at & permissions_granted_at */}
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Info Akun
              </th>
              {/* Kolom 4: Aksi */}
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedf1]">
            {admins.map((admin) => {
              const nama = admin.name || admin.nama || 'Admin';
              const permissions = Array.isArray(admin.permissions) ? admin.permissions : [];
              const hasPermissions = permissions.length > 0;
              const terdaftar = formatTanggal(admin.created_at);
              const aksesDisetujui = formatTanggal(admin.permissions_granted_at);
              const isAdmin = (admin.role || '').toLowerCase() === 'admin';

              return (
                <tr
                  key={admin.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* ── Kolom 1: Profil ── */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={nama} size={40} />
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {nama}
                        </p>
                        <p className="text-[12px] text-slate-500 truncate">{admin.email || '—'}</p>
                        {/* Role Badge */}
                        <span
                          className={`mt-1 inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAdmin
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {admin.role || 'admin'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* ── Kolom 2: Hak Akses ── */}
                  <td className="p-4">
                    {hasPermissions ? (
                      <div className="flex flex-col gap-1.5">
                        {permissions.map((perm) => (
                          <PermissionChip key={perm} perm={perm} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                        <span className="text-[12px] text-slate-400 italic">Belum ada hak akses</span>
                      </div>
                    )}
                  </td>

                  {/* ── Kolom 3: Info Akun ── */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      {terdaftar && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Clock size={11} className="text-slate-400 flex-shrink-0" />
                          <span>Terdaftar: <span className="font-semibold text-slate-700">{terdaftar}</span></span>
                        </div>
                      )}
                      {aksesDisetujui ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Shield size={11} className="text-blue-400 flex-shrink-0" />
                          <span>Akses diberikan: <span className="font-semibold text-slate-700">{aksesDisetujui}</span></span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Shield size={11} className="text-slate-300 flex-shrink-0" />
                          <span className="italic">Belum ada akses diberikan</span>
                        </div>
                      )}
                      {/* Catatan: last_login, kasus_ditangani, kasus_aktif, kasus_selesai
                          belum tersedia di endpoint GET /superadmin/admins.
                          Akan ditampilkan otomatis jika backend menambahkan field tersebut. */}
                    </div>
                  </td>

                  {/* ── Kolom 4: Aksi ── */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Lihat Aktivitas */}
                      <button
                        onClick={() => onDetail(admin)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 flex items-center justify-center transition-all cursor-pointer"
                        title="Lihat Aktivitas"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Kelola Hak Akses */}
                      <button
                        onClick={() => onPermissions(admin)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center transition-all cursor-pointer"
                        title="Kelola Hak Akses"
                      >
                        <Shield size={14} />
                      </button>

                      {/* Aktifkan / Nonaktifkan (Cabut Akses) */}
                      <button
                        onClick={() => onToggleStatus(admin)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 flex items-center justify-center transition-all cursor-pointer"
                        title={hasPermissions ? 'Cabut Semua Akses' : 'Lihat Hak Akses'}
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer: info jumlah data */}
      <div className="px-5 py-3 bg-slate-50/60 border-t border-[#eaedf1] flex items-center justify-between">
        <p className="text-[12px] text-slate-500">
          Menampilkan <span className="font-bold text-slate-700">{admins.length}</span> admin
        </p>
      </div>
    </div>
  );
}
