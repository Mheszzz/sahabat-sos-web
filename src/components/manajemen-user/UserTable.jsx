import { Search, MapPin, Phone, Check, X } from 'lucide-react';
import Badge from '../global/Badge';

export default function UserTable({ activeTab, search, setSearch, data, onVerify }) {
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
              <th style={{ minWidth: '140px' }}>Kebutuhan / Peran</th>
              <th style={{ minWidth: '140px' }}>Kontak</th>
              <th style={{ minWidth: '200px' }}>Wilayah</th>
              <th style={{ minWidth: '130px' }}>Status</th>
              <th style={{ width: '100px', minWidth: '100px' }} className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-slate-500">Tidak ada data.</td></tr>
            ) : data.map(item => (
              <tr key={item.id}>
                <td className="min-w-0">
                  <span className="block text-[12px] font-extrabold text-slate-900 break-words">{item.id}</span>
                </td>
                <td className="min-w-0">
                  <p className="text-[14px] font-bold text-slate-900 break-words">{item.nama}</p>
                  <p className="text-[12px] text-slate-500 break-words">{item.email}</p>
                </td>
                <td className="min-w-0">
                  <span className="block text-[13px] font-medium text-slate-600 break-words">{item.disabilitas || item.peran || 'N/A'}</span>
                </td>
                <td className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[13px] text-slate-600 break-words whitespace-nowrap"><Phone size={12}/>{item.kontak}</div>
                </td>
                <td className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[13px] text-slate-600 break-words"><MapPin size={12} className="flex-shrink-0"/><span>{item.lokasi}</span></div>
                </td>
                <td className="min-w-0">
                  <Badge variant={item.status === 'Terverifikasi' ? 'success' : item.status === 'Pending Verifikasi' ? 'warning' : 'danger'}>{item.status || 'N/A'}</Badge>
                </td>
                <td className="text-right min-w-0">
                  {activeTab === 'pending' ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onVerify(item.id, 'terverifikasi')} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"><Check size={14}/></button>
                      <button onClick={() => onVerify(item.id, 'ditolak')} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"><X size={14}/></button>
                    </div>
                  ) : (
                    <button className="btn-base btn-secondary h-8 rounded-lg px-2.5 text-[11px]">
                      Detail
                    </button>
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
