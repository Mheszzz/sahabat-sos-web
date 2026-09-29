// LoadingSpinner.jsx — Reusable loading state component
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Memuat data...', size = 20, className = '' }) {
  return (
    <div className={`loading-row ${className}`}>
      <Loader2 size={size} className="animate-spin text-slate-400" />
      <span className="text-[13px] font-medium text-slate-500">{text}</span>
    </div>
  );
}
