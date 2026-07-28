/* Renderiza a proposta rica a partir do id (?id=) lido do banco local da plataforma */
(function(){
  const KEY = 'start-plataforma-v1';
  const brl = v => v==null ? 'A definir' : 'R$ ' + Number(v).toLocaleString('pt-BR');
  const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const $ = id => document.getElementById(id);

  const ETAPAS = [
    {titulo:'Diagnóstico e briefing', texto:'Entendemos seu negócio, seus números e seus objetivos. Coletamos acessos, materiais e referências para embasar toda a estratégia.'},
    {titulo:'Estratégia', texto:'Analisamos mercado e concorrência e desenhamos o plano: canais, ofertas, funil e metas. Você aprova a direção antes de qualquer execução.'},
    {titulo:'Implementação', texto:'Colocamos a estrutura no ar — campanhas, páginas, rastreamento e integrações — garantindo funcionamento pleno em todos os dispositivos.'},
    {titulo:'Otimização', texto:'Acompanhamos os dados de perto e otimizamos continuamente para melhorar conversão, reduzir custo por resultado e escalar o que funciona.'},
    {titulo:'Acompanhamento', texto:'Relatórios claros e reuniões estratégicas para você enxergar o retorno e decidir os próximos passos com segurança.'}
  ];
  const DEPOIMENTOS = [
    {img:'assets/depoimentos/telma-phone.png', nome:'Telma Oliveira', hd:'@brilhandonoseua'},
    {img:'assets/depoimentos/bomdia.jpg', nome:'Cliente Start', hd:'Landing Page'},
    {img:'assets/depoimentos/luciano.jpg', nome:'Luciano Pozzebom', hd:'@luccxxsxn'},
    {img:'assets/depoimentos/amanda.jpg', nome:'Amanda Pinheiro', hd:'Cliente Start'},
    {img:'assets/depoimentos/jared.jpg', nome:'Jared Michael', hd:'Cliente internacional'}
  ];

  function loadDb(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } }
  function saveDb(db){ localStorage.setItem(KEY, JSON.stringify(db)); }

  function fromHash(){
    try{
      const m = location.hash.match(/[#&]p=([^&]+)/);
      if(m) return JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g,'+').replace(/_/g,'/')))));
    }catch(e){ console.warn('link embutido inválido', e); }
    return null;
  }
  const params = new URLSearchParams(location.search);
  const pid = params.get('id');
  const pslug = params.get('p');
  const db = loadDb();
  let p = fromHash() || (db.propostas||[]).find(x=>x.id===pid || (x.slug && pslug && x.slug.toLowerCase()===pslug.toLowerCase()));
  if(!p && (pslug || pid)){
    try {
      const xhr = new XMLHttpRequest();
      const query = pslug ? `p=${encodeURIComponent(pslug)}` : `id=${encodeURIComponent(pid)}`;
      xhr.open('GET', `/api/propostas?${query}`, false);
      xhr.send();
      if(xhr.status === 200){
        const json = JSON.parse(xhr.responseText);
        if(json && !json.error) p = json;
      }
    }catch(e){}
  }
  const isDemo = !p;
  if(!p){
    const seedSvc = (db.servicos&&db.servicos.length) ? db.servicos.slice(0,2) : [
      {id:'demo-trafego', nome:'Gestão de Tráfego Pago STANDARD', categoria:'Tráfego', preco:3500, rec:'mensal', prazo:'Contrato mensal',
       resumo:'Gestão profissional de Meta Ads e Google Ads para gerar demanda previsível.',
       inclusos:['Planejamento estratégico das campanhas','Gestão de Meta Ads e Google Ads','Prospecção, relacionamento e remarketing','Monitoramento diário','Otimizações contínuas','Relatórios periódicos','Reuniões estratégicas']},
      {id:'demo-landing', nome:'Landing Page', categoria:'Web', preco:2000, rec:'unico', prazo:'Até 10 dias',
       resumo:'Página de alta conversão com copy estratégica e rastreamento configurado.',
       inclusos:['Copy estratégica','Design personalizado','Desenvolvimento da página','Integração com WhatsApp','Configuração do Meta Pixel','Publicação da página']}
    ];
    const seedBonus = (db.bonus&&db.bonus.length) ? db.bonus.slice(0,2) : [
      {id:'demo-b1', nome:'Setup de Plataforma', valor:1750, descricao:'Estrutura completa de anúncios configurada, testada e validada.',
       inclusos:['Configuração do Meta Business','Conta de anúncios','WhatsApp Business','Até 45 públicos estratégicos','Pixel de rastreamento']},
      {id:'demo-b2', nome:'Tracking Completo', valor:3500, descricao:'Estrutura pronta para mensuração de leads, vendas e resultados.',
       inclusos:['Google Tag Manager','Google Analytics 4','Meta Pixel + CAPI','Eventos de conversão','Integração site + Meta + Google']}
    ];
    p = {
      id:'DEMO01', cliente:'Cliente', empresa:'', template:'dark',
      objetivo:'Estruturar a aquisição digital da sua empresa com tráfego pago, página de conversão e rastreamento completo, para gerar demanda previsível e mensurável.',
      validadeDias:7, descontoPix:true, criadoEm:new Date().toISOString(),
      servicos:seedSvc, bonus:seedBonus,
      condicoes:[
        {titulo:'Cartão de crédito', texto:'Parcelamento conforme as condições comerciais desta proposta.'},
        {titulo:'Pagamento à vista via PIX', texto:'10% de desconto sobre o valor total da proposta.'}
      ],
      link:{expiraDias:7, senha:'', download:true, impressao:true, status:'Enviada', views:[]}
    };
  }

  // resolve refs de imagem guardadas no IndexedDB ("idb:<id>")
  const IMG = v => (window.StartImg ? window.StartImg.src(v) : v) || '';
  const PX = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  const IMGSRC = v => IMG(v) || PX;
  function applyImgs(){
    const o = p.owner || {};
    const hb = $('hero-bg');
    if(o.heroImg && hb){ const u = IMG(o.heroImg); if(u) hb.style.background = `url('${u}') center 12% / cover no-repeat`; }
    document.querySelectorAll('img[data-ref]').forEach(im => { const u = IMG(im.getAttribute('data-ref')); if(u) im.src = u; });
    // recalcula a altura dos quadros de portfólio depois das imagens resolverem
    document.querySelectorAll('#pfGrid .pf-item').forEach(it => it.style.setProperty('--pf-h', it.clientHeight + 'px'));
  }

  // foto da seção "Quem somos": usa a do autor da proposta, senão a foto da equipe
  const ap = $('about-photo');
  if(ap) ap.src = IMG((p.owner || {}).aboutImg) || 'assets/donos/start-equipe.png';

  document.documentElement.setAttribute('data-theme', p.template === 'start' ? 'start' : 'dark');
  document.title = `Proposta ${p.id} — ${p.cliente} · START INC.`;

  // hero personalizado pelo autor (dono) da proposta
  const owner = p.owner || {};
  if(owner.heroImg){
    const hb = $('hero-bg');
    const u = IMG(owner.heroImg);
    if(hb && u){ hb.style.background = `url('${u}') center 12% / cover no-repeat`; }
  }

  const criado = new Date(p.criadoEm);
  const expiraDias = p.link && p.link.expiraDias;
  const deadline = new Date(criado.getTime() + (Number(p.validadeDias)||7)*864e5);
  const linkExpirado = expiraDias ? (Date.now() > criado.getTime() + expiraDias*864e5) : false;

  const gate = $('gate'), page = $('page');
  function show(){ gate.style.display='none'; page.style.display='block'; registrar(); render();
    if(window.StartImg) window.StartImg.init().then(applyImgs).catch(()=>{});
  }

  if(linkExpirado && !isDemo){
    gate.style.display='flex';
    $('gateTitle').textContent = 'Link expirado';
    $('gateMsg').textContent = 'O acesso a esta proposta expirou. Fale com a START INC. para receber um novo link.';
    $('gateForm').style.display = 'none';
  } else if(p.link && p.link.senha && !isDemo){
    gate.style.display='flex';
    window.checkPwd = function(){
      if($('gatePwd').value === p.link.senha) show();
      else { $('gatePwd').value=''; $('gatePwd').placeholder='Senha incorreta'; }
    };
    $('gatePwd').addEventListener('keydown', e=>{ if(e.key==='Enter') window.checkPwd(); });
  } else { show(); }

  function registrar(){
    if(isDemo) return;
    const fresh = loadDb();
    const prop = (fresh.propostas||[]).find(x=>x.id===p.id);
    if(!prop) return;
    prop.link = prop.link||{}; prop.link.views = prop.link.views||[];
    const device = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    prop.link.views.push({ts:Date.now(), device});
    if(prop.link.status === 'Enviada') prop.link.status = 'Visualizada';
    saveDb(fresh);
  }

  function render(){
    const mensal = p.servicos.filter(s=>s.rec==='mensal').reduce((a,s)=>a+Number(s.preco||0),0);
    const unico = p.servicos.filter(s=>s.rec!=='mensal').reduce((a,s)=>a+Number(s.preco||0),0);
    const beneficios = (p.bonus||[]).reduce((a,b)=>a+Number(b.valor||0),0);

    $('tCodigo').textContent = '#' + p.id;
    $('tData').textContent = criado.toLocaleDateString('pt-BR');
    const validadeLabel = (p.validadeDias||7) + ' dias';
    $('tValidade').textContent = validadeLabel;
    $('validadeLabel').textContent = validadeLabel;
    $('hCliente').textContent = p.empresa || p.cliente;
    $('hIntro').textContent = `Olá${p.cliente?', '+p.cliente:''}! Preparamos esta proposta sob medida para o seu momento — role para ver escopo, bonificações e investimento.`;
    $('fAno').textContent = new Date().getFullYear();
    // assinatura do autor no hero
    const authorEl = $('hAuthor');
    if(authorEl){
      if(owner && owner.nome && owner.id !== 'start'){
        authorEl.style.display = 'flex';
        authorEl.innerHTML = `<span class="ha-label">Apresentado por</span><b>${esc(owner.nome)}</b>${owner.cargo?`<span class="ha-role">· ${esc(owner.cargo)}</span>`:''}`;
      } else authorEl.style.display = 'none';
    }

    // stats
    $('statsBar').innerHTML = ['+250 Clientes Atendidos','Clientes em mais de 5 países','+7 anos de mercado']
      .map(s=>`<span class="stat-pill"><span class="dot"></span>${s}</span>`).join('');

    // objetivo
    if(p.objetivo && p.objetivo.trim()) $('objTexto').textContent = p.objetivo;
    else $('objSec').style.display='none';

    // escopo
    $('svcList').innerHTML = p.servicos.map(s=>`
      <div class="svc">
        <div>
          <div class="svc-head">
            <h3>${esc(s.nome)}</h3>
          </div>
          <div class="resumo">${esc(s.resumo)}</div>
          <ul>${(s.inclusos||[]).map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
          <div class="prazo">Prazo: ${esc(s.prazo||'A combinar')}</div>
        </div>
        <div class="svc-price">
          <div class="svc-price-label">Investimento</div>
          <div class="svc-price-value">${s.parcelas ? esc(s.parcelas) : brl(s.preco)}${s.rec==='mensal' && !s.parcelas ? '<span class="per">/mês</span>' : ''}</div>
          ${s.precoMax ? `<div class="svc-price-note">até ${brl(s.precoMax)}</div>` : (s.rec==='consulta' ? '<div class="svc-price-note">valor sob consulta</div>' : '<div class="svc-price-note">'+(s.rec==='mensal'?'contrato recorrente':'pagamento único')+'</div>')}
        </div>
      </div>`).join('');

    // bônus
    if((p.bonus||[]).length){
      $('bonusGrid').innerHTML = p.bonus.map(b=>`
        <div class="bonus-card">
          <div class="bonus-price"><s>De ${brl(b.valor)}</s><b>Por R$ 0</b></div>
          <h3>${esc(b.nome)}</h3>
          <div class="desc">${esc(b.descricao)}</div>
          <ul>${(b.inclusos||[]).map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
        </div>`).join('');
      $('bonusTotal').textContent = brl(beneficios);
    } else $('bonusSec').style.display='none';

    // depoimentos — vindos da proposta (puxados pelo tema); fallback para o conjunto padrão
    // portfólio (prints de trabalhos)
    const pfs = (p.portfolio || []).filter(d => d && d.img);
    const pfSec = $('pfSec');
    if(!pfs.length){ if(pfSec) pfSec.style.display = 'none'; }
    else {
      if(pfSec) pfSec.style.display = '';
      $('pfGrid').innerHTML = pfs.map(d =>
        `<div class="pf-item${d.anim ? ' pf-scroll' : ''}"><img src="${IMGSRC(d.img)}" data-ref="${esc(d.img||'')}" alt="${esc(d.titulo||'Portfólio')}"></div>`).join('');
      // guarda a altura do quadro para a animação de rolagem parar no fim da imagem
      $('pfGrid').querySelectorAll('.pf-item').forEach(it => it.style.setProperty('--pf-h', it.clientHeight + 'px'));
    }

    const deps = (p.depoimentos && p.depoimentos.length)
      ? p.depoimentos.map(t => ({ img: t.img, nome: t.nome, hd: t.handle || t.hd || '' }))
      : DEPOIMENTOS;
    const depSec = $('depGrid') ? $('depGrid').closest('.section') : null;
    if(!deps.length){ if(depSec) depSec.style.display = 'none'; }
    else {
      $('depGrid').innerHTML = deps.map(t=>`
        <div class="dep-card">
          <div class="dep-shot"><img src="${IMGSRC(t.img)}" data-ref="${esc(t.img||'')}" alt="Depoimento ${esc(t.nome)}"></div>
          <div class="dep-who"><div><div class="nm">${esc(t.nome)}</div><div class="hd">${esc(t.hd)}</div></div></div>
        </div>`).join('');
    }

    // etapas
    $('stepsCol').innerHTML = ETAPAS.map((e,i)=>`
      <div class="step"><div class="et">Etapa ${String(i+1).padStart(2,'0')}</div><h3>${esc(e.titulo)}</h3><p>${esc(e.texto)}</p></div>`).join('');

    // info cards (condições + prazo do serviço mais longo)
    const infos = (p.condicoes||[]).map((c,i)=>({n:i+1, ...c}));
    $('infoCards').innerHTML = infos.map((c,i)=>`
      <div class="info-card"><div class="info-num">${String(i+1).padStart(2,'0')}</div><h4>${esc(c.titulo)}</h4><p>${esc(c.texto)}</p></div>`).join('');

    // investimento — tabela
    let rows='';
    const unicos = p.servicos.filter(s=>s.rec!=='mensal');
    const mensais = p.servicos.filter(s=>s.rec==='mensal');
    if(unicos.length){
      rows += `<tr class="grp"><td colspan="2">Investimento único</td></tr>`;
      rows += unicos.map(s=>`<tr><td>${esc(s.nome)}</td><td>${brl(s.preco)}</td></tr>`).join('');
    }
    if(mensais.length){
      rows += `<tr class="grp"><td colspan="2">Investimento mensal${Number(p.contratoMeses) ? ' · contrato de ' + p.contratoMeses + ' meses' : ''}</td></tr>`;
      rows += mensais.map(s=>`<tr><td>${esc(s.nome)}</td><td>${s.parcelas?esc(s.parcelas):brl(s.preco)+'/mês'}</td></tr>`).join('');
    }
    if((p.bonus||[]).length){
      rows += `<tr class="grp"><td colspan="2">Bonificações inclusas</td></tr>`;
      rows += p.bonus.map(b=>`<tr class="bonus-row"><td>${esc(b.nome)}</td><td><s>${brl(b.valor)}</s><b>R$ 0</b></td></tr>`).join('');
    }
    $('svcRows').innerHTML = rows;

    // preço grande — total à vista do contrato, com opção de parcelamento
    const meses = Number(p.contratoMeses) || 0;
    const totalAvista = unico + mensal * (meses || 1);
    const forma = p.pagamento || 'pix';
    const pc = (function(total, forma){
      const cartao = forma !== 'pix' && forma !== 'boleto';
      const n = (forma === 'avista' || !cartao) ? 1 : (Number(forma) || 1);
      const taxa = cartao ? ((n <= 3 ? 0.0299 : 0.0399) + 0.0249) : 0;
      return { n: n, cartao: cartao, valor: Math.ceil(((total / n) * (1 + taxa) + (cartao ? 0.49 : 0)) * 100) / 100 };
    })(totalAvista, forma);
    const cheio = totalAvista + beneficios;
    const money2 = v => 'R$ ' + Number(v).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
    if(totalAvista > 0){
      $('priceDe').innerHTML = beneficios ? `De <s>${brl(cheio)}</s> por` : '';
      if(pc.n > 1){
        $('priceBig').innerHTML = pc.n + 'x <small>de</small> ' + money2(pc.valor);
        $('priceSub').innerHTML = `TOTAL: <b>${brl(totalAvista)}</b> à vista` + (meses ? ` · contrato de ${meses} meses` : (mensal ? ' · equivale a 1 mês de gestão' : ''));
      } else {
        $('priceBig').innerHTML = brl(totalAvista) + '<small> à vista</small>';
        $('priceSub').innerHTML = (mensal ? `${brl(mensal)}/mês` + (meses ? ` × ${meses} meses` : ' (equivale a 1 mês de gestão)') : '') + (unico && mensal ? ' + setup' : '');
      }
      $('pricePix').textContent = p.descontoPix && forma === 'pix'
        ? `ou ${brl(Math.round(totalAvista*0.9))} no PIX à vista (10% de desconto)`
        : (pc.cartao && pc.n === 1 ? `no cartão à vista: ${money2(pc.valor)}` : '');
    } else {
      $('priceDe').innerHTML = '';
      $('priceBig').textContent = 'Sob consulta';
      $('priceSub').textContent = '';
      $('pricePix').textContent = '';
    }

    // countdown
    const cd = $('countdown');
    (function tick(){
      const ms = deadline - Date.now();
      if(ms<=0){ cd.textContent = 'Proposta expirada — fale conosco para renovar as condições.'; return; }
      const d=Math.floor(ms/864e5), h=Math.floor(ms%864e5/36e5);
      cd.innerHTML = `Expira em <b>${d}d ${h}h</b>`;
      setTimeout(tick, 60e3);
    })();

    window.__proposta = p;
    window.__pdfAllowed = !(p.link && p.link.download === false);
    // impressão bloqueada (simulado)
    if(p.link && p.link.impressao === false){
      window.addEventListener('beforeprint', ()=>{ document.body.style.visibility='hidden'; });
      window.addEventListener('afterprint', ()=>{ document.body.style.visibility=''; });
    }
  }
})();

