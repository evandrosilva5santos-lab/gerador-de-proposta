/* Shell da plataforma — sidebar + roteamento */
const DS_A = window.STARTINCDesignSystem_dd2482;

const NAV = [
  { id: 'editor', label: 'Nova proposta', icon: '✦' },
  { id: 'propostas', label: 'Propostas', icon: '▤' },
  { id: 'servicos', label: 'Serviços', icon: '◈' },
  { id: 'bonus', label: 'Bonificações', icon: '❋' },
];

function App() {
  const [db, setDb] = React.useState(() => StartDB.load());
  const [page, setPage] = React.useState('editor');
  const [highlight, setHighlight] = React.useState(null);

  const update = (changes) => setDb(prev => { const next = { ...prev, ...changes }; StartDB.save(next); return next; });
  const go = (p, hl) => { setHighlight(hl || null); setPage(p); window.scrollTo(0, 0); };

  // sincroniza views registradas pela página da proposta em outra aba
  React.useEffect(() => {
    const onFocus = () => setDb(StartDB.load());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)', background: 'var(--color-bg-subtle)' }}>
      <aside data-screen-label="Menu lateral" style={{ width: 232, flexShrink: 0, background: 'var(--color-dark)', color: '#fff', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '26px 22px 20px', borderBottom: '1px solid var(--color-border-dark)' }}>
          <img src="assets/logos/start-inc-negative-white.png" alt="START INC." style={{ height: 34, display: 'block' }} />
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-on-dark-muted)', marginTop: 10, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>Plataforma comercial</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 14 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => go(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
              background: page === n.id ? 'rgba(0,147,224,0.18)' : 'transparent',
              color: page === n.id ? 'var(--sky-300)' : 'rgba(255,255,255,0.78)',
              border: 'none', borderRadius: 'var(--radius-md)', padding: '11px 14px',
              font: 'var(--text-label)', cursor: 'pointer',
              transition: 'all var(--duration-base) var(--ease-standard)',
            }}>
              <span aria-hidden style={{ width: 16, textAlign: 'center' }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: 18, font: 'var(--text-caption)', color: 'var(--color-text-on-dark-muted)' }}>
          Protótipo — dados salvos neste navegador. Links públicos, senha e rastreamento de IP exigem servidor.
        </div>
      </aside>
      <main data-screen-label={NAV.find(n => n.id === page)?.label} style={{ flex: 1, padding: '36px 40px', maxWidth: 1160, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {page === 'editor' && <EditorPage db={db} update={update} go={go} />}
        {page === 'propostas' && <PropostasPage db={db} update={update} highlight={highlight} />}
        {page === 'servicos' && <ServicosPage db={db} update={update} />}
        {page === 'bonus' && <BonusPage db={db} update={update} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
