/* Gerador de Proposta — estado do formulário + link */
(function(){
  const DEF = {
    cliente:'', dataEnvio:new Date().toISOString().slice(0,10), validadeDias:7, validadeHoras:0,
    servicos:[{nome:'Design da página',preco:1500},{nome:'Implementação e responsividade',preco:900},{nome:'Otimização de performance',preco:400}],
    precoPor:2500,
    infos:[
      {titulo:'Prazo de Entrega', texto:'O prazo de entrega de uma página é de no máximo 4 dias, podendo ser entregue antes dependendo do fluxo de demandas e da necessidade do cliente.'},
      {titulo:'Formas de Pagamento', texto:'A partir do pagamento de 50% do valor começamos o projeto e depois que o serviço for entregue as outras 50%.'},
      {titulo:'Meios de Pagamento', texto:'Você pode pagar através de boleto, pix ou transferência bancária. E se preferir você pode parcelar em até 12x no cartão de crédito (essa forma pode conter juros).'}
    ],
    sobreMim:'Meu nome é Washington Melo, mais conhecido como Tom, e trabalho como designer há mais de 4 anos, especialista em design para lançamentos. Já participei de +70 lançamentos e +250 clientes atendidos em mais de 5 países diferentes.',
    stats:['+250 Clientes Atendidos','Clientes em mais de 5 Países','+4 Anos de Experiência'],
    portfolioLink:'',
    depoimentos:[
      {nome:'', handle:'', texto:''},
      {nome:'', handle:'', texto:''},
      {nome:'', handle:'', texto:''}
    ],
    etapas:[
      {titulo:'Aplicação do Briefing', texto:'O primeiro passo é entender exatamente o que você quer e coletar as informações necessárias, como copy, arquivos de imagem, identidade visual e referências.'},
      {titulo:'Pesquisa', texto:'Realizo uma análise do nicho para compreender profundamente as estratégias dos concorrentes, identificando as melhores práticas e referências do setor.'},
      {titulo:'Criação do Design', texto:'A partir disso, inicia-se o desenvolvimento da parte visual, garantindo que o resultado final seja não apenas atrativo, mas também altamente competitivo e alinhado com as tendências de mercado.'},
      {titulo:'Implementação', texto:'Após a completa aprovação do design pelo cliente, procedo com a implementação da página, assegurando o pleno funcionamento em todos os dispositivos e plataformas.'},
      {titulo:'Otimização da Página', texto:'Durante esta fase, dedico-me à otimização integral da página, assegurando um carregamento rápido e eficiente.'}
    ],
    ctaLink:'', duvidaLink:'', empresa:'', cnpj:'', marca:'', criador:''
  };

  let state;
  try{ state = Object.assign({}, DEF, JSON.parse(localStorage.getItem('proposta-data')||'{}')); }
  catch(e){ state = Object.assign({}, DEF); }

  const $ = id => document.getElementById(id);
  const brl = v => 'R$ ' + Number(v||0).toLocaleString('pt-BR');
  const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

  const SIMPLE = ['cliente','dataEnvio','validadeDias','validadeHoras','precoPor','sobreMim','portfolioLink','ctaLink','duvidaLink','empresa','cnpj','marca','criador'];

  function save(){ localStorage.setItem('proposta-data', JSON.stringify(state)); }

  /* ---- serviços ---- */
  window.addSvc = function(){ state.servicos.push({nome:'',preco:0}); renderSvc(); save(); };
  window.delSvc = function(i){ state.servicos.splice(i,1); renderSvc(); save(); };
  function renderSvc(){
    $('svcList').innerHTML = state.servicos.map((s,i)=>`
      <div class="item-row">
        <input value="${esc(s.nome)}" placeholder="Serviço" oninput="upSvc(${i},'nome',this.value)">
        <input type="number" min="0" value="${s.preco||''}" placeholder="R$" oninput="upSvc(${i},'preco',this.value)">
        <button class="x" onclick="delSvc(${i})" title="Remover">×</button>
      </div>`).join('');
    $('somaDe').textContent = brl(state.servicos.reduce((a,s)=>a+Number(s.preco||0),0));
  }
  window.upSvc = function(i,k,v){ state.servicos[i][k] = k==='preco'?Number(v):v; $('somaDe').textContent = brl(state.servicos.reduce((a,s)=>a+Number(s.preco||0),0)); save(); };

  /* ---- depoimentos ---- */
  window.addDep = function(){ state.depoimentos.push({nome:'',handle:'',texto:''}); renderDep(); save(); };
  window.delDep = function(i){ state.depoimentos.splice(i,1); renderDep(); save(); };
  function renderDep(){
    $('depList').innerHTML = state.depoimentos.map((t,i)=>`
      <div class="dep-row">
        <input value="${esc(t.nome)}" placeholder="Nome" oninput="upDep(${i},'nome',this.value)">
        <input value="${esc(t.handle)}" placeholder="@instagram" oninput="upDep(${i},'handle',this.value)">
        <button class="x" onclick="delDep(${i})" title="Remover">×</button>
        <textarea placeholder="Texto do depoimento" oninput="upDep(${i},'texto',this.value)">${esc(t.texto)}</textarea>
      </div>`).join('');
  }
  window.upDep = function(i,k,v){ state.depoimentos[i][k]=v; save(); };

  /* ---- etapas ---- */
  window.addEtp = function(){ state.etapas.push({titulo:'',texto:''}); renderEtp(); save(); };
  window.delEtp = function(i){ state.etapas.splice(i,1); renderEtp(); save(); };
  function renderEtp(){
    $('etpList').innerHTML = state.etapas.map((e,i)=>`
      <div class="etp-row">
        <div class="stack">
          <input value="${esc(e.titulo)}" placeholder="Título da etapa" oninput="upEtp(${i},'titulo',this.value)">
          <textarea placeholder="Descrição" oninput="upEtp(${i},'texto',this.value)">${esc(e.texto)}</textarea>
        </div>
        <button class="x" onclick="delEtp(${i})" title="Remover">×</button>
      </div>`).join('');
  }
  window.upEtp = function(i,k,v){ state.etapas[i][k]=v; save(); };

  /* ---- init campos simples ---- */
  SIMPLE.forEach(k=>{
    const el = $(k); if(!el) return;
    el.value = state[k] != null ? state[k] : '';
    el.addEventListener('input', ()=>{ state[k] = el.type==='number'?Number(el.value):el.value; save(); });
  });
  [0,1,2].forEach(i=>{
    const el = $('info'+i);
    el.value = state.infos[i] ? state.infos[i].texto : '';
    el.addEventListener('input', ()=>{ state.infos[i].texto = el.value; save(); });
    const st = $('stat'+i);
    st.value = state.stats[i]||'';
    st.addEventListener('input', ()=>{ state.stats[i]=st.value; save(); });
  });
  renderSvc(); renderDep(); renderEtp();

  /* ---- gerar ---- */
  function payload(){
    const p = Object.assign({}, state);
    p.depoimentos = p.depoimentos.filter(t=>t.nome||t.texto);
    p.servicos = p.servicos.filter(s=>s.nome);
    p.etapas = p.etapas.filter(e=>e.titulo);
    p.portfolioLinkLabel = p.portfolioLink ? p.portfolioLink.replace(/^https?:\/\//,'') : 'meu portfólio';
    return p;
  }
  function link(){ return 'Proposta.html#d=' + btoa(unescape(encodeURIComponent(JSON.stringify(payload())))); }

  window.abrir = function(){ save(); location.href = link(); };
  window.copiar = function(btn){
    save();
    const url = new URL(link(), location.href).href;
    navigator.clipboard.writeText(url).then(()=>{
      const t = btn.textContent; btn.textContent = 'Link copiado ✓';
      setTimeout(()=>btn.textContent=t, 2000);
    });
  };
})();
