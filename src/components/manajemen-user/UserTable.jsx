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
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-[#eaedf1]">
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase">ID</th>
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase">Nama Lengkap</th>
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase">Kebutuhan / Peran</th>
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase">Kontak</th>
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase">Wilayah</th>
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase">Status</th>
              <th className="p-4 text-[12px] font-semibold text-slate-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedf1]">
            {data.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-slate-500">Tidak ada data.</td></tr>
            ) : data.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="p-4 text-[13px] font-semibold text-slate-700">{item.id}</td>
                <td className="p-4">
                  <p className="text-[14px] font-bold text-slate-900">{item.nama}</p>
                  <p className="text-[12px] text-slate-500">{item.email}</p>
                </td>
                <td className="p-4 text-[13px] font-medium text-slate-600">{item.disabilitas || item.peran || 'N/A'}</td>
                <td className="p-4 text-[13px] text-slate-600">
                  <div className="flex items-center gap-1.5"><Phone size={12}/>{item.kontak}</div>
                </td>
                <td className="p-4 text-[13px] text-slate-600">
                  <div className="flex items-center gap-1.5"><MapPin size={12}/>{item.lokasi}</div>
                </td>
                <td className="p-4">
                  <Badge variant={item.status === 'Terverifikasi' ? 'success' : item.status === 'Pending Verifikasi' ? 'warning' : 'danger'}>{item.status || 'N/A'}</Badge>
                </td>
                <td className="p-4 text-right">
                  {activeTab === 'pending' ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onVerify(item.id, 'terverifikasi')} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"><Check size={14}/></button>
                      <button onClick={() => onVerify(item.id, 'ditolak')} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"><X size={14}/></button>
                    </div>
                  ) : (
                    <button className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700">Detail</button>
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
