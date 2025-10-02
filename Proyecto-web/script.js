// === VARIABLES ===
const cartBtn = document.getElementById("cartBtn");
const cart = document.getElementById("cart");
const cartItemsContainer = document.querySelector(".cart-items");
const closeCartBtn = document.getElementById("closeCart");
const totalElement = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

let cartItems = [];

// === ABRIR / CERRAR CARRITO ===
cartBtn.addEventListener("click", () => {
  cart.classList.toggle("open");
});

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", () => {
    cart.classList.remove("open");
  });
}

// === AÑADIR AL CARRITO ===
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = {
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price),
    };

    cartItems.push(product);
    renderCart();
  });
});

// === RENDERIZAR CARRITO ===
function renderCart() {
  cartItemsContainer.innerHTML = "";

  let total = 0;
  cartItems.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name}</span>
      <span>$${item.price.toFixed(2)}</span>
      <button onclick="removeFromCart(${index})">x</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  totalElement.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = cartItems.length;
}

// === ELIMINAR ITEM DEL CARRITO ===
function removeFromCart(index) {
  cartItems.splice(index, 1);
  renderCart();
}

// === VACIAR CARRITO ===
document.getElementById("clearCart")?.addEventListener("click", () => {
  cartItems = [];
  renderCart();
});

// === FINALIZAR COMPRA ===
document.getElementById("checkout")?.addEventListener("click", () => {
  if (cartItems.length === 0) {
    alert("Tu carrito está vacío 😅");
    return;
  }
  alert("✅ Gracias por tu compra 🎉 Nos pondremos en contacto contigo.");
  cartItems = [];
  renderCart();
});

// === ANIMACIÓN DE SCROLL (Fade-in en productos) ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".card").forEach(card => {
  observer.observe(card);
});
