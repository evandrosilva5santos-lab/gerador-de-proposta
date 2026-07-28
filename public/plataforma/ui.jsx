/* Primitivos de formulário no estilo do design system (controlados) */
const { useState } = React;

function Field({ label, value, onChange, placeholder, type = 'text', style, min, max }) {
  const [focus, setFocus] = useState(false);
  return (
    /* flexGrow só no eixo horizontal: flexBasis 'auto' evita o campo esticar quando o pai é uma coluna */
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', flex: '1 1 auto', minWidth: 160, ...style }}>
      {label && <span style={{ font: 'var(--text-body-sm)', lineHeight: 1.3, fontWeight: 600, color: 'var(--color-dark)' }}>{label}</span>}
      <input
        type={type} value={value == null ? '' : value} min={min} max={max}
        placeholder={placeholder}
        onChange={e => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          border: `1px solid ${focus ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)', padding: '11px 14px', outline: 'none',
          font: 'var(--text-body-md)', color: 'var(--color-text)', background: 'var(--color-surface, #fff)',
          boxShadow: focus ? 'var(--shadow-focus)' : 'none',
          transition: 'all var(--duration-base) var(--ease-standard)', width: '100%', boxSizing: 'border-box',
        }} />
    </label>
  );
}

function TArea({ label, value, onChange, placeholder, rows = 3, style }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', flex: '1 1 180px', minWidth: 160, ...style }}>
      {label && <span style={{ font: 'var(--text-body-sm)', lineHeight: 1.3, fontWeight: 600, color: 'var(--color-dark)' }}>{label}</span>}
      <textarea
        value={value == null ? '' : value} rows={rows} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          border: `1px solid ${focus ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)', padding: '11px 14px', outline: 'none', resize: 'vertical',
          font: 'var(--text-body-md)', color: 'var(--color-text)', background: 'var(--color-surface, #fff)',
          boxShadow: focus ? 'var(--shadow-focus)' : 'none', width: '100%', boxSizing: 'border-box',
        }} />
    </label>
  );
}

function SelectField({ label, value, onChange, options, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', flex: '1 1 180px', minWidth: 160, ...style }}>
      {label && <span style={{ font: 'var(--text-body-sm)', lineHeight: 1.3, fontWeight: 600, color: 'var(--color-dark)' }}>{label}</span>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '11px 12px',
          font: 'var(--text-body-md)', color: 'var(--color-text)', background: 'var(--color-surface, #fff)', outline: 'none', width: '100%',
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

/* Modal do app — usa as cores do tema (o Dialog do design system é sempre branco) */
function Modal({ title, children, onClose, actions, width }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,2,8,0.7)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: width || 460, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', padding: 28, fontFamily: 'var(--font-body)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div style={{ font: 'var(--text-heading-md)', color: 'var(--color-dark)' }}>{title}</div>
          {onClose && <button onClick={onClose} style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 20, lineHeight: 1, color: 'var(--color-text-muted)' }}>×</button>}
        </div>
        <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text)' }}>{children}</div>
        {actions && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>{actions}</div>}
      </div>
    </div>
  );
}

/* Confirmação destrutiva padrão */
function ConfirmDialog({ title, children, onClose, onConfirm, confirmLabel }) {
  const DS_M = window.STARTINCDesignSystem_dd2482;
  return (
    <Modal title={title} onClose={onClose} actions={<React.Fragment>
      <DS_M.Button variant="ghost" onClick={onClose}>Cancelar</DS_M.Button>
      <DS_M.Button variant="primary" onClick={onConfirm}>{confirmLabel || 'Excluir'}</DS_M.Button>
    </React.Fragment>}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', background: 'var(--color-primary-tint)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 18px/1 var(--font-body)' }}>!</span>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </Modal>
  );
}
