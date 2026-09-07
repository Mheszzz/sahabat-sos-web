export default function ProgressBarChart({ items, title, subtitle }) {
  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          {subtitle && (
            <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
          )}
        </div>
      )}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const pct = Math.round((item.count / item.total) * 100);
          return (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600 font-medium leading-tight">{item.label}</span>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-xs text-slate-400">{item.count} kasus</span>
                  <span className="text-xs font-bold text-slate-700 w-7 text-right">{pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
