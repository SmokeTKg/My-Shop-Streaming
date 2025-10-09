/* =========================================================
   VivaStore — script.js (estable)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const toast = $('#toast');

  const showToast = (m) => {
    if (!toast) return;
    toast.textContent = m;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 1800);
  };

  /* === Moneda forzada para toda la web (USD) === */
  const nf = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' });
  const fmt = (usd) => nf.format(usd);

/* Productos */
const products = [
  { id:'netflix',   name:'Netflix',          usd:5.49, img:'./img/netflix.jpg' },
  { id:'spotify',   name:'Spotify Premium',  usd:3.49, img:'./img/spotify.jpg' },
  { id:'disney',    name:'Disney+',          usd:5.49, img:'./img/disneyplus.jpg' },
  { id:'hbomax',    name:'HBO Max',          usd:6.49, img:'./img/hbomax.png' },
  { id:'prime',     name:'Prime Video',      usd:4.49, img:'./img/primevideo.jpg' },
  { id:'paramount', name:'Paramount+',       usd:4.99, img:'./img/paramount.jpg' },
  { id:'vix',       name:'ViX Premium',      usd:3.99, img:'./img/vix.jpg' },
];
const productMap = Object.fromEntries(products.map(p => [p.id, p]));

  const renderProducts = () => {
  const grid = $('#products-grid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <article class="product-card">
      <img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy">
      <h3 class="product-title">${p.name}</h3>
      <div class="product-price">${fmt(p.usd)}</div>
      <div class="product-actions">
        <button class="btn btn-primary add-btn" data-id="${p.id}">Agregar</button>
      </div>
    </article>
  `).join('');
};

  /* Carrito */
  const btnCart=$('#btn-cart'), panel=$('#cart-panel'), overlay=$('#overlay'),
        badge=$('#cart-badge'), list=$('#cart-items'), totalEl=$('#cart-total');

  let cart = JSON.parse(localStorage.getItem('viva_cart') || '[]');
  const saveCart=()=>localStorage.setItem('viva_cart', JSON.stringify(cart));
  const inCart=id=>cart.find(i=>i.id===id);
  const openCart=()=>{panel?.classList.add('open'); overlay?.classList.add('show'); panel?.setAttribute('aria-hidden','false');};
  const closeCart=()=>{panel?.classList.remove('open'); overlay?.classList.remove('show'); panel?.setAttribute('aria-hidden','true');};
  const updateBadge=()=>{
    const c = cart.reduce((a,b)=>a+b.qty,0);
    if (badge){ badge.textContent=String(c); if(c>0){ badge.classList.add('bounce'); setTimeout(()=>badge.classList.remove('bounce'),300); } }
  };

  const updateCartUI=()=>{
    if(!list) return;
    if(cart.length===0){
      list.innerHTML=`<p class="muted" style="margin:8px 2px">Tu carrito está vacío.</p>`;
      if(totalEl) totalEl.textContent='—'; updateBadge(); return;
    }
    list.innerHTML = cart.map(it=>{
      const p = productMap[it.id];
      return `<div class="cart-row" data-id="${it.id}">
        <div class="cart-name">${p.name}</div>
        <div class="cart-ops">
          <div class="qty">
            <button class="qty-btn minus" aria-label="Disminuir">−</button>
            <b>${it.qty}</b>
            <button class="qty-btn plus" aria-label="Aumentar">+</button>
          </div>
          <div><b>${fmt(p.usd*it.qty)}</b></div>
          <button class="cart-remove remove" aria-label="Eliminar">✕</button>
        </div>
      </div>`;
    }).join('');
    const totalUSD = cart.reduce((s,i)=>s+productMap[i.id].usd*i.qty,0);
    if(totalEl) totalEl.textContent=fmt(totalUSD); updateBadge();
  };

  const addToCart=id=>{
  const p=productMap[id]; if(!p) return;
  const f=inCart(id); f? f.qty++ : cart.push({id,qty:1});
  saveCart(); updateCartUI(); openCart();
  // showToast(`${p.name} agregado`);
};

  list?.addEventListener('click', e=>{
    const row=e.target.closest('.cart-row'); if(!row) return;
    const id=row.dataset.id; const it=inCart(id); if(!it) return;
    if(e.target.classList.contains('plus')) it.qty++;
    if(e.target.classList.contains('minus')) it.qty=Math.max(1,it.qty-1);
    if(e.target.classList.contains('remove')) cart=cart.filter(x=>x.id!==id);
    saveCart(); updateCartUI();
  });

  $('#clear-cart')?.addEventListener('click', ()=>{ cart=[]; saveCart(); updateCartUI(); });
  $('#checkout')?.addEventListener('click', ()=> showToast('Compra simulada ✔'));
  $('#close-cart')?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);
  btnCart?.addEventListener('click', openCart);

  document.body.addEventListener('click', e=>{
    const b=e.target.closest('.add-btn'); if(!b) return; addToCart(b.dataset.id);
  });

  /* Opiniones */
  const starsWrap=$('#stars'); let rating=0;
  const paint=n=>{ if(!starsWrap) return; [...starsWrap.children].forEach((s,i)=>s.classList.toggle('active',i<n)); };
  starsWrap?.addEventListener('click', e=>{
    const el=e.target.closest('span[data-val]'); if(!el) return;
    rating=Number(el.dataset.val); paint(rating); $('#r-help').textContent=`${rating} / 5`;
  });
  const rText=$('#r-text'); rText?.addEventListener('input',()=>$('#r-count').textContent=`${rText.value.length}/400`);
  const loadReviews=()=>JSON.parse(localStorage.getItem('viva_reviews')||'[]');
  const saveReviews=a=>localStorage.setItem('viva_reviews',JSON.stringify(a));

  const updateReviewSummary=()=>{
    const box=$('#rating-summary'), dist=$('#rating-distribution'); if(!box||!dist) return;
    const arr=loadReviews();
    if(arr.length===0){
      box.innerHTML=`<div class="big">—</div><div class="muted">Aún no hay reseñas.</div>`;
      dist.innerHTML=''; $('#reviews-list')&&( $('#reviews-list').innerHTML=`<p class="muted">Aún no hay reseñas.</p>` ); return;
    }
    const avg=arr.reduce((a,b)=>a+b.rating,0)/arr.length;
    box.innerHTML=`<div class="big">${avg.toFixed(1)}</div><div class="muted">${arr.length} reseñas</div>`;
    const bins=[0,0,0,0,0]; arr.forEach(r=>bins[r.rating-1]++);
    dist.innerHTML=[5,4,3,2,1].map(val=>{
      const c=bins[val-1], pct=(c/arr.length*100)||0;
      return `<div style="display:flex;align-items:center;gap:8px">
        <span>${val}★</span><div class="bar" style="flex:1"><i style="width:${pct}%"></i></div>
        <small class="muted" style="width:40px;text-align:right">${c}</small></div>`;
    }).join('');
    renderReviewList(arr);
  };

  const renderReviewList=arr=>{
    const wrap=$('#reviews-list'); if(!wrap) return;
    wrap.innerHTML=arr.slice().reverse().map(r=>`
      <article class="review-item">
        <div class="meta"><strong>${r.name||'Anónimo'}</strong>
          <span>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
          <small class="muted">${new Date(r.date).toLocaleDateString()}</small></div>
        <div class="body">${escapeHTML(r.text)}</div>
      </article>`).join('');
  };

  const escapeHTML=s=>s.replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));

  $('#review-form')?.addEventListener('submit', e=>{
    e.preventDefault();
    const name=$('#r-name')?.value?.trim();
    const text=rText?.value?.trim();
    if(!rating){ showToast('Selecciona una calificación'); return; }
    if(!text){ showToast('Escribe un comentario'); return; }
    const arr=loadReviews(); arr.push({name,rating,text,date:Date.now()}); saveReviews(arr);
    e.target.reset(); rating=0; paint(0); $('#r-help').textContent='Sin calificación'; $('#r-count').textContent='0/400';
    updateReviewSummary(); showToast('¡Gracias por tu reseña!');
  });

  /* Contacto */
  $('#contact-form')?.addEventListener('submit', e=>{
    e.preventDefault();
    const n=$('#c-name').value.trim(), m=$('#c-msg').value.trim();
    if(!n||!m){ showToast('Completa los campos requeridos'); return; }
    $('#contact-feedback').textContent='Mensaje enviado. Te responderemos pronto.';
    e.target.reset();
  });

  /* Init */
  renderProducts(); updateCartUI(); updateReviewSummary();

  // Scroll suave
  document.body.addEventListener('click', e=>{
    const a=e.target.closest('a[href^="#"]'); if(!a) return;
    const el=$(a.getAttribute('href')); if(!el) return; e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'});
  });
  // === Menú hamburguesa móvil ===
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
  });
}
});
