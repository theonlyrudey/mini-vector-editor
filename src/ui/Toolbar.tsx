export function Toolbar() {
  return (
    <div
      style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 12px',
        borderBottom: '1px solid #2a2a2a',
        background: '#111',
        color: '#ddd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 14,
      }}
    >
      <strong>Mini Vector Editor</strong>
      <div style={{ flex: 1 }} />
      <button>Pen</button>
      <button>Select</button>
      <button>Move</button>
      <input type="color" title="Fill" />
      <button disabled>Export SVG</button>
    </div>
  );
}