let cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const paymentMethods = document.getElementById("payment-methods");

document.querySelectorAll(".btn-add").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    cart.push({ name, price });
    updateCart();

    // Mostrar carrito automáticamente
    document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  updateCart();
});

document.getElementById("checkout").addEventListener("click", () => {
  if(cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  paymentMethods.classList.remove("hidden");
  paymentMethods.scrollIntoView({ behavior: "smooth" });
});

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = () => { removeItem(index); };
    
    li.appendChild(removeBtn);
    cartItems.appendChild(li);

    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.length;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}
