// PageHeader.jsx — Standardized page header used across all pages
export default function PageHeader({ title, description, actions, border = true }) {
  return (
    <div className={`page-header ${border ? 'pb-5 mb-2 border-b border-slate-200' : ''}`}>
      <div className="min-w-0">
        <h1 className="page-header-title">{title}</h1>
        {description && (
          <p className="page-header-desc">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
