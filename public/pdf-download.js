/* Download direto em PDF (sem diálogo de impressão) — html2canvas + jsPDF
   Mantém a fidelidade visual: texto com gradiente é convertido em cor sólida
   no clone (html2canvas não suporta background-clip:text) e as páginas são
   cortadas em limites seguros (seções/cards), nunca no meio de um bloco. */
(function(){
  const LIBS = [
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
  ];
  function loadScript(src){
    return new Promise(function(res, rej){
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function(){ rej(new Error('falha ao carregar ' + src)); };
      document.head.appendChild(s);
    });
  }
  async function ensureLibs(){
    if(!window.html2canvas) await loadScript(LIBS[0]);
    if(!(window.jspdf && window.jspdf.jsPDF)) await loadScript(LIBS[1]);
  }

  /* CSS aplicado só no clone usado para a captura */
  const CAPTURE_CSS = `
.pdf-fab,#__pdfOverlay,.topbar,.countdown{display:none!important}
.topbar .hot,.hero-copy .kicker,.hero-copy h1 .l2,.tag,.svc .preco,.svc-price-value,.step h3,.price-big,.bonus-price b,.bonus-total b{
  background:none!important;background-image:none!important;
  -webkit-background-clip:border-box!important;background-clip:border-box!important;
  filter:none!important;text-shadow:none!important}
.tag,.hero-copy .kicker,.topbar .hot{color:#FF7A00!important;-webkit-text-fill-color:#FF7A00!important}
.hero-copy h1 .l2,.step h3,.svc .preco,.svc-price-value,.price-big{color:#FF2E9A!important;-webkit-text-fill-color:#FF2E9A!important}
[data-theme="start"] .tag,[data-theme="start"] .hero-copy .kicker,[data-theme="start"] .topbar .hot{color:#54C3FE!important;-webkit-text-fill-color:#54C3FE!important}
[data-theme="start"] .hero-copy h1 .l2,[data-theme="start"] .step h3,[data-theme="start"] .svc .preco,[data-theme="start"] .svc-price-value,[data-theme="start"] .price-big{color:#0093E0!important;-webkit-text-fill-color:#0093E0!important}
.svc-price-value .per,.price-big small{-webkit-text-fill-color:inherit!important;color:inherit!important}
.price-big{line-height:1.22!important;margin-bottom:10px!important;padding-bottom:2px!important}
.price-sub,.price-pix,.valid-note{margin-top:6px!important;line-height:1.5!important}
.h2,.hero-copy h1,.step h3,.svc h3,.invest .tag{line-height:1.3!important}
.bonus-price b,.bonus-total b{color:#2EE59D!important;-webkit-text-fill-color:#2EE59D!important}
*{transition:none!important;animation:none!important}
`;

  function overlay(txt){
    let el = document.getElementById('__pdfOverlay');
    if(!el){
      el = document.createElement('div');
      el.id = '__pdfOverlay';
      el.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;color:#fff;font:600 15px/1.5 system-ui,-apple-system,sans-serif;text-align:center;padding:24px';
      document.body.appendChild(el);
    }
    el.textContent = txt;
    return el;
  }

  async function download(nome){
    const fab = document.querySelector('.pdf-fab');
    const ov = overlay('Gerando o PDF…');
    try {
      await ensureLibs();
      const target = document.getElementById('page') || document.body;
      const bg = getComputedStyle(document.body).backgroundColor || '#01050c';
      if(document.fonts && document.fonts.ready) await document.fonts.ready;
      ov.style.display = 'none';
      const canvas = await window.html2canvas(target, {
        scale: 2, backgroundColor: bg, useCORS: true, allowTaint: true, logging: false,
        windowWidth: Math.max(1224, target.scrollWidth), scrollX: 0, scrollY: 0,
        onclone: function(doc){
          const st = doc.createElement('style');
          st.textContent = CAPTURE_CSS;
          doc.head.appendChild(st);
        }
      });
      ov.style.display = 'flex';
      ov.textContent = 'Montando o PDF…';

      const { jsPDF } = window.jspdf;
      // página única, do tamanho exato do design — nada é cortado
      let wPt = (canvas.width / 2) * 0.75;
      let hPt = (canvas.height / 2) * 0.75;
      const LIMITE = 14000; // limite do formato PDF por dimensão
      if(hPt > LIMITE){ const s = LIMITE / hPt; wPt *= s; hPt *= s; }
      const doc1 = new jsPDF({ unit: 'pt', format: [wPt, hPt], orientation: hPt >= wPt ? 'portrait' : 'landscape', compress: true });
      doc1.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, wPt, hPt);
      doc1.save((nome || 'proposta') + '.pdf');
      ov.remove();
      if(fab) fab.style.display = '';
    } catch(err){
      console.warn('PDF direto falhou, usando impressão do navegador', err);
      ov.remove();
      if(window.__doPrint) window.__doPrint(); else window.print();
    } finally {
      if(fab) fab.style.display = '';
    }
  }
  window.StartPDF = { download: download };
})();
