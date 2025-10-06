/* ======================================
   VivaStore - Script principal
   ====================================== */

// Esperar a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("btn-cart");
  const cartBadge = document.getElementById("cart-badge");
  const buyButtons = document.querySelectorAll(".plan-card .btn");
  let cartCount = 0;

  // Simular agregar al carrito
  buyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      cartCount++;
      updateCartBadge();
      showNotification("Producto agregado al carrito 🛒");
    });
  });

  // Actualiza el número del carrito
  function updateCartBadge() {
    cartBadge.textContent = cartCount;
    cartBadge.classList.add("bounce");
    setTimeout(() => cartBadge.classList.remove("bounce"), 400);
  }

  // Animación visual tipo notificación
  function showNotification(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => toast.classList.remove("show"), 2500);
    setTimeout(() => toast.remove(), 3000);
  }

  // Acceso rápido al carrito (solo simulado)
  cartButton.addEventListener("click", () => {
    showNotification(`Tienes ${cartCount} item(s) en tu carrito.`);
  });
});

/* ======================================
   Efectos visuales adicionales
   ====================================== */

// Efecto suave al hacer scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
