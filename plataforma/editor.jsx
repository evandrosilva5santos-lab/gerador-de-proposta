/* Página: Editor de proposta */
const DS_E = window.STARTINCDesignSystem_dd2482;

function calcTotais(db, sel, selBonus) {
  const svcs = sel.map(s => ({ ...db.servicos.find(x => x.id === s.id), precoFinal: s.preco }));
  const mensal = svcs.filter(s => s.rec === 'mensal').reduce((a, s) => a + Number(s.precoFinal || 0), 0);
  const unico = svcs.filter(s => s.rec !== 'mensal').reduce((a, s) => a + Number(s.precoFinal || 0), 0);
  const beneficios = selBonus.map(id => db.bonus.find(b => b.id === id)).filter(Boolean).reduce((a, b) => a + Number(b.valor || 0), 0);
  return { mensal, unico, beneficios };
}

function EditorPage({ db, update, go }) {
  const [f, setF] = React.useState({
    cliente: '', empresa: '', template: 'dark', objetivo: '',
    validadeDias: 7, descontoPix: true,
    sel: [], selBonus: []
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggleSvc = (svc) => setF(p => {
    const has = p.sel.find(s => s.id === svc.id);
    return { ...p, sel: has ? p.sel.filter(s => s.id !== svc.id) : [...p.sel, { id: svc.id, preco: svc.preco }] };
  });
  const setPreco = (id, v) => setF(p => ({ ...p, sel: p.sel.map(s => s.id === id ? { ...s, preco: v === '' ? null : v } : s) }));
  const toggleBonus = (id) => setF(p => ({ ...p, selBonus: p.selBonus.includes(id) ? p.selBonus.filter(x => x !== id) : [...p.selBonus, id] }));

  const t = calcTotais(db, f.sel, f.selBonus);
  const cats = [...new Set(db.servicos.map(s => s.categoria))];

  const gerar = () => {
    if (!f.cliente.trim() || f.sel.length === 0) return;
    const codigo = StartDB.uid();
    const proposta = {
      id: codigo, cliente: f.cliente, empresa: f.empresa, template: f.template,
      objetivo: f.objetivo, validadeDias: Number(f.validadeDias) || 7, descontoPix: f.descontoPix,
      criadoEm: new Date().toISOString(),
      servicos: f.sel.map(s => { const sv = db.servicos.find(x => x.id === s.id); return { ...sv, preco: s.preco }; }),
      bonus: f.selBonus.map(id => db.bonus.find(b => b.id === id)).filter(Boolean),
      condicoes: db.condicoes,
      link: { expiraDias: 7, senha: '', download: true, impressao: true, status: 'Enviada', views: [] }
    };
    update({ propostas: [proposta, ...db.propostas] });
    go('propostas', codigo);
  };

  const secTitle = (txt) => <div style={{ font: 'var(--text-heading-md)', color: 'var(--color-dark)', margin: '0 0 14px' }}>{txt}</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <PageHead title="Nova proposta" sub="Monte a oferta selecionando serviços e bonificações da biblioteca. O investimento é calculado automaticamente." />
        <DS_E.Card padding="lg">
          {secTitle('Cliente')}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Field label="Nome do contato" value={f.cliente} onChange={v => set('cliente', v)} placeholder="Ex.: Dra. Camila" />
            <Field label="Empresa" value={f.empresa} onChange={v => set('empresa', v)} placeholder="Ex.: Clínica Vida" />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
            <SelectField label="Template da proposta" value={f.template} onChange={v => set('template', v)} options={[
              { value: 'start', label: 'START INC — azul institucional' },
              { value: 'dark', label: 'Dark neon — impacto visual' }]} />
            <Field label="Validade (dias)" type="number" min={1} value={f.validadeDias} onChange={v => set('validadeDias', v)} />
          </div>
          <div style={{ marginTop: 14 }}>
            <TArea label="Objetivo do projeto (abre a proposta)" value={f.objetivo} onChange={v => set('objetivo', v)} rows={3}
              placeholder="Ex.: Estruturar a aquisição digital da Clínica Vida com tráfego pago, landing page e rastreamento completo para gerar agendamentos previsíveis." />
          </div>
        </DS_E.Card>

        <DS_E.Card padding="lg">
          {secTitle('Serviços')}
          {cats.map(cat => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>{cat}</div>
              {db.servicos.filter(s => s.categoria === cat).map(s => {
                const sel = f.sel.find(x => x.id === s.id);
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: sel ? 'var(--color-primary-tint)' : 'transparent', marginBottom: 4 }}>
                    <input type="checkbox" checked={!!sel} onChange={() => toggleSvc(s)} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleSvc(s)}>
                      <div style={{ font: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-dark)' }}>{s.nome}</div>
                      <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{s.rec === 'mensal' ? 'mensal' : s.rec === 'consulta' ? 'sob consulta' : 'valor único'} · {s.prazo}</div>
                    </div>
                    {sel ? (
                      <input type="number" min={0} value={sel.preco == null ? '' : sel.preco} placeholder="A definir"
                        onChange={e => setPreco(s.id, e.target.value === '' ? '' : Number(e.target.value))}
                        style={{ width: 110, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 10px', font: 'var(--text-body-sm)', outline: 'none' }} />
                    ) : (
                      <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>{s.parcelas || StartDB.brl(s.preco)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </DS_E.Card>

        <DS_E.Card padding="lg">
          {secTitle('Bonificações')}
          {db.bonus.map(b => (
            <div key={b.id} onClick={() => toggleBonus(b.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: f.selBonus.includes(b.id) ? '#EAFBF1' : 'transparent', marginBottom: 4, cursor: 'pointer' }}>
              <input type="checkbox" checked={f.selBonus.includes(b.id)} readOnly style={{ width: 18, height: 18, accentColor: 'var(--color-success)', pointerEvents: 'none' }} />
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-dark)' }}>{b.nome}</div>
                <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{b.descricao}</div>
              </div>
              <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>De <s>{StartDB.brl(b.valor)}</s> por <b style={{ color: 'var(--color-success)' }}>R$ 0</b></span>
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <DS_E.Switch checked={f.descontoPix} onChange={v => set('descontoPix', v)} label="Oferecer 10% de desconto no PIX à vista" />
          </div>
        </DS_E.Card>
      </div>

      <div style={{ position: 'sticky', top: 24 }}>
        <DS_E.Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ font: 'var(--text-heading-md)', color: 'var(--color-dark)' }}>Resumo</div>
          <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>{f.sel.length} serviço{f.sel.length !== 1 ? 's' : ''} · {f.selBonus.length} bônus</div>
          {t.unico > 0 && <Row k="Investimento único" v={StartDB.brl(t.unico)} />}
          {t.mensal > 0 && <Row k="Investimento mensal" v={StartDB.brl(t.mensal) + '/mês'} />}
          {t.beneficios > 0 && <Row k="Total em benefícios" v={StartDB.brl(t.beneficios)} green />}
          {f.descontoPix && t.unico > 0 && <Row k="PIX à vista (−10%)" v={StartDB.brl(Math.round(t.unico * 0.9))} />}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <DS_E.Button variant="primary" disabled={!f.cliente.trim() || f.sel.length === 0} onClick={gerar}>Gerar proposta</DS_E.Button>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)', textAlign: 'center' }}>A proposta aparece em "Propostas" com o link para envio.</div>
          </div>
        </DS_E.Card>
      </div>
    </div>
  );
}
function Row({ k, v, green }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-body-sm)' }}>
    <span style={{ color: 'var(--color-text-muted)' }}>{k}</span>
    <b style={{ color: green ? 'var(--color-success)' : 'var(--color-dark)' }}>{v}</b>
  </div>;
}
window.EditorPage = EditorPage;
