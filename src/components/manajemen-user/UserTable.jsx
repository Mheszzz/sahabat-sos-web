import { Search, MapPin, Phone, Check, X } from 'lucide-react';
import Badge from '../global/Badge';

export default function UserTable({ activeTab, search, setSearch, data, onVerify, onUpdateStatus }) {
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
              <th style={{ width: '60px', minWidth: '60px' }}>ID</th>
              <th style={{ minWidth: '160px' }}>Nama Lengkap</th>
              <th style={{ minWidth: '140px' }}>No. Telepon</th>
              <th style={{ minWidth: '200px' }}>Alamat</th>
              <th style={{ minWidth: '120px' }}>Status Aktif</th>
              {activeTab === 'pending' && (
                <th style={{ minWidth: '120px' }}>Status Verifikasi</th>
              )}
              <th style={{ width: '120px', minWidth: '120px' }} className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-slate-500">Tidak ada data.</td></tr>
            ) : data.map(item => (
              <tr key={item.id}>
                {/* ID */}
                <td className="min-w-0">
                  <span className="block text-[12px] font-extrabold text-slate-900">{item.id}</span>
                </td>

                {/* Nama + Email */}
                <td className="min-w-0">
                  <p className="text-[14px] font-bold text-slate-900 break-words">{item.name ?? item.nama ?? '—'}</p>
                  <p className="text-[12px] text-slate-400 break-words">{item.email ?? ''}</p>
                </td>

                {/* No. Telepon */}
                <td className="min-w-0">
                  {item.no_telp ? (
                    <div className="flex items-center gap-1.5 text-[13px] text-slate-600">
                      <Phone size={12} className="flex-shrink-0" />
                      <span>{item.no_telp}</span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-slate-400">—</span>
                  )}
                </td>

                {/* Alamat */}
                <td className="min-w-0">
                  {item.alamat ? (
                    <div className="flex items-start gap-1.5 text-[13px] text-slate-600">
                      <MapPin size={12} className="flex-shrink-0 mt-0.5" />
                      <span className="break-words">{item.alamat}</span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-slate-400">—</span>
                  )}
                </td>

                {/* Status Aktif (is_active boolean) */}
                <td className="min-w-0">
                  {item.is_active === true || item.is_active === 1 ? (
                    <Badge variant="success">Aktif</Badge>
                  ) : item.is_active === false || item.is_active === 0 ? (
                    <Badge variant="danger">Nonaktif</Badge>
                  ) : (
                    <Badge variant="default">—</Badge>
                  )}
                </td>

                {/* Status Verifikasi (hanya tab pending) */}
                {activeTab === 'pending' && (
                  <td className="min-w-0">
                    <Badge variant={
                      item.status_verifikasi === 'terverifikasi' ? 'success'
                      : item.status_verifikasi === 'pending' ? 'warning'
                      : 'danger'
                    }>
                      {item.status_verifikasi ?? 'pending'}
                    </Badge>
                  </td>
                )}

                {/* Aksi */}
                <td className="text-right min-w-0">
                  {activeTab === 'pending' ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onVerify(item.id, 'terverifikasi')}
                        title="Setujui"
                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => onVerify(item.id, 'ditolak')}
                        title="Tolak"
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      {onUpdateStatus && (
                        <button
                          onClick={() => onUpdateStatus(item.id, !(item.is_active === true || item.is_active === 1))}
                          title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            item.is_active
                              ? 'bg-red-50 text-red-500 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {item.is_active ? <X size={14} /> : <Check size={14} />}
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
    </div>
  );
}
