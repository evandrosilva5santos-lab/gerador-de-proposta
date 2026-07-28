/* Banco de imagens em IndexedDB — o localStorage guarda só a referência "idb:<id>".
   Assim o portfólio e os depoimentos podem crescer sem estourar cota (centenas de MB). */
(function(){
  const DB = 'start-images', STORE = 'imgs', VER = 1;
  const cache = Object.create(null);     // id -> dataURL (memória, preenchido no init)
  let ready = null;

  function open(){
    return new Promise((res, rej) => {
      const rq = indexedDB.open(DB, VER);
      rq.onupgradeneeded = () => { const d = rq.result; if(!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE); };
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => rej(rq.error);
    });
  }
  function tx(mode, fn){
    return open().then(d => new Promise((res, rej) => {
      const t = d.transaction(STORE, mode), s = t.objectStore(STORE);
      let out; try { out = fn(s); } catch(e){ rej(e); return; }
      t.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
      t.onerror = () => rej(t.error);
    }));
  }

  /* carrega tudo para memória — depois disso o acesso é síncrono */
  function init(){
    if (ready) return ready;
    ready = open().then(d => new Promise((res) => {
      const t = d.transaction(STORE, 'readonly'), s = t.objectStore(STORE);
      const kq = s.getAllKeys(), vq = s.getAll();
      t.oncomplete = () => {
        (kq.result || []).forEach((k, i) => { cache[k] = (vq.result || [])[i]; });
        res(true);
      };
      t.onerror = () => res(false);
    })).catch(() => false);
    return ready;
  }

  const uid = () => 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* grava uma dataURL e devolve a referência curta para guardar no banco */
  function put(dataURL){
    const id = uid();
    cache[id] = dataURL;
    return tx('readwrite', s => s.put(dataURL, id)).then(() => 'idb:' + id).catch(() => dataURL);
  }
  function del(ref){
    if (typeof ref !== 'string' || !ref.startsWith('idb:')) return Promise.resolve();
    const id = ref.slice(4); delete cache[id];
    return tx('readwrite', s => s.delete(id)).catch(() => {});
  }
  /* resolve para uso em <img src>; qualquer outro valor (url/dataURL) passa direto */
  function src(v){
    if (typeof v !== 'string') return '';
    return v.startsWith('idb:') ? (cache[v.slice(4)] || '') : v;
  }
  function bytes(){
    let n = 0; for (const k in cache) n += (cache[k] || '').length;
    return n;
  }

  /* move dataURLs que já estão no localStorage para o IndexedDB, liberando cota */
  async function migrate(db){
    let mudou = false;
    const mv = async (obj, key) => {
      const v = obj && obj[key];
      if (typeof v === 'string' && v.startsWith('data:')) { obj[key] = await put(v); mudou = true; }
    };
    for (const d of (db.portfolio || [])) await mv(d, 'img');
    for (const d of (db.depoimentos || [])) await mv(d, 'img');
    for (const o of (db.owners || [])) await mv(o, 'heroImg');
    for (const p of (db.propostas || [])) {
      await mv(p.owner || {}, 'heroImg');
      for (const d of (p.depoimentos || [])) await mv(d, 'img');
      for (const d of (p.portfolio || [])) await mv(d, 'img');
    }
    return mudou;
  }

  window.StartImg = { init, put, del, src, migrate, bytes };
})();
