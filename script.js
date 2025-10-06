/* ======================================
   VivaStore - Eneba-like shop
   ====================================== */

// ---- Productos base (USD) ----
const PRODUCTS = [
  { id: 'netflix',  name: 'Netflix Premium 1 mes',  price: 6.99,  img: 'https://images.unsplash.com/photo-1589405858862-2ac9cbb41321?q=80&w=800&auto=format&fit=crop' },
  { id: 'spotify',  name: 'Spotify Premium 1 mes',  price: 3.49,  img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop' },
  { id: 'disney',   name: 'Disney+ 1 mes',         price: 5.49,  img: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?q=80&w=800&auto=format&fit=crop' },
  { id: 'hbo',      name: 'HBO Max 1 mes',         price: 6.49,  img: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=800&auto=format&fit=crop' },
  { id: 'prime',    name: 'Prime Video 1 mes',     price: 5.99,  img: 'https://images.unsplash.com/photo-1520975682031-6cf9f3cbd76b?q=80&w=800&auto=format&fit=crop' },
  { id: 'paramount',name: 'Paramount+ 1 mes',      price: 4.99,  img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop' },
  { id: 'vix',      name: 'ViX Premium 1 mes',     price: 3.99,  img: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=800&auto=format&fit=crop' },
];

// ---- Detección de moneda por país (aprox) ----
// Tomamos el país desde navigator.language (ej: "es-HN").
// Mapeamos a moneda y a un factor de conversión (tasas simples para demo).
const CURRENCY_MAP = {
  HN: { code: 'HNL', symbol: 'L',  rate: 24.5 },   // Honduras
  MX: { code: 'MXN', symbol: '$',  rate: 18.0 },
  US: { code: 'USD', symbol: '$',  rate: 1 },
  ES: { code: 'EUR', symbol: '€',  rate: 0.92 },
  AR: { code: 'ARS', symbol: '$',  rate: 980 },    // Aproximado
  CO: { code: 'COP', symbol: '$',  rate: 3920 },
  CL: { code: 'CLP', symbol: '$',  rate: 940 },
  PE: { code: 'PEN', symbol: 'S/', rate: 3.7 },
  EC: { code: 'USD', symbol: '$',  rate: 1 },
  DO: { code: 'DOP', symbol: 'RD$',rate: 59 },
  NI: { code: 'NIO', symbol: 'C$', rate: 36.5 },
  GT: { code: 'GTQ', symbol: 'Q',  rate: 7.8 },
  SV: { code: 'USD', symbol: '$',  rate: 1 },
  CR: { code: 'CRC', symbol: '₡',  rate: 510 },
  UY: { code: 'UYU', symbol: '$',  rate: 39 },
  PY: { code: 'PYG', symbol: '₲',  rate: 7600 },
  BO: { code: 'BOB', symbol: 'Bs', rate: 6.9 },
  VE: { code: 'VES', symbol: 'Bs.',rate: 36 },
};

function detectCurrency() {
  const locale = (navigator.language || 'es-US').toUpperCase(); // p.ej. ES-HN
  const region = locale.split('-')[1] || 'US';
  return CURRENCY_MAP[region] || CURRENCY_MAP['US'];
}

const USER_CURRENCY = detectCurrency();

function fmt(amountUSD) {
  const converted = amountUSD * USER_CURRENCY.rate;
  // Mostramos monto redondeado agradable (2 decimales si es necesario)
  const opts = { minimumFractionDigits: 0, maximumFractionDigits: 2 };
  try {
    return new Intl.NumberFormat(undefined, opts).format(converted);
  } catch {
    return converted.toFixed(2);
  }
}
function priceLabel(usd) {
  return `${USER_CURRENCY.symbol}${fmt(usd)}`;
}

// ---- Estado del carrito (persistido) ----
const STORAGE_KEY = 'vivastore_cart_v1';
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); // [{id, qty}]

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// ---- Render de productos ----
function renderProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <div class="thumb">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <h3>${p.name}</h3>
      <p>Acceso premium por 30 días. Entrega rápida y soporte.</p>
      <div class="price">${priceLabel(p.price)}</div>
      <div class="actions">
        <button class="btn btn-ghost" data-id="${p.id}" data-action="view">Detalles</button>
        <button class="btn btn-primary" data-id="${p.id}" data-action="buy">Comprar</button>
      </div>
    </article>
  `).join('');
}

// ---- Carrito UI ----
const overlay   = document.getElementById('overlay');
const cartPanel = document.getElementById('cart-panel');
const closeBtn  = document.getElementById('close-cart');
const btnCart   = document.getElementById('btn-cart');
const badge     = document.getElementById('cart-badge');
const itemsBox  = document.getElementById('cart-items');
const totalBox  = document.getElementById('cart-total');
const clearBtn  = document.getElementById('clear-cart');
const checkout  = document.getElementById('checkout');
const toastEl   = document.getElementById('toast');

function openCart() {
  cartPanel.classList.add('open');
  overlay.classList.add('show');
  cartPanel.setAttribute('aria-hidden','false');
}
function closeCart() {
  cartPanel.classList.remove('open');
  overlay.classList.remove('show');
  cartPanel.setAttribute('aria-hidden','true');
}

function showToast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2200);
}

// Sumar un producto
function addToCart(id) {
  const found = cart.find(i => i.id === id);
  if (found) found.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateCartUI();
}

// Eliminar una unidad del item
function removeOne(id) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx >= 0) {
    if (cart[idx].qty > 1) cart[idx].qty -= 1;
    else cart.splice(idx, 1);
  }
  saveCart();
  updateCartUI();
}

// Eliminar totalmente el item
function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

function cartTotalUSD() {
  return cart.reduce((acc, it) => {
    const prod = PRODUCTS.find(p => p.id === it.id);
    return acc + (prod ? prod.price * it.qty : 0);
  }, 0);
}

function updateCartUI() {
  // Badge
  const count = cart.reduce((n, it) => n + it.qty, 0);
  badge.textContent = count;

  // Lista
  if (cart.length === 0) {
    itemsBox.innerHTML = `<p style="color:#b9bbbe; text-align:center; padding:18px;">Tu carrito está vacío.</p>`;
  } else {
    itemsBox.innerHTML = cart.map(it => {
      const p = PRODUCTS.find(x => x.id === it.id);
      const lineUSD = p.price * it.qty;
      return `
        <div class="cart-item">
          <img src="${p.img}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4>
            <div class="meta">${it.qty} × ${priceLabel(p.price)}</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
            <strong>${priceLabel(lineUSD)}</strong>
            <div style="display:flex; gap:6px;">
              <button class="btn-ghost" data-id="${p.id}" data-action="minus" title="Quitar 1">−</button>
              <button class="btn-ghost" data-id="${p.id}" data-action="plus" title="Agregar 1">+</button>
              <button class="remove" data-id="${p.id}" data-action="remove" title="Eliminar">❌</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Total
  totalBox.textContent = priceLabel(cartTotalUSD());
}

// ---- Listeners ----
document.addEventListener('DOMContentLoaded', () => {
  // Render inicial
  renderProducts();
  updateCartUI();

  // Efecto header on scroll
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // Abrir / cerrar carrito
  btnCart.addEventListener('click', openCart);
  closeBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  // Click en productos
  document.getElementById('products-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'buy') {
      addToCart(id);
      showToast('Producto agregado 🛒');
      openCart();
    } else if (action === 'view') {
      showToast('Detalles próximamente 😉');
    }
  });

  // Clicks en el carrito
  itemsBox.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'remove') removeItem(id);
    if (action === 'minus')  removeOne(id);
    if (action === 'plus')   addToCart(id);
  });

  clearBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    if (confirm('¿Vaciar carrito?')) {
      clearCart();
      showToast('Carrito vacío');
    }
  });

  checkout.addEventListener('click', () => {
    if (cart.length === 0) { showToast('Tu carrito está vacío'); return; }
    const totalUSD = cartTotalUSD();
    const totalText = priceLabel(totalUSD);
    showToast('Procesando compra…');
    // Aquí podrías redirigir a WhatsApp o a un checkout real:
    // window.location.href = `https://wa.me/<numero>?text=Compra%20${encodeURIComponent(totalText)}`;
    setTimeout(() => {
      alert(`¡Gracias por tu compra! Total: ${totalText}\n(Esto es una demo. Integra tu checkout aquí.)`);
      clearCart();
      closeCart();
    }, 600);
  });
});
