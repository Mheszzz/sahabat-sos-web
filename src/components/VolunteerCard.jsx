import { Phone, MessageSquare } from 'lucide-react';

export default function VolunteerCard({ relawan }) {
  const isBertugas = relawan.status === 'Bertugas';

  return (
    <div className="flex items-center justify-between py-2.5 px-1 hover:bg-slate-50/80 rounded-xl transition-colors">
      {/* Left: Avatar & Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs ${relawan.avatarBg}`}>
          {relawan.avatar}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-bold text-slate-900 truncate leading-tight">
              {relawan.nama}
            </p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 leading-none ${
              isBertugas ? 'bg-[#fffbeb] text-[#d97706]' : 'bg-[#f0fdf4] text-[#16a34a]'
            }`}>
              {relawan.status}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-medium mt-1 leading-tight">
            {relawan.jarak} · {relawan.eta}
          </p>
        </div>
      </div>

      {/* Right: Phone & Message Quick Buttons */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => alert(`Memanggil ${relawan.nama} (${relawan.kontak})`)}
          className="w-7 h-7 rounded-lg border border-[#e2e8f0] bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Telepon"
        >
          <Phone size={12} />
        </button>

        <button
          onClick={() => alert(`Kirim pesan ke ${relawan.nama}`)}
          className="w-7 h-7 rounded-lg border border-[#e2e8f0] bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Kirim Pesan"
        >
          <MessageSquare size={12} />
        </button>
      </div>
    </div>
  );
}
