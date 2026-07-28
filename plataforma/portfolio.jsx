/* Página: Portfólio — banco de prints de trabalhos, com tags por tipo de serviço */
const DS_PF = window.STARTINCDesignSystem_dd2482;

function PortfolioDialog({ item, onSave, onClose }) {
  const [f, setF] = React.useState(() => item
    ? JSON.parse(JSON.stringify(item))
    : { id: 'pf-' + StartDB.uid().toLowerCase(), img: '', titulo: '', tags: [] });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggleTag = (t) => setF(p => ({ ...p, tags: p.tags.includes(t) ? p.tags.filter(x => x !== t) : [...p.tags, t] }));
  const [busy, setBusy] = React.useState(false);
  const [erro, setErro] = React.useState('');
  const onPick = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setErro(''); setBusy(true);
    window.fileToDataURL(file, async (url, err) => {
      if (!url) { setBusy(false); setErro(err || 'Não foi possível processar essa imagem.'); return; }
      const ref = await StartImg.put(url);          // guarda no IndexedDB, banco fica leve
      if (f.img) StartImg.del(f.img);
      setBusy(false); set('img', ref);
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,2,8,0.72)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: 560, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', padding: 32, fontFamily: 'var(--font-body)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ font: 'var(--text-heading-lg)', color: 'var(--color-dark)' }}>{item ? 'Editar print' : 'Novo print do portfólio'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--color-text-muted)' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <span style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)', display: 'block', marginBottom: 8 }}>Print / imagem do trabalho</span>
            <label style={{ display: 'block', border: '1.5px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: f.img ? 12 : 28, textAlign: 'center', cursor: 'pointer', background: 'var(--color-bg-subtle)' }}>
              {busy
                ? <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>Comprimindo imagem…</span>
                : f.img
                ? <img src={StartImg.src(f.img)} alt="preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, display: 'block', margin: '0 auto' }} />
                : <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>Clique para enviar o print da página / projeto</span>}
              <input type="file" accept="image/*" onChange={onPick} style={{ display: 'none' }} />
            </label>
            {erro && <div style={{ marginTop: 8, font: 'var(--text-body-sm)', color: '#f87171' }}>{erro}</div>}
            {f.img && <div style={{ marginTop: 8 }}><DS_PF.Button size="sm" variant="ghost" onClick={() => set('img', '')}>Remover imagem</DS_PF.Button></div>}
          </div>
          <Field label="Título (opcional)" value={f.titulo} onChange={v => set('titulo', v)} placeholder="Ex.: Landing Page — Clínica Vida" />
          <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: 14 }}>
            <DS_PF.Switch checked={!!f.anim} onChange={v => set('anim', v)} label="Rolagem automática (efeito GIF)" />
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)', marginTop: 6 }}>
              O print começa fixado na hero e desce sozinho até o fim da página, sempre dentro do bloco. Desligado, mostra só a hero.
            </div>
          </div>
          <div>
            <span style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)', display: 'block', marginBottom: 8 }}>Vincular a quais tipos de serviço?</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {StartDB.TAGS.map(t => {
                const on = f.tags.includes(t.id);
                return (
                  <button key={t.id} type="button" onClick={() => toggleTag(t.id)} style={{
                    border: `1px solid ${on ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: on ? 'var(--color-primary-tint)' : 'transparent',
                    color: on ? 'var(--sky-300)' : 'var(--color-text-muted)',
                    borderRadius: 999, padding: '6px 14px', font: 'var(--text-body-sm)', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .2s'
                  }}>{on ? '✓ ' : ''}{t.label}</button>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <DS_PF.Button variant="ghost" onClick={onClose}>Cancelar</DS_PF.Button>
          <DS_PF.Button variant="primary" onClick={() => { if (!f.img || busy) return; onSave(f); }}>Salvar print</DS_PF.Button>
        </div>
      </div>
    </div>
  );
}

function PortfolioPage({ db, update }) {
  const [editing, setEditing] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [filtro, setFiltro] = React.useState('todos');
  const portfolio = db.portfolio || [];

  const saveItem = (f) => {
    const i = portfolio.findIndex(d => d.id === f.id);
    const list = [...portfolio];
    if (i >= 0) list[i] = f; else list.push(f);
    const res = update({ portfolio: list });
    if (res && res.ok === false) return;   // mantém o diálogo aberto se não couber no armazenamento
    setEditing(null);
  };
  const tagLabel = id => (StartDB.TAGS.find(t => t.id === id) || {}).label || id;
  const lista = filtro === 'todos' ? portfolio : portfolio.filter(d => (d.tags || []).includes(filtro));

  return (
    <div>
      <PageHead title="Portfólio" sub="Banco de prints dos seus trabalhos. Envie as imagens, marque a qual tipo de serviço pertencem, e o editor puxa os certos ao escolher o tema da proposta (template Completa)."
        action={<DS_PF.Button variant="primary" onClick={() => setEditing('new')}>Novo print</DS_PF.Button>} />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {[{ id: 'todos', label: 'Todos' }, ...StartDB.TAGS].map(t => (
          <button key={t.id} onClick={() => setFiltro(t.id)} style={{
            border: `1px solid ${filtro === t.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: filtro === t.id ? 'var(--color-primary-tint)' : 'transparent',
            color: filtro === t.id ? 'var(--sky-300)' : 'var(--color-text-muted)',
            borderRadius: 999, padding: '6px 14px', font: 'var(--text-body-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)'
          }}>{t.label}</button>
        ))}
      </div>

      {portfolio.length === 0 && <Empty>Nenhum print ainda. Envie o primeiro em "Novo print".</Empty>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {lista.map(d => (
          <DS_PF.Card key={d.id} padding="none" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className={d.anim ? 'pf-prev pf-scroll' : 'pf-prev'} style={{ background: 'var(--color-bg-subtle)', aspectRatio: '4/5', position: 'relative', overflow: 'hidden' }}>
              {d.img ? <img src={StartImg.src(d.img)} alt={d.titulo} ref={el => { if (el) el.parentNode.style.setProperty('--pf-h', el.parentNode.clientHeight + 'px'); }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto', display: 'block' }} />
                : <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sem imagem</span>}
              {d.anim && <span style={{ position: 'absolute', bottom: 8, right: 8, font: 'var(--text-caption)', fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,.55)', borderRadius: 999, padding: '3px 10px' }}>auto-scroll</span>}
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <div style={{ font: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-dark)' }}>{d.titulo || 'Print do portfólio'}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1 }}>
                {(d.tags || []).length ? d.tags.map(t => (
                  <span key={t} style={{ font: 'var(--text-caption)', color: 'var(--sky-300)', background: 'var(--color-primary-tint)', borderRadius: 999, padding: '3px 10px' }}>{tagLabel(t)}</span>
                )) : <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>Sem vínculo</span>}
              </div>
              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
                <DS_PF.Button size="sm" variant="secondary" onClick={() => setEditing(d)}>Editar</DS_PF.Button>
                <DS_PF.Button size="sm" variant="ghost" onClick={() => setConfirm(d)}>Excluir</DS_PF.Button>
              </div>
            </div>
          </DS_PF.Card>
        ))}
      </div>

      {editing && <PortfolioDialog item={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={saveItem} />}
      {confirm && (
        <ConfirmDialog title="Excluir print" onClose={() => setConfirm(null)}
          onConfirm={() => { update({ portfolio: db.portfolio.filter(x => x.id !== confirm.id) }); setConfirm(null); }}>
          Excluir este print do banco? As propostas já geradas não serão alteradas.
        </ConfirmDialog>
      )}
    </div>
  );
}
window.PortfolioPage = PortfolioPage;
