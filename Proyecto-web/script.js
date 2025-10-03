// Productos de streaming
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
  card.classList.add("product-card");
  card.innerHTML = `
    <h3>${p.name}</h3>
    <div class="price">$${p.price.toFixed(2)}</div>
    <button class="btn primary" data-id="${p.id}">Agregar</button>
  `;
  productsGrid.appendChild(card);
});

// Agregar al carrito
productsGrid.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const id = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
  }
});

// Actualizar carrito
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<span>${item.name}</span> <span>$${item.price.toFixed(2)}</span>`;
    cartItemsContainer.appendChild(div);
  });
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
  cartCountEl.textContent = cart.length;
}

// Toggle carrito
document.getElementById("cart-toggle").addEventListener("click", () => {
  cartPanel.classList.add("active");
});
document.getElementById("close-cart").addEventListener("click", () => {
  cartPanel.classList.remove("active");
});

// Checkout (simulado)
document.getElementById("checkout").addEventListener("click", () => {
  alert("Gracias por tu compra ✅\nEn breve recibirás tu cuenta en tu correo.");
  cart = [];
  updateCart();
  cartPanel.classList.remove("active");
});

// Formulario de contacto
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const result = document.getElementById("form-result");

  if (!name || !email || !message) {
    result.textContent = "⚠️ Por favor, completa todos los campos.";
    return;
  }
  result.textContent = "✅ Mensaje enviado correctamente. Te responderemos pronto.";
  contactForm.reset();
});

// Año dinámico
document.getElementById("year").textContent = new Date().getFullYear();
