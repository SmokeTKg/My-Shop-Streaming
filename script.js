/* ======================================
   VivaStore — lógica principal
   ====================================== */

// ---------- Productos base (USD) ----------
const PRODUCTS = [
  { id:'netflix',  name:'Netflix Premium 1 mes',  price: 6.99, img:'https://images.unsplash.com/photo-1589405858862-2ac9cbb41321?w=800&q=80&auto=format&fit=crop' },
  { id:'spotify',  name:'Spotify Premium 1 mes',  price: 3.49, img:'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop' },
  { id:'disney',   name:'Disney+ 1 mes',         price: 5.49, img:'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80&auto=format&fit=crop' },
  { id:'hbo',      name:'HBO Max 1 mes',         price: 6.49, img:'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800&q=80&auto=format&fit=crop' },
  { id:'prime',    name:'Prime Video 1 mes',     price: 5.99, img:'https://images.unsplash.com/photo-1520975682031-6cf9f3cbd76b?w=800&q=80&auto=format&fit=crop' },
  { id:'paramount',name:'Paramount+ 1 mes',      price: 4.99, img:'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80&auto=format&fit=crop' },
  { id:'vix',      name:'ViX Premium 1 mes',     price: 3.99, img:'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80&auto=format&fit=crop' },
];

// ---------- Moneda por país (aprox) ----------
const CURRENCY_MAP = {
  HN:{code:'HNL', symbol:'L',  rate:24.5}, MX:{code:'MXN',symbol:'$' ,rate:18},
  US:{code:'USD', symbol:'$',  rate:1},    ES:{code:'EUR',symbol:'€' ,rate:0.92},
  AR:{code:'ARS', symbol:'$' , rate:980},  CO:{code:'COP',symbol:'$' ,rate:3920},
  CL:{code:'CLP', symbol:'$' , rate:940},  PE:{code:'PEN',symbol:'S/',rate:3.7},
  EC:{code:'USD', symbol:'$',  rate:1},    DO:{code:'DOP',symbol:'RD$',rate:59},
  NI:{code:'NIO', symbol:'C$', rate:36.5}, GT:{code:'GTQ',symbol:'Q', rate:7.8},
  SV:{code:'USD', symbol:'$',  rate:1},    CR:{code:'CRC',symbol:'₡', rate:510},
  UY:{code:'UYU', symbol:'$U', rate:39},   PY:{code:'PYG',symbol:'₲', rate:7600},
  BO:{code:'BOB', symbol:'Bs', rate:6.9},  VE:{code:'VES',symbol:'Bs.',rate:36},
};
function detectCurrency(){
  const loc=(navigator.language||'es-US').toUpperCase();
  const region=loc.split('-')[1]||'US';
  return CURRENCY_MAP[region]||CURRENCY_MAP['US'];
}
const CUR = detectCurrency();
const fmtN = (n)=> new Intl.NumberFormat(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}).format(n);
const priceLabel = (usd)=> `${CUR.symbol}${fmtN(usd*CUR.rate)}`;

// ---------- Estado del carrito ----------
const STORAGE = 'vivastore_cart_v1';
let cart = JSON.parse(localStorage.getItem(STORAGE) || '[]'); // [{id,qty}]
const save = ()=> localStorage.setItem(STORAGE, JSON.stringify(cart));

// ---------- Helpers UI ----------
const $ = (s, r=document)=> r.querySelector(s);
const $$= (s, r=document)=> [...r.querySelectorAll(s)];
const toast = (msg)=>{
  const el = $('#toast'); if(!el) return;
  el.textContent = msg; el.classList.add('show');
  setTimeout(()=> el.classList.remove('show'), 2200);
};

// ---------- Render de productos ----------
function renderProducts(){
  const grid = $('#products-grid');
  grid.innerHTML = PRODUCTS.map(p=>`
    <article class="card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Acceso premium por 30 días. Entrega rápida y soporte.</p>
      <div class="price">${priceLabel(p.price)}</div>
      <button class="btn add-btn" data-id="${p.id}">Agregar</button>
    </article>
  `).join('');
}

// ---------- Carrito UI ----------
const overlay   = $('#overlay');
const panel     = $('#cart-panel');
const badge     = $('#cart-badge');
const itemsBox  = $('#cart-items');
const totalBox  = $('#cart-total');

const openCart = ()=>{ panel.classList.add('open'); overlay.classList.add('show'); panel.setAttribute('aria-hidden','false'); };
const closeCart= ()=>{ panel.classList.remove('open'); overlay.classList.remove('show'); panel.setAttribute('aria-hidden','true'); };

