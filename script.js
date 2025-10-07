/* =========================================================
   VivaStore — script.js
   Productos, carrito, reseñas, contacto
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* ------------------ Utilidades ------------------ */
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const toast = $('#toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  }

  /* ------------------ Divisa local ------------------ */
  const LOCALE = navigator.language || 'es-US';
  const country = (LOCALE.split('-')[1] || 'US').toUpperCase();

  const countryToCurrency = {
    US:'USD', HN:'HNL', MX:'MXN', CO:'COP', AR:'ARS', CL:'CLP', PE:'PEN',
    ES:'EUR', EC:'USD', SV:'USD', GT:'GTQ', NI:'NIO', CR:'CRC', UY:'UYU',
    PY:'PYG', BR:'BRL', DO:'DOP', VE:'USD', PA:'USD', PR:'USD'
  };
  const currencyCode = countryToCurrency[country] || 'USD';

  // Tasas simples respecto a USD (aprox; se pueden actualizar)
  const rates = {
    USD:1, HNL:24.7, MXN:17.0, COP:3980, ARS:950, CLP:920, PEN:3.75, EUR:0.93,
    GTQ:7.8, NIO:36.7, CRC:525, UYU:39, PYG:7400, BRL:5.5, DOP:59
  };

  const nf = new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode });
  const convertUSD = (usd) => usd * (rates[currencyCode] || 1);
  const fmt = (usd) => nf.format(convertUSD(usd));

  /* ------------------ Productos ------------------ */
  const products = [
    { id:'netflix',   name:'Netflix',          usd:5.49, img:'' },
    { id:'spotify',   name:'Spotify Premium',  usd:3.49, img:'' },
    { id:'disney',    name:'Disney+',          usd:5.49, img:'' },
    { id:'hbomax',    name:'HBO Max',          usd:6.49, img:'' },
    { id:'prime',     name:'Prime Video',      usd:4.49, img:'' },
    { id:'paramount', name:'Paramount+',       usd:4.99, img:'' },
    { id:'vix',       name:'ViX Premium',      usd:3.99, img:'' },
  ];
  const productMap = Object.fromEntries(products.map(p => [p.id, p]));

  function renderProducts() {
    const grid = $('#products-grid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
      <article class="product-card">
        <div class="product-media">${p.name}</div>
        <h3 class="product-title">${p.name}</h3>
        <div class="product-price">${fmt(p.usd)}</div>
        <div class="product-actions">
          <button class="btn btn-primary add-btn" data-id="${p.id}">Agregar</button>
        </div>
      </article>
    `).join('');
  }

  /* ------------------ Carrito ------------------ */
  const btnCart = $('#btn-cart');
  const panel   = $('#cart-panel');
  const overlay = $('#overlay');
  const badge   = $('#cart-badge');
  const list    = $('#cart-items');
  const totalEl = $('#cart-total');

  let cart = JSON.parse(localStorage.getItem('viva_cart') || '[]');

  function saveCart(){ localStorage.setItem('viva_cart', JSON.stringify(cart)); }
  function findInCart(id){ return cart.find(i => i.id === id); }

  function updateBadge() {
    const count = cart.reduce((a,b)=>a + b.qty, 0);
    if (badge) {
      badge.textContent = String(count);
      if (count>0){ badge.classList.add('bounce'); setTimeout(()=>badge.classList.remove('bounce'), 300); }
    }
  }

  function openCart(){ if(!panel||!overlay) return; panel.classList.add('open'); overlay.classList.add('show'); panel.setAttribute('aria-hidden','false'); }
  function closeCart(){ if(!panel||!overlay) return; panel.classList.remove('open'); overlay.classList.remove('show'); panel.setAttribute('aria-hidden','true'); }

  function updateCartUI() {
    if (!list) return;
    if (cart.length === 0) {
      list.innerHTML = `<p class="muted" style="margin:8px 2px">Tu carrito está vacío.</p>`;
      totalEl && (totalEl.textContent = '—');
      updateBadge();
      return;
    }
    list.innerHTML = cart.map(item => {
      const p = productMap[item.id];
      return `
        <div class="cart-row" data-id="${item.id}">
          <div class="cart-name">${p.name}</div>
          <div class="cart-ops">
            <div class="qty">
              <button class="qty-btn minus" aria-label="Disminuir">−</button>
              <b>${item.qty}</b>
              <button class="qty-btn plus" aria-label="Aumentar">+</button>
            </div>
            <div><b>${fmt(p.usd*item.qty)}</b></div>
            <button class="cart-remove remove" aria-label="Eliminar">✕</button>
          </div>
        </div>
      `;
    }).join('');
    const totalUSD = cart.reduce((sum, i)=> sum + productMap[i.id].usd*i.qty, 0);
    totalEl && (totalEl.textContent = fmt(totalUSD));
    updateBadge();
  }

  function addToCart(id) {
    const p = productMap[id]; if (!p) return;
    const found = findInCart(id);
    if (found) found.qty += 1; else cart.push({id, qty:1});
    saveCart(); updateCartUI(); openCart();
    showToast(`${p.name} agregado`);
  }

  // Delegación de eventos carrito
  if (list) {
    list.addEventListener('click', e => {
      const row = e.target.closest('.cart-row'); if(!row) return;
      const id = row.dataset.id; const item = findInCart(id); if(!item) return;

      if (e.target.classList.contains('plus'))  { item.qty += 1; }
      if (e.target.classList.contains('minus')) { item.qty = Math.max(1, item.qty-1); }
      if (e.target.classList.contains('remove')){ cart = cart.filter(i=>i.id!==id); }

      saveCart(); updateCartUI();
    });
  }

  $('#clear-cart')?.addEventListener('click', () => { cart = []; saveCart(); updateCartUI(); });
  $('#checkout')?.addEventListener('click', () => { showToast('Compra simulada ✔'); });
  $('#close-cart')?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);
  btnCart?.addEventListener('click', openCart);

  // Agregar desde productos
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn'); if(!btn) return;
    addToCart(btn.dataset.id);
  });

  /* ------------------ Opiniones ------------------ */
  const starsWrap = $('#stars');
  let currentRating = 0;
  function paintStars(n){
    if (!starsWrap) return;
    [...starsWrap.children].forEach((s,i)=> s.classList.toggle('active', i < n));
  }

  starsWrap?.addEventListener('click', e => {
    const el = e.target.closest('span[data-val]'); if(!el) return;
    currentRating = Number(el.dataset.val);
    paintStars(currentRating);
    $('#r-help').textContent = `${currentRating} / 5`;
  });

  const rText = $('#r-text');
  rText?.addEventListener('input', () => $('#r-count').textContent = `${rText.value.length}/400`);

  function loadReviews(){ return JSON.parse(localStorage.getItem('viva_reviews') || '[]'); }
  function saveReviews(arr){ localStorage.setItem('viva_reviews', JSON.stringify(arr)); }

  function updateReviewSummary() {
    const box = $('#rating-summary'); const dist = $('#rating-distribution');
    if (!box || !dist) return;
    const arr = loadReviews();
    if (arr.length === 0) {
      box.innerHTML = `<div class="big">—</div><div class="muted">Aún no hay reseñas.</div>`;
      dist.innerHTML = '';
      $('#reviews-list') && ($('#reviews-list').innerHTML = `<p class="muted">Aún no hay reseñas.</p>`);
      return;
    }
    const avg = arr.reduce((a,b)=>a+b.rating,0) / arr.length;
    box.innerHTML = `<div class="big">${avg.toFixed(1)}</div><div class="muted">${arr.length} reseñas</div>`;

    const buckets = [0,0,0,0,0]; // index 0 => 1 estrella
    arr.forEach(r=> buckets[r.rating-1]++);
    dist.innerHTML = [5,4,3,2,1].map(val=>{
      const count = buckets[val-1], pct = (count/arr.length*100)||0;
      return `
        <div style="display:flex;align-items:center;gap:8px">
          <span>${val}★</span>
          <div class="bar" style="flex:1"><i style="width:${pct}%"></i></div>
          <small class="muted" style="width:40px;text-align:right">${count}</small>
        </div>
      `;
    }).join('');

    renderReviewList(arr);
  }

  function renderReviewList(arr){
    const wrap = $('#reviews-list'); if(!wrap) return;
    wrap.innerHTML = arr.slice().reverse().map(r => `
      <article class="review-item">
        <div class="meta">
          <strong>${r.name || 'Anónimo'}</strong>
          <span>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
          <small class="muted">${new Date(r.date).toLocaleDateString()}</small>
        </div>
        <div class="body">${escapeHTML(r.text)}</div>
      </article>
    `).join('');
  }

  function escapeHTML(s){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

  $('#review-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#r-name')?.value?.trim();
    const text = rText?.value?.trim();
    if (!currentRating) { showToast('Selecciona una calificación'); return; }
    if (!text) { showToast('Escribe un comentario'); return; }
    const arr = loadReviews();
    arr.push({ name, rating: currentRating, text, date: Date.now() });
    saveReviews(arr);
    (e.target).reset();
    currentRating = 0; paintStars(0); $('#r-help').textContent='Sin calificación'; $('#r-count').textContent='0/400';
    updateReviewSummary(); showToast('¡Gracias por tu reseña!');
  });

  /* ------------------ Contacto ------------------ */
  $('#contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const n = $('#c-name').value.trim();
    const m = $('#c-msg').value.trim();
    if (!n || !m) { showToast('Completa los campos requeridos'); return; }
    $('#contact-feedback').textContent = 'Mensaje enviado. Te responderemos pronto.';
    (e.target).reset();
  });

  /* ------------------ Inicialización ------------------ */
  renderProducts();
  updateCartUI();
  updateReviewSummary();

  // Enlaces internos suaves
  document.body.addEventListener('click', e=>{
    const a = e.target.closest('a[href^="#"]'); if(!a) return;
    const el = $(a.getAttribute('href')); if(!el) return;
    e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
