/* VivaStore — funcionalidades globales (Productos, Carrito, Reseñas, Contacto) */
const PRODUCTS = [
  { id:'netflix',  name:'Netflix Premium 1 mes',  price: 6.99, img:'https://images.unsplash.com/photo-1589405858862-2ac9cbb41321?w=800&q=80&auto=format&fit=crop' },
  { id:'spotify',  name:'Spotify Premium 1 mes',  price: 3.49, img:'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop' },
  { id:'disney',   name:'Disney+ 1 mes',          price: 5.49, img:'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80&auto=format&fit=crop' },
  { id:'hbo',      name:'HBO Max 1 mes',          price: 6.49, img:'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800&q=80&auto=format&fit=crop' },
  { id:'prime',    name:'Prime Video 1 mes',      price: 5.99, img:'https://images.unsplash.com/photo-1520975682031-6cf9f3cbd76b?w=800&q=80&auto=format&fit=crop' },
  { id:'paramount',name:'Paramount+ 1 mes',       price: 4.99, img:'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80&auto=format&fit=crop' },
  { id:'vix',      name:'ViX Premium 1 mes',      price: 3.99, img:'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80&auto=format&fit=crop' },
];

/* Moneda simple por país */
const CURMAP={HN:{code:'HNL',symbol:'L',rate:24.5},MX:{code:'MXN',symbol:'$',rate:18},US:{code:'USD',symbol:'$',rate:1},ES:{code:'EUR',symbol:'€',rate:.92},AR:{code:'ARS',symbol:'$',rate:980},CO:{code:'COP',symbol:'$',rate:3920},CL:{code:'CLP',symbol:'$',rate:940},PE:{code:'PEN',symbol:'S/',rate:3.7},EC:{code:'USD',symbol:'$',rate:1},DO:{code:'DOP',symbol:'RD$',rate:59},NI:{code:'NIO',symbol:'C$',rate:36.5},GT:{code:'GTQ',symbol:'Q',rate:7.8},SV:{code:'USD',symbol:'$',rate:1},CR:{code:'CRC',symbol:'₡',rate:510},UY:{code:'UYU',symbol:'$U',rate:39},PY:{code:'PYG',symbol:'₲',rate:7600},BO:{code:'BOB',symbol:'Bs',rate:6.9},VE:{code:'VES',symbol:'Bs.',rate:36}};
function detectCur(){const l=(navigator.language||'es-US').toUpperCase();const r=l.split('-')[1]||'US';return CURMAP[r]||CURMAP.US}
const CUR=detectCur();
const fmt=(n)=>new Intl.NumberFormat(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}).format(n);
const price=(usd)=>`${CUR.symbol}${fmt(usd*CUR.rate)}`;

/* Carrito */
const STORE='vivastore_cart_v1';
let cart=JSON.parse(localStorage.getItem(STORE)||'[]');
const save=()=>localStorage.setItem(STORE,JSON.stringify(cart));
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const toast=(m)=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);};

/* Render de productos (solo en home) */
function renderProducts(){
  const grid=$('#products-grid'); if(!grid) return;
  grid.innerHTML=PRODUCTS.map(p=>`
    <article class="card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Acceso premium por 30 días. Entrega rápida y soporte.</p>
      <div class="price">${price(p.price)}</div>
      <button class="btn add-btn" data-id="${p.id}">Agregar</button>
    </article>`).join('');
}

