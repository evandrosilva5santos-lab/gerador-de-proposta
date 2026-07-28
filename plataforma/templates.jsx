/* Página: Templates de Proposta — combos editáveis (serviços + etapas + cor) */
const DS_T = window.STARTINCDesignSystem_dd2482;

function TemplateCard({ t, db, patch, restaurar, usar }) {
  const [open, setOpen] = React.useState(false);
  const etapasTxt = (t.etapas || []).map(e => e.titulo + ' :: ' + (e.texto || '')).join('\n');
  const setEtapas = (txt) => patch({
    etapas: txt.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const i = l.indexOf('::');
      return i > -1 ? { titulo: l.slice(0, i).trim(), texto: l.slice(i + 2).trim() } : { titulo: l, texto: '' };
    })
  });
  const toggleSvc = (id) => patch({ servicos: (t.servicos || []).includes(id) ? t.servicos.filter(x => x !== id) : [...(t.servicos || []), id] });
  const valor = (t.servicos || []).map(id => db.servicos.find(s => s.id === id)).filter(Boolean);
  const mensal = valor.filter(s => s.rec === 'mensal').reduce((a, s) => a + Number(s.preco || 0), 0);
  const unico = valor.filter(s => s.rec !== 'mensal').reduce((a, s) => a + Number(s.preco || 0), 0);

  return (
    <DS_T.Card padding="none" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: `linear-gradient(135deg, ${t.cor} 0%, ${t.cor}99 100%)`, color: '#fff', padding: 28, minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ font: 'var(--text-heading-lg)', fontWeight: 700, marginBottom: 10, textWrap: 'pretty' }}>{t.nome}</div>
        <div style={{ font: 'var(--text-body-sm)', opacity: 0.92 }}>{t.descricao}</div>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>
          {valor.length} serviço{valor.length !== 1 ? 's' : ''} · {unico ? StartDB.brl(unico) : '—'}{mensal ? ' + ' + StartDB.brl(mensal) + '/mês' : ''}
        </div>
        {valor.length === 0 && <div style={{ font: 'var(--text-caption)', color: 'var(--color-error, #C0392B)' }}>Nenhum serviço válido neste template — marque os serviços em “Editar template”.</div>}
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-muted)', font: 'var(--text-caption)', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {(t.etapas || []).map((e, i) => <li key={i}>{e.titulo}</li>)}
        </ul>
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <DS_T.Button variant="primary" size="sm" disabled={valor.length === 0} onClick={() => usar(t)}>Criar proposta</DS_T.Button>
          <DS_T.Button variant="secondary" size="sm" onClick={() => setOpen(!open)}>{open ? 'Fechar edição' : 'Editar template'}</DS_T.Button>
          <DS_T.Button variant="ghost" size="sm" onClick={() => restaurar(t)}>Restaurar</DS_T.Button>
        </div>
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: 16 }}>
            <Field label="Nome do template" value={t.nome} onChange={v => patch({ nome: v })} />
            <TArea label="Descrição" rows={2} value={t.descricao} onChange={v => patch({ descricao: v })} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <SelectField label="Cor de destaque" value={t.cor} onChange={v => patch({ cor: v })} options={[
                { value: '#0093E0', label: 'Azul START' }, { value: '#0073B8', label: 'Azul profundo' },
                { value: '#7C3AED', label: 'Violeta' }, { value: '#D97706', label: 'Âmbar' },
                { value: '#1E40AF', label: 'Azul marinho' }, { value: '#059669', label: 'Verde' }]} style={{ maxWidth: 200 }} />
            </div>
            <div>
              <div style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)', marginBottom: 8 }}>Serviços do template</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6, maxHeight: 220, overflow: 'auto' }}>
                {db.servicos.map(s => (
                  <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--text-body-sm)', color: 'var(--color-text)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={(t.servicos || []).includes(s.id)} onChange={() => toggleSvc(s.id)} style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }} />
                    <span>{s.nome}</span>
                  </label>
                ))}
              </div>
            </div>
            <TArea label="Etapas — uma por linha, no formato “Título :: descrição”" rows={6} value={etapasTxt} onChange={setEtapas} />
          </div>
        )}
      </div>
    </DS_T.Card>
  );
}

function TemplatesPage({ db, update, go }) {
  const templates = db.templates || [];
  const patch = (id, changes) => update({ templates: templates.map(t => t.id === id ? { ...t, ...changes } : t) });
  const restaurar = (t) => {
    const orig = (StartDB.TEMPLATES || []).find(x => x.id === t.id);
    if (orig) update({ templates: templates.map(x => x.id === t.id ? JSON.parse(JSON.stringify(orig)) : x) });
  };
  const usar = (t) => go('editor', null, {
    novo: true, cliente: '', empresa: '', template: 'start', objetivo: '',
    validadeDias: 7, descontoPix: true, contratoMeses: 0, pagamento: 'pix',
    tema: 'custom', owner: db.owners[0], etapas: t.etapas || [],
    servicos: (t.servicos || []).map(id => db.servicos.find(s => s.id === id)).filter(Boolean).map(s => ({ ...s })),
    bonus: [], depoimentos: [], portfolio: []
  });

  return (
    <div>
      <PageHead title="Templates de Proposta" sub="Combos prontos de serviços e etapas. Edite o que quiser — as alterações ficam salvas e valem para as próximas propostas." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, alignItems: 'start' }}>
        {templates.map(t => (
          <TemplateCard key={t.id} t={t} db={db} patch={c => patch(t.id, c)} restaurar={restaurar} usar={usar} />
        ))}
      </div>
      <div style={{ marginTop: 32, padding: 18, background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
        <b style={{ color: 'var(--color-dark)' }}>Como funciona:</b> “Criar proposta” abre o editor já com os serviços e as etapas deste template carregados — você só ajusta cliente, preços e bônus. “Editar template” muda o combo em si; “Restaurar” volta ao original.
      </div>
    </div>
  );
}

window.TemplatesPage = TemplatesPage;
