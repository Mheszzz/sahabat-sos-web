// EmptyState.jsx — Reusable empty state component
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Tidak ada data',
  description = 'Belum ada data yang tersedia saat ini.',
  action = null,
}) {
  return (
    <div className="empty-state">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon size={22} />
      </div>
      <p className="text-[14px] font-semibold text-slate-700">{title}</p>
      {description && (
        <p className="text-[13px] text-slate-400 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
