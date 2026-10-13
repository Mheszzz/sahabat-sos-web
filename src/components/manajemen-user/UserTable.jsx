import { useState } from 'react';
import {
  MapPin, Phone, Check, X, Eye, Loader2, MessageSquare,
  Copy, CheckCheck, Power, HeartHandshake, UserPlus,
  RotateCcw, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import InitialsAvatar from '../global/InitialsAvatar';
import RelawanDetailModal from './RelawanDetailModal';
import RelawanStatusConfirmModal from './RelawanStatusConfirmModal';

// ── Skeleton Rows Component ───────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <tr key={i} className="border-b border-[#eaedf1] animate-pulse">
          <td className="py-2.5 px-3 text-center">
            <div className="w-5 h-3.5 bg-slate-100 rounded mx-auto" />
          </td>
          <td className="py-2 px-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="h-3.5 bg-slate-100 rounded w-2/3" />
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          </td>
          <td className="py-2 px-3">
            <div className="h-6 bg-slate-100 rounded-md w-28" />
          </td>
          <td className="py-2 px-3">
            <div className="h-4 bg-slate-100 rounded w-36" />
          </td>
          <td className="py-2 px-3">
            <div className="h-5 bg-slate-100 rounded-md w-24" />
          </td>
          <td className="py-2 px-3 text-center">
            <div className="h-5 bg-slate-100 rounded-full w-16 mx-auto" />
          </td>
          <td className="py-2 px-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-7 h-7 bg-slate-100 rounded-lg" />
              <div className="w-7 h-7 bg-slate-100 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default function UserTable({
  activeTab,
  data = [],
  totalResults = 0,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 15,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
  onVerify,
  onUpdateStatus,
  onOpenAddModal,
  hasActiveFilters = false,
  onResetFilters,
}) {
  const [selectedRelawan, setSelectedRelawan] = useState(null);
  const [loadingRowId, setLoadingRowId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Safe status confirmation modal state
  const [statusConfirm, setStatusConfirm] = useState({
    isOpen: false,
    relawan: null,
    targetStatus: false,
    isLoading: false,
  });

  const handleRowVerify = async (id, status) => {
    try {
      setLoadingRowId(id);
      await onVerify(id, status);
    } catch {
      // Handled in hook
    } finally {
      setLoadingRowId(null);
    }
  };

  const handleCopyPhone = (id, phone) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getWaUrl = (phone, name) => {
    if (!phone) return null;
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    const msg = encodeURIComponent(
      `Halo ${name || 'Relawan'}, kami dari Tim Posko Koordinasi Sahabat SOS.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const openStatusConfirm = (item, targetStatus) => {
    setStatusConfirm({
      isOpen: true,
      relawan: item,
      targetStatus,
      isLoading: false,
    });
  };

  const handleConfirmStatusChange = async (id, isActivating) => {
    try {
      setStatusConfirm((prev) => ({ ...prev, isLoading: true }));
      await onUpdateStatus(id, isActivating);
      setStatusConfirm({ isOpen: false, relawan: null, targetStatus: false, isLoading: false });
    } catch {
      setStatusConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Pagination calculation
  const startIndex = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <div className="bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs">
      {/* Table responsive container */}
      <div className="table-responsive">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-[#eaedf1]">
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider w-[50px] text-center">
                No
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider min-w-[220px]">
                Profil Relawan
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider min-w-[160px]">
                Kontak & WhatsApp
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider min-w-[180px]">
                Alamat Domisili
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider min-w-[140px]">
                Keahlian / Profesi
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center w-[130px]">
                {activeTab === 'pending' ? 'Status Verifikasi' : 'Status Keaktifan'}
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center w-[130px]">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedf1]">
            {isLoading ? (
              <TableSkeleton />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 px-4 text-center">
                  <div className="max-w-md mx-auto space-y-2.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                      {hasActiveFilters ? (
                        <RotateCcw size={22} />
                      ) : activeTab === 'pending' ? (
                        <Sparkles size={22} className="text-teal-600" />
                      ) : (
                        <HeartHandshake size={22} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-800">
                        {hasActiveFilters
                          ? 'Tidak Ada Relawan yang Sesuai'
                          : activeTab === 'pending'
                          ? 'Semua Pengajuan Telah Ditinjau'
                          : 'Belum Ada Relawan Terdaftar'}
                      </h4>
                      <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                        {hasActiveFilters
                          ? 'Coba ubah kata kunci pencarian atau sesuaikan opsi filter yang sedang aktif.'
                          : activeTab === 'pending'
                          ? 'Tidak ada permohonan pendaftaran relawan baru yang menunggu verifikasi saat ini.'
                          : 'Belum ada relawan yang terdata di sistem. Anda dapat menambahkan relawan baru.'}
                      </p>
                    </div>
                    {hasActiveFilters ? (
                      <button
                        onClick={onResetFilters}
                        className="inline-flex items-center gap-1.5 px-3.5 h-8.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-semibold transition-colors cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        <span>Reset Semua Filter</span>
                      </button>
                    ) : activeTab === 'relawan' && typeof onOpenAddModal === 'function' ? (
                      <button
                        onClick={onOpenAddModal}
                        className="inline-flex items-center gap-1.5 px-3.5 h-8.5 rounded-lg bg-[#0b6f61] hover:bg-[#085d52] text-white text-[12px] font-semibold transition-colors shadow-xs cursor-pointer"
                      >
                        <UserPlus size={13} />
                        <span>Tambah Relawan Pertama</span>
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                const nama = item.name || item.nama || 'Relawan';
                const email = item.email || item.accounts?.[0]?.email || '';
                const isActive = item.is_active === true || item.is_active === 1;
                const isDeactivated = activeTab === 'relawan' && !isActive;
                const waUrl = getWaUrl(item.no_telp, nama);

                return (
                  <tr
                    key={item.id ?? index}
                    className={`transition-colors group ${
                      isDeactivated
                        ? 'bg-red-50/80 hover:bg-red-100/70'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* No */}
                    <td className="py-2 px-3 text-center">
                      <span className="text-[11.5px] font-semibold text-slate-500">{rowNumber}</span>
                    </td>

                    {/* Profil Relawan */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          {item.foto_profile ? (
                            <img
                              src={
                                item.foto_profile.startsWith('http')
                                  ? item.foto_profile
                                  : `/storage-file/${item.foto_profile}`
                              }
                              alt={nama}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-2xs"
                            />
                          ) : (
                            <InitialsAvatar
                              name={nama}
                              size={32}
                              bgClass="bg-[#0b6f61]"
                            />
                          )}
                          {/* Dot status keaktifan */}
                          {activeTab === 'relawan' && (
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                isActive ? 'bg-emerald-500' : 'bg-rose-400'
                              }`}
                              title={isActive ? 'Aktif' : 'Nonaktif'}
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`text-[12.5px] font-bold text-slate-900 transition-colors truncate leading-tight ${
                              isDeactivated
                                ? 'group-hover:text-red-700'
                                : 'group-hover:text-[#0b6f61]'
                            }`}
                          >
                            {nama}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">{email || '—'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Kontak & WhatsApp */}
                    <td className="py-2 px-3">
                      {item.no_telp ? (
                        <div className="flex items-center gap-1.5">
                          <div className="inline-flex items-center gap-1 text-[11.5px] text-slate-700 font-medium bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">
                            <Phone size={11} className="text-slate-400" />
                            <span>{item.no_telp}</span>
                          </div>

                          {/* Quick WhatsApp button */}
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-6.5 h-6.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center transition-colors"
                              title="Kirim pesan WhatsApp langsung"
                            >
                              <MessageSquare size={12} />
                            </a>
                          )}

                          {/* Copy Phone button */}
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(item.id, item.no_telp)}
                            className="w-6.5 h-6.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                            title="Salin nomor telepon"
                          >
                            {copiedId === item.id ? (
                              <CheckCheck size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11.5px] text-slate-400">—</span>
                      )}
                    </td>

                    {/* Domisili */}
                    <td className="py-2 px-3">
                      {item.alamat ? (
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-600 max-w-[220px]">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate" title={item.alamat}>
                            {item.alamat}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11.5px] text-slate-400">—</span>
                      )}
                    </td>

                    {/* Pekerjaan / Keahlian */}
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60 max-w-[150px] truncate">
                        {item.pekerjaan || 'Relawan Umum'}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-2 px-3 text-center">
                      {activeTab === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200/90 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Menunggu</span>
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border whitespace-nowrap ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-rose-400'
                            }`}
                          />
                          <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </span>
                      )}
                    </td>

                    {/* Action Column */}
                    <td className="py-2 px-3 text-center">
                      {activeTab === 'pending' ? (
                        <div className="flex items-center justify-center gap-1">
                          {/* Detail button */}
                          <button
                            type="button"
                            onClick={() => setSelectedRelawan(item)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50 flex items-center justify-center transition-all cursor-pointer"
                            title="Tinjau Detail Berkas Pendaftaran"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Approve button */}
                          <button
                            type="button"
                            disabled={loadingRowId === item.id}
                            onClick={() => handleRowVerify(item.id, 'terverifikasi')}
                            className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
                            title="Setujui Relawan"
                          >
                            {loadingRowId === item.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Check size={13} />
                            )}
                          </button>

                          {/* Reject button */}
                          <button
                            type="button"
                            disabled={loadingRowId === item.id}
                            onClick={() => handleRowVerify(item.id, 'ditolak')}
                            className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
                            title="Tolak Pengajuan"
                          >
                            {loadingRowId === item.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <X size={13} />
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          {/* Detail button */}
                          <button
                            type="button"
                            onClick={() => setSelectedRelawan(item)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0b6f61] hover:border-teal-300 hover:bg-teal-50 flex items-center justify-center transition-all cursor-pointer"
                            title="Lihat Profil Lengkap"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Toggle status button with safe confirmation */}
                          <button
                            type="button"
                            onClick={() => openStatusConfirm(item, !isActive)}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                              isActive
                                ? 'bg-white border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50'
                                : 'bg-white border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50'
                            }`}
                            title={isActive ? 'Nonaktifkan Akun Relawan' : 'Aktifkan Kembali Akun Relawan'}
                          >
                            <Power size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination & Items Per Page Selector */}
      {!isLoading && data.length > 0 && (
        <div className="px-4 py-2.5 bg-slate-50/70 border-t border-[#eaedf1] flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-slate-500">
            <p>
              Menampilkan <span className="font-bold text-slate-800">{startIndex}</span>–<span className="font-bold text-slate-800">{endIndex}</span> dari{' '}
              <span className="font-bold text-slate-800">{totalResults}</span> relawan
            </p>

            {typeof onItemsPerPageChange === 'function' && totalResults > 0 && (
              <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                <span className="text-slate-400 text-[11px]">Baris:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                  aria-label="Jumlah baris per halaman"
                  className="h-6.5 px-1.5 rounded-md bg-white border border-slate-200 text-[11.5px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0b6f61] cursor-pointer"
                >
                  {[15, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num} / hal
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => onPageChange(page)}
                      className={`w-7 h-7 rounded-lg text-[11.5px] font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-[#0b6f61] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-0.5 text-slate-400 text-[11px]">
                      …
                    </span>
                  );
                }
                return null;
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Halaman Selanjutnya"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Detail Relawan */}
      <RelawanDetailModal
        isOpen={Boolean(selectedRelawan)}
        onClose={() => setSelectedRelawan(null)}
        relawan={selectedRelawan}
        onVerify={onVerify}
        onToggleStatus={openStatusConfirm}
      />

      {/* Safe Status Confirmation Modal */}
      <RelawanStatusConfirmModal
        isOpen={statusConfirm.isOpen}
        onClose={() => setStatusConfirm({ isOpen: false, relawan: null, targetStatus: false, isLoading: false })}
        relawan={statusConfirm.relawan}
        targetStatus={statusConfirm.targetStatus}
        isLoading={statusConfirm.isLoading}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
}
