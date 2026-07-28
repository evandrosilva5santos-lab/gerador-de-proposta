/* Página: Bonificações — biblioteca de bônus */
const DS_B = window.STARTINCDesignSystem_dd2482;

function BonusDialog({ item, servicos, onSave, onClose }) {
  const [f, setF] = React.useState(() => item ? JSON.parse(JSON.stringify(item)) : { id: 'b-' + StartDB.uid().toLowerCase(), nome: '', valor: '', descricao: '', inclusos: [] });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const espelhar = (svcId) => {
    const sv = (servicos || []).find(s => s.id === svcId);
    if (!sv) return;
    setF(p => ({ ...p, nome: sv.nome, valor: sv.preco || 0, descricao: sv.resumo || '', inclusos: [...(sv.inclusos || [])] }));
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,2,8,0.72)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: 600, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', padding: 32, fontFamily: 'var(--font-body)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ font: 'var(--text-heading-lg)', color: 'var(--color-dark)' }}>{item ? 'Editar bonificação' : 'Nova bonificação'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--color-text-muted)' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!item && servicos && servicos.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 14, background: 'var(--color-surface-alt, rgba(0,0,0,0.03))', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ font: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-dark)' }}>Espelhar de um serviço existente</div>
              <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Puxa nome, valor e itens de um serviço já cadastrado. Depois você pode ajustar ou apagar itens para deixar o bônus mais enxuto.</div>
              <select defaultValue="" onChange={e => { espelhar(e.target.value); e.target.value=''; }} style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-dark)', font: 'var(--text-body-md)', fontFamily: 'var(--font-body)' }}>
                <option value="" disabled>Selecione um serviço…</option>
                {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} — {StartDB.brl(s.preco || 0)}</option>)}
              </select>
            </div>
          )}
          <div style={{ display: 'flex', gap: 14 }}>
            <Field label="Nome" value={f.nome} onChange={v => set('nome', v)} placeholder="Ex.: Landing Page" style={{ flex: 2 }} />
            <Field label="Valor de mercado (R$)" type="number" min={0} value={f.valor} onChange={v => set('valor', v)} />
          </div>
          <TArea label="Descrição" value={f.descricao} onChange={v => set('descricao', v)} rows={2} />
          <TArea label="O que está incluso (um item por linha)" value={(f.inclusos || []).join('\n')} onChange={v => set('inclusos', v.split('\n'))} rows={6} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <DS_B.Button variant="ghost" onClick={onClose}>Cancelar</DS_B.Button>
          <DS_B.Button variant="primary" onClick={() => { if (!f.nome.trim()) return; f.inclusos = f.inclusos.map(s => s.trim()).filter(Boolean); f.valor = Number(f.valor) || 0; onSave(f); }}>Salvar</DS_B.Button>
        </div>
      </div>
    </div>
  );
}

function BonusPage({ db, update }) {
  const [editing, setEditing] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const saveB = (f) => {
    const i = db.bonus.findIndex(b => b.id === f.id);
    const list = [...db.bonus];
    if (i >= 0) list[i] = f; else list.push(f);
    update({ bonus: list });
    setEditing(null);
  };
  return (
    <div>
      <PageHead title="Bonificações" sub={'Bônus que entram na proposta como "de R$ X por R$ 0". O valor de mercado soma no total de benefícios apresentado ao cliente.'}
        action={<DS_B.Button variant="primary" onClick={() => setEditing('new')}>Nova bonificação</DS_B.Button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {db.bonus.map(b => (
          <DS_B.Card key={b.id} padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ font: 'var(--text-heading-sm)', color: 'var(--color-dark)' }}>{b.nome}</div>
              <DS_B.Badge tone="success">Bônus</DS_B.Badge>
            </div>
            <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)', flex: 1 }}>{b.descricao}</div>
            <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-muted)' }}>
              De <s>{StartDB.brl(b.valor)}</s> por <b style={{ color: 'var(--color-success)' }}>R$ 0</b>
            </div>
            <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
              <DS_B.Button size="sm" variant="secondary" onClick={() => setEditing(b)}>Editar</DS_B.Button>
              <DS_B.Button size="sm" variant="ghost" onClick={() => setConfirm(b)}>Excluir</DS_B.Button>
            </div>
          </DS_B.Card>
        ))}
      </div>
      {editing && <BonusDialog item={editing === 'new' ? null : editing} servicos={db.servicos} onClose={() => setEditing(null)} onSave={saveB} />}
      {confirm && (
        <ConfirmDialog title="Excluir bonificação" onClose={() => setConfirm(null)}
          onConfirm={() => { update({ bonus: db.bonus.filter(x => x.id !== confirm.id) }); setConfirm(null); }}>
          Excluir <b>{confirm.nome}</b> da biblioteca?
        </ConfirmDialog>
      )}
    </div>
  );
}
window.BonusPage = BonusPage;
