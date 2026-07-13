/* Página: Serviços — biblioteca com cadastro rico */
const DS_S = window.STARTINCDesignSystem_dd2482;

function ServicoDialog({ svc, onSave, onClose }) {
  const [f, setF] = React.useState(() => svc ? JSON.parse(JSON.stringify(svc)) : { id: 'svc-' + StartDB.uid().toLowerCase(), nome: '', categoria: '', preco: '', rec: 'unico', prazo: '', resumo: '', inclusos: [] });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: 640, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', padding: 32, fontFamily: 'var(--font-body)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ font: 'var(--text-heading-lg)', color: 'var(--color-dark)' }}>{svc ? 'Editar serviço' : 'Novo serviço'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--color-text-muted)' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Nome" value={f.nome} onChange={v => set('nome', v)} placeholder="Ex.: Gestão de Tráfego Pago" />
          <div style={{ display: 'flex', gap: 14 }}>
            <Field label="Categoria" value={f.categoria} onChange={v => set('categoria', v)} placeholder="Tráfego, Web, Setup..." />
            <Field label="Prazo" value={f.prazo} onChange={v => set('prazo', v)} placeholder="Até 10 dias" />
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <Field label="Preço (R$)" type="number" min={0} value={f.preco === null ? '' : f.preco} onChange={v => set('preco', v === '' ? null : v)} placeholder="Vazio = a definir" />
            <SelectField label="Cobrança" value={f.rec} onChange={v => set('rec', v)} options={[
              { value: 'unico', label: 'Valor único' }, { value: 'mensal', label: 'Mensal' }, { value: 'consulta', label: 'Sob consulta' }]} />
          </div>
          <TArea label="Resumo (aparece na proposta)" value={f.resumo} onChange={v => set('resumo', v)} rows={2} />
          <TArea label="O que está incluso (um item por linha)" value={(f.inclusos || []).join('\n')} onChange={v => set('inclusos', v.split('\n'))} rows={8} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <DS_S.Button variant="ghost" onClick={onClose}>Cancelar</DS_S.Button>
          <DS_S.Button variant="primary" onClick={() => { if (!f.nome.trim()) return; f.inclusos = f.inclusos.map(s => s.trim()).filter(Boolean); if (f.preco === '') f.preco = null; onSave(f); }}>Salvar serviço</DS_S.Button>
        </div>
      </div>
    </div>
  );
}

function ServicosPage({ db, update }) {
  const [editing, setEditing] = React.useState(null); // null | 'new' | svc
  const [confirm, setConfirm] = React.useState(null);
  const cats = [...new Set(db.servicos.map(s => s.categoria))];

  const saveSvc = (f) => {
    const i = db.servicos.findIndex(s => s.id === f.id);
    const list = [...db.servicos];
    if (i >= 0) list[i] = f; else list.push(f);
    update({ servicos: list });
    setEditing(null);
  };

  return (
    <div>
      <PageHead title="Serviços" sub="Biblioteca de serviços da Start. Cada cadastro alimenta o editor de propostas com preço, prazo e entregáveis."
        action={<DS_S.Button variant="primary" onClick={() => setEditing('new')}>Novo serviço</DS_S.Button>} />
      {cats.map(cat => (
        <div key={cat} style={{ marginBottom: 28 }}>
          <div style={{ font: 'var(--text-heading-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', fontSize: 13, marginBottom: 12 }}>{cat}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {db.servicos.filter(s => s.categoria === cat).map(s => (
              <DS_S.Card key={s.id} padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ font: 'var(--text-heading-sm)', color: 'var(--color-dark)' }}>{s.nome}</div>
                  <DS_S.Badge tone={s.rec === 'mensal' ? 'primary' : s.rec === 'consulta' ? 'neutral' : 'success'}>
                    {s.rec === 'mensal' ? 'Mensal' : s.rec === 'consulta' ? 'A definir' : 'Único'}
                  </DS_S.Badge>
                </div>
                <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', flex: 1 }}>{s.resumo}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ font: 'var(--text-heading-md)', color: 'var(--color-primary)' }}>{s.parcelas || StartDB.brl(s.preco)}</span>
                    {s.rec === 'mensal' && !s.parcelas && <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>/mês</span>}
                    {s.precoMax && <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}> até {StartDB.brl(s.precoMax)}</span>}
                  </div>
                  <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{s.inclusos.length} entregáveis</span>
                </div>
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
                  <DS_S.Button size="sm" variant="secondary" onClick={() => setEditing(s)}>Editar</DS_S.Button>
                  <DS_S.Button size="sm" variant="ghost" onClick={() => setConfirm(s)}>Excluir</DS_S.Button>
                </div>
              </DS_S.Card>
            ))}
          </div>
        </div>
      ))}
      {editing && <ServicoDialog svc={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={saveSvc} />}
      {confirm && (
        <DS_S.Dialog title="Excluir serviço" onClose={() => setConfirm(null)}
          actions={<React.Fragment>
            <DS_S.Button variant="ghost" onClick={() => setConfirm(null)}>Cancelar</DS_S.Button>
            <DS_S.Button variant="primary" onClick={() => { update({ servicos: db.servicos.filter(x => x.id !== confirm.id) }); setConfirm(null); }}>Excluir</DS_S.Button>
          </React.Fragment>}>
          Excluir "{confirm.nome}" da biblioteca? As propostas já geradas não serão alteradas.
        </DS_S.Dialog>
      )}
    </div>
  );
}
window.ServicosPage = ServicosPage;
