/* Shell da plataforma — sidebar + roteamento */
const DS_A = window.STARTINCDesignSystem_dd2482;

const NAV = [
  { id: 'editor', label: 'Nova proposta', icon: '✦' },
  { id: 'propostas', label: 'Propostas', icon: '▤' },
  { id: 'servicos', label: 'Serviços', icon: '◈' },
  { id: 'bonus', label: 'Bonificações', icon: '❋' },
  { id: 'depoimentos', label: 'Depoimentos', icon: '❝' },
  { id: 'portfolio', label: 'Portfólio', icon: '▦' },
  { id: 'templates', label: 'Templates de Proposta', icon: '🎨' },
  { id: 'donos', label: 'Donos', icon: '◉' },
];

function App() {
  const [db, setDb] = React.useState(() => StartDB.load());
  const [page, setPage] = React.useState('editor');
  const [highlight, setHighlight] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [theme, setTheme] = React.useState(() => localStorage.getItem('plat-theme') || 'dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-plat-theme', theme);
    localStorage.setItem('plat-theme', theme);
  }, [theme]);

  const update = (changes) => {
    let res = { ok: true };
    setDb(prev => { const next = { ...prev, ...changes }; res = StartDB.save(next); return next; });
    if (!res.ok) alert(res.message);
    return res;
  };
  const go = (p, hl, ed) => { setHighlight(hl || null); setEditing(ed || null); setPage(p); window.scrollTo(0, 0); };

  React.useEffect(() => {
    const onFocus = () => setDb(StartDB.load());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)', background: 'var(--color-bg-subtle)' }}>
      <aside data-screen-label="Menu lateral" style={{ width: 232, flexShrink: 0, background: theme === 'dark' ? '#04070e' : '#f8f8f8', color: theme === 'dark' ? '#fff' : '#1d274e', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', transition: 'background .3s, color .3s' }}>
        <div style={{ padding: '26px 22px 20px', borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,147,224,0.15)'}` }}>
          <img src="assets/logos/start-inc-negative-white.png" alt="START INC." style={{ height: 34, display: 'block' }} />
          <div style={{ font: 'var(--text-caption)', color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(29,39,78,0.6)', marginTop: 10, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>Plataforma comercial</div>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '10px 14px', background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,147,224,0.06)', borderRadius: 'var(--radius-md)', margin: '10px 14px 0' }}>
          <button onClick={() => setTheme('dark')} style={{ flex: 1, padding: '7px 10px', background: theme === 'dark' ? 'var(--color-primary)' : 'transparent', color: theme === 'dark' ? '#fff' : 'var(--color-text)', border: 'none', borderRadius: 'var(--radius-sm)', font: 'var(--text-caption)', cursor: 'pointer', transition: 'all .2s', fontWeight: 600 }}>🌙 Dark</button>
          <button onClick={() => setTheme('light')} style={{ flex: 1, padding: '7px 10px', background: theme === 'light' ? 'var(--color-primary)' : 'transparent', color: theme === 'light' ? '#fff' : 'var(--color-text)', border: 'none', borderRadius: 'var(--radius-sm)', font: 'var(--text-caption)', cursor: 'pointer', transition: 'all .2s', fontWeight: 600 }}>☀️ Light</button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 14 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => go(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
              background: page === n.id ? 'var(--color-primary-tint)' : 'transparent',
              color: page === n.id ? 'var(--sky-300)' : (theme === 'dark' ? 'rgba(255,255,255,0.78)' : 'rgba(29,39,78,0.7)'),
              border: page === n.id ? '1px solid var(--color-primary-tint)' : (theme === 'dark' ? '1px solid transparent' : '1px solid rgba(0,147,224,0.15)'),
              borderRadius: 'var(--radius-md)', padding: '11px 14px',
              font: 'var(--text-label)', cursor: 'pointer',
              transition: 'all var(--duration-base) var(--ease-standard)',
            }}>
              <span aria-hidden style={{ width: 16, textAlign: 'center' }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: 18, font: 'var(--text-caption)', color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(29,39,78,0.6)', borderTop: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,147,224,0.15)'}` }}>
          Protótipo — dados salvos neste navegador. Links públicos, senha e rastreamento de IP exigem servidor.
        </div>
      </aside>
      <main data-screen-label={NAV.find(n => n.id === page)?.label} style={{ flex: 1, padding: '36px 40px', maxWidth: 1160, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {page === 'editor' && <EditorPage key={editing ? (editing.id || 'preset') : 'novo'} db={db} update={update} go={go} editing={editing} />}
        {page === 'propostas' && <PropostasPage db={db} update={update} highlight={highlight} go={go} />}
        {page === 'servicos' && <ServicosPage db={db} update={update} />}
        {page === 'bonus' && <BonusPage db={db} update={update} />}
        {page === 'depoimentos' && <DepoimentosPage db={db} update={update} />}
        {page === 'portfolio' && <PortfolioPage db={db} update={update} />}
        {page === 'templates' && <TemplatesPage db={db} update={update} go={go} />}
        {page === 'donos' && <DonosPage db={db} update={update} />}
      </main>
    </div>
  );
}

/* Barreira de erro: qualquer falha de render mostra mensagem em vez de tela preta */
class ErrBoundary extends React.Component {
  constructor(p){ super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err){ return { err }; }
  componentDidCatch(err){ console.error('Erro de render:', err); }
  render(){
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ padding: 40, fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
        <div style={{ font: 'var(--text-heading-lg)', color: 'var(--color-dark)', marginBottom: 10 }}>Algo falhou nesta tela</div>
        <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginBottom: 18 }}>{String(this.state.err && this.state.err.message || this.state.err)}</div>
        <button onClick={() => this.setState({ err: null })} style={{ border: '1px solid var(--color-border)', background: 'var(--color-primary-tint)', color: 'var(--sky-300)', borderRadius: 999, padding: '8px 18px', font: 'var(--text-body-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Tentar de novo</button>
      </div>
    );
  }
}

/* espera o banco de imagens (IndexedDB) carregar e migra dataURLs antigas antes de renderizar */
StartImg.init().then(async () => {
  const db = StartDB.load();
  if (await StartImg.migrate(db)) StartDB.save(db);
}).catch(() => {}).then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(<ErrBoundary><App /></ErrBoundary>);
});