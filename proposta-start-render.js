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
    {nome:'Cliente Start', hd:'Tráfego Pago'},
    {nome:'Cliente Start', hd:'Landing Page'},
    {nome:'Cliente Start', hd:'Setup completo'},
    {nome:'Cliente Start', hd:'Site institucional'}
  ];

  function loadDb(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } }
  function saveDb(db){ localStorage.setItem(KEY, JSON.stringify(db)); }

  const params = new URLSearchParams(location.search);
  const pid = params.get('id');
  const db = loadDb();
  let p = (db.propostas||[]).find(x=>x.id===pid);
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

  document.documentElement.setAttribute('data-theme', p.template === 'start' ? 'start' : 'dark');
  document.title = `Proposta ${p.id} — ${p.cliente} · START INC.`;

  const criado = new Date(p.criadoEm);
  const expiraDias = p.link && p.link.expiraDias;
  const deadline = new Date(criado.getTime() + (Number(p.validadeDias)||7)*864e5);
  const linkExpirado = expiraDias ? (Date.now() > criado.getTime() + expiraDias*864e5) : false;

  const gate = $('gate'), page = $('page');
  function show(){ gate.style.display='none'; page.style.display='block'; registrar(); render(); }

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

    // stats
    $('statsBar').innerHTML = ['+250 Clientes Atendidos','Clientes em mais de 5 países','+4 anos de mercado']
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

    // depoimentos (slots de print reutilizáveis)
    $('depGrid').innerHTML = DEPOIMENTOS.map((t,i)=>`
      <div class="dep-card">
        <div class="dep-shot"><image-slot id="dep-shot-${i+1}" shape="rect" placeholder="Print do depoimento"></image-slot></div>
        <div class="dep-who"><div><div class="nm">${esc(t.nome)}</div><div class="hd">${esc(t.hd)}</div></div></div>
      </div>`).join('');

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
      rows += `<tr class="grp"><td colspan="2">Investimento mensal</td></tr>`;
      rows += mensais.map(s=>`<tr><td>${esc(s.nome)}</td><td>${s.parcelas?esc(s.parcelas):brl(s.preco)+'/mês'}</td></tr>`).join('');
    }
    if((p.bonus||[]).length){
      rows += `<tr class="grp"><td colspan="2">Bonificações inclusas</td></tr>`;
      rows += p.bonus.map(b=>`<tr class="bonus-row"><td>${esc(b.nome)}</td><td><s>${brl(b.valor)}</s><b>R$ 0</b></td></tr>`).join('');
    }
    $('svcRows').innerHTML = rows;

    // preço grande
    const cheio = unico + beneficios;
    if(unico){
      $('priceDe').innerHTML = beneficios ? `De <s>${brl(cheio)}</s> por` : '';
      $('priceBig').innerHTML = brl(unico).replace('R$ ','R$ ') + '<small></small>';
      $('priceSub').textContent = mensal ? `+ ${brl(mensal)}/mês de gestão` : '';
      $('pricePix').textContent = p.descontoPix ? `ou ${brl(Math.round(unico*0.9))} no PIX à vista (10% de desconto)` : '';
    } else if(mensal){
      $('priceDe').innerHTML = '';
      $('priceBig').innerHTML = brl(mensal) + '<small>/mês</small>';
      $('priceSub').textContent = beneficios ? `+ ${brl(beneficios)} em benefícios inclusos` : '';
      $('pricePix').textContent = '';
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

    // impressão bloqueada (simulado)
    if(p.link && p.link.impressao === false){
      window.addEventListener('beforeprint', ()=>{ document.body.style.visibility='hidden'; });
      window.addEventListener('afterprint', ()=>{ document.body.style.visibility=''; });
    }
  }
})();