/* Panel de carrito */
const overlay=$('#overlay'), panel=$('#cart-panel'), badge=$('#cart-badge');
const itemsBox=$('#cart-items'), totalBox=$('#cart-total');
const openCart=()=>{panel?.classList.add('open');overlay?.classList.add('show');panel?.setAttribute('aria-hidden','false');};
const closeCart=()=>{panel?.classList.remove('open');overlay?.classList.remove('show');panel?.setAttribute('aria-hidden','true');};
const cartTotalUSD=()=>cart.reduce((s,it)=>{const p=PRODUCTS.find(x=>x.id===it.id);return s+(p?p.price*it.qty:0)},0);
function updateCartUI(){
  badge && (badge.textContent = cart.reduce((n,i)=>n+i.qty,0));
  if(!itemsBox||!totalBox) return;
  if(cart.length===0){itemsBox.innerHTML=`<p style="color:#b9bbbe;text-align:center;padding:12px">Tu carrito está vacío.</p>`;totalBox.textContent='—';return;}
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
      </div>`;}).join('');
  totalBox.textContent=price(cartTotalUSD());
}
function addToCart(id){const f=cart.find(i=>i.id===id);if(f)f.qty++;else cart.push({id,qty:1});save();updateCartUI();}

/* Opiniones */
const REV_KEY='vivastore_reviews_v1';
const getReviews=()=>JSON.parse(localStorage.getItem(REV_KEY)||'[]');
const setReviews=(a)=>localStorage.setItem(REV_KEY,JSON.stringify(a));

function renderReviews(){
  const list=$('#reviews-list'); if(!list) return;
  const arr=getReviews();
  if(!arr.length){list.innerHTML=`<p style="color:#b9bbbe;text-align:center">Aún no hay reseñas.</p>`;return;}
  list.innerHTML=arr.slice().reverse().map(r=>{
    const name=r.name?.trim()||'Usuario';
    const letter=name.charAt(0).toUpperCase();
    const hue=((name.length*47)%360);
    const date=new Date(r.date||Date.now()).toLocaleDateString();
    return `
      <article class="review-card">
        <div class="rev-head">
          <div class="avatar" style="background:hsl(${hue} 85% 72%)">${letter}</div>
          <div>
            <div class="rev-name">${name}</div>
            <div class="rev-stars">${'★'.repeat(r.rating)}</div>
          </div>
          <div style="margin-left:auto" class="rev-date">${date}</div>
        </div>
        <p>${r.text}</p>
      </article>`}).join('');
}

function renderRatingSummary(){
  const arr=getReviews();
  const sum=arr.reduce((a,b)=>a+(+b.rating||0),0);
  const avg=arr.length? (sum/arr.length) : 0;
  const summary=$('#rating-summary'); const dist=$('#rating-distribution');
  if(summary){
    summary.innerHTML=`
      <div class="avg">${avg?avg.toFixed(1):'—'}</div>
      <div class="stars-row">${'★'.repeat(Math.round(avg))}</div>
      <div class="count">${arr.length} reseña${arr.length===1?'':'s'}</div>`;
  }
  if(dist){
    const total=arr.length||1;
    dist.innerHTML=[5,4,3,2,1].map(n=>{
      const c=arr.filter(x=>+x.rating===n).length;
      const pct=Math.round((c/total)*100);
      return `<div class="dist-row">
        <small>${n}★</small>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <small>${pct}%</small>
      </div>`}).join('');
  }
}

/* Contacto */
function validateEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}

/* Init */
document.addEventListener('DOMContentLoaded',()=>{
  renderProducts(); updateCartUI(); renderReviews(); renderRatingSummary();

  $('#btn-cart')?.addEventListener('click',openCart);
  $('#close-cart')?.addEventListener('click',closeCart);
  $('#overlay')?.addEventListener('click',closeCart);

  $('#products-grid')?.addEventListener('click',e=>{
    const btn=e.target.closest('.add-btn'); if(!btn) return;
    addToCart(btn.dataset.id); btn.classList.add('clicked'); setTimeout(()=>btn.classList.remove('clicked'),200);
    toast('Producto agregado 🛒'); openCart();
  });
  $('#cart-items')?.addEventListener('click',e=>{
    const b=e.target.closest('button[data-act]'); if(!b) return;
    const id=b.dataset.id, act=b.dataset.act;
    const i=cart.findIndex(x=>x.id===id); if(i<0) return;
    if(act==='plus') cart[i].qty++;
    if(act==='minus') cart[i].qty>1?cart[i].qty--:cart.splice(i,1);
    if(act==='remove') cart.splice(i,1);
    save(); updateCartUI();
  });
  $('#clear-cart')?.addEventListener('click',()=>{ if(cart.length&&confirm('¿Vaciar carrito?')){cart=[];save();updateCartUI();} });
  $('#checkout')?.addEventListener('click',()=>{
    if(!cart.length) return toast('Tu carrito está vacío');
    alert(`¡Gracias! Total: ${price(cartTotalUSD())}\n(Ejemplo: integra tu checkout/WhatsApp aquí)`); cart=[]; save(); updateCartUI(); closeCart();
  });

  /* Estrellas + contador (solo en home) */
  let rating=0; const stars=$$('#stars span'); const help=$('#r-help');
  const labels={0:'Sin calificación',1:'Muy malo',2:'Regular',3:'Bien',4:'Muy bien',5:'Excelente'};
  const paint=(n)=>stars.forEach(s=>s.classList.toggle('active',+s.dataset.val<=n));
  const setHelp=(n)=>{ if(help) help.textContent=labels[n]||labels[0]; }
  stars.forEach(s=>{
    s.addEventListener('mouseenter',()=>{paint(+s.dataset.val);setHelp(+s.dataset.val);});
    s.addEventListener('mouseleave',()=>{paint(rating);setHelp(rating);});
    s.addEventListener('click',()=>{rating=+s.dataset.val;paint(rating);setHelp(rating);});
  });
  const t=$('#r-text'), cnt=$('#r-count');
  t?.addEventListener('input',()=>{ if(cnt) cnt.textContent=`${t.value.length}/400`; });

  $('#review-form')?.addEventListener('submit',e=>{
    e.preventDefault();
    if(!rating) return toast('Selecciona estrellas ⭐');
    const name=$('#r-name').value;
    const text=$('#r-text').value.trim(); if(!text) return;
    const arr=getReviews(); arr.push({name, text, rating, date: Date.now()});
    setReviews(arr);
    $('#r-text').value=''; $('#r-name').value=''; rating=0; paint(0); setHelp(0); if(cnt) cnt.textContent='0/400';
    renderReviews(); renderRatingSummary(); toast('¡Gracias por tu reseña!');
  });

  /* Form de contacto (solo en contacto.html) */
  const cform=$('#contact-form');
  if(cform){
    cform.addEventListener('submit',e=>{
      e.preventDefault();
      const name=$('#c-name').value.trim();
      const email=$('#c-email').value.trim();
      const msg=$('#c-msg').value.trim();
      if(!validateEmail(email)) return toast('Correo inválido');
      if(!name || !msg) return toast('Completa los campos requeridos');
      $('#contact-feedback').textContent='✅ Mensaje enviado. Te responderemos pronto.';
      cform.reset(); toast('Mensaje enviado ✅');
    });
  }
});
