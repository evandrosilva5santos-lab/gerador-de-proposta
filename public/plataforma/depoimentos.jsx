/* Página: Depoimentos — banco de prova social com upload e tags por tipo de serviço */
const DS_D = window.STARTINCDesignSystem_dd2482;

/* lê um arquivo de imagem, redimensiona e comprime até caber num orçamento de bytes.
   Prints de página inteira são muito altos, então limitamos largura E área total. */
function fileToDataURL(file, cb, opts) {
  const o = opts || {};
  const maxW = o.maxW || 1400;
  const maxPixels = o.maxPixels || 4.5e6;      // ~4.5 MP evita canvas gigante
  const budget = o.budget || 900 * 1024;        // ~900 KB por imagem no banco
  const r = new FileReader();
  r.onerror = () => cb(null, 'Não foi possível ler o arquivo.');
  r.onload = () => {
    const img = new Image();
    img.onerror = () => cb(null, 'Arquivo de imagem inválido ou corrompido.');
    img.onload = () => {
      try {
        let scale = Math.min(1, maxW / img.width);
        if (img.width * scale * img.height * scale > maxPixels)
          scale = Math.sqrt(maxPixels / (img.width * img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        let q = 0.82, url = canvas.toDataURL('image/jpeg', q);
        while (url.length > budget && q > 0.35) { q -= 0.12; url = canvas.toDataURL('image/jpeg', q); }
        if (url.length > budget) {           // ainda grande: reduz resolução pela metade
          const c2 = document.createElement('canvas');
          c2.width = Math.max(1, Math.round(w / 2)); c2.height = Math.max(1, Math.round(h / 2));
          const x2 = c2.getContext('2d');
          x2.fillStyle = '#fff'; x2.fillRect(0, 0, c2.width, c2.height);
          x2.drawImage(canvas, 0, 0, c2.width, c2.height);
          url = c2.toDataURL('image/jpeg', 0.7);
        }
        cb(url);
      } catch (e) { cb(null, 'Falha ao processar a imagem: ' + e.message); }
    };
    img.src = r.result;
  };
  r.readAsDataURL(file);
}

function TagPicker({ value, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {StartDB.TAGS.map(t => {
        const on = value.includes(t.id);
        return (
          <button key={t.id} type="button" onClick={() => onToggle(t.id)} style={{
            border: `1px solid ${on ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: on ? 'var(--color-primary-tint)' : 'transparent',
            color: on ? 'var(--sky-300)' : 'var(--color-text-muted)',
            borderRadius: 999, padding: '6px 14px', font: 'var(--text-body-sm)', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .2s'
          }}>{on ? '✓ ' : ''}{t.label}</button>
        );
      })}
    </div>
  );
}

function DepoimentoDialog({ item, onSave, onClose }) {
  const [f, setF] = React.useState(() => item
    ? JSON.parse(JSON.stringify(item))
    : { id: 'dep-' + StartDB.uid().toLowerCase(), img: '', nome: '', handle: '', tags: [] });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggleTag = (t) => setF(p => ({ ...p, tags: p.tags.includes(t) ? p.tags.filter(x => x !== t) : [...p.tags, t] }));
  const onPick = (e) => { const file = e.target.files[0]; e.target.value=''; if (file) fileToDataURL(file, async (url, err) => { if (!url) { alert(err || 'Não foi possível processar essa imagem.'); return; } const ref = await StartImg.put(url); if (f.img) StartImg.del(f.img); set('img', ref); }); };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,2,8,0.72)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: 560, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', padding: 32, fontFamily: 'var(--font-body)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ font: 'var(--text-heading-lg)', color: 'var(--color-dark)' }}>{item ? 'Editar depoimento' : 'Novo depoimento'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--color-text-muted)' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <span style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)', display: 'block', marginBottom: 8 }}>Print / imagem do depoimento</span>
            <label style={{ display: 'block', border: '1.5px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: f.img ? 12 : 28, textAlign: 'center', cursor: 'pointer', background: 'var(--color-bg-subtle)' }}>
              {f.img
                ? <img src={StartImg.src(f.img)} alt="preview" style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 8, display: 'block', margin: '0 auto' }} />
                : <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>Clique para enviar o print do WhatsApp / Instagram</span>}
              <input type="file" accept="image/*" onChange={onPick} style={{ display: 'none' }} />
            </label>
            {f.img && <div style={{ marginTop: 8 }}><DS_D.Button size="sm" variant="ghost" onClick={() => set('img', '')}>Remover imagem</DS_D.Button></div>}
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <Field label="Nome" value={f.nome} onChange={v => set('nome', v)} placeholder="Ex.: Telma Oliveira" />
            <Field label="@ / legenda" value={f.handle} onChange={v => set('handle', v)} placeholder="@instagram ou tipo" />
          </div>
          <div>
            <span style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)', display: 'block', marginBottom: 8 }}>Vincular a quais tipos de serviço?</span>
            <TagPicker value={f.tags} onToggle={toggleTag} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <DS_D.Button variant="ghost" onClick={onClose}>Cancelar</DS_D.Button>
          <DS_D.Button variant="primary" onClick={() => { if (!f.img && !f.nome.trim()) return; onSave(f); }}>Salvar depoimento</DS_D.Button>
        </div>
      </div>
    </div>
  );
}

function DepoimentosPage({ db, update }) {
  const [editing, setEditing] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [filtro, setFiltro] = React.useState('todos');

  const saveDep = (f) => {
    const i = db.depoimentos.findIndex(d => d.id === f.id);
    const list = [...db.depoimentos];
    if (i >= 0) list[i] = f; else list.push(f);
    update({ depoimentos: list });
    setEditing(null);
  };
  const tagLabel = id => (StartDB.TAGS.find(t => t.id === id) || {}).label || id;
  const lista = filtro === 'todos' ? db.depoimentos : db.depoimentos.filter(d => (d.tags || []).includes(filtro));

  return (
    <div>
      <PageHead title="Depoimentos" sub="Banco de prova social. Envie os prints, marque a qual tipo de serviço cada um pertence e o editor puxa os certos automaticamente ao escolher o tema da proposta."
        action={<DS_D.Button variant="primary" onClick={() => setEditing('new')}>Novo depoimento</DS_D.Button>} />

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

      {db.depoimentos.length === 0 && <Empty>Nenhum depoimento ainda. Envie o primeiro print em "Novo depoimento".</Empty>}
      <div style={{ columnCount: 2, columnGap: 14 }} className="dep-masonry-admin">
        <style>{`@media(min-width:1500px){.dep-masonry-admin{column-count:3!important}}@media(max-width:760px){.dep-masonry-admin{column-count:1!important}}.dep-masonry-admin>*{break-inside:avoid;-webkit-column-break-inside:avoid;margin:0 0 14px;display:inline-flex!important;width:100%}`}</style>
        {lista.map(d => (
          <DS_D.Card key={d.id} padding="none" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'var(--color-bg-subtle)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {d.img ? <img src={StartImg.src(d.img)} alt={d.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>Sem imagem</span>}
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <div>
                <div style={{ font: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-dark)' }}>{d.nome || '—'}</div>
                <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{d.handle}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-start', alignContent: 'flex-start', flex: 1 }}>
                {(d.tags || []).length ? d.tags.map(t => (
                  <span key={t} style={{ font: 'var(--text-caption)', lineHeight: 1.4, whiteSpace: 'nowrap', color: 'var(--sky-300)', background: 'var(--color-primary-tint)', borderRadius: 999, padding: '4px 10px' }}>{tagLabel(t)}</span>
                )) : <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>Sem vínculo</span>}
              </div>
              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
                <DS_D.Button size="sm" variant="secondary" onClick={() => setEditing(d)}>Editar</DS_D.Button>
                <DS_D.Button size="sm" variant="ghost" onClick={() => setConfirm(d)}>Excluir</DS_D.Button>
              </div>
            </div>
          </DS_D.Card>
        ))}
      </div>

      {editing && <DepoimentoDialog item={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={saveDep} />}
      {confirm && (
        <ConfirmDialog title="Excluir depoimento" onClose={() => setConfirm(null)}
          onConfirm={() => { update({ depoimentos: db.depoimentos.filter(x => x.id !== confirm.id) }); setConfirm(null); }}>
          Excluir <b>{confirm.nome || 'este depoimento'}</b> do banco? Ele sai das próximas propostas; as já geradas não mudam.
        </ConfirmDialog>
      )}
    </div>
  );
}
window.DepoimentosPage = DepoimentosPage;
window.fileToDataURL = fileToDataURL;
