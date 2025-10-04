// VivaStore - script.js (funcionalidad completa)
// Cambia el número de WhatsApp abajo a tu número (sin +, con código de país): ejemplo "5215512345678"
const WHATSAPP_NUMBER = "50499999999";

document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: 'Netflix Premium (1 mes)', price: 5.99, desc: 'Cuenta compartida segura' },
    { id: 2, name: 'Spotify Premium (1 mes)', price: 3.99, desc: 'Cuenta sin anuncios' },
    { id: 3, name: 'Disney+ (1 mes)', price: 4.99, desc: 'Contenido familiar' },
    { id: 4, name: 'Amazon Prime Video (1 mes)', price: 4.50, desc: 'Incluye Prime benefits' }
  ];

  // Elementos
  const productsGrid = document.getElementById('products-grid');
  const cartBtn = document.getElementById('btn-cart');
  const cartPanel = document.getElementById('cart-panel');
  const cartClose = document.getElementById('cart-close');
  const cartItemsEl = document.getElementById('cart-items');
  const cartBadge = document.getElementById('cart-badge');
  const cartTotalEl = document.getElementById('cart-total');
  const cartClearBtn = document.getElementById('cart-clear');
  const cartCheckoutBtn = document.getElementById('cart-checkout');

  const paymentModal = document.getElementById('payment-modal');
  const payTotalEl = document.getElementById('pay-total');
  const whatsappPay = document.getElementById('whatsapp-pay');
  const paymentClose = document.getElementById('payment-close');

  const contactForm = document.getElementById('contact-form');
  const contactResult = document.getElementById('contact-result');
  const yearEl = document.getElementById('year');

  let cart = JSON.parse(localStorage.getItem('viva_cart') || '[]');

  // RENDER PRODUCTS
  function renderProducts() {
    productsGrid.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <h3>${escapeHtml(p.name)}</h3>
        <div class="desc" style="color:var(--muted);font-size:0.95rem;margin-bottom:0.6rem">${escapeHtml(p.desc)}</div>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="actions">
          <button class="btn btn-card btn-add" data-id="${p.id}">Agregar</button>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  // ESCAPE helper (XSS safe)
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // CART functions
  function saveCart(){ localStorage.setItem('viva_cart', JSON.stringify(cart)); }
  function updateBadge(){ cartBadge.textContent = cart.reduce((s,i)=>s+i.qty,0); }

  function renderCart() {
    cartItemsEl.innerHTML = '';
    if(cart.length === 0){
      cartItemsEl.innerHTML = '<p style="color:var(--muted);padding:0.6rem">Tu carrito está vacío.</p>';
      cartTotalEl.textContent = '$0.00';
      updateBadge();
      saveCart();
      return;
    }

    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.qty;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="meta">
          <div style="font-weight:600">${escapeHtml(item.name)}</div>
          <div style="color:var(--muted);font-size:0.9rem">$${item.price.toFixed(2)} × ${item.qty}</div>
        </div>
        <div class="controls">
          <button class="btn-ghost small" data-action="dec" data-index="${idx}">−</button>
          <button class="btn-ghost small" data-action="inc" data-index="${idx}">+</button>
          <button class="remove" data-index="${idx}">Eliminar</button>
        </div>
      `;
      cartItemsEl.appendChild(row);
    });
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
    updateBadge();
    saveCart();
  }

  // Add item
  function addToCart(id){
    const p = products.find(x => x.id === Number(id));
    if(!p) return;
    const exists = cart.find(it => it.id === p.id);
    if(exists) exists.qty++;
    else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
    renderCart();
    openCart();
  }

  // Remove or change qty
  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target;
    const idx = btn.dataset.index;
    if(!idx) return;
    if(btn.dataset.action === 'dec'){
      cart[idx].qty--;
      if(cart[idx].qty <= 0) cart.splice(idx,1);
      renderCart();
    } else if(btn.dataset.action === 'inc'){
      cart[idx].qty++;
      renderCart();
    } else if(btn.classList.contains('remove')){
      cart.splice(idx,1);
      renderCart();
    }
  });

  // Delegation for add buttons
  productsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add');
    if(!btn) return;
    addToCart(btn.dataset.id);
  });

  // OPEN / CLOSE cart
  function openCart(){ cartPanel.classList.add('open'); cartPanel.setAttribute('aria-hidden','false'); }
  function closeCartFn(){ cartPanel.classList.remove('open'); cartPanel.setAttribute('aria-hidden','true'); }
  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCartFn);

  // Clear cart
  cartClearBtn.addEventListener('click', () => {
    cart = [];
    renderCart();
  });

  // Checkout -> show payment modal
  cartCheckoutBtn.addEventListener('click', () => {
    if(cart.length === 0){
      showToast('Tu carrito está vacío.');
      return;
    }
    const total = cart.reduce((s,i) => s + i.price * i.qty, 0).toFixed(2);
    payTotalEl.textContent = `$${total}`;

    // prepare WhatsApp link
    const msg = encodeURIComponent(`Hola 👋, quiero comprar: ${cart.map(i=>`${i.qty}x ${i.name}`).join(', ')}. Total: $${total}`);
    whatsappPay.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

    // open modal
    paymentModal.classList.add('active');
    paymentModal.setAttribute('aria-hidden','false');
  });

  // close modal
  paymentClose.addEventListener('click', () => {
    paymentModal.classList.remove('active');
    paymentModal.setAttribute('aria-hidden','true');
  });

  // click outside modal to close
  paymentModal.addEventListener('click', (e) => {
    if(e.target === paymentModal){
      paymentModal.classList.remove('active');
      paymentModal.setAttribute('aria-hidden','true');
    }
  });

  // contact form
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    if(name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 6){
      contactResult.style.color = '#ffcccb';
      contactResult.textContent = 'Por favor completa correctamente los campos.';
      return;
    }
    contactResult.style.color = '#9ef7b5';
    contactResult.textContent = '¡Mensaje enviado! Te responderemos pronto.';
    contactForm.reset();
  });

  // small toast (using page top)
  function showToast(msg){
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed'; t.style.top = '18px'; t.style.left = '50%';
    t.style.transform = 'translateX(-50%)'; t.style.background = '#222';
    t.style.padding = '10px 16px'; t.style.borderRadius = '10px'; t.style.zIndex = 3000;
    document.body.appendChild(t); setTimeout(()=>t.remove(),2200);
  }

  // INITIALIZE
  function init(){
    renderProducts();
    renderCart();
    yearEl.textContent = new Date().getFullYear();
  }

  init();
});