function updateCartUI(){
  const count = cart.reduce((n,i)=> n+i.qty, 0);
  badge.textContent = count;

  if(cart.length===0){
    itemsBox.innerHTML = `<p style="color:#b9bbbe;text-align:center;padding:12px">Tu carrito está vacío.</p>`;
    totalBox.textContent = '—';
    return;
  }

  itemsBox.innerHTML = cart.map(it=>{
    const p = PRODUCTS.find(x=>x.id===it.id);
    const lineUSD = p.price * it.qty;
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <div class="meta">${it.qty} × ${priceLabel(p.price)}</div>
        </div>
        <div class="mini">
          <button class="btn-ghost" data-act="minus"  data-id="${p.id}" title="Quitar 1">−</button>
          <button class="btn-ghost" data-act="plus"   data-id="${p.id}" title="Agregar 1">+</button>
          <button class="btn-ghost" data-act="remove" data-id="${p.id}" title="Eliminar">❌</button>
        </div>
      </div>
    `;
  }).join('');

  const totalUSD = cart.reduce((acc,it)=>{
    const p=PRODUCTS.find(x=>x.id===it.id); return acc+(p?p.price*it.qty:0);
  },0);
  totalBox.textContent = priceLabel(totalUSD);
}

function addToCart(id){
  const found = cart.find(i=>i.id===id);
  if(found) found.qty+=1; else cart.push({id, qty:1});
  save(); updateCartUI();
}

// ---------- Eventos ----------
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts(); updateCartUI();

  // Header efecto
  window.addEventListener('scroll', ()=>{
    const h = $('.site-header');
    if(window.scrollY>20) h.classList.add('scrolled'); else h.classList.remove('scrolled');
  });

  // Abrir/ cerrar carrito
  $('#btn-cart')?.addEventListener('click', openCart);
  $('#close-cart')?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);

  // Click en productos (Agregar)
  $('#products-grid').addEventListener('click', (e)=>{
    const btn = e.target.closest('.add-btn'); if(!btn) return;
    const id = btn.dataset.id;
    addToCart(id);
    // feedback: gris -> rojo breve
    btn.classList.add('clicked');
    setTimeout(()=> btn.classList.remove('clicked'), 250);
    toast('Producto agregado 🛒');
    openCart();
  });

  // Clicks en carrito
  itemsBox.addEventListener('click', (e)=>{
    const b = e.target.closest('button[data-act]'); if(!b) return;
    const id = b.dataset.id; const act = b.dataset.act;
    const idx = cart.findIndex(i=>i.id===id);
    if(idx<0) return;
    if(act==='plus'){ cart[idx].qty++; }
    if(act==='minus'){ cart[idx].qty>1? cart[idx].qty-- : cart.splice(idx,1); }
    if(act==='remove'){ cart.splice(idx,1); }
    save(); updateCartUI();
  });

  $('#clear-cart').addEventListener('click', ()=>{
    if(cart.length===0) return;
    if(confirm('¿Vaciar carrito?')){ cart=[]; save(); updateCartUI(); }
  });

  $('#checkout').addEventListener('click', ()=>{
    if(cart.length===0) return toast('Tu carrito está vacío');
    const total = totalBox.textContent;
    alert(`¡Gracias por tu compra! Total: ${total}\n(Ejemplo: aquí integras tu checkout o WhatsApp).`);
    cart=[]; save(); updateCartUI(); closeCart();
  });

  // Contacto
  const contact = $('#contact-form');
  if(contact){
    contact.addEventListener('submit', e=>{
      e.preventDefault();
      $('#contact-feedback').textContent = '✅ Mensaje enviado. Te responderemos pronto.';
      contact.reset();
      toast('Mensaje enviado ✅');
    });
  }

  // Reseñas
  let rating=0;
  const starEls = $$('#stars span');
  starEls.forEach(s=> s.addEventListener('click', ()=>{
    rating = Number(s.dataset.val);
    starEls.forEach(x=> x.classList.toggle('active', Number(x.dataset.val)<=rating));
  }));

  const REV_KEY='vivastore_reviews_v1';
  const reviewsBox = $('#reviews-list');
  const renderReviews = ()=>{
    const reviews = JSON.parse(localStorage.getItem(REV_KEY)||'[]');
    reviewsBox.innerHTML = reviews.length
      ? reviews.map(r=>`
          <div class="review">
            <div class="smini">${'★'.repeat(r.rating)}</div>
            <p>${r.text}</p>
            <small style="color:#8e90a1">— ${new Date(r.date).toLocaleString()}</small>
          </div>`).join('')
      : `<p style="color:#b9bbbe;text-align:center">Aún no hay reseñas.</p>`;
  };
  renderReviews();

  $('#review-form').addEventListener('submit', e=>{
    e.preventDefault();
    if(!rating){ toast('Selecciona estrellas ⭐'); return; }
    const text = $('#r-text').value.trim();
    if(!text) return;
    const data = JSON.parse(localStorage.getItem(REV_KEY)||'[]');
    data.push({rating, text, date: Date.now()});
    localStorage.setItem(REV_KEY, JSON.stringify(data));
    $('#r-text').value=''; rating=0; starEls.forEach(x=>x.classList.remove('active'));
    renderReviews(); toast('¡Gracias por tu reseña!');
  });
});
