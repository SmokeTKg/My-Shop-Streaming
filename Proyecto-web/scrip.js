// CONFIGURA TU NÚMERO Y CORREO
const phoneForWhatsApp = "521234567890"; 
const sellerEmail = "tutienda@ejemplo.com"; 

// Moneda local
const userLocale = navigator.language || "es-ES"; 
let currency = "USD";
if (userLocale.includes("es-MX")) currency = "MXN";
else if (userLocale.includes("es-AR")) currency = "ARS";
else if (userLocale.includes("es-CO")) currency = "COP";
else if (userLocale.includes("es-CL")) currency = "CLP";
else if (userLocale.includes("es-PE")) currency = "PEN";
else if (userLocale.includes("es-HN")) currency = "HNL";
else if (userLocale.includes("es-ES")) currency = "EUR";

const formatter = new Intl.NumberFormat(userLocale, {
  style: "currency",
  currency: currency,
});

// Productos
const productos = [
  { id: 1, nombre: "Netflix HD 4K", precio: 10.99 },
  { id: 2, nombre: "Spotify Premium", precio: 7.99 },
  { id: 3, nombre: "Crunchyroll", precio: 6.99 },
  { id: 4, nombre: "Prime Video", precio: 6.99 },
  { id: 5, nombre: "HBO Max", precio: 5.99 },
  { id: 6, nombre: "Paramount Plus", precio: 4.99 },
  { id: 7, nombre: "Disney Plus", precio: 8.99 },
  { id: 8, nombre: "VIX", precio: 3.99 },
  { id: 8, nombre: "Youtube Premium", precio: 4.99 },
];

let carrito = {};

// Render catálogo
const catalogoEl = document.getElementById("catalogo");
if (catalogoEl) {
  catalogoEl.innerHTML = productos.map(p => `
    <div class="card">
      <h3>${p.nombre}</h3>
      <p>${formatter.format(p.precio)}</p>
      <button class="btn" onclick="addToCart(${p.id})">Añadir</button>
    </div>
  `).join("");
}

// Añadir al carrito
function addToCart(id) {
  carrito[id] = (carrito[id] || 0) + 1;
  updateCart();
  openCart();
}

// Actualizar carrito
function updateCart() {
  document.getElementById("cartCount").textContent = Object.values(carrito).reduce((a,b)=>a+b,0);
  const cartItemsEl = document.getElementById("cartItems");
  cartItemsEl.innerHTML = Object.entries(carrito).map(([id,c])=>{
    const p = productos.find(x=>x.id==id);
    return `
      <div class="flex-between">
        <span>${p.nombre} x${c}</span>
        <div>
          <b>${formatter.format(p.precio*c)}</b>
          <button class="remove-btn" onclick="removeItem(${id})">❌</button>
        </div>
      </div>
    `;
  }).join("") || `<p>Carrito vacío</p>`;

  const cartTotalEl = document.getElementById("cartTotal");
  if (cartTotalEl) {
    cartTotalEl.innerHTML = `<hr><div class="flex-between"><strong>Total:</strong><b>${formatter.format(total())}</b></div>`;
  }
}

// Calcular total
function total() {
  return Object.entries(carrito).reduce((acc,[id,c])=>{
    const p = productos.find(x=>x.id==id); 
    return acc + (p.precio*c);
  },0);
}

// Vaciar carrito
function vaciarCarrito() {
  carrito = {};
  updateCart();
}

// Eliminar un producto individual
function removeItem(id) {
  delete carrito[id];
  updateCart();
}

// Checkout WhatsApp
function checkoutWhatsApp() {
  if (!Object.keys(carrito).length) return alert("Carrito vacío");
  let msg = "Hola, quiero comprar:\n";
  Object.entries(carrito).forEach(([id,c])=>{
    const p = productos.find(x=>x.id==id);
    msg += `- ${p.nombre} x${c} (${formatter.format(p.precio*c)})\n`;
  });
  msg += `Total: ${formatter.format(total())}`;
  window.open(`https://wa.me/${phoneForWhatsApp}?text=${encodeURIComponent(msg)}`,"_blank");
}

// Checkout Email
function checkoutEmail() {
  if (!Object.keys(carrito).length) return alert("Carrito vacío");
  let body = "Pedido:\n";
  Object.entries(carrito).forEach(([id,c])=>{
    const p = productos.find(x=>x.id==id);
    body += `- ${p.nombre} x${c} (${formatter.format(p.precio*c)})\n`;
  });
  body += `\nTotal: ${formatter.format(total())}`;
  window.location.href = `mailto:${sellerEmail}?subject=Nuevo Pedido&body=${encodeURIComponent(body)}`;
}

// Panel carrito
const cartPanel = document.getElementById("cartPanel");
if (document.getElementById("cartBtn")) {
  document.getElementById("cartBtn").addEventListener("click", openCart);
}
function openCart(){ cartPanel.classList.remove("hidden"); }
function closeCart(){ cartPanel.classList.add("hidden"); }

/* ---------- OPINIONES ---------- */
const form = document.getElementById("opinionForm");
const lista = document.getElementById("listaOpiniones");

let opiniones = JSON.parse(localStorage.getItem("opiniones")) || [];
renderOpiniones();

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const puntuacion = document.getElementById("puntuacion").value;
    if (!nombre || !mensaje) return alert("Completa todos los campos");
    const nueva = { nombre, mensaje, puntuacion, fecha: new Date().toLocaleDateString() };
    opiniones.push(nueva);
    localStorage.setItem("opiniones", JSON.stringify(opiniones));
    form.reset();
    renderOpiniones();
  });
}

function renderOpiniones() {
  if (!lista) return;
  lista.innerHTML = opiniones.map(op => `
    <div class="opinion">
      <strong>${op.nombre}</strong> <small>(${op.fecha})</small>
      <p>${op.mensaje}</p>
      <div class="puntuacion">${"⭐".repeat(op.puntuacion)}</div>
    </div>
  `).join("");
}
