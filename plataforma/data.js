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
     inclusos:['Implantação do CRM','Configuração do funil comercial','Cadastro de usuários','Organização das etapas de venda','Integrações necessárias','Treinamento inicial']},
    {id:'captacao-basic', nome:'Captação de Fotos e Vídeos BASIC', categoria:'Conteúdo', preco:1500, rec:'unico', prazo:'1 dia',
     resumo:'Captação básica com celular: 2h de gravação, ~20 vídeos curtos e fotos editadas.',
     inclusos:['Planejamento de captação','Produção no local do cliente (2h)','Edição e tratamento do conteúdo','~20 vídeos curtos para redes sociais','Fotos otimizadas','Entrega via Google Drive','Sem iluminação profissional ou microfone']},
    {id:'captacao-premium', nome:'Captação de Fotos e Vídeos PREMIUM', categoria:'Conteúdo', preco:2500, rec:'unico', prazo:'1 dia',
     resumo:'Captação profissional com câmera, iluminação e áudio: 4h de gravação, 12 conteúdos completos.',
     inclusos:['Planejamento de captação','Produção no local do cliente (4h)','Câmera profissional, tripé e iluminação','Áudio profissional','Edição e tratamento do conteúdo','12 conteúdos principais','Fotos de alta qualidade','Entrega via Google Drive','Integração ao calendário editorial']},
    {id:'posicionamento-magnetico', nome:'Posicionamento Magnético™', categoria:'Marca', preco:1497, rec:'mensal', prazo:'6 meses',
     resumo:'Sistema de posicionamento, conteúdo estratégico e autoridade digital para construir referência no mercado.',
     inclusos:['Planejamento estratégico mensal','Análise de posicionamento','Definição de pautas','4 roteiros estratégicos para vídeos com edição','4 conteúdos complementares para feed','Calendário editorial','Estrutura da narrativa da marca','Manual dos stories','Grupo exclusivo WhatsApp para suporte','Ajustes e decisões em tempo real','Contrato mínimo 6 meses']},
    {id:'mentoria-arquitetura', nome:'Mentoria Arquitetura de Vendas', categoria:'Conteúdo', preco:8000, rec:'unico', prazo:'6 encontros',
     resumo:'6 encontros estratégicos para estruturar posicionamento, oferta, funis, aquisição, automação e escala.',
     inclusos:['6 encontros estratégicos','Estruturação de posicionamento','Definição de oferta','Desenho de funis de vendas','Estratégia de aquisição','Automação de processos','Estrutura de recorrência','Planejamento de escala']},
    {id:'coproduto-setup', nome:'Coprodução Setup de Infoproduto', categoria:'Tecnologia', preco:15500, rec:'unico', prazo:'30 dias',
     resumo:'Montagem completa da estrutura de venda: landing page, funil, CRM, e-mail marketing, área de membros.',
     inclusos:['1 landing page de vendas','Copys da página de vendas','Infraestrutura de e-mail marketing','Layout da área de membros','Implementação CRM para recuperação de vendas','Automação de recuperação de vendas','Designer para criativos e materiais ilustrativos','Inteligência artificial para suporte','Entrega pronta para venda']},
    {id:'coproduto-suporte', nome:'Coprodução Suporte Platinum', categoria:'Tecnologia', preco:2500, rec:'mensal', prazo:'Contrato mensal',
     resumo:'Suporte contínuo: ferramenta de recuperação de vendas, otimização, subir novos materiais na área de membros.',
     inclusos:['Ferramenta de recuperação de vendas com IA','Inteligência artificial de suporte','Editor de vídeo e designer para aulas','Subir novos materiais na área de membros','Otimização de landing pages','Otimização de copys e e-mail marketing','Otimização de funis','Acompanhamento de métricas','Contrato mínimo recomendado: 6 meses']},
    {id:'coproduto-recorrencia', nome:'Coprodução Recorrência Completa', categoria:'Tecnologia', preco:5500, rec:'mensal', prazo:'Contrato mensal',
     resumo:'Tudo do Suporte Platinum + gestão de tráfego pago e otimização de LTV com modelo de ganho compartilhado.',
     inclusos:['Tudo do Suporte Platinum','Gestão de tráfego pago multi-plataforma','Funil de vendas para aumentar LTV','Criativos semanais','Análise de dados avançada','Dashboard de otimização','Otimização diária','Relatórios semanais','+ 10% variável sobre a venda gerada']},
    {id:'redes-produzida', nome:'Gestão de Redes Sociais PRODUZIDA', categoria:'Conteúdo', preco:1800, rec:'mensal', prazo:'Contrato mensal',
     resumo:'Gestão completa com planejamento, conteúdo criado e publicação semanal otimizada para engajamento.',
     inclusos:['Planejamento estratégico e pesquisa de mercado','12 conteúdos mensais (3 posts por semana)','Criação de artes e copys estratégicos','Análise de dados e relatórios de performance','Templates personalizados para stories','Capa e bio otimizadas no Instagram','Consultoria de crescimento mensal','Agendamento via Meta Business Suite']},
    {id:'scripts-magneticos', nome:'Scripts Magnéticos™', categoria:'Conteúdo', preco:null, rec:'consulta', prazo:'Entrega imediata',
     resumo:'Conjunto de scripts profissionais para converter conversas em oportunidades de venda.',
     inclusos:['Scripts estratégicos de vendas','Técnicas de objeção','Estrutura de apresentação','Templates prontos para uso','Treinamento de aplicação']},
    {id:'calendario-tatico', nome:'Calendário Tático (Planejamento Estratégico)', categoria:'Conteúdo', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Planejamento estratégico completo de marketing, vendas e comunicação para o trimestre/ano.',
     inclusos:['Análise situacional','Definição de objetivos','Planejamento de campanhas','Calendário de publicações','Estratégia de conteúdo','Métricas e KPIs','Documento entregável com roadmap']},
    {id:'pdv-eventos', nome:'Ações de PDV / Feiras e Eventos', categoria:'Conteúdo', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Realização de ações em pontos de venda, feiras e eventos para aproximar clientes e gerar presença física.',
     inclusos:['Planejamento da ação','Setup do espaço','Materiais de apoio','Captação de fotos e vídeos','Gestão do evento','Relatório de resultados']},
    {id:'palestras-treinamentos', nome:'Palestras e Treinamentos', categoria:'Conteúdo', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Palestras, workshops e treinamentos para equipes ou públicos, com conteúdo estratégico.',
     inclusos:['Desenvolvimento da palestra','Materiais didáticos','Apresentação','Suporte técnico','Certificação','Relatório de participação']},
    {id:'lancamentos-perpetuos', nome:'Gestão de Lançamentos e Perpétuos', categoria:'Conteúdo', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Estruturação e gestão de lançamentos de produtos/serviços e campanhas perpétuas de vendas.',
     inclusos:['Planejamento de lançamento','Cronograma e fases','Gestão de tráfego','Copywriting','Criação de sequências de e-mail','Acompanhamento de resultados','Otimização pós-lançamento']},
    {id:'editor-video', nome:'Edição de Vídeos', categoria:'Conteúdo', preco:null, rec:'consulta', prazo:'A definir',
     resumo:'Edição profissional de vídeos para redes sociais, YouTube, campanhas e conteúdo institucional.',
     inclusos:['Edição bruta','Cortes e transições','Efeitos visuais','Legendas e áudio','Otimização para plataforma','Entrega em múltiplos formatos']}
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
    {id:'b-gestao-gmn', nome:'Gestão do Google Meu Negócio', valor:1400, descricao:'Perfil ativo e monitorado todos os meses para aparecer nas buscas da sua região.',
     inclusos:['Publicações mensais no perfil da empresa','Atualização de fotos, horários e informações','Otimização contínua de categorias e palavras-chave locais','Estratégia para captação de avaliações','Resposta e acompanhamento das avaliações recebidas','Monitoramento de visualizações, cliques e pedidos de rota','Relatório mensal de desempenho local']},
    {id:'b-tracking', nome:'Tracking Completo', valor:3500, descricao:'Estrutura pronta para mensuração de leads, vendas e resultados.',
     inclusos:['Configuração do Google Tag Manager','Configuração do Google Analytics 4 (GA4)','Configuração do Meta Pixel','Configuração da Meta Conversions API','Configuração dos principais eventos de conversão','Integração entre site, Meta e Google','Testes e validação de todo o rastreamento']}
  ];

  const CONDICOES = [
    {titulo:'Cartão de crédito', texto:'Parcelamento conforme as condições comerciais desta proposta.'},
    {titulo:'Pagamento à vista via PIX', texto:'10% de desconto sobre o valor total da proposta.'}
  ];

  /* ---- Temas (o "exemplo" que o usuário escolhe): puxam prova social e hero automaticamente ---- */
  const TEMAS = [
    {id:'trafego',       label:'Assessoria / Tráfego Pago', tags:['trafego','assessoria','resultados'], categorias:['Tráfego','Setup'], owner:'start',
     servicos:['trafego-standard','setup-plataforma','tracking'],
     descricao:'Já vem com Gestão de Tráfego STANDARD + Setup de Plataforma + Tracking Completo, além dos depoimentos de tráfego e hero da START.'},
    {id:'web',           label:'Web Designer / Landing Page', tags:['web'], categorias:['Web'], owner:'start',
     servicos:['landing-page'],
     descricao:'Puxa os depoimentos de web/landing page + hero da START.'},
    {id:'posicionamento',label:'Posicionamento de Marca', tags:['posicionamento'], categorias:['Marca'], owner:'katy',
     servicos:['branding','identidade-visual'],
     descricao:'Puxa os depoimentos de posicionamento de marca + hero da Katy.'},
    {id:'infoproduto',   label:'Infoproduto / Mentoria', tags:['infoproduto'], categorias:['Conteúdo','Marca','Tecnologia'], owner:'evandro',
     servicos:['conteudo','automacoes'],
     descricao:'Puxa os depoimentos de infoproduto + hero do Evandro.'},
    {id:'custom',        label:'Personalizado (escolho tudo)', tags:[], categorias:[], owner:'start',
     descricao:'Sem automação — você seleciona serviços, depoimentos e hero manualmente.'}
  ];

  /* ---- Etapas do processo por tema. 'web' = LP: MANTER EXATAMENTE (corresponde à entrega de LP) ---- */
  const ETAPAS_TEMA = {
    web: [
      {titulo:'Aplicação do Briefing', texto:'O primeiro passo é entender exatamente o que você quer e coletar as informações necessárias, como copy, arquivos de imagem, identidade visual e referências.'},
      {titulo:'Pesquisa', texto:'Realizo uma análise do nicho para compreender profundamente as estratégias dos concorrentes, identificando as melhores práticas e referências do setor. Esse processo me permite absorver ideias inovadoras e eficazes para embasar e elevar a qualidade do seu projeto.'},
      {titulo:'Criação do Design', texto:'A partir disso, inicia-se o desenvolvimento da parte visual, garantindo que o resultado final seja não apenas atrativo, mas também altamente competitivo e alinhado com as tendências de mercado.'},
      {titulo:'Implementação', texto:'Após a completa aprovação do design pelo cliente, procedo com a implementação da página, assegurando o pleno funcionamento em todos os dispositivos e plataformas, garantindo uma experiência de usuário fluida e acessível.'},
      {titulo:'Otimização da Página', texto:'Durante esta fase, dedico-me à otimização integral da página, assegurando um carregamento rápido e eficiente. Essa etapa é crucial para o desempenho ágil para o sucesso online.'}
    ],
    trafego: [
      {titulo:'Diagnóstico & Estratégia', texto:'Analiso o momento atual do seu negócio, público e objetivos para desenhar a estratégia de tráfego mais adequada — canais, verba e metas claras.'},
      {titulo:'Setup & Estrutura', texto:'Configuro a estrutura completa de anúncios: contas, pixel, públicos, campanhas e rastreamento, garantindo mensuração precisa desde o primeiro clique.'},
      {titulo:'Criativos & Campanhas', texto:'Desenvolvo e subo as campanhas com criativos e copy alinhados à oferta, cobrindo prospecção, relacionamento e remarketing.'},
      {titulo:'Otimização Contínua', texto:'Monitoro o desempenho diariamente, faço testes A/B e otimizo públicos, criativos e lances para melhorar o custo por resultado.'},
      {titulo:'Relatórios & Escala', texto:'Entrego relatórios periódicos com os resultados e, com base nos dados, escalo o que funciona para gerar demanda previsível.'}
    ],
    posicionamento: [
      {titulo:'Imersão & Diagnóstico', texto:'Mergulho na sua marca, mercado e público para entender onde você está hoje e para onde quer ir.'},
      {titulo:'Posicionamento Estratégico', texto:'Defino proposta de valor, arquétipos e o território de marca que diferencia você da concorrência.'},
      {titulo:'Identidade Verbal & Visual', texto:'Construo a narrativa e as diretrizes visuais que traduzem o posicionamento em uma marca memorável.'},
      {titulo:'Aplicação', texto:'Aplico a nova identidade nos principais pontos de contato, garantindo consistência em toda a comunicação.'},
      {titulo:'Diretrizes & Entrega', texto:'Entrego o manual com as diretrizes estratégicas para a marca crescer de forma coerente ao longo do tempo.'}
    ],
    infoproduto: [
      {titulo:'Planejamento', texto:'Estruturo a jornada do seu infoproduto ou mentoria, definindo oferta, promessa e formato ideal para o seu público.'},
      {titulo:'Estruturação de Conteúdo', texto:'Organizo o conteúdo em módulos e etapas claras, com direcionamento criativo e editorial.'},
      {titulo:'Construção', texto:'Desenvolvo as páginas, materiais e automações necessárias para colocar o produto no ar.'},
      {titulo:'Integrações & Automação', texto:'Integro plataformas e crio fluxos automatizados para escalar as entregas e o relacionamento.'},
      {titulo:'Lançamento & Otimização', texto:'Acompanho o lançamento e otimizo os pontos de conversão para maximizar os resultados.'}
    ]
  };

  /* ---- Templates de proposta: combos prontos (serviços + etapas + cor) ---- */
  const TEMPLATES = [
    {id:'lp-ecommerce', nome:'LP + E-commerce', cor:'#0093E0',
     descricao:'Para landing pages e lojas virtuais. Foco em conversão, velocidade e call-to-action claro.',
     servicos:['landing-page','ecommerce'],
     etapas:[
       {titulo:'Briefing & Pesquisa', texto:'Coletamos copy, identidade visual, referências e objetivos da página.'},
       {titulo:'Design & Prototipagem', texto:'Estrutura de seções e layout aprovado antes do desenvolvimento.'},
       {titulo:'Desenvolvimento', texto:'Construção responsiva, integrações e configuração de rastreamento.'},
       {titulo:'Testes & Otimização', texto:'Validação em todos os dispositivos, velocidade e conversão.'},
       {titulo:'Publicação', texto:'Publicação no domínio, checklist final e entrega dos acessos.'}
     ]},
    {id:'assessoria-tatica', nome:'Assessoria & Tática', cor:'#0073B8',
     descricao:'Para tráfego pago e gestão de campanhas. Foco em resultados mensuráveis e ROI.',
     servicos:['trafego-standard','setup-plataforma','tracking'],
     etapas:[
       {titulo:'Diagnóstico & Estratégia', texto:'Entendemos o negócio, números e objetivos para embasar o plano.'},
       {titulo:'Setup & Estrutura', texto:'Contas, pixel, públicos e rastreamento configurados e validados.'},
       {titulo:'Criativos & Campanhas', texto:'Campanhas de prospecção, relacionamento e remarketing no ar.'},
       {titulo:'Otimização Contínua', texto:'Ajustes diários de verba, criativos e públicos com base em dados.'},
       {titulo:'Escalabilidade', texto:'Relatórios, reuniões estratégicas e escala do que funciona.'}
     ]},
    {id:'posicionamento', nome:'Posicionamento de Marca', cor:'#7C3AED',
     descricao:'Para branding e autoridade. Foco em diferenciação, narrativa e presença digital.',
     servicos:['branding','identidade-visual','social-media'],
     etapas:[
       {titulo:'Imersão & Diagnóstico', texto:'Entrevistas, análise de mercado e leitura da percepção atual da marca.'},
       {titulo:'Posicionamento Estratégico', texto:'Definição de território, promessa e diferenciais competitivos.'},
       {titulo:'Identidade Verbal & Visual', texto:'Tom de voz, mensagens-chave e aplicação visual do posicionamento.'},
       {titulo:'Aplicação', texto:'Perfis, materiais e comunicação alinhados ao novo posicionamento.'},
       {titulo:'Diretrizes & Suporte', texto:'Manual de uso e acompanhamento da implementação.'}
     ]},
    {id:'infoproduto', nome:'Infoproduto & Mentoria', cor:'#D97706',
     descricao:'Para cursos, treinamentos e produtos digitais. Foco em estrutura, escalabilidade e automação.',
     servicos:['landing-page','conteudo','automacoes','crm'],
     etapas:[
       {titulo:'Planejamento & Estruturação', texto:'Definição de oferta, jornada do aluno e arquitetura do produto.'},
       {titulo:'Desenvolvimento de Conteúdo', texto:'Roteiros, módulos e materiais de apoio organizados.'},
       {titulo:'Infraestrutura & Integrações', texto:'Plataforma, pagamentos, e-mails e automações conectados.'},
       {titulo:'Setup de Vendas', texto:'Página de vendas, checkout e rastreamento configurados.'},
       {titulo:'Lançamento & Otimização', texto:'Acompanhamento das métricas e ajustes de conversão.'}
     ]},
    {id:'social-media', nome:'Social Media & Conteúdo', cor:'#059669',
     descricao:'Para gestão de redes sociais e produção de conteúdo. Foco em presença constante, autoridade e engajamento.',
     servicos:['social-media','conteudo','setup-redes'],
     etapas:[
       {titulo:'Diagnóstico de Presença', texto:'Auditoria dos perfis, análise de concorrentes e definição de referências visuais.'},
       {titulo:'Estratégia & Linha Editorial', texto:'Pilares de conteúdo, tom de voz e calendário editorial aprovados antes da produção.'},
       {titulo:'Produção de Conteúdo', texto:'Criação de posts, legendas e criativos alinhados à identidade da marca.'},
       {titulo:'Publicação & Comunidade', texto:'Agendamento das publicações e acompanhamento de comentários e mensagens.'},
       {titulo:'Relatório & Ajustes', texto:'Leitura de alcance, engajamento e crescimento para ajustar a linha editorial.'}
     ]},
    {id:'google-meu-negocio', nome:'Google Meu Negócio', cor:'#0F9D58',
     descricao:'Para negócios locais. Foco em aparecer nas buscas da região, receber avaliações e gerar contatos direto do Google.',
     servicos:['setup-gmn','gestao-gmn'],
     etapas:[
       {titulo:'Verificação & Diagnóstico', texto:'Reivindicação ou criação do perfil, verificação da empresa e análise da concorrência local.'},
       {titulo:'Otimização do Perfil', texto:'Categorias, serviços, área de atendimento, horários, fotos e descrição otimizados para busca local.'},
       {titulo:'Publicações & Avaliações', texto:'Rotina de postagens no perfil e estratégia para captar e responder avaliações.'},
       {titulo:'Monitoramento Local', texto:'Acompanhamento de visualizações, cliques, ligações e pedidos de rota.'},
       {titulo:'Relatório & Ajustes', texto:'Leitura mensal do desempenho e ajustes de palavras-chave e conteúdo do perfil.'}
     ]},
    {id:'automacoes-crm', nome:'Automações & CRM', cor:'#4338CA',
     descricao:'Para organizar o comercial e parar de perder lead. Foco em funil estruturado, follow-up automático e visão real do pipeline.',
     servicos:['crm','automacoes','ia'],
     etapas:[
       {titulo:'Mapeamento do Processo', texto:'Entendemos como a venda acontece hoje: canais de entrada, etapas, responsáveis e gargalos.'},
       {titulo:'Desenho do Funil', texto:'Definição das etapas do pipeline, campos obrigatórios, gatilhos e regras de passagem.'},
       {titulo:'Implantação do CRM', texto:'Configuração da ferramenta, integração com WhatsApp, formulários e origem dos leads.'},
       {titulo:'Automações & Follow-up', texto:'Fluxos de resposta, distribuição de leads, lembretes e reativação de contatos frios.'},
       {titulo:'Treinamento & Indicadores', texto:'Time treinado no uso diário e painel de conversão por etapa para decisão.'}
     ]},
    {id:'ecommerce', nome:'E-commerce', cor:'#0EA5E9',
     descricao:'Para lojas virtuais. Foco em catálogo bem estruturado, checkout sem atrito e rastreamento de vendas ponta a ponta.',
     servicos:['ecommerce','setup-plataforma','tracking'],
     etapas:[
       {titulo:'Briefing & Arquitetura da Loja', texto:'Definição de categorias, catálogo, formas de envio e regras comerciais.'},
       {titulo:'Design & Vitrine', texto:'Layout da home, páginas de produto e carrinho pensados para conversão.'},
       {titulo:'Configuração & Integrações', texto:'Meios de pagamento, frete, estoque e emissão conectados e testados.'},
       {titulo:'Rastreamento de Vendas', texto:'Pixel, GA4 e eventos de compra configurados para medir cada etapa do funil.'},
       {titulo:'Publicação & Testes de Compra', texto:'Compras de teste em todos os meios de pagamento antes de abrir a loja.'}
     ]},
    {id:'combo-completo', nome:'Combo Completo — Tráfego + Site + Conteúdo', cor:'#1E40AF',
     descricao:'Pacote misto: tráfego pago, landing page/site e estratégia de conteúdo. Solução 360.',
     servicos:['trafego-standard','landing-page','setup-plataforma','tracking','conteudo'],
     etapas:[
       {titulo:'Diagnóstico Completo', texto:'Análise de negócio, canais, oferta e ativos existentes.'},
       {titulo:'Estratégia Integrada', texto:'Plano único ligando tráfego, página e conteúdo.'},
       {titulo:'Setup & Implementação', texto:'Estrutura no ar: campanhas, páginas, rastreamento e integrações.'},
       {titulo:'Conteúdo & Campanhas', texto:'Produção contínua e veiculação alinhada ao funil.'},
       {titulo:'Otimização & Escala', texto:'Leitura de dados, otimização e ampliação do que performa.'}
     ]}
  ];

  /* ---- Donos da proposta: definem a foto/hero da capa e dados de "Quem somos" ---- */
  const OWNERS = [
    {id:'start',   nome:'START INC.', cargo:'Growth · Marketing · IA', heroImg:'assets/donos/start.png', tipo:'Empresa',
     descricao:'Somos a START: especialistas em crescimento digital que combinam estratégia, tecnologia e dados para transformar negócios.',
     clientes:250, paises:5, anos:4, expertise:['Growth Marketing','Tráfego Pago','Automação','IA & Dados']},
    {id:'evandro', nome:'Evandro',    cargo:'Especialista em Growth & Infoprodutos', heroImg:'assets/donos/evandro.png', tipo:'Individual',
     descricao:'Evandro ajuda empreendedores a escalar com infoprodutos, mentoria e estratégias de automação. Foco em resultados mensuráveis.',
     clientes:120, paises:3, anos:6, expertise:['Infoprodutos','Mentoria','Automação','Growth']},
    {id:'katy',    nome:'Katy',       cargo:'Especialista em Posicionamento de Marca', heroImg:'assets/donos/katy.png', tipo:'Individual',
     descricao:'Katy transforma marcas com posicionamento estratégico, identidade visual e narrativa que vendem. Marcas memoráveis crescem.',
     clientes:85, paises:2, anos:5, expertise:['Posicionamento','Branding','Identidade Visual','Copywriting']},
    {id:'start-equipe', nome:'START INC. · Equipe', cargo:'Time completo de performance', heroImg:'assets/donos/start-equipe.png', tipo:'Empresa',
     descricao:'Um time inteiro dedicado ao seu crescimento: estratégia, mídia, criativo e dados operando em conjunto, com performance acompanhada em tempo real.',
     clientes:250, paises:5, anos:4, expertise:['Performance Marketing','Tráfego Pago','Dados & BI','Criativo']}
  ];

  /* ---- Banco de depoimentos (prova social) com tags por tipo de serviço ---- */
  const DEPOIMENTOS = [
    {id:'dep-telma',   img:'assets/depoimentos/telma-phone.png',  nome:'Telma Oliveira',   handle:'@brilhandonoseua', tags:['web','resultados']},
    {id:'dep-bomdia',  img:'assets/depoimentos/bomdia.jpg',       nome:'Cliente Start',    handle:'Landing Page',     tags:['web']},
    {id:'dep-luciano', img:'assets/depoimentos/luciano.jpg',      nome:'Luciano Pozzebom', handle:'@luccxxsxn',       tags:['trafego','resultados']},
    {id:'dep-amanda',  img:'assets/depoimentos/amanda.jpg',       nome:'Amanda Pinheiro',  handle:'Cliente Start',    tags:['posicionamento','trafego']},
    {id:'dep-jared',   img:'assets/depoimentos/jared.jpg',        nome:'Jared Michael',    handle:'Cliente internacional', tags:['trafego','assessoria','resultados']},
    {id:'dep-telma2',  img:'assets/depoimentos/telma-bubbles.jpg',nome:'Telma Oliveira',   handle:'Resultados',       tags:['web','resultados']},
    {id:'dep-start-res',img:'assets/depoimentos/start-resultados.png',nome:'Método Start x Resultados',handle:'Agendamento com R$1,86',tags:['trafego','assessoria','resultados']},
    {id:'dep-675k',    img:'assets/depoimentos/fechamos-675k.png',nome:'Time comercial',   handle:'Fechamos 675k com um lead',tags:['trafego','assessoria','resultados']},
    {id:'dep-marcelo', img:'assets/depoimentos/marcelo-2vendas.png',nome:'Marcelo',        handle:'2 vendas via Lead',tags:['trafego','assessoria','resultados']},
    {id:'dep-fenster', img:'assets/depoimentos/fenster-64700.png',nome:'Esquadrias Fenster',handle:'R$64.700 vindos de Google + Insta',tags:['trafego','assessoria','resultados']},
    {id:'dep-1milhao', img:'assets/depoimentos/totalizando-1milhao.png',nome:'Time comercial',handle:'Totalizando R$1.186.000',tags:['trafego','assessoria','resultados']}
  ];

  /* rótulos amigáveis das tags de depoimento */
  const TAGS = [
    {id:'web',           label:'Web / Landing Page'},
    {id:'trafego',       label:'Tráfego Pago'},
    {id:'assessoria',    label:'Assessoria'},
    {id:'resultados',    label:'Resultados'},
    {id:'posicionamento',label:'Posicionamento de Marca'},
    {id:'infoproduto',   label:'Infoproduto / Mentoria'}
  ];

  function load(){
    let db = null;
    try{ db = JSON.parse(localStorage.getItem(KEY)); }catch(e){}
    if(!db) db = {};
    if(!db.servicos) db.servicos = SERVICOS;
    if(!db.bonus) db.bonus = BONUS;
    else BONUS.forEach(b => { if(!db.bonus.find(x => x.id === b.id)) db.bonus.push({...b}); });
    if(!db.condicoes) db.condicoes = CONDICOES;
    if(!db.depoimentos) db.depoimentos = DEPOIMENTOS;
    else DEPOIMENTOS.forEach(d => { if(!db.depoimentos.find(x => x.id === d.id)) db.depoimentos.push({...d}); });
    if(!db.portfolio) db.portfolio = [];
    if(!db.owners) db.owners = OWNERS;
    else {
      // garante que os 3 donos base sempre existam e tenham a foto padrão (sem sobrescrever fotos já enviadas)
      OWNERS.forEach(o => {
        const ex = db.owners.find(x => x.id === o.id);
        if(!ex) db.owners.push({...o});
        else if(!ex.heroImg && o.heroImg) ex.heroImg = o.heroImg;
      });
    }
    if(!db.templates) db.templates = JSON.parse(JSON.stringify(TEMPLATES));
    else {
      TEMPLATES.forEach(t => { if(!db.templates.find(x => x.id === t.id)) db.templates.push(JSON.parse(JSON.stringify(t))); });
      // remove ids de serviço que não existem mais e repõe o padrão se sobrar vazio
      db.templates.forEach(t => {
        t.servicos = (t.servicos || []).filter(id => SERVICOS.find(s => s.id === id) || (db.servicos || []).find(s => s.id === id));
        if(!t.servicos.length){ const o = TEMPLATES.find(x => x.id === t.id); if(o) t.servicos = o.servicos.slice(); }
      });
    }
    if(!db.propostas) db.propostas = [];
    else db.propostas.forEach((p, i) => { if(!p.slug) p.slug = makeSlug(p.cliente, p.empresa, db.propostas.slice(0, i), p.id); });
    return db;
  }
  /* salva com proteção de quota: nunca deixa o erro derrubar a aplicação */
  function save(db){
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
      return { ok: true };
    } catch(e) {
      const cheio = /quota|exceed|full/i.test(e && (e.name + ' ' + e.message));
      console.warn('StartDB.save falhou:', e);
      return { ok: false, quota: cheio, error: e,
        message: cheio
          ? 'O armazenamento local está cheio. Remova alguns prints antigos do portfólio (ou depoimentos) e tente de novo.'
          : 'Não foi possível salvar: ' + (e && e.message ? e.message : 'erro desconhecido') };
    }
  }
  /* espaço aproximado usado pelo banco, em MB */
  function usage(){
    try { return +( (localStorage.getItem(KEY) || '').length / 1048576 ).toFixed(2); } catch(e) { return 0; }
  }

  function slugify(txt){
    return String(txt || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'proposta';
  }
  /* slug sempre único, derivado do nome do cliente/empresa */
  function makeSlug(cliente, empresa, propostas, ignoreId){
    const base = slugify([cliente, empresa].filter(Boolean).join('-'));
    const usados = (propostas || []).filter(p => p.id !== ignoreId).map(p => p.slug).filter(Boolean);
    let s = base, i = 2;
    while(usados.indexOf(s) > -1) s = base + '-' + (i++);
    return s;
  }

  const brl = v => v==null ? 'A definir' : 'R$ ' + Number(v).toLocaleString('pt-BR');
  const uid = () => Math.random().toString(36).slice(2,8).toUpperCase();

  /* ── Motor de precificação (espelha a planilha) ──────────────────────────
     G  Valor de venda   = TETO( (custo * (1+lucro%)) / (1-imposto%) , 5 )
     I  Valor da parcela = TETO( (G/n) * (1+taxas) + 0,49 , 0,01 )
     J  Valor total      = I * n
     K  Margem R$        = J - custo      L  Margem %  = K / J
     Cartão: 2,99% até 3x, 3,99% de 4x em diante + 2,49% de antecipação + R$ 0,49.
     PIX e Boleto não têm taxa; "à vista" é cartão 1x e paga taxa. */
  const TAXA_ANTEC = 0.0249, TAXA_ATE_3X = 0.0299, TAXA_4X_MAIS = 0.0399, TARIFA_FIXA = 0.49;
  const SEM_TAXA = ['pix', 'boleto'];

  function parcelasDe(forma){
    const k = String(forma || 'pix').toLowerCase();
    if (SEM_TAXA.includes(k) || k === 'avista') return 1;
    const n = parseInt(k, 10);
    return n > 0 ? n : 1;
  }
  function parcelamento(total, forma){
    const k = String(forma || 'pix').toLowerCase();
    const n = parcelasDe(k);
    const cartao = !SEM_TAXA.includes(k);
    const taxa = cartao ? ((n <= 3 ? TAXA_ATE_3X : TAXA_4X_MAIS) + TAXA_ANTEC) : 0;
    const parcela = Math.ceil(((total / n) * (1 + taxa) + (cartao ? TARIFA_FIXA : 0)) * 100) / 100;
    const totalParcelado = Math.ceil(parcela * n * 100) / 100;
    return { n, cartao, taxa, parcela, totalParcelado, acrescimo: Math.max(0, totalParcelado - total) };
  }
  function precoSugerido(custo, lucroPct, impostoPct){
    const b = Number(custo) || 0;
    if (!b) return 0;
    const c = Number(lucroPct) || 0, e = Math.min(0.95, Number(impostoPct) || 0);
    return Math.ceil((b * (1 + c)) / (1 - e) / 5) * 5;
  }
  function margem(totalRecebido, custo){
    const j = Number(totalRecebido) || 0, b = Number(custo) || 0;
    const k = j - b;
    return { valor: k, pct: j ? k / j : 0 };
  }

  window.StartDB = { load, save, usage, brl, uid, slugify, makeSlug, parcelamento, parcelasDe, precoSugerido, margem, KEY, TEMAS, TAGS, TEMPLATES, AUTORES: OWNERS, ETAPAS_TEMA };
})();
