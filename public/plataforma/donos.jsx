/* Página: Donos — define a foto/hero da capa por autor da proposta (Evandro, Katy, START) */
const DS_O = window.STARTINCDesignSystem_dd2482;

function DonosPage({ db, update }) {
  const patch = (id, changes) => update({ owners: db.owners.map(o => o.id === id ? { ...o, ...changes } : o) });
  const onPick = (id, e) => { const file = e.target.files[0]; e.target.value=''; if (file) fileToDataURL(file, async (url, err) => { if (!url) { alert(err || 'Não foi possível processar essa imagem.'); return; } const ref = await StartImg.put(url); const at = db.owners.find(o => o.id === id); if (at && at.heroImg) StartImg.del(at.heroImg); patch(id, { heroImg: ref }); }, { maxW: 900, budget: 350*1024 }); };

  return (
    <div>
      <PageHead title="Donos da proposta" sub="A capa da proposta é personalizada por autor. Envie a foto/hero de cada um — ao gerar, a proposta usa a imagem do autor escolhido (Evandro, Katy ou a START)." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {db.owners.map(o => (
          <DS_O.Card key={o.id} padding="none" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', aspectRatio: '3/4', background: 'linear-gradient(180deg,#1c0b30,#01050c)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {o.heroImg
                ? <img src={StartImg.src(o.heroImg)} alt={o.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ font: 'var(--text-body-sm)', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 16 }}>{o.id === 'start' ? 'Sem foto — usa o hero padrão da START' : 'Sem foto enviada'}</span>}
              <span style={{ position: 'absolute', top: 12, left: 12, font: 'var(--text-caption)', fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.5)', borderRadius: 999, padding: '4px 12px' }}>{o.tipo}</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Field label="Nome" value={o.nome} onChange={v => patch(o.id, { nome: v })} />
              <Field label="Cargo / linha de apoio" value={o.cargo} onChange={v => patch(o.id, { cargo: v })} />
              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{ flex: 1 }}>
                  <DS_O.Button variant="primary" size="sm" style={{ width: '100%', pointerEvents: 'none' }}>{o.heroImg ? 'Trocar foto' : 'Enviar foto'}</DS_O.Button>
                  <input type="file" accept="image/*" onChange={e => onPick(o.id, e)} style={{ display: 'none' }} />
                </label>
                {o.heroImg && <DS_O.Button variant="ghost" size="sm" onClick={() => patch(o.id, { heroImg: '' })}>Remover</DS_O.Button>}
              </div>
            </div>
          </DS_O.Card>
        ))}
      </div>
    </div>
  );
}
window.DonosPage = DonosPage;