/* Botão "Baixar PDF" + impressão */
(function(){
  function initPdf(allowed){
    if(allowed === false) return;
    var st = document.createElement('style');
    st.textContent = '.pdf-fab{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;align-items:center;gap:8px;padding:12px 20px;border:0;border-radius:999px;background:#111;color:#fff;font:600 14px/1 system-ui,-apple-system,sans-serif;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.28)}.pdf-fab:hover{transform:translateY(-1px)}@media print{.pdf-fab{display:none!important}}';
    document.head.appendChild(st);
    var b = document.createElement('button');
    b.className = 'pdf-fab';
    b.innerHTML = '\u2193 Baixar PDF';
    function doPrint(){
      var imgs = Array.prototype.slice.call(document.images).filter(function(i){ return !i.complete; });
      Promise.all(imgs.map(function(i){ return new Promise(function(r){ i.onload = i.onerror = r; }); }).concat([document.fonts && document.fonts.ready]))
        .then(function(){ setTimeout(function(){ window.print(); }, 250); });
    }
    b.onclick = function(){
      var pr = window.__proposta || {};
      var nome = 'Proposta START' + (pr.cliente ? ' - ' + String(pr.cliente).replace(/[^\w\s-]/g,'') : '');
      if(window.StartPDF) window.StartPDF.download(nome); else doPrint();
    };
    window.__doPrint = doPrint;
    document.body.appendChild(b);
    if(new URLSearchParams(location.search).get('print') === '1'){
      setTimeout(function(){ if(window.StartPDF) window.StartPDF.download('Proposta START'); else doPrint(); }, 600);
    }
  }
  window.__initPdfButton = initPdf;
  document.addEventListener('DOMContentLoaded', function(){
    const arrancar = () => setTimeout(function(){ if(!document.querySelector('.pdf-fab')) initPdf(window.__pdfAllowed); }, 600);
    if(window.StartImg) window.StartImg.init().then(arrancar).catch(arrancar); else arrancar();
  });
})();
