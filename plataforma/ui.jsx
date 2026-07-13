/* Primitivos de formulário no estilo do design system (controlados) */
const { useState } = React;

function Field({ label, value, onChange, placeholder, type = 'text', style, min }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', flex: 1, ...style }}>
      {label && <span style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)' }}>{label}</span>}
      <input
        type={type} value={value == null ? '' : value} min={min}
        placeholder={placeholder}
        onChange={e => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          border: `1px solid ${focus ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)', padding: '11px 14px', outline: 'none',
          font: 'var(--text-body-md)', color: 'var(--color-text)', background: '#fff',
          boxShadow: focus ? 'var(--shadow-focus)' : 'none',
          transition: 'all var(--duration-base) var(--ease-standard)', width: '100%', boxSizing: 'border-box',
        }} />
    </label>
  );
}

function TArea({ label, value, onChange, placeholder, rows = 3, style }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', flex: 1, ...style }}>
      {label && <span style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)' }}>{label}</span>}
      <textarea
        value={value == null ? '' : value} rows={rows} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          border: `1px solid ${focus ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)', padding: '11px 14px', outline: 'none', resize: 'vertical',
          font: 'var(--text-body-md)', color: 'var(--color-text)', background: '#fff',
          boxShadow: focus ? 'var(--shadow-focus)' : 'none', width: '100%', boxSizing: 'border-box',
        }} />
    </label>
  );
}

function SelectField({ label, value, onChange, options, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', flex: 1, ...style }}>
      {label && <span style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)' }}>{label}</span>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '11px 12px',
          font: 'var(--text-body-md)', color: 'var(--color-text)', background: '#fff', outline: 'none', width: '100%',
        }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function PageHead({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ font: 'var(--text-display-sm)', color: 'var(--color-dark)', margin: 0 }}>{title}</h1>
        {sub && <p style={{ font: 'var(--text-body-md)', color: 'var(--color-text-muted)', margin: '6px 0 0', maxWidth: 560 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Empty({ children }) {
  return <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-text-muted)', font: 'var(--text-body-md)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>{children}</div>;
}

Object.assign(window, { Field, TArea, SelectField, PageHead, Empty });
