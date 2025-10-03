// Productos
const products = [
  { id: 1, name: "Netflix Premium (1 mes)", price: 5.99 },
  { id: 2, name: "Spotify Premium (1 mes)", price: 3.99 },
  { id: 3, name: "Disney+ (1 mes)", price: 4.99 },
  { id: 4, name: "Amazon Prime Video (1 mes)", price: 4.50 }
];

const productsGrid = document.getElementById("products-grid");
const cartPanel = document.getElementById("cart-panel");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");

let cart = [];

// Render productos
products.forEach(p => {
  const card = document.createElement("div");
  card.classList.add("product-card", "fade-in");
  card.innerHTML = `
    <h3>${p.name}</h3>
    <div class="price">$${p.price.toFixed(2)}</div>
    <button class="btn primary" data-id="${p.id}">Agregar</button>
  `;
  productsGrid.appendChild(card);
});

// Agregar producto
productsGrid.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const id = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
    cartPanel.classList.add("active"); // abre carrito automáticamente
  }
});

// Actualizar carrito
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name}</span>
      <span>$${item.price.toFixed(2)}</span>
      <button data-index="${index}">Eliminar</button>
    `;
    cartItemsContainer.appendChild(div);
  });
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
  cartCountEl.textContent = cart.length;
}

// Eliminar un producto
cartItemsContainer.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    updateCart();
  }
});

// Vaciar carrito
document.getElementById("empty-cart").addEventListener("click", () => {
  cart = [];
  updateCart();
});

// Toggle carrito
document.getElementById("cart-toggle").addEventListener("click", () => {
  cartPanel.classList.add("active");
});
document.getElementById("close-cart").addEventListener("click", () => {
  cartPanel.classList.remove("active");
});

// Checkout
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío 🛒");
    return;
  }
  alert("✅ Gracias por tu compra. Recibirás tus cuentas en tu correo.");
  cart = [];
  updateCart();
  cartPanel.classList.remove("active");
});

// Formulario
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const result = document.getElementById("form-result");
  result.textContent = "✅ Mensaje enviado correctamente. Te responderemos pronto.";
  contactForm.reset();
});

// Año dinámico
document.getElementById("year").textContent = new Date().getFullYear();

// Animaciones on-scroll
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// Animación inicial al cargar
window.addEventListener("load", () => {
  document.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible"));
});
