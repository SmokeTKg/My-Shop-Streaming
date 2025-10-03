const cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const totalEl = document.getElementById("total");
const clearCartBtn = document.getElementById("clear-cart");

// Modal de pago
const paymentModal = document.getElementById("payment-modal");
const payTotal = document.getElementById("pay-total");
const whatsappPay = document.getElementById("whatsapp-pay");
const closePayment = document.getElementById("close-payment");

// Mostrar / ocultar carrito
cartBtn.addEventListener("click", () => cartSidebar.classList.add("active"));
closeCartBtn.addEventListener("click", () => cartSidebar.classList.remove("active"));

// Agregar productos
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    cart.push({ name, price });
    updateCart();
    cartSidebar.classList.add("active"); // mostrar carrito al agregar
  });
});

// Actualizar carrito
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)}
      <button class="remove-btn" data-index="${index}">Eliminar</button>
    `;
    cartItems.appendChild(li);
  });
  totalEl.textContent = `$${total.toFixed(2)}`;

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.dataset.index;
      cart.splice(i, 1);
      updateCart();
    });
  });
}

// Vaciar carrito
clearCartBtn.addEventListener("click", () => {
  cart.length = 0;
  updateCart();
});

// Checkout
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío 🛒");
    return;
  }

  let total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  payTotal.textContent = `$${total}`;

  // WhatsApp con mensaje automático
  let msg = encodeURIComponent(`Hola 👋 quiero comprar mis cuentas. Total: $${total}`);
  whatsappPay.href = `https://wa.me/50499999999?text=${msg}`; // <-- Cambia tu número aquí

  paymentModal.classList.add("active");
});

// Cerrar modal de pago
closePayment.addEventListener("click", () => {
  paymentModal.classList.remove("active");
});
