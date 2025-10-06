/* VivaStore — Minimal PRO (carrito con + / − y sin "1×$") */

/* ---------- Productos (USD) ---------- */
const PRODUCTS = [
  { id:'netflix',  name:'Netflix Premium 1 mes',  price: 6.99, img:'https://images.unsplash.com/photo-1589405858862-2ac9cbb41321?w=800&q=80&auto=format&fit=crop' },
  { id:'spotify',  name:'Spotify Premium 1 mes',  price: 3.49, img:'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop' },
  { id:'disney',   name:'Disney+ 1 mes',          price: 5.49, img:'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80&auto=format&fit=crop' },
  { id:'hbo',      name:'HBO Max 1 mes',          price: 6.49, img:'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800&q=80&auto=format&fit=crop' },
  { id:'prime',    name:'Prime Video 1 mes',      price: 5.99, img:'https://images.unsplash.com/photo-1520975682031-6cf9f3cbd76b?w=800&q=80&auto=format&fit=crop' },
  { id:'paramount',name:'Paramount+ 1 mes',       price: 4.99, img:'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80&auto=format&fit=crop' },
  { id:'vix',      name:'ViX Premium 1 mes',      price: 3.99, img:'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80&auto=format&fit=crop' },
];

/* ---------- Moneda por país (simple) ---------- */
const CURMAP={HN:{code:'HNL',symbol:'L',rate:24.5},MX:{code:'MXN',symbol:'$',rate:18},US:{code:'USD',symbol:'$',rate:1},ES:{code:'EUR',symbol:'€',rate:.92},AR:{code:'ARS',symbol:'$',rate:980},CO:{code:'COP',symbol:'$',rate:3920},CL:{code:'CLP',symbol:'$',rate:940},PE:{code:'PEN',symbol:'S/',rate:3.7},EC:{code:'USD',symbol:'$',rate:1},DO:{code:'DOP',symbol:'RD$',rate:59},NI:{code:'NIO',symbol:'C$',rate:36.5},GT:{code:'GTQ',symbol:'Q',rate:7.8},SV:{code:'USD',symbol:'$',rate:1},CR:{code:'CRC',symbol:'₡',rate:510},UY:{code:'UYU',symbol:'$U',rate:39},PY:{code:'PYG',symbol:'₲',rate:7600},BO:{code:'BOB',symbol:'Bs',rate:6.9},VE:{code:'VES',symbol:'Bs.',rate:36}};
function detectCur(){const l=(navigator.language||'es-US').toUpperCase();const r=l.split('-')[1]||'US';return CURMAP[r]||CURMAP.US}
const CUR=detectCur();
const fmt=(n)=>new Intl.NumberFormat(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}).format(n);
const price=(usd)=>`${CUR.symbol}${fmt(usd*CUR.rate)}`;

/* ---------- Estado del carrito ---------- */
const STORE='vivastore_cart_v1';
let cart=JSON.parse(localStorage.getItem(STORE)||'[]'); // [{id,qty}]
const save=()=>localStorage.setItem(STORE,JSON.stringify(cart));

/* ---------- Helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const toast=(m)=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);};

/* ---------- Render productos ---------- */
function renderProducts(){
  const grid=$('#products-grid'); if(!grid) return;
  grid.innerHTML=PRODUCTS.map(p=>`
    <article class="card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Acceso premium por 30 días. Entrega rápida y soporte.</p>
      <div class="price">${price(p.price)}</div>
      <button class="btn add-btn" data-id="${p.id}">Agregar</button>
    </article>
  `).join('');
}

/* ---------- Carrito UI ---------- */
const overlay=$('#overlay'), panel=$('#cart-panel'), badge=$('#cart-badge');
const itemsBox=$('#cart-items'), totalBox=$('#cart-total');

const openCart = ()=>{panel?.classList.add('open');overlay?.classList.add('show');panel?.setAttribute('aria-hidden','false');};
const closeCart= ()=>{panel?.classList.remove('open');overlay?.classList.remove('show');panel?.setAttribute('aria-hidden','true');};

function cartTotalUSD(){return cart.reduce((s,it)=>{const p=PRODUCTS.find(x=>x.id===it.id);return s+(p?p.price*it.qty:0)},0)}

