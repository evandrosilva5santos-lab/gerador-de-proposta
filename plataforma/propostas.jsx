/* Página: Propostas — histórico + controle do link */
const DS_P = window.STARTINCDesignSystem_dd2482;

function LinkControls({ p, patch }) {
  const link = p.link || {};
  const set = (k, v) => patch({ link: { ...link, [k]: v } });
  const slugVal = p.slug || '';
  return (
    <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Field 
          label="Slug Personalizada (Link curto)" 
          value={slugVal} 
          onChange={v => patch({ slug: v.toLowerCase().replace(/[^a-z0-9-_]/g, '-') })} 
          placeholder="Ex.: empresa-acme" 
          style={{ minWidth: 200, flex: 1 }} 
        />
        <SelectField 
          label="Tipo de Link ao copiar" 
          value={p.linkMode || 'short'} 
          onChange={v => patch({ linkMode: v })} 
          options={[
            { value: 'short', label: 'Link Curto (Recomendado)' },
            { value: 'full', label: 'Link Completo (Offline / Embarcado)' }
          ]} 
          style={{ maxWidth: 220 }} 
        />
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

function PropostasPage({ db, update, highlight, go }) {
  const [open, setOpen] = React.useState(highlight || null);
  const [confirm, setConfirm] = React.useState(null);
  const [copied, setCopied] = React.useState(null);
  const [manual, setManual] = React.useState(null);

  const patchP = (id, changes) => {
    const nextPropostas = db.propostas.map(p => p.id === id ? { ...p, ...changes } : p);
    update({ propostas: nextPropostas });
    const pUpdated = nextPropostas.find(x => x.id === id);
    if(pUpdated) syncApi(pUpdated);
  };

  const fileFor = (p) => p.template === 'completa' ? 'Proposta.html' : 'Proposta START.html';
  const slim = (p) => {
    const leve = v => !(typeof v === 'string' && v.startsWith('data:') && v.length > 6000);
    const o = JSON.parse(JSON.stringify(p));
    if(o.owner && !leve(o.owner.heroImg)) o.owner.heroImg = '';
    o.depoimentos = (o.depoimentos || []).filter(d => leve(d.img));
    o.portfolio = (o.portfolio || []).filter(x => leve(x.img));
    return o;
  };
  const encode = (p) => btoa(unescape(encodeURIComponent(JSON.stringify(slim(p))))).replace(/\+/g, '-').replace(/\//g, '_');
  const slugOf = (p) => (p.slug || StartDB.makeSlug(p.cliente, p.empresa, db.propostas, p.id)).toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  
  const shortUrlFor = (p) => new URL(`${fileFor(p)}?p=${slugOf(p)}`, location.href).href;
  const fullUrlFor = (p) => new URL(`${fileFor(p)}?p=${slugOf(p)}&id=${p.id}#p=${encode(p)}`, location.href).href;
  const urlFor = (p) => (p.linkMode === 'full' ? fullUrlFor(p) : shortUrlFor(p));

  const syncApi = (p) => {
    try {
      fetch('/api/propostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      }).catch(() => {});
    } catch(e) {}
  };

  const copiar = async (p) => {
    syncApi(p);
    const url = urlFor(p);
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(url); ok = true; }
    } catch (e) { ok = false; }
    if (!ok) {
      const ta = document.createElement('textarea');
      ta.value = url; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, url.length);
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
    }
    if (ok) { setCopied(p.id); setTimeout(() => setCopied(null), 2000); }
    else setManual({ id: p.id, url });
  };

  const totalDe = (p) => {
    const unico = p.servicos.filter(s => s.rec !== 'mensal').reduce((a, s) => a + Number(s.preco || 0), 0);
    const mensal = p.servicos.filter(s => s.rec === 'mensal').reduce((a, s) => a + Number(s.preco || 0), 0);
    return [unico ? StartDB.brl(unico) : null, mensal ? StartDB.brl(mensal) + '/mês' : null].filter(Boolean).join(' + ') || 'A definir';
  };
  const statusTone = { 'Enviada': 'primary', 'Visualizada': 'warning', 'Aprovada': 'success', 'Perdida': 'error', 'Expirada': 'neutral' };

  return (
    <div>
      <PageHead title="Propostas" sub="Todas as propostas geradas, com link de envio, controle de slug/URL, permissões e histórico de acessos." />
      <div style={{ background: 'var(--color-bg-subtle)', borderLeft: '3px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginBottom: 16 }}>
        <b style={{ color: 'var(--color-dark)' }}>Link Curto Personalizado:</b> Você pode editar a slug de cada proposta (ex: <code>/empresa-acme</code>) para enviar um link curto e profissional.
      </div>
      {db.propostas.length === 0 && <Empty>Nenhuma proposta ainda. Crie a primeira em "Nova proposta".</Empty>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {db.propostas.map(p => (
          <DS_P.Card key={p.id} padding="md" style={{ position: 'relative', ...(open === p.id ? { borderColor: 'var(--color-primary)' } : {}) }}>
            <button title="Excluir proposta" onClick={() => setConfirm(p)}
              style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 14px/1 system-ui', padding: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'transparent'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}>×</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', paddingRight: 26 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ font: 'var(--text-heading-sm)', color: 'var(--color-dark)' }}>{p.cliente}{p.empresa ? ' — ' + p.empresa : ''}</div>
                <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  /{slugOf(p)} · #{p.id} · {new Date(p.criadoEm).toLocaleDateString('pt-BR')} · {p.servicos.length} serviços · {totalDe(p)} · template {p.template === 'dark' ? 'Dark neon' : p.template === 'completa' ? 'Completa' : 'START INC'}
                </div>
              </div>
              <DS_P.Badge tone={statusTone[p.link?.status] || 'neutral'}>{p.link?.status || 'Enviada'}</DS_P.Badge>
              <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>{(p.link?.views || []).length} views</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={shortUrlFor(p)} style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer"><DS_P.Button size="sm" variant="primary">Abrir</DS_P.Button></a>
                <DS_P.Button size="sm" variant="secondary" onClick={() => copiar(p)}>{copied === p.id ? 'Copiado ✓' : 'Copiar link'}</DS_P.Button>
                <DS_P.Button size="sm" variant="secondary" onClick={() => window.open(`${fileFor(p)}?p=${slugOf(p)}&id=${p.id}&print=1#p=${encode(p)}`, '_blank')}>Baixar PDF</DS_P.Button>
                <DS_P.Button size="sm" variant="secondary" onClick={() => go('editor', null, p)}>Editar</DS_P.Button>
                <DS_P.Button size="sm" variant="secondary" onClick={() => {
                  const novoId = StartDB.uid();
                  const copia = { ...p, id: novoId, slug: StartDB.makeSlug(p.cliente + ' copia', p.empresa, db.propostas, novoId), criadoEm: new Date().toISOString(), link: { ...(p.link || {}), status: 'Enviada', views: [] } };
                  update({ propostas: [copia, ...db.propostas] });
                  syncApi(copia);
                }}>Duplicar</DS_P.Button>
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
      {manual && (
        <Modal title="Copiar o link da proposta" onClose={() => setManual(null)} width={560}
          actions={<DS_P.Button variant="primary" onClick={() => setManual(null)}>Fechar</DS_P.Button>}>
          <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginBottom: 10 }}>
            O navegador bloqueou a cópia automática. Selecione o link abaixo e copie (Ctrl/Cmd + C):
          </div>
          <textarea readOnly value={manual.url} onFocus={e => e.target.select()} autoFocus
            style={{ width: '100%', minHeight: 120, resize: 'vertical', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 12, font: 'var(--text-body-sm)', fontFamily: 'monospace', background: 'var(--color-bg-subtle)', color: 'var(--color-text)', boxSizing: 'border-box' }} />
        </Modal>
      )}
      {confirm && (
        <ConfirmDialog title="Excluir proposta" onClose={() => setConfirm(null)}
          onConfirm={() => { update({ propostas: db.propostas.filter(x => x.id !== confirm.id) }); setConfirm(null); }}
          confirmLabel="Excluir proposta">
          <div style={{ font: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-dark)' }}>{confirm.cliente}{confirm.empresa ? ' — ' + confirm.empresa : ''}</div>
          <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>/{slugOf(confirm)} · #{confirm.id} · {(confirm.link?.views || []).length} acesso{(confirm.link?.views || []).length !== 1 ? 's' : ''}</div>
          <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginTop: 10 }}>Esta ação não pode ser desfeita e o link enviado ao cliente deixa de funcionar.</div>
        </ConfirmDialog>
      )}
    </div>
  );
}
window.PropostasPage = PropostasPage;
