/* Renderiza a Proposta a partir dos dados do gerador (hash #d= / localStorage) */
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

  // portfolio: 8 slots
  document.getElementById('pfGrid').innerHTML = Array.from({length:8},(_,i)=>
    `<div class="pf-item"><image-slot id="pf-${i+1}" shape="rect" placeholder="Print ${i+1} do portfólio"></image-slot></div>`).join('');

  // depoimentos
  document.getElementById('depGrid').innerHTML = (d.depoimentos||[]).map((t,i)=>`
    <div class="dep-card">
      <div class="dep-shot"><image-slot id="dep-shot-${i+1}" shape="rect" placeholder="Print do depoimento"></image-slot></div>
      <div class="dep-text">${esc(t.texto)}</div>
      <div class="dep-who">
        <div class="av"><image-slot id="dep-av-${i+1}" shape="circle" placeholder=""></image-slot></div>
        <div><div class="nm">${esc(t.nome)}</div><div class="hd">${esc(t.handle)}</div></div>
      </div>
    </div>`).join('');

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
  function tick(){
    const ms = deadline - Date.now();
    if(ms <= 0){ cd.innerHTML = 'Oferta expirada — fale comigo para renovar.'; return; }
    const dd = Math.floor(ms/864e5), hh = Math.floor(ms%864e5/36e5), mm = Math.floor(ms%36e5/6e4);
    cd.innerHTML = `Expira em <b>${dd}d ${hh}h ${mm}min</b>`;
    setTimeout(tick, 30e3);
  }
  tick();
})();
