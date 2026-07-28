/* Página: Editor de proposta */
const DS_E = window.STARTINCDesignSystem_dd2482;

/* parcelamento: usa o motor da planilha (2,99% até 3x, 3,99% de 4x+, 2,49% antecipação, R$0,49) */
function calcParcela(total, forma) {
  const p = StartDB.parcelamento(total, forma);
  return { n: p.n, cartao: p.cartao, valor: p.parcela, total: p.totalParcelado, acrescimo: p.acrescimo };
}

function calcTotais(db, sel, selBonus, bonusSvc, bonusSvcPreco) {
  const svcs = sel.map(s => ({ ...db.servicos.find(x => x.id === s.id), precoFinal: s.preco }));
  const mensal = svcs.filter(s => s.rec === 'mensal').reduce((a, s) => a + Number(s.precoFinal || 0), 0);
  const unico = svcs.filter(s => s.rec !== 'mensal').reduce((a, s) => a + Number(s.precoFinal || 0), 0);
  const beneficios = selBonus.map(id => db.bonus.find(b => b.id === id)).filter(Boolean).reduce((a, b) => a + Number(b.valor || 0), 0)
    + (bonusSvc || []).map(id => db.servicos.find(s => s.id === id)).filter(Boolean).reduce((a, s) => {
      const m = bonusSvcPreco || {};
      return a + Number((m[s.id] === undefined ? s.preco : m[s.id]) || 0);
    }, 0);
  return { mensal, unico, beneficios };
}

function svcsForTema(db, temaId) {
  const tema = StartDB.TEMAS.find(t => t.id === temaId);
  const ids = (tema && tema.servicos) || [];
  return ids.map(id => { const sv = db.servicos.find(x => x.id === id); return sv ? { id: sv.id, preco: sv.preco } : null; }).filter(Boolean);
}

function depsForTema(db, temaId) {
  const tema = StartDB.TEMAS.find(t => t.id === temaId);
  if (!tema || !tema.tags.length) return [];
  return db.depoimentos.filter(d => (d.tags || []).some(tg => tema.tags.includes(tg))).map(d => d.id);
}

function pfForTema(db, temaId) {
  const tema = StartDB.TEMAS.find(t => t.id === temaId);
  const pf = db.portfolio || [];
  if (!tema || !tema.tags.length) return pf.map(d => d.id);
  const match = pf.filter(d => (d.tags || []).some(tg => tema.tags.includes(tg)));
  return (match.length ? match : pf).map(d => d.id);
}

