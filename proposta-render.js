/* Renderiza a Proposta a partir dos dados do gerador (hash #d= / localStorage) */
// resolve refs de imagem guardadas no IndexedDB ("idb:<id>")
const IMG = v => (window.StartImg ? window.StartImg.src(v) : v) || '';
// pixel transparente enquanto a ref do IndexedDB não resolve (evita <img src="">)
const PX = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const IMGSRC = v => IMG(v) || PX;
function __applyImgRefs(){
  document.querySelectorAll('img[data-ref]').forEach(im => { const u = IMG(im.getAttribute('data-ref')); if(u) im.src = u; });
  document.querySelectorAll('[data-hero-ref]').forEach(el => { const u = IMG(el.getAttribute('data-hero-ref')); if(u) el.style.background = `url('${u}') center 12% / cover no-repeat`; });
  const ap = document.getElementById('about-photo');
  if(ap && !ap.getAttribute('src')) ap.src = 'assets/donos/start-equipe.png';
}
if(window.StartImg) window.StartImg.init().then(__applyImgRefs).catch(()=>{});
(function(){
  const DEFAULTS = {
    cliente: 'Cliente',
    dataEnvio: new Date().toISOString().slice(0,10),
    validadeDias: 7, validadeHoras: 0,
    portfolioLink: '#', portfolioLinkLabel: 'meu portfólio',
    stats: ['+250 Clientes Atendidos','Clientes em mais de 5 Países','+4 Anos de Experiência'],
    depoimentos: [
      {nome:'Nome do Cliente', handle:'@cliente', texto:'"Tá linda demais essa página!"'},
      {nome:'Nome do Cliente', handle:'@cliente', texto:'"Ficou muito top, achei iradíssimo!"'},
      {nome:'Nome do Cliente', handle:'@cliente', texto:'"Excelente trabalho, obrigado pela dedicação!"'}
    ],
    sobreMim: 'Meu nome é Washington Melo, mais conhecido como Tom, e trabalho como designer há mais de 4 anos, especialista em design para lançamentos. Já participei de +70 lançamentos e +250 clientes atendidos em mais de 5 países diferentes.',
    badge: ['<b>60</b> Lançamentos','<b>250</b> clientes atendidos em mais de <b>5 países</b>','<b>4 anos</b> de experiência'],
    players: [],
    etapas: [
      {titulo:'Aplicação do Briefing', texto:'O primeiro passo é entender exatamente o que você quer e coletar as informações necessárias, como copy, arquivos de imagem, identidade visual e referências.'},
      {titulo:'Pesquisa', texto:'Realizo uma análise do nicho para compreender profundamente as estratégias dos concorrentes, identificando as melhores práticas e referências do setor. Esse processo me permite absorver ideias inovadoras e eficazes para embasar e elevar a qualidade do seu projeto.'},
      {titulo:'Criação do Design', texto:'A partir disso, inicia-se o desenvolvimento da parte visual, garantindo que o resultado final seja não apenas atrativo, mas também altamente competitivo e alinhado com as tendências de mercado.'},
      {titulo:'Implementação', texto:'Após a completa aprovação do design pelo cliente, procedo com a implementação da página, assegurando o pleno funcionamento em todos os dispositivos e plataformas, garantindo uma experiência de usuário fluida e acessível.'},
      {titulo:'Otimização da Página', texto:'Durante esta fase, dedico-me à otimização integral da página, assegurando um carregamento rápido e eficiente. Essa etapa é crucial para o desempenho ágil para o sucesso online.'}
    ],
    infos: [
      {titulo:'Prazo de Entrega', texto:'O prazo de entrega de uma página é de no máximo 4 dias, podendo ser entregue antes dependendo do fluxo de demandas e da necessidade do cliente.'},
      {titulo:'Formas de Pagamento', texto:'A partir do pagamento de 50% do valor começamos o projeto e depois que o serviço for entregue as outras 50%.'},
      {titulo:'Meios de Pagamento', texto:'Você pode pagar através de boleto, pix ou transferência bancária. E se preferir você pode parcelar em até 12x no cartão de crédito (essa forma pode conter juros).'}
    ],
    servicos: [
      {nome:'Design da página', preco:1500},
      {nome:'Implementação e responsividade', preco:900},
      {nome:'Otimização de performance', preco:400}
    ],
    precoPor: 2500,
    ctaLink:'#', duvidaLink:'#',
    empresa:'SUA EMPRESA LTDA', cnpj:'CNPJ: 00.000.000/0000-00',
    marca:'@seuuser', criador:'@seuuser'
  };

  function readData(){
    // 1) proposta vinda da plataforma (?id=) — traz hero do dono + depoimentos do tema
    try{
      const params = new URLSearchParams(location.search);
      const pid = params.get('id');
      if(pid){
        const db = JSON.parse(localStorage.getItem('start-plataforma-v1')||'{}');
        const p = (db.propostas||[]).find(x=>x.id===pid);
        if(p) return fromPlataforma(p);
      }
    }catch(e){ console.warn('id plataforma inválido', e); }
    // 1b) proposta da plataforma embutida no link (#p=)
    try{
      const m = location.hash.match(/[#&]p=([^&]+)/);
      if(m) return fromPlataforma(JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g,'+').replace(/_/g,'/'))))));
    }catch(e){ console.warn('link embutido inválido', e); }
    // 2) gerador standalone (hash #d=)
    try{
      const m = location.hash.match(/d=([^&]+)/);
      if(m) return JSON.parse(decodeURIComponent(escape(atob(m[1]))));
    }catch(e){ console.warn('hash inválido', e); }
    try{
      const s = localStorage.getItem('proposta-data');
      if(s) return JSON.parse(s);
    }catch(e){}
    return {};
  }

  // mapeia a proposta da plataforma para os campos deste template
  function fromPlataforma(p){
    const unico = (p.servicos||[]).filter(s=>s.rec!=='mensal').reduce((a,s)=>a+Number(s.preco||0),0);
    const mensal = (p.servicos||[]).filter(s=>s.rec==='mensal').reduce((a,s)=>a+Number(s.preco||0),0);
    const criado = new Date(p.criadoEm||Date.now());
    const owner = p.owner || {};
    return {
      __plataforma: true,
      __owner: owner,
      cliente: p.empresa || p.cliente || 'Cliente',
      objetivo: p.objetivo || '',
      dataEnvio: criado.toISOString().slice(0,10),
      validadeDias: p.validadeDias || 7, validadeHoras: 0,
      servicos: (p.servicos||[]).map(s=>({nome:s.nome, preco:s.preco})),
      precoPor: unico + mensal * (Number(p.contratoMeses) || 1),
      contratoMeses: Number(p.contratoMeses) || 0, pagamento: p.pagamento || 'pix',
      depoimentos: (p.depoimentos||[]).map(t=>({nome:t.nome, handle:t.handle||'', texto:'', img:t.img})),
      portfolio: (p.portfolio||[]).map(x=>({img:x.img, titulo:x.titulo||'', anim:!!x.anim})),
      infos: (p.condicoes||[]).map(c=>({titulo:c.titulo, texto:c.texto})),
      empresa: owner.nome || 'START INC.', cnpj: '', marca: owner.cargo || 'Growth · Marketing · IA', criador: '@startinc',
      // etapas do processo por tema (fallback = LP). Propostas antigas sem etapas caem no default LP do template.
      etapas: (p.etapas && p.etapas.length) ? p.etapas : DEFAULTS.etapas,
      // dados do autor para "Quem somos"
      __autorClientes: owner.clientes, __autorPaises: owner.paises, __autorAnos: owner.anos, __autorExpertise: owner.expertise
    };
  }
  const d = Object.assign({}, DEFAULTS, readData());

  const brl = v => Number(v||0).toLocaleString('pt-BR');
  const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // datas / validade
  const envio = new Date(d.dataEnvio + 'T00:00:00');
  const dias = Number(d.validadeDias)||0, horas = Number(d.validadeHoras)||0;
  const validadeLabel = [dias?`${dias} dia${dias>1?'s':''}`:'', horas?`${horas} hora${horas>1?'s':''}`:''].filter(Boolean).join(' e ') || '7 dias';
  const deadline = new Date(envio.getTime() + (dias*24+horas)*3600e3);

  // campos simples
  const F = {
    cliente: esc(d.cliente),
    dataEnvio: envio.toLocaleDateString('pt-BR'),
    validadeLabel: validadeLabel, validadeLabel2: validadeLabel,
    portfolioLinkLabel: esc(d.portfolioLinkLabel),
    sobreMim: esc(d.sobreMim),
    precoDe: brl(d.servicos.reduce((a,s)=>a+Number(s.preco||0),0)),
    precoPor: brl(d.precoPor),
    empresa: esc(d.empresa), cnpj: esc(d.cnpj), marca: esc(d.marca), criador: esc(d.criador),
    ano: String(new Date().getFullYear())
  };
  document.querySelectorAll('[data-f]').forEach(el=>{ const k=el.getAttribute('data-f'); if(F[k]!=null) el.innerHTML=F[k]; });
  document.querySelectorAll('[data-f-href]').forEach(el=>{ const k=el.getAttribute('data-f-href'); if(d[k]) el.href=d[k]; });

  // stats
  document.getElementById('statsBar').innerHTML = (d.stats||[]).filter(s=>s&&s.trim()).map(s=>
    `<span class="stat-pill"><span class="dot">●</span>${esc(s)}</span>`).join('');

  // portfolio: usa prints embutidos da plataforma; senão, 8 slots vazios para preencher
  const pf = (d.portfolio || []).filter(p => p && p.img);
  if(pf.length){
    document.getElementById('pfGrid').innerHTML = pf.map(p=>
      `<div class="pf-item${p.anim ? ' pf-scroll' : ''}"><img src="${IMGSRC(p.img)}" data-ref="${esc(p.img||'')}" alt="${esc(p.titulo||'Portfólio')}"></div>`).join('');
    // a rolagem precisa saber a altura visível do bloco
    requestAnimationFrame(()=>{
      document.querySelectorAll('#pfGrid .pf-item').forEach(el=>{
        el.style.setProperty('--pf-h', el.clientHeight + 'px');
      });
    });
  } else {
    document.getElementById('pfGrid').innerHTML = Array.from({length:8},(_,i)=>
      `<div class="pf-item"><image-slot id="pf-${i+1}" shape="rect" placeholder="Print ${i+1} do portfólio"></image-slot></div>`).join('');
  }

  // depoimentos
  document.getElementById('depGrid').innerHTML = (d.depoimentos||[]).map((t,i)=>{
    const shot = t.img
      ? `<img src="${IMGSRC(t.img)}" data-ref="${esc(t.img||'')}" alt="${esc(t.nome)}" style="width:100%;height:auto;display:block;object-fit:contain">`
      : `<image-slot id="dep-shot-${i+1}" shape="rect" placeholder="Print do depoimento"></image-slot>`;
    return `
    <div class="dep-card">
      <div class="dep-shot">${shot}</div>
      ${t.texto?`<div class="dep-text">${esc(t.texto)}</div>`:''}
      <div class="dep-who">
        <div class="av"><image-slot id="dep-av-${i+1}" shape="circle" placeholder=""></image-slot></div>
        <div><div class="nm">${esc(t.nome)}</div><div class="hd">${esc(t.handle)}</div></div>
      </div>
    </div>`;
  }).join('');

  // badge sobre mim (permite <b>)
  document.getElementById('aboutBadge').innerHTML = (d.badge||[]).map(l=>`<div>${l}</div>`).join('');

  // players
  const players = (d.players||[]).filter(p=>p&&p.trim());
  if(players.length) document.getElementById('playerChips').innerHTML = players.map(p=>`<span class="chip">${esc(p)}</span>`).join('');
  else document.getElementById('playersBlock').style.display='none';

  // etapas
  document.getElementById('stepsCol').innerHTML = (d.etapas||[]).map((e,i)=>`
    <div class="step">
      <div class="et">Etapa ${String(i+1).padStart(2,'0')}</div>
      <h3>${esc(e.titulo)}</h3>
      <p>${esc(e.texto)}</p>
    </div>`).join('');

  // info cards
  document.getElementById('infoCards').innerHTML = (d.infos||[]).map((c,i)=>`
    <div class="info-card">
      <div class="info-num">${String(i+1).padStart(2,'0')}</div>
      <h4>${esc(c.titulo)}</h4>
      <p>${esc(c.texto)}</p>
    </div>`).join('');

  // serviços
  const total = d.servicos.reduce((a,s)=>a+Number(s.preco||0),0);
  document.getElementById('svcRows').innerHTML =
    d.servicos.map(s=>`<tr><td>${esc(s.nome)}</td><td>R$ ${brl(s.preco)}</td></tr>`).join('') +
    `<tr class="total"><td>Valor individual somado</td><td>R$ ${brl(total)}</td></tr>`;

  // countdown
  const cd = document.getElementById('countdown');

  // ---- customizações vindas da plataforma: hero do dono + assinatura do autor ----
  if(d.__plataforma){
    const owner = d.__owner || {};
    const heroImg = IMG(owner.heroImg) || (String(owner.heroImg||'').startsWith('idb:') ? '' : 'assets/hero-bg.png');
    const hb = document.getElementById('hero-bg');
    if(hb) hb.outerHTML = `<div data-hero-ref="${esc(owner.heroImg||'')}" style="width:100%;height:100%;${heroImg ? `background:url('${heroImg}') center 12% / cover no-repeat` : 'background:#01050c'}"></div>`;
    const ap = document.getElementById('about-photo');
    if(ap) ap.src = IMG(owner.aboutImg) || 'assets/donos/start-equipe.png';
    if(owner.nome && owner.id && owner.id !== 'start'){
      const p = document.querySelector('.hero-copy p');
      if(p){
        const a = document.createElement('div');
        a.className = 'hero-author';
        a.innerHTML = `<span class="ha-label">Apresentado por</span><b>${esc(owner.nome)}</b>${owner.cargo?`<span class="ha-role">· ${esc(owner.cargo)}</span>`:''}`;
        p.insertAdjacentElement('afterend', a);
      }
    }
    if(d.objetivo){ const p = document.querySelector('.hero-copy p'); if(p) p.textContent = d.objetivo; }
    // renderiza a seção "Quem somos" com dados do autor
    if(d.__autorClientes){
      const container = document.getElementById('statsAutor');
      if(container){
        container.innerHTML = `
          <div style="padding:20px;border-radius:10px;background:var(--bg-subtle);text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--txt-hot)">+${d.__autorClientes}</div>
            <div style="font-size:13px;color:var(--txt-mute);margin-top:6px">clientes atendidos</div>
          </div>
          <div style="padding:20px;border-radius:10px;background:var(--bg-subtle);text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--txt-hot)">${d.__autorAnos}</div>
            <div style="font-size:13px;color:var(--txt-mute);margin-top:6px">anos de experiência</div>
          </div>
          <div style="padding:20px;border-radius:10px;background:var(--bg-subtle);text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--txt-hot)">+${d.__autorPaises}</div>
            <div style="font-size:13px;color:var(--txt-mute);margin-top:6px">países atendidos</div>
          </div>
        `;
        if(d.__autorExpertise && d.__autorExpertise.length){
          const expertise = document.createElement('div');
          expertise.style.cssText = 'margin:24px 0;text-align:center';
          expertise.innerHTML = `
            <span style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-mute);display:block;margin-bottom:12px">Especialidades</span>
            <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
              ${d.__autorExpertise.map(e=>`<span style="padding:8px 16px;border-radius:999px;background:var(--color-primary-tint);color:var(--txt-hot);font-size:13px;font-weight:600">${esc(e)}</span>`).join('')}
            </div>
          `;
          container.parentElement.insertAdjacentElement('afterend', expertise);
        }
      }
    }
  }
  function tick(){
    const ms = deadline - Date.now();
    if(ms <= 0){ cd.innerHTML = 'Oferta expirada — fale comigo para renovar.'; return; }
    const dd = Math.floor(ms/864e5), hh = Math.floor(ms%864e5/36e5), mm = Math.floor(ms%36e5/6e4);
    cd.innerHTML = `Expira em <b>${dd}d ${hh}h ${mm}min</b>`;
    setTimeout(tick, 30e3);
  }
  tick();
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
    // espera o banco de imagens para o PDF nunca sair sem os prints
    if(window.StartImg) window.StartImg.init().then(arrancar).catch(arrancar); else arrancar();
  });
})();
