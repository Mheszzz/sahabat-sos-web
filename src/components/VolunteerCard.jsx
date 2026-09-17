import { Phone, MessageSquare } from 'lucide-react';

export default function VolunteerCard({ relawan }) {
  const isBertugas = relawan.status === 'Bertugas';

  return (
    <div className="flex items-center justify-between rounded-2xl px-2 py-3 transition-colors hover:bg-slate-50">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-extrabold shadow-sm flex-shrink-0 ${relawan.avatarBg}`}>
          {relawan.avatar}
        </div>

        <div className="min-w-0">
          <div className="flex max-w-full items-center gap-2">
            <p className="truncate text-[13px] font-bold text-slate-900">{relawan.nama}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${isBertugas ? 'bg-[#fff7ed] text-[#b45309]' : 'bg-[#ecfdf5] text-[#0b7a64]'}`}>
              {relawan.status}
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            {relawan.jarak} · {relawan.eta}
          </p>
        </div>
      </div>

      <div className="ml-2 flex flex-shrink-0 items-center gap-1.5">
        <button
          onClick={() => alert(`Memanggil ${relawan.nama} (${relawan.kontak})`)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          title="Telepon"
        >
          <Phone size={12} />
        </button>

        <button
          onClick={() => alert(`Kirim pesan ke ${relawan.nama}`)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          title="Kirim Pesan"
        >
          <MessageSquare size={12} />
        </button>
      </div>
    </div>
  );
}
