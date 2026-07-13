/* Base de dados da plataforma — seeds + persistência em localStorage */
(function(){
  const KEY = 'start-plataforma-v1';

  const SERVICOS = [
    {id:'trafego-starter', nome:'Gestão de Tráfego Pago STARTER', categoria:'Tráfego', preco:2950, rec:'mensal', prazo:'Contrato mensal',
     resumo:'Gestão profissional de Meta Ads e Google Ads para gerar demanda previsível.',
     inclusos:['Planejamento estratégico das campanhas','Gestão de campanhas Meta Ads e Google Ads','Campanhas de prospecção, relacionamento e remarketing','Monitoramento diário de desempenho','Otimizações contínuas','Relatórios periódicos','Reuniões estratégicas de acompanhamento']},
    {id:'trafego-standard', nome:'Gestão de Tráfego Pago STANDARD', categoria:'Tráfego', preco:3500, rec:'mensal', prazo:'Contrato mensal',
     resumo:'Tudo do STARTER com segmentação avançada, testes A/B e otimização de funis.',
     inclusos:['Tudo do plano STARTER','Estratégias avançadas de segmentação','Estrutura de campanhas para múltiplos objetivos','Testes A/B de criativos e públicos','Otimização de funis de conversão','Acompanhamento estratégico mensal']},
    {id:'trafego-apolo', nome:'Gestão de Tráfego Pago APOLO', categoria:'Tráfego', preco:4500, rec:'mensal', prazo:'Contrato mensal',
     resumo:'Plano completo com estratégias de escala, dashboards personalizados e suporte prioritário.',
     inclusos:['Tudo do plano STANDARD','Planejamento estratégico completo','Gestão avançada de Meta Ads e Google Ads','Estratégias de escala','Dashboards personalizados','Reuniões consultivas','Suporte estratégico prioritário']},
    {id:'landing-page', nome:'Landing Page', categoria:'Web', preco:2000, rec:'unico', prazo:'Até 10 dias',
     resumo:'Página de alta conversão com copy estratégica e rastreamento configurado.',
     inclusos:['Copy estratégica','Design personalizado','Desenvolvimento da página','Layout responsivo','Integração com WhatsApp','Integração com formulários','Configuração do Meta Pixel','Configuração do Google Analytics','Publicação da página']},
    {id:'site-institucional', nome:'Site Institucional', categoria:'Web', preco:3500, precoMax:7000, rec:'unico', prazo:'20 a 40 dias',
     resumo:'Site completo com layout exclusivo, otimizado para dispositivos móveis e SEO.',
     inclusos:['Desenvolvimento completo do site','Layout exclusivo','Páginas institucionais','Formulário de contato','Integração com WhatsApp','Otimização para dispositivos móveis','Configuração básica de SEO','Configuração do Google Analytics','Publicação do projeto']},
    {id:'ecommerce', nome:'E-commerce Completo', categoria:'Web', preco:20000, rec:'unico', prazo:'45 a 60 dias',
     resumo:'Loja virtual completa, do layout ao painel administrativo, pronta para vender.',
     inclusos:['Desenvolvimento completo da loja virtual','Layout personalizado','Cadastro da estrutura inicial','Configuração de categorias e produtos','Configuração de meios de pagamento','Configuração de frete','Integração com plataformas de pagamento','Configuração do Meta Pixel','Configuração do Google Analytics','Painel administrativo','Publicação da loja']},
    {id:'sistema-proprio', nome:'Sistema Próprio', categoria:'Tecnologia', preco:35000, rec:'unico', prazo:'Sob cronograma',
     resumo:'Sistema exclusivo com CRM personalizado, dashboard gerencial e integrações.',
     inclusos:['Desenvolvimento exclusivo para a empresa','CRM personalizado','Área administrativa','Gestão de clientes','Gestão de leads','Página de captura integrada','Dashboard gerencial','Integrações personalizadas','Banco de dados dedicado','Implantação do sistema']},
    {id:'setup-redes', nome:'Setup de Redes Sociais', categoria:'Setup', preco:1750, rec:'unico', prazo:'Até 7 dias',
     resumo:'Perfis organizados, integrados e com identidade visual padronizada.',
     inclusos:['Organização do perfil do Instagram','Otimização da bio','Configuração da foto de perfil','Organização dos destaques','Criação de 3 posts institucionais','Configuração da página do Facebook','Configuração da capa do Facebook','Integração entre Instagram, Facebook e WhatsApp','Configuração dos canais de contato']},
    {id:'setup-plataforma', nome:'Setup de Plataforma', categoria:'Setup', preco:1750, rec:'unico', prazo:'Até 7 dias',
     resumo:'Estrutura completa de anúncios configurada, testada e validada.',
     inclusos:['Configuração do Meta Business','Configuração da Conta de Anúncios','Configuração da Página do Facebook','Vinculação do Instagram','Configuração do WhatsApp Business','Criação de até 45 públicos estratégicos','Configuração do método de pagamento','Configuração do domínio','Configuração do Meta Pixel','Configuração da Meta Conversions API','Configuração das integrações necessárias','Testes e validação da estrutura']},
    {id:'tracking', nome:'Tracking Completo', categoria:'Setup', preco:3500, rec:'unico', prazo:'Até 15 dias',
     resumo:'Rastreamento completo de leads, vendas e resultados entre site, Meta e Google.',
     inclusos:['Configuração do Google Tag Manager','Configuração do Google Analytics 4','Configuração do Meta Pixel','Configuração da Meta Conversions API','Configuração do Google Search Console','Configuração dos principais eventos de conversão','Configuração das conversões do Meta Ads e Google Ads','Configuração de parâmetros UTM','Integração entre site, Meta e Google','Testes e validação do rastreamento']},
    {id:'setup-gmn', nome:'Setup Google Meu Negócio', categoria:'Setup', preco:1000, rec:'unico', prazo:'Até 5 dias',
     resumo:'Empresa publicada e otimizada para pesquisas locais no Google.',
     inclusos:['Criação ou configuração do perfil','Cadastro completo da empresa','Configuração de categorias','Configuração de produtos e serviços','Configuração das informações de contato','Cadastro de imagens','Otimização para SEO Local','Configuração do mapa','Publicação da empresa']},
    {id:'gestao-gmn', nome:'Gestão Google Meu Negócio', categoria:'Gestão', preco:350, rec:'mensal', prazo:'5 meses', parcelas:'5x de R$ 350',
     resumo:'Gestão contínua do perfil com publicações, avaliações e SEO Local.',
     inclusos:['Até 5 publicações mensais','Atualização das informações da empresa','Gestão das avaliações','Resposta às perguntas dos usuários','Atualização de fotos','Otimização contínua para SEO Local','Relatório de desempenho']},
    {id:'conteudo', nome:'Criação de Conteúdo', categoria:'Conteúdo', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Planejamento editorial e produção de conteúdo com direcionamento criativo.',
     inclusos:['Planejamento editorial','Desenvolvimento de pautas','Produção de copies','Direcionamento criativo','Calendário de publicações','Organização dos conteúdos']},
    {id:'social-media', nome:'Social Media', categoria:'Conteúdo', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Gestão das redes sociais com calendário editorial e monitoramento.',
     inclusos:['Gestão das redes sociais','Agendamento de publicações','Acompanhamento do calendário editorial','Monitoramento básico de desempenho','Suporte estratégico de conteúdo']},
    {id:'branding', nome:'Branding', categoria:'Marca', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Posicionamento estratégico, identidade verbal e diretrizes de marca.',
     inclusos:['Diagnóstico de marca','Posicionamento estratégico','Definição de proposta de valor','Arquétipos da marca','Identidade verbal','Diretrizes estratégicas']},
    {id:'identidade-visual', nome:'Identidade Visual', categoria:'Marca', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Criação de marca completa: logotipo, cores, tipografia e manual.',
     inclusos:['Criação da marca','Logotipo','Paleta de cores','Tipografia','Elementos gráficos','Manual básico de identidade visual']},
    {id:'ia', nome:'Inteligência Artificial', categoria:'Tecnologia', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Implantação de soluções com IA e automação de tarefas nos processos.',
     inclusos:['Diagnóstico dos processos','Implantação de soluções com IA','Automação de tarefas','Fluxos inteligentes','Integração com sistemas','Treinamento da equipe']},
    {id:'automacoes', nome:'Automações', categoria:'Tecnologia', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Fluxos automatizados integrando as plataformas da operação.',
     inclusos:['Mapeamento de processos','Desenvolvimento de automações','Integração entre plataformas','Fluxos automatizados','Testes e implantação','Documentação básica']},
    {id:'crm', nome:'CRM', categoria:'Tecnologia', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Implantação de CRM com funil comercial organizado e equipe treinada.',
     inclusos:['Implantação do CRM','Configuração do funil comercial','Cadastro de usuários','Organização das etapas de venda','Integrações necessárias','Treinamento inicial']}
  ];

  const BONUS = [
    {id:'b-setup-redes', nome:'Setup de Redes Sociais', valor:1250, descricao:'Perfis organizados, otimizados e integrados, com identidade visual padronizada.',
     inclusos:['Organização inicial do perfil do Instagram','Otimização da bio e informações de contato','Configuração da página do Facebook','Padronização da identidade visual dos perfis','Criação de 3 posts institucionais para o feed','Configuração dos principais canais de contato']},
    {id:'b-setup-plataforma', nome:'Setup de Plataforma', valor:1750, descricao:'Estrutura completa de anúncios configurada, testada e validada.',
     inclusos:['Configuração da estrutura completa de anúncios','Configuração da conta de anúncios','Configuração da página do Facebook','Vinculação do perfil do Instagram','Configuração do WhatsApp Business','Criação de até 45 públicos estratégicos','Configuração do Pixel de rastreamento','Testes e validação de toda a estrutura']},
    {id:'b-landing', nome:'Landing Page', valor:2000, descricao:'Página otimizada para conversão, com copy estratégica e integrações.',
     inclusos:['Desenvolvimento da página','Copy estratégica','Design personalizado','Formulário de captação','Integração com WhatsApp','Configuração para acompanhamento de conversões','Publicação da página']},
    {id:'b-gmn', nome:'Setup Google Meu Negócio', valor:1000, descricao:'Empresa publicada e otimizada para pesquisas locais no Google.',
     inclusos:['Criação ou configuração do perfil','Cadastro completo das informações da empresa','Configuração de categorias e serviços','Cadastro de fotos','Otimização para pesquisas locais','Publicação da empresa no Google']},
    {id:'b-tracking', nome:'Tracking Completo', valor:3500, descricao:'Estrutura pronta para mensuração de leads, vendas e resultados.',
     inclusos:['Configuração do Google Tag Manager','Configuração do Google Analytics 4 (GA4)','Configuração do Meta Pixel','Configuração da Meta Conversions API','Configuração dos principais eventos de conversão','Integração entre site, Meta e Google','Testes e validação de todo o rastreamento']}
  ];

  const CONDICOES = [
    {titulo:'Cartão de crédito', texto:'Parcelamento conforme as condições comerciais desta proposta.'},
    {titulo:'Pagamento à vista via PIX', texto:'10% de desconto sobre o valor total da proposta.'}
  ];

  function load(){
    let db = null;
    try{ db = JSON.parse(localStorage.getItem(KEY)); }catch(e){}
    if(!db) db = {};
    if(!db.servicos) db.servicos = SERVICOS;
    if(!db.bonus) db.bonus = BONUS;
    if(!db.condicoes) db.condicoes = CONDICOES;
    if(!db.propostas) db.propostas = [];
    return db;
  }
  function save(db){ localStorage.setItem(KEY, JSON.stringify(db)); }

  const brl = v => v==null ? 'A definir' : 'R$ ' + Number(v).toLocaleString('pt-BR');
  const uid = () => Math.random().toString(36).slice(2,8).toUpperCase();

  window.StartDB = { load, save, brl, uid, KEY };
})();