function EditorPage({ db, update, go, editing }) {
  const isEdit = !!(editing && !editing.novo);
  const [f, setF] = React.useState(() => editing ? {
    slug: editing.slug || '',
    cliente: editing.cliente || '', empresa: editing.empresa || '', template: editing.template || 'dark',
    objetivo: editing.objetivo || '', validadeDias: editing.validadeDias || 7, descontoPix: editing.descontoPix !== false,
    contratoMeses: editing.contratoMeses === undefined ? 0 : Number(editing.contratoMeses), pagamento: editing.pagamento || 'pix',
    tema: editing.tema || 'trafego', owner: (editing.owner && editing.owner.id) || 'start',
    sel: (editing.servicos || []).map(s => ({ id: s.id, preco: s.preco })),
    selBonus: (editing.bonus || []).filter(b => !b.fromSvc).map(b => b.id),
    bonusSvc: (editing.bonus || []).filter(b => b.fromSvc).map(b => b.fromSvc),
    bonusSvcPreco: (editing.bonus || []).filter(b => b.fromSvc).reduce((a, b) => { a[b.fromSvc] = b.valor; return a; }, {}),
    selDep: (editing.depoimentos || []).map(d => d.id),
    selPf: (editing.portfolio || []).map(p => { const m = (db.portfolio || []).find(x => x.img === p.img); return m && m.id; }).filter(Boolean),
    etapasCustom: editing.etapas && editing.etapas.length ? editing.etapas : null
  } : {
    slug: '', cliente: '', empresa: '', template: 'dark', objetivo: '',
    validadeDias: 7, descontoPix: true,
    contratoMeses: 0, pagamento: 'pix',
    tema: 'trafego', owner: 'start',
    sel: svcsForTema(db, 'trafego'), selBonus: [], bonusSvc: [], bonusSvcPreco: {}, selDep: depsForTema(db, 'trafego'), selPf: pfForTema(db, 'trafego'), etapasCustom: null
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  // trocar o tema: puxa hero do autor + depoimentos automaticamente
  const setTema = (temaId) => {
    const tema = StartDB.TEMAS.find(t => t.id === temaId);
    setF(p => ({ ...p, etapasCustom: null, tema: temaId, owner: tema ? tema.owner : p.owner, sel: svcsForTema(db, temaId), selDep: depsForTema(db, temaId), selPf: pfForTema(db, temaId) }));
  };
  const toggleDep = (id) => setF(p => ({ ...p, selDep: p.selDep.includes(id) ? p.selDep.filter(x => x !== id) : [...p.selDep, id] }));
  const togglePf = (id) => setF(p => ({ ...p, selPf: p.selPf.includes(id) ? p.selPf.filter(x => x !== id) : [...p.selPf, id] }));
  const tema = StartDB.TEMAS.find(t => t.id === f.tema);
  const owner = db.owners.find(o => o.id === f.owner) || db.owners[0];
  // serviços sugeridos pelo tema aparecem primeiro
  const svcOrdenados = tema && tema.categorias.length
    ? [...db.servicos].sort((a, b) => (tema.categorias.includes(b.categoria) ? 1 : 0) - (tema.categorias.includes(a.categoria) ? 1 : 0))
    : db.servicos;
  const toggleSvc = (svc) => setF(p => {
    const has = p.sel.find(s => s.id === svc.id);
    return { ...p, bonusSvc: (p.bonusSvc || []).filter(x => x !== svc.id), sel: has ? p.sel.filter(s => s.id !== svc.id) : [...p.sel, { id: svc.id, preco: svc.preco }] };
  });
  const setPreco = (id, v) => setF(p => ({ ...p, sel: p.sel.map(s => s.id === id ? { ...s, preco: v === '' ? null : v } : s) }));
  const setBonusPreco = (id, v) => setF(p => ({ ...p, bonusSvcPreco: { ...(p.bonusSvcPreco || {}), [id]: v === '' ? null : Number(v) } }));
  const bonusPreco = (s) => { const m = f.bonusSvcPreco || {}; return m[s.id] === undefined ? s.preco : m[s.id]; };
  // marca um serviço como bônus (entra grátis na proposta e sai da lista de cobrança)
  const toggleBonusSvc = (id) => setF(p => ({
    ...p,
    bonusSvc: (p.bonusSvc || []).includes(id) ? p.bonusSvc.filter(x => x !== id) : [...(p.bonusSvc || []), id],
    sel: p.sel.filter(s => s.id !== id)
  }));
  const toggleBonus = (id) => setF(p => ({ ...p, selBonus: p.selBonus.includes(id) ? p.selBonus.filter(x => x !== id) : [...p.selBonus, id] }));

  const t0 = calcTotais(db, f.sel, f.selBonus, f.bonusSvc, f.bonusSvcPreco);
  const t = { ...t0, totalAvista: t0.unico + t0.mensal * (Number(f.contratoMeses) || 1) };

  const gerar = () => {
    if (!f.cliente.trim() || f.sel.length === 0) return;
    const codigo = isEdit ? editing.id : StartDB.uid();
    const ownerObj = db.owners.find(o => o.id === f.owner) || db.owners[0];
    const userSlug = (f.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const proposta = {
      id: codigo,
      slug: userSlug || StartDB.makeSlug(f.cliente, f.empresa, db.propostas, codigo),
      cliente: f.cliente, empresa: f.empresa, template: f.template,
      objetivo: f.objetivo, validadeDias: Number(f.validadeDias) || 7, descontoPix: f.descontoPix,
      contratoMeses: Number(f.contratoMeses) || 0, pagamento: f.pagamento,
      tema: f.tema, owner: { ...ownerObj },
      etapas: f.etapasCustom || (StartDB.ETAPAS_TEMA && StartDB.ETAPAS_TEMA[f.tema]) || StartDB.ETAPAS_TEMA.web,
      depoimentos: f.selDep.map(id => db.depoimentos.find(d => d.id === id)).filter(Boolean),
      portfolio: f.selPf.map(id => (db.portfolio || []).find(d => d.id === id)).filter(Boolean).map(d => ({ img: d.img, titulo: d.titulo || '', anim: !!d.anim })),
      criadoEm: isEdit ? editing.criadoEm : new Date().toISOString(),
      servicos: f.sel.map(s => { const sv = db.servicos.find(x => x.id === s.id); return { ...sv, preco: s.preco }; }),
      bonus: [
        ...f.selBonus.map(id => db.bonus.find(b => b.id === id)).filter(Boolean),
        ...(f.bonusSvc || []).map(id => db.servicos.find(s => s.id === id)).filter(Boolean).map(s => ({
          id: 'bsvc-' + s.id, fromSvc: s.id, nome: s.nome, valor: bonusPreco(s),
          descricao: s.resumo || '', inclusos: s.inclusos || []
        }))
      ],
      condicoes: db.condicoes,
      link: isEdit && editing.link ? editing.link : { expiraDias: 7, senha: '', download: true, impressao: true, status: 'Enviada', views: [] }
    };
    update({ propostas: isEdit
      ? db.propostas.map(p => p.id === codigo ? proposta : p)
      : [proposta, ...db.propostas] });
    try {
      fetch('/api/propostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposta)
      }).catch(() => {});
    } catch(e) {}
    go('propostas', codigo);
  };

  const secTitle = (txt) => <div style={{ font: 'var(--text-heading-md)', color: 'var(--color-dark)', margin: '0 0 14px' }}>{txt}</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <PageHead title={isEdit ? 'Editar proposta #' + editing.id : 'Nova proposta'} sub={isEdit ? 'Alterando uma proposta já criada — o link e o histórico de acessos são mantidos.' : 'Monte a oferta selecionando serviços e bonificações da biblioteca. O investimento é calculated automaticamente.'} />
        <DS_E.Card padding="lg">
          {secTitle('Cliente')}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Field label="Nome do contato" value={f.cliente} onChange={v => set('cliente', v)} placeholder="Ex.: Dra. Camila" />
            <Field label="Empresa" value={f.empresa} onChange={v => set('empresa', v)} placeholder="Ex.: Clínica Vida" />
            <Field label="Slug da URL (ex: clinica-vida)" value={f.slug || ''} onChange={v => set('slug', v.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))} placeholder="Ex.: clinica-vida" />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
            <SelectField label="Template da proposta" value={f.template} onChange={v => set('template', v)} options={[
              { value: 'start', label: 'START INC — azul institucional' },
              { value: 'dark', label: 'Dark neon — impacto visual' },
              { value: 'completa', label: 'Completa — portfólio + depoimentos' }]} />
            <Field label="Validade (dias)" type="number" min={1} value={f.validadeDias} onChange={v => set('validadeDias', v)} />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
            <SelectField label="Tempo de contrato" value={String(f.contratoMeses)} onChange={v => set('contratoMeses', Number(v))} options={[
              { value: '0', label: 'Pontual — sem recorrência' },
              { value: '2', label: '2 meses' }, { value: '4', label: '4 meses' },
              { value: '6', label: '6 meses' }, { value: '12', label: '12 meses' }]} />
            <SelectField label="Forma de pagamento" value={f.pagamento} onChange={v => set('pagamento', v)} options={[
              { value: 'pix', label: 'PIX — sem taxa' },
              { value: 'boleto', label: 'Boleto — sem taxa' },
              { value: 'avista', label: 'Cartão à vista (1x) — com taxa' },
              ...[2,3,4,5,6,7,8,9,10,11,12].map(n => ({ value: String(n), label: n + 'x no cartão' }))]} />
          </div>
          <div style={{ marginTop: 14 }}>
            <TArea label="Objetivo do projeto (abre a proposta)" value={f.objetivo} onChange={v => set('objetivo', v)} rows={3}
              placeholder="Ex.: Estruturar a aquisição digital da Clínica Vida com tráfego pago, landing page e rastreamento completo para gerar agendamentos previsíveis." />
          </div>
        </DS_E.Card>

        <DS_E.Card padding="lg">
          {secTitle('Tema & autor da proposta')}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <SelectField label="Tema (puxa prova social e hero automático)" value={f.tema} onChange={setTema}
              options={StartDB.TEMAS.map(t => ({ value: t.id, label: t.label }))} />
            <SelectField label="Proposta em nome de (hero da capa)" value={f.owner} onChange={v => set('owner', v)}
              options={db.owners.map(o => ({ value: o.id, label: o.nome + ' — ' + o.tipo }))} />
          </div>
          {tema && <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginTop: 10 }}>{tema.descricao}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-subtle)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', background: 'linear-gradient(180deg,#1c0b30,#01050c)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {owner && owner.heroImg ? <img src={StartImg.src(owner.heroImg)} alt={owner.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ font: 'var(--text-caption)', color: 'rgba(255,255,255,.6)' }}>{owner ? owner.nome[0] : '?'}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)' }}>Hero: {owner ? owner.nome : '—'}</div>
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{owner && owner.heroImg ? 'Foto personalizada será usada na capa.' : (owner && owner.id === 'start' ? 'Usará o hero padrão da START.' : 'Sem foto — envie em “Donos” para personalizar.')}</div>
            </div>
          </div>
        </DS_E.Card>

        <DS_E.Card padding="lg">
          {secTitle('Serviços')}
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)', marginBottom: 10 }}>Marque a caixa para cobrar o serviço, ou toque no <b style={{ color: 'var(--color-success)' }}>✓</b> verde para oferecê-lo como bônus grátis.</div>
          {svcOrdenados.map(s => {
            const sel = f.sel.find(x => x.id === s.id);
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: sel ? 'var(--color-primary-tint)' : ((f.bonusSvc || []).includes(s.id) ? '#EAFBF1' : 'transparent'), marginBottom: 4 }}>
                <input type="checkbox" checked={!!sel} onChange={() => toggleSvc(s)} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleSvc(s)}>
                  <div style={{ font: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-dark)' }}>{s.nome}</div>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{s.rec === 'mensal' ? 'mensal' : s.rec === 'consulta' ? 'sob consulta' : 'valor único'}</div>
                </div>
                <button title={(f.bonusSvc || []).includes(s.id) ? 'Remover dos bônus' : 'Oferecer como bônus (grátis)'}
                  onClick={() => toggleBonusSvc(s.id)}
                  style={{ width: 30, height: 30, flexShrink: 0, borderRadius: '50%', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, lineHeight: 1,
                    border: '1px solid ' + ((f.bonusSvc || []).includes(s.id) ? 'var(--color-success)' : 'var(--color-border)'),
                    background: (f.bonusSvc || []).includes(s.id) ? 'var(--color-success)' : 'transparent',
                    color: (f.bonusSvc || []).includes(s.id) ? '#fff' : 'var(--color-text-muted)' }}>✓</button>
                {sel ? (
                  <input type="number" min={0} value={sel.preco == null ? '' : sel.preco} placeholder="A definir"
                    onChange={e => setPreco(s.id, e.target.value === '' ? '' : Number(e.target.value))}
                    style={{ width: 110, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 10px', font: 'var(--text-body-sm)', outline: 'none', background: 'var(--color-surface, #fff)', color: 'var(--color-text)' }} />
                ) : (f.bonusSvc || []).includes(s.id) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>valor de</span>
                    <input type="number" min={0} value={bonusPreco(s) == null ? '' : bonusPreco(s)} placeholder="0"
                      onChange={ev => setBonusPreco(s.id, ev.target.value)}
                      style={{ width: 92, border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', padding: '8px 10px', font: 'var(--text-body-sm)', outline: 'none', background: 'var(--color-surface, #fff)', color: 'var(--color-text)' }} />
                    <b style={{ font: 'var(--text-body-sm)', color: 'var(--color-success)' }}>→ R$ 0</b>
                  </div>
                ) : (
                  <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>{s.parcelas || StartDB.brl(s.preco)}</span>
                )}
              </div>
            );
          })}
        </DS_E.Card>

        <DS_E.Card padding="lg">
          {secTitle('Bonificações')}
          {(f.bonusSvc || []).length > 0 && (
            <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {f.bonusSvc.map(id => { const s = db.servicos.find(x => x.id === id); if (!s) return null; return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: '#EAFBF1' }}>
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓</span>
                  <div style={{ flex: 1, font: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-dark)' }}>{s.nome} <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>· serviço oferecido como bônus</span></div>
                  <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>De <s>{StartDB.brl(bonusPreco(s))}</s> por <b style={{ color: 'var(--color-success)' }}>R$ 0</b></span>
                  <button onClick={() => toggleBonusSvc(id)} style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 16 }}>×</button>
                </div>
              ); })}
            </div>
          )}
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

        <DS_E.Card padding="lg">
          {secTitle('Depoimentos (automáticos pelo tema)')}
          <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginBottom: 14 }}>
            Já vieram {f.selDep.length} depoimento{f.selDep.length !== 1 ? 's' : ''} do tema “{tema ? tema.label : ''}”. Desmarque para tirar da proposta.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            {db.depoimentos.map(d => {
              const on = f.selDep.includes(d.id);
              return (
                <div key={d.id} onClick={() => toggleDep(d.id)} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${on ? 'var(--color-primary)' : 'transparent'}`, opacity: on ? 1 : 0.5, transition: 'all .2s' }}>
                  <div style={{ aspectRatio: '4/3', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {d.img ? <img src={StartImg.src(d.img)} alt={d.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{d.nome}</span>}
                  </div>
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: on ? 'var(--color-primary)' : 'rgba(0,0,0,.4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-caption)', fontWeight: 700 }}>{on ? '✓' : ''}</div>
                  <div style={{ padding: '6px 8px', font: 'var(--text-caption)', color: 'var(--color-dark)', background: 'var(--color-surface,#fff)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.nome}</div>
                </div>
              );
            })}
          </div>
          {db.depoimentos.length === 0 && <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>Nenhum depoimento no banco ainda — adicione em “Depoimentos”.</div>}
        </DS_E.Card>

        <DS_E.Card padding="lg">
          {secTitle('Portfólio (só no template Completa)')}
          <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginBottom: 14 }}>
            Vieram {f.selPf.length} print{f.selPf.length !== 1 ? 's' : ''} do tema “{tema ? tema.label : ''}”. Desmarque para tirar da proposta. As imagens ficam embutidas na proposta gerada.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {(db.portfolio || []).map(d => {
              const on = f.selPf.includes(d.id);
              return (
                <div key={d.id} onClick={() => togglePf(d.id)} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${on ? 'var(--color-primary)' : 'transparent'}`, opacity: on ? 1 : 0.5, transition: 'all .2s' }}>
                  <div style={{ aspectRatio: '4/5', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {d.img ? <img src={StartImg.src(d.img)} alt={d.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{d.titulo}</span>}
                  </div>
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: on ? 'var(--color-primary)' : 'rgba(0,0,0,.4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-caption)', fontWeight: 700 }}>{on ? '✓' : ''}</div>
                </div>
              );
            })}
          </div>
          {(db.portfolio || []).length === 0 && <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>Nenhum print no banco ainda — adicione em “Portfólio”.</div>}
        </DS_E.Card>
      </div>

      <div style={{ position: 'sticky', top: 24 }}>
        <DS_E.Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ font: 'var(--text-heading-md)', color: 'var(--color-dark)' }}>Resumo</div>
          <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>{f.sel.length} serviço{f.sel.length !== 1 ? 's' : ''} · {f.selBonus.length + (f.bonusSvc || []).length} bônus · {f.selDep.length} depoimentos · {f.selPf.length} prints</div>
          {t.unico > 0 && <Row k="Investimento único" v={StartDB.brl(t.unico)} />}
          {t.mensal > 0 && <Row k="Investimento mensal" v={StartDB.brl(t.mensal) + '/mês'} />}
          {t.beneficios > 0 && <Row k="Total em benefícios" v={StartDB.brl(t.beneficios)} green />}
          <Row k={f.contratoMeses ? 'Contrato ' + f.contratoMeses + ' meses' : 'Contrato pontual'}
            v={t.mensal > 0 ? (f.contratoMeses ? StartDB.brl(t.mensal * f.contratoMeses) : StartDB.brl(t.mensal) + ' (1 mês)') : 'sem recorrência'} />
          {t.mensal === 0 && (
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
              Nenhum serviço <b>mensal</b> selecionado — por isso o tempo de contrato não altera o total. Marque um serviço recorrente (ex.: Gestão de Tráfego) para o prazo entrar na conta.
            </div>
          )}
          <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 10 }}>
            <Row k="Total à vista" v={StartDB.brl(t.totalAvista)} />
          </div>
          {(() => {
            const pc = calcParcela(t.totalAvista, f.pagamento);
            if (!pc.cartao) return null;
            return <React.Fragment>
              <Row k={pc.n > 1 ? pc.n + 'x no cartão' : 'Cartão 1x (com taxa)'} v={'R$ ' + pc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} />
              <Row k="Total parcelado" v={'R$ ' + pc.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} />
              <Row k="Acréscimo das taxas" v={'+ R$ ' + pc.acrescimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} />
            </React.Fragment>;
          })()}
          {(() => {
            const custo = f.sel.reduce((a, s) => {
              const svc = db.servicos.find(x => x.id === s.id);
              if (!svc || svc.custo == null) return a;
              return a + svc.custo * (svc.rec === 'mensal' ? (Number(f.contratoMeses) || 1) : 1);
            }, 0);
            if (!custo) return null;
            const m = StartDB.margem(t.totalAvista, custo);
            return <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Row k="Custo estimado" v={StartDB.brl(Math.round(custo))} />
              <Row k={'Margem · ' + (m.pct * 100).toFixed(0) + '%'} v={StartDB.brl(Math.round(m.valor))} green={m.pct >= 0.3} />
            </div>;
          })()}
          {f.descontoPix && f.pagamento === 'pix' && <Row k="PIX à vista (−10%)" v={StartDB.brl(Math.round(t.totalAvista * 0.9))} green />}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <DS_E.Button variant="primary" disabled={!f.cliente.trim() || f.sel.length === 0} onClick={gerar}>{isEdit ? 'Salvar alterações' : 'Gerar proposta'}</DS_E.Button>
            {isEdit && <DS_E.Button variant="ghost" onClick={() => go('propostas', editing.id)}>Cancelar edição</DS_E.Button>}
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)', textAlign: 'center' }}>{isEdit ? 'O mesmo link continua válido depois de salvar.' : 'A proposta aparece em "Propostas" com o link para envio.'}</div>
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
