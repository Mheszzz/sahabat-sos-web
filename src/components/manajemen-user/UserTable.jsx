import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Phone, Check, X, Eye, Loader2 } from 'lucide-react';
import Badge from '../global/Badge';
import RelawanDetailModal from './RelawanDetailModal';

export default function UserTable({ activeTab, search, setSearch, data, onVerify, onUpdateStatus }) {
  const [searchParams] = useSearchParams();
  const [selectedRelawan, setSelectedRelawan] = useState(null);
  const [loadingRowId, setLoadingRowId] = useState(null);

  useEffect(() => {
    const targetId = searchParams.get('id');
    if (targetId && data && data.length > 0) {
      const found = data.find(item => String(item.id) === String(targetId));
      if (found) {
        setSelectedRelawan(found);
      }
    }
  }, [searchParams, data]);

  const handleRowVerify = async (id, status) => {
    try {
      setLoadingRowId(id);
      await onVerify(id, status);
    } catch {
      // Handled
    } finally {
      setLoadingRowId(null);
    }
  };

  return (
    <div className="bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, kontak, lokasi..."
            className="w-full h-8 pr-3 text-[12px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 pl-8"
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '70px', minWidth: '70px', textAlign: 'center' }} className="!text-center !font-bold !text-slate-900">No</th>
              <th style={{ minWidth: '180px', textAlign: 'center' }} className="!text-center !font-bold !text-slate-900">Nama Lengkap</th>
              <th style={{ minWidth: '150px', textAlign: 'center' }} className="!text-center !font-bold !text-slate-900">No. Telepon</th>
              <th style={{ minWidth: '220px', textAlign: 'center' }} className="!text-center !font-bold !text-slate-900">Alamat</th>
              {activeTab === 'pending' ? (
                <>
                  <th style={{ minWidth: '140px', textAlign: 'center' }} className="!text-center !font-bold !text-slate-900">Pekerjaan</th>
                  <th style={{ minWidth: '140px', textAlign: 'center' }} className="!text-center !font-bold !text-slate-900">Status Verifikasi</th>
                </>
              ) : (
                <th style={{ minWidth: '130px', textAlign: 'center' }} className="!text-center !font-bold !text-slate-900">Status Aktif</th>
              )}
              <th style={{ width: '200px', minWidth: '200px', textAlign: 'center' }} className="!text-center !font-bold !text-slate-900">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">Tidak ada data.</td></tr>
            ) : data.map((item, index) => (
              <tr key={item.id ?? index}>
                {/* No Urut */}
                <td className="min-w-0 text-center" style={{ textAlign: 'center' }}>
                  <span className="text-[12px] font-bold text-slate-700">{index + 1}</span>
                </td>

                {/* Nama + Email */}
                <td className="min-w-0 text-center" style={{ textAlign: 'center' }}>
                  <p className="text-[14px] font-bold text-slate-900 break-words">{item.name ?? item.nama ?? '—'}</p>
                  {item.email && <p className="text-[12px] text-slate-400 break-words">{item.email}</p>}
                </td>

                {/* No. Telepon */}
                <td className="min-w-0 text-center" style={{ textAlign: 'center' }}>
                  {item.no_telp ? (
                    <div className="inline-flex items-center justify-center gap-1.5 text-[13px] text-slate-600">
                      <Phone size={12} className="flex-shrink-0" />
                      <span>{item.no_telp}</span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-slate-400">—</span>
                  )}
                </td>

                {/* Alamat */}
                <td className="min-w-0 text-center" style={{ textAlign: 'center' }}>
                  {item.alamat ? (
                    <div className="inline-flex items-center justify-center gap-1.5 text-[13px] text-slate-600">
                      <MapPin size={12} className="flex-shrink-0" />
                      <span className="break-words">{item.alamat}</span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-slate-400">—</span>
                  )}
                </td>

                {/* Kolom Pekerjaan (hanya tab pending) */}
                {activeTab === 'pending' && (
                  <td className="min-w-0 text-center" style={{ textAlign: 'center' }}>
                    <span className="text-[13px] text-slate-700 font-medium">{item.pekerjaan || '—'}</span>
                  </td>
                )}

                {/* Status Aktif (hanya tab relawan terdaftar) */}
                {activeTab !== 'pending' && (
                  <td className="min-w-0 text-center" style={{ textAlign: 'center' }}>
                    <div className="inline-flex justify-center">
                      {item.is_active === true || item.is_active === 1 ? (
                        <Badge variant="success">Aktif</Badge>
                      ) : item.is_active === false || item.is_active === 0 ? (
                        <Badge variant="danger">Nonaktif</Badge>
                      ) : (
                        <Badge variant="default">—</Badge>
                      )}
                    </div>
                  </td>
                )}

                {/* Status Verifikasi (hanya tab pending) */}
                {activeTab === 'pending' && (
                  <td className="min-w-0 text-center" style={{ textAlign: 'center' }}>
                    <div className="inline-flex justify-center">
                      <Badge variant={
                        item.status_verifikasi === 'terverifikasi' ? 'success'
                        : item.status_verifikasi === 'pending' ? 'warning'
                        : 'danger'
                      }>
                        {item.status_verifikasi ?? 'pending'}
                      </Badge>
                    </div>
                  </td>
                )}

                {/* Aksi */}
                <td className="text-center min-w-0" style={{ textAlign: 'center' }}>
                  {activeTab === 'pending' ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedRelawan(item)}
                        title="Lihat Detail Pendaftaran"
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 flex items-center gap-1 hover:bg-slate-200 text-[12px] font-semibold transition-colors"
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Detail</span>
                      </button>

                      <button
                        disabled={loadingRowId === item.id}
                        onClick={() => handleRowVerify(item.id, 'terverifikasi')}
                        title="Setujui Relawan"
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center gap-1 hover:bg-emerald-100 text-[12px] font-semibold transition-colors disabled:opacity-50"
                      >
                        {loadingRowId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
                        <span>Setujui</span>
                      </button>

                      <button
                        disabled={loadingRowId === item.id}
                        onClick={() => handleRowVerify(item.id, 'ditolak')}
                        title="Tolak Relawan"
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 flex items-center gap-1 hover:bg-red-100 text-[12px] font-semibold transition-colors disabled:opacity-50"
                      >
                        {loadingRowId === item.id ? <Loader2 size={13} className="animate-spin" /> : <X size={14} />}
                        <span>Tolak</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedRelawan(item)}
                        title="Lihat Detail Relawan"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 flex items-center gap-1 hover:bg-slate-200 text-[12px] font-semibold transition-colors"
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Detail</span>
                      </button>

                      {onUpdateStatus && (
                        <button
                          onClick={() => onUpdateStatus(item.id, !(item.is_active === true || item.is_active === 1))}
                          title={item.is_active ? 'Nonaktifkan Relawan' : 'Aktifkan Relawan'}
                          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[12px] font-semibold transition-colors ${
                            item.is_active
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {item.is_active ? (
                            <>
                              <X size={14} />
                              <span>Nonaktifkan</span>
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              <span>Aktifkan</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Relawan */}
      <RelawanDetailModal
        isOpen={!!selectedRelawan}
        onClose={() => setSelectedRelawan(null)}
        relawan={selectedRelawan}
        onVerify={onVerify}
      />
    </div>
  );
}
