/* Página: Propostas — histórico + controle do link */
const DS_P = window.STARTINCDesignSystem_dd2482;

function LinkControls({ p, patch }) {
  const link = p.link || {};
  const set = (k, v) => patch({ link: { ...link, [k]: v } });
  return (
    <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <SelectField label="Link expira em" value={String(link.expiraDias)} onChange={v => set('expiraDias', Number(v))} options={[
          { value: '3', label: '3 dias' }, { value: '7', label: '7 dias' }, { value: '10', label: '10 dias' }, { value: '30', label: '30 dias' }, { value: '0', label: 'Nunca' }]} style={{ maxWidth: 160 }} />
        <Field label="Senha (opcional)" value={link.senha} onChange={v => set('senha', v)} placeholder="Sem senha" style={{ maxWidth: 180 }} />
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <DS_P.Switch checked={link.download !== false} onChange={v => set('download', v)} label="Permitir download" />
        <DS_P.Switch checked={link.impressao !== false} onChange={v => set('impressao', v)} label="Permitir impressão" />
      </div>
      <div>
        <div style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)', marginBottom: 8 }}>Acessos ({(link.views || []).length})</div>
        {(link.views || []).length === 0
          ? <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>Nenhum acesso ainda — cada abertura da proposta é registrada aqui.</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 140, overflow: 'auto' }}>
              {link.views.slice().reverse().map((v, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', borderBottom: '1px dashed var(--color-border)', padding: '4px 0' }}>
                  <span>{new Date(v.ts).toLocaleString('pt-BR')}</span><span>{v.device}</span>
                </div>
              ))}
            </div>}
      </div>
    </div>
  );
}

function PropostasPage({ db, update, highlight }) {
  const [open, setOpen] = React.useState(highlight || null);
  const [confirm, setConfirm] = React.useState(null);
  const [copied, setCopied] = React.useState(null);

  const patchP = (id, changes) => update({ propostas: db.propostas.map(p => p.id === id ? { ...p, ...changes } : p) });

  const urlFor = (p) => new URL(`Proposta START.html?id=${p.id}`, location.href).href;
  const copiar = (p) => {
    navigator.clipboard.writeText(urlFor(p)).then(() => { setCopied(p.id); setTimeout(() => setCopied(null), 2000); });
  };
  const totalDe = (p) => {
    const unico = p.servicos.filter(s => s.rec !== 'mensal').reduce((a, s) => a + Number(s.preco || 0), 0);
    const mensal = p.servicos.filter(s => s.rec === 'mensal').reduce((a, s) => a + Number(s.preco || 0), 0);
    return [unico ? StartDB.brl(unico) : null, mensal ? StartDB.brl(mensal) + '/mês' : null].filter(Boolean).join(' + ') || 'A definir';
  };
  const statusTone = { 'Enviada': 'primary', 'Visualizada': 'warning', 'Aprovada': 'success', 'Perdida': 'error', 'Expirada': 'neutral' };

  return (
    <div>
      <PageHead title="Propostas" sub="Todas as propostas geradas, com link de envio, controles de acesso e registro de visualizações." />
      {db.propostas.length === 0 && <Empty>Nenhuma proposta ainda. Crie a primeira em "Nova proposta".</Empty>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {db.propostas.map(p => (
          <DS_P.Card key={p.id} padding="md" style={open === p.id ? { borderColor: 'var(--color-primary)' } : {}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ font: 'var(--text-heading-sm)', color: 'var(--color-dark)' }}>{p.cliente}{p.empresa ? ' — ' + p.empresa : ''}</div>
                <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  #{p.id} · {new Date(p.criadoEm).toLocaleDateString('pt-BR')} · {p.servicos.length} serviços · {totalDe(p)} · template {p.template === 'dark' ? 'Dark neon' : 'START INC'}
                </div>
              </div>
              <DS_P.Badge tone={statusTone[p.link?.status] || 'neutral'}>{p.link?.status || 'Enviada'}</DS_P.Badge>
              <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>{(p.link?.views || []).length} views</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`Proposta START.html?id=${p.id}`} style={{ textDecoration: 'none' }}><DS_P.Button size="sm" variant="primary">Abrir</DS_P.Button></a>
                <DS_P.Button size="sm" variant="secondary" onClick={() => copiar(p)}>{copied === p.id ? 'Copiado ✓' : 'Copiar link'}</DS_P.Button>
                <DS_P.Button size="sm" variant="ghost" onClick={() => setOpen(open === p.id ? null : p.id)}>{open === p.id ? 'Fechar' : 'Controles'}</DS_P.Button>
              </div>
            </div>
            {open === p.id && (
              <div style={{ marginTop: 16 }}>
                <LinkControls p={p} patch={c => patchP(p.id, c)} />
                <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <SelectField label="" value={p.link?.status || 'Enviada'} onChange={v => patchP(p.id, { link: { ...p.link, status: v } })}
                    options={['Enviada', 'Visualizada', 'Aprovada', 'Perdida', 'Expirada'].map(s => ({ value: s, label: 'Status: ' + s }))} style={{ maxWidth: 220 }} />
                  <DS_P.Button size="sm" variant="ghost" onClick={() => setConfirm(p)}>Excluir proposta</DS_P.Button>
                </div>
              </div>
            )}
          </DS_P.Card>
        ))}
      </div>
      {confirm && (
        <DS_P.Dialog title="Excluir proposta" onClose={() => setConfirm(null)}
          actions={<React.Fragment>
            <DS_P.Button variant="ghost" onClick={() => setConfirm(null)}>Cancelar</DS_P.Button>
            <DS_P.Button variant="primary" onClick={() => { update({ propostas: db.propostas.filter(x => x.id !== confirm.id) }); setConfirm(null); }}>Excluir</DS_P.Button>
          </React.Fragment>}>
          Excluir a proposta de "{confirm.cliente}"? O link deixará de funcionar.
        </DS_P.Dialog>
      )}
    </div>
  );
}
window.PropostasPage = PropostasPage;
