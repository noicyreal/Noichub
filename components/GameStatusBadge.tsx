export function GameStatusBadge({ status }: { status: 'undetected' | 'patched' }) {
  return <span className={`supported-badge script-status ${status}`} aria-label={`Script status: ${status === 'patched' ? 'Patched' : 'Undetected'}`}>
    <span className="status-dot" />{status === 'patched' ? 'Patched' : 'Undetected'}
  </span>;
}
