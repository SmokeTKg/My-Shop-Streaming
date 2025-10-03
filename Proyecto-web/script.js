// ===============================
// script.js — lógica de VivaStore
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cart-btn");
  const cartPanel = document.getElementById("cart-panel");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout");
  const paymentModal = document.getElementById("payment-modal");
  const closeModalBtn = document.getElementById("close-modal");

  let cart = [];

  // Abrir / cerrar carrito
  cartBtn.addEventListener("click", () => {
    cartPanel.classList.add("active");
  });
  closeCartBtn.addEventListener("click", () => {
    cartPanel.classList.remove("active");
  });

  // Agregar producto
  document.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      cart.push({ name, price });
      updateCart();
      cartPanel.classList.add("active");
    });
  });

  // Vaciar carrito
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCart();
  });

  // Procesar compra
  checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    paymentModal.classList.add("active");
  });
  closeModalBtn.addEventListener("click", () => {
    paymentModal.classList.remove("active");
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
        <div class="meta">${item.name} - $${item.price.toFixed(2)}</div>
        <button class="remove" data-index="${index}">Eliminar</button>
      `;
      cartItemsContainer.appendChild(div);
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Eliminar producto individual
    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        updateCart();
      });
    });
  }

  // Contacto (simulado)
  const contactForm = document.getElementById("contact-form");
  const result = document.querySelector(".form-result");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    result.textContent = "✅ Gracias por tu mensaje. Te responderemos pronto.";
    contactForm.reset();
  });
});