function updateCartUI(){
  badge && (badge.textContent = cart.reduce((n,i)=>n+i.qty,0));

  if(!itemsBox||!totalBox) return;

  if(cart.length===0){
    itemsBox.innerHTML=`<p style="color:#b9bbbe;text-align:center;padding:12px">Tu carrito está vacío.</p>`;
    totalBox.textContent='—';
    return;
  }

  itemsBox.innerHTML=cart.map(it=>{
    const p=PRODUCTS.find(x=>x.id===it.id);
    return `
      <div class="cart-item">
        <div class="ci-main">
          <img class="ci-thumb" src="${p.img}" alt="${p.name}">
          <div class="ci-info">
            <h4>${p.name}</h4>
            <small class="ci-price">${price(p.price)} / mes</small>
          </div>
        </div>
        <div class="ci-controls">
          <button class="qty-btn" data-act="minus" data-id="${p.id}" aria-label="Quitar uno">−</button>
          <span class="qty-val">${it.qty}</span>
          <button class="qty-btn" data-act="plus" data-id="${p.id}" aria-label="Agregar uno">+</button>
          <button class="remove-btn" data-act="remove" data-id="${p.id}" aria-label="Eliminar">✕</button>
        </div>
      </div>`;
  }).join('');

  totalBox.textContent=price(cartTotalUSD());
}

function addToCart(id){
  const f=cart.find(i=>i.id===id);
  if(f) f.qty++; else cart.push({id,qty:1});
  save(); updateCartUI();
}

/* ---------- Eventos ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  renderProducts(); updateCartUI();

  $('#btn-cart')?.addEventListener('click',openCart);
  $('#close-cart')?.addEventListener('click',closeCart);
  overlay?.addEventListener('click',closeCart);

  $('#products-grid')?.addEventListener('click',e=>{
    const btn=e.target.closest('.add-btn'); if(!btn) return;
    addToCart(btn.dataset.id);
    btn.classList.add('clicked'); setTimeout(()=>btn.classList.remove('clicked'),220);
    toast('Producto agregado 🛒'); openCart();
  });

  itemsBox?.addEventListener('click',e=>{
    const b=e.target.closest('button[data-act]'); if(!b) return;
    const id=b.dataset.id, act=b.dataset.act;
    const i=cart.findIndex(x=>x.id===id); if(i<0) return;
    if(act==='plus'){cart[i].qty++;}
    if(act==='minus'){cart[i].qty>1?cart[i].qty--:cart.splice(i,1);}
    if(act==='remove'){cart.splice(i,1);}
    save(); updateCartUI();
  });

  $('#clear-cart')?.addEventListener('click',()=>{
    if(cart.length===0) return;
    if(confirm('¿Vaciar carrito?')){ cart=[]; save(); updateCartUI(); }
  });

  $('#checkout')?.addEventListener('click',()=>{
    if(cart.length===0) return toast('Tu carrito está vacío');
    const total=totalBox.textContent;
    alert(`¡Gracias por tu compra! Total: ${total}\n(Ejemplo: integra tu checkout/WhatsApp aquí)`);
    cart=[]; save(); updateCartUI(); closeCart();
  });

  // Contacto
  const cform=$('#contact-form');
  if(cform){
    cform.addEventListener('submit',e=>{
      e.preventDefault();
      $('#contact-feedback').textContent='✅ Mensaje enviado. Te responderemos pronto.';
      cform.reset(); toast('Mensaje enviado ✅');
    });
  }

  // Reseñas
  let rating=0; const stars=$$('#stars span'); const box=$('#reviews-list'); const KEY='vivastore_reviews_v1';
  const renderReviews=()=>{
    const arr=JSON.parse(localStorage.getItem(KEY)||'[]');
    box.innerHTML=arr.length?arr.map(r=>`
      <div class="review">
        <div class="smini">${'★'.repeat(r.rating)}</div>
        <p>${r.text}</p>
        <small style="color:#8e90a1">— ${new Date(r.date).toLocaleString()}</small>
      </div>`).join(''):`<p style="color:#b9bbbe;text-align:center">Aún no hay reseñas.</p>`;
  };
  stars.forEach(s=>s.addEventListener('click',()=>{rating=+s.dataset.val;stars.forEach(x=>x.classList.toggle('active',+x.dataset.val<=rating));}));
  $('#review-form')?.addEventListener('submit',e=>{
    e.preventDefault(); if(!rating) return toast('Selecciona estrellas ⭐');
    const txt=$('#r-text').value.trim(); if(!txt) return;
    const arr=JSON.parse(localStorage.getItem(KEY)||'[]'); arr.push({rating:rating,text:txt,date:Date.now()});
    localStorage.setItem(KEY,JSON.stringify(arr)); $('#r-text').value=''; rating=0; stars.forEach(x=>x.classList.remove('active'));
    renderReviews(); toast('¡Gracias por tu reseña!');
  });
  renderReviews();
});
