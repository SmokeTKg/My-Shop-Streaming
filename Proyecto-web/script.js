// Datos de los planes
const plans = [
  { name: "Netflix Premium (1 mes)", desc: "Cuenta compartida segura", price: 5.99 },
  { name: "Spotify Premium (1 mes)", desc: "Cuenta sin anuncios", price: 3.99 },
  { name: "Disney+ (1 mes)", desc: "Contenido familiar", price: 4.99 },
  { name: "Amazon Prime Video (1 mes)", desc: "Incluye Prime benefits", price: 4.50 }
];

const plansContainer = document.getElementById("plans-container");
const cartModal = document.getElementById("cartModal");
const cartTotal = document.getElementById("cart-total");
const closeCart = document.getElementById("closeCart");
const whatsappBtn = document.getElementById("whatsappBtn");

let total = 0;

// Crear las tarjetas dinámicamente
plans.forEach(plan => {
  const card = document.createElement("div");
  card.classList.add("plan");
  card.innerHTML = `
    <h3>${plan.name}</h3>
    <p>${plan.desc}</p>
    <span class="price">$${plan.price.toFixed(2)}</span>
    <button>Agregar</button>
  `;
  const btn = card.querySelector("button");
  btn.addEventListener("click", () => addToCart(plan.price));
  plansContainer.appendChild(card);
});

function addToCart(price) {
  total += price;
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  cartModal.style.display = "flex";
}

closeCart.addEventListener("click", () => {
  cartModal.style.display = "none";
});

whatsappBtn.addEventListener("click", () => {
  const msg = `Hola, quiero pagar los servicios por un total de $${total.toFixed(2)}.`;
  const url = `https://wa.me/50400000000?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});
