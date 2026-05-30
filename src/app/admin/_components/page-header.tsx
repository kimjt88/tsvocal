import Link from "next/link";

type Crumb = { href: string; label: string };

export function PageHeader({
  title,
  description,
  crumbs,
  action,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {crumbs && crumbs.length > 0 && (
        <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1">
              {i > 0 && <span className="text-slate-300">/</span>}
              <Link href={c.href} className="hover:text-slate-900 transition">
                {c.label}
              </Link>
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
