/* Página: Serviços — biblioteca com cadastro rico */
const DS_S = window.STARTINCDesignSystem_dd2482;

function ServicoDialog({ svc, onSave, onClose }) {
  const [f, setF] = React.useState(() => svc
    ? { nome: svc.nome, preco: svc.preco == null ? '' : svc.preco, mensal: svc.rec === 'mensal', inclusos: svc.inclusos || [],
        custo: svc.custo == null ? '' : svc.custo, lucroPct: svc.lucroPct == null ? '' : Math.round(svc.lucroPct * 100), impostoPct: svc.impostoPct == null ? 15 : Math.round(svc.impostoPct * 100) }
    : { nome: '', preco: '', mensal: false, inclusos: [], custo: '', lucroPct: '', impostoPct: 15 });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const custoN = f.custo === '' ? 0 : Number(f.custo);
  const lucroN = f.lucroPct === '' ? 0 : Number(f.lucroPct) / 100;
  const impostoN = f.impostoPct === '' ? 0 : Number(f.impostoPct) / 100;
  const sugerido = StartDB.precoSugerido(custoN, lucroN, impostoN);
  const precoAtual = f.preco === '' ? 0 : Number(f.preco);
  const marg = StartDB.margem(precoAtual, custoN);
  const save = () => {
    if (!f.nome.trim()) return;
    const inclusos = (f.inclusos || []).map(s => s.trim()).filter(Boolean);
    const preco = f.preco === '' ? null : Number(f.preco);
    onSave({
      ...(svc || { id: 'svc-' + StartDB.uid().toLowerCase(), categoria: 'Geral', prazo: 'A combinar', resumo: '' }),
      nome: f.nome.trim(), preco,
      custo: f.custo === '' ? null : Number(f.custo),
      lucroPct: f.lucroPct === '' ? null : Number(f.lucroPct) / 100,
      impostoPct: f.impostoPct === '' ? null : Number(f.impostoPct) / 100,
      rec: f.mensal ? 'mensal' : (preco == null ? 'consulta' : 'unico'),
      inclusos,
    });
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,2,8,0.72)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: 560, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', padding: 32, fontFamily: 'var(--font-body)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ font: 'var(--text-heading-lg)', color: 'var(--color-dark)' }}>{svc ? 'Editar plano' : 'Novo plano'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--color-text-muted)' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Nome do plano" value={f.nome} onChange={v => set('nome', v)} placeholder="Ex.: Gestão de Tráfego Pago STANDARD" />
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
            <Field label="Valor (R$)" type="number" min={0} value={f.preco} onChange={v => set('preco', v)} placeholder="Vazio = sob consulta" style={{ flex: 1 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 13, fontFamily: 'var(--font-body)', font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
              <input type="checkbox" checked={f.mensal} onChange={e => set('mensal', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
              Cobrança mensal
            </label>
          </div>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--color-primary-tint)' }}>
            <div style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)' }}>Precificação</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Field label="Custo (R$)" type="number" min={0} value={f.custo} onChange={v => set('custo', v)} placeholder="0" />
              <Field label="Lucro (%)" type="number" min={0} value={f.lucroPct} onChange={v => set('lucroPct', v)} placeholder="0" />
              <Field label="Imposto (%)" type="number" min={0} max={95} value={f.impostoPct} onChange={v => set('impostoPct', v)} placeholder="15" />
            </div>
            {custoN > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>
              <span>Sugerido: <strong style={{ color: 'var(--color-primary)' }}>{StartDB.brl(sugerido)}</strong></span>
              {sugerido !== precoAtual && <button onClick={() => set('preco', sugerido)} style={{ border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--sky-300)', borderRadius: 999, padding: '4px 12px', font: 'var(--text-caption)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Aplicar</button>}
              {precoAtual > 0 && <span>Margem: <strong style={{ color: marg.pct >= 0.3 ? '#4ade80' : '#fbbf24' }}>{StartDB.brl(Math.round(marg.valor))} · {(marg.pct * 100).toFixed(0)}%</strong></span>}
            </div>}
          </div>
          <TArea label="O que contempla (um item por linha)" value={(f.inclusos || []).join('\n')} onChange={v => set('inclusos', v.split('\n'))} rows={8} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <DS_S.Button variant="ghost" onClick={onClose}>Cancelar</DS_S.Button>
          <DS_S.Button variant="primary" onClick={save}>Salvar plano</DS_S.Button>
        </div>
      </div>
    </div>
  );
}

function ServicosPage({ db, update }) {
  const [editing, setEditing] = React.useState(null); // null | 'new' | svc
  const [confirm, setConfirm] = React.useState(null);
  const [copiado, setCopiado] = React.useState(null);

  /* espelha um plano na biblioteca de Bonificações (mantém nome, valor e itens) */
  const paraBonus = (s) => {
    const id = 'b-de-' + s.id;
    const bonus = {
      id, nome: s.nome, valor: s.preco || 0,
      descricao: s.resumo || 'Incluso como bonificação nesta proposta.',
      inclusos: (s.inclusos || []).slice(), origemSvc: s.id
    };
    const lista = db.bonus || [];
    const i = lista.findIndex(b => b.id === id);
    const nova = [...lista];
    if (i >= 0) nova[i] = { ...nova[i], ...bonus }; else nova.push(bonus);
    update({ bonus: nova });
    setCopiado(s.id); setTimeout(() => setCopiado(null), 2200);
  };

  const saveSvc = (f) => {
    const i = db.servicos.findIndex(s => s.id === f.id);
    const list = [...db.servicos];
    if (i >= 0) list[i] = f; else list.push(f);
    update({ servicos: list });
    setEditing(null);
  };

  return (
    <div>
      <PageHead title="Planos" sub="Biblioteca de planos da Start: nome, valor e o que contempla. Cada um alimenta o editor de propostas. Use “→ Bonificação” para espelhar um plano na biblioteca de bônus."
        action={<DS_S.Button variant="primary" onClick={() => setEditing('new')}>Novo plano</DS_S.Button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {db.servicos.map(s => (
          <DS_S.Card key={s.id} padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ font: 'var(--text-heading-sm)', color: 'var(--color-dark)' }}>{s.nome}</div>
              {s.rec === 'mensal' && <DS_S.Badge tone="primary">Mensal</DS_S.Badge>}
              {s.rec === 'consulta' && <DS_S.Badge tone="neutral">A definir</DS_S.Badge>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ font: 'var(--text-heading-md)', color: 'var(--color-primary)' }}>{s.parcelas || StartDB.brl(s.preco)}</span>
                {s.rec === 'mensal' && !s.parcelas && <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>/mês</span>}
                {s.precoMax && <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}> até {StartDB.brl(s.precoMax)}</span>}
              </div>
              <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{(s.inclusos || []).length} itens inclusos</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
              <DS_S.Button size="sm" variant="secondary" onClick={() => setEditing(s)}>Editar</DS_S.Button>
              <DS_S.Button size="sm" variant="secondary" onClick={() => paraBonus(s)}>
                {copiado === s.id ? 'Em Bonificações ✓' : (db.bonus || []).some(b => b.id === 'b-de-' + s.id) ? 'Atualizar bônus' : '→ Bonificação'}
              </DS_S.Button>
              <DS_S.Button size="sm" variant="ghost" onClick={() => setConfirm(s)}>Excluir</DS_S.Button>
            </div>
          </DS_S.Card>
        ))}
      </div>
      {editing && <ServicoDialog svc={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={saveSvc} />}
      {confirm && (
        <ConfirmDialog title="Excluir plano" onClose={() => setConfirm(null)}
          onConfirm={() => { update({ servicos: db.servicos.filter(x => x.id !== confirm.id) }); setConfirm(null); }}>
          Excluir <b>{confirm.nome}</b> da biblioteca? As propostas já geradas não serão alteradas.
        </ConfirmDialog>
      )}
    </div>
  );
}
window.ServicosPage = ServicosPage;
