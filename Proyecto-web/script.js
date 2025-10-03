let cart = [];

const addCartButtons = document.querySelectorAll(".add-cart");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

if(addCartButtons){
  addCartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      cart.push({ name, price });
      renderCart();
    });
  });
}

function renderCart() {
  if(!cartItemsList) return;
  cartItemsList.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartItemsList.appendChild(li);
    total += item.price;
  });
  cartTotal.textContent = total.toFixed(2);
}

// Validación contacto
const form = document.getElementById("contact-form");
if(form){
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    if (!name || !email || !message) {
      alert("Por favor completa todos los campos.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Correo no válido.");
      return;
    }
    alert("¡Mensaje enviado con éxito!");
    form.reset();
  });
}

function validateEmail(email) {
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email);
}
