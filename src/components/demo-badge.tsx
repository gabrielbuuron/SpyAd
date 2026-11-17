export function DemoBadge({ compact = false }: { compact?: boolean }) {
  return <span className="demo-badge"><span aria-hidden="true"/>{compact ? 'Demo' : 'Ambiente demonstrativo'}</span>;
}
