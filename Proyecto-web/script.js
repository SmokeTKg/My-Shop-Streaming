let cart = [];
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const paymentMethods = document.getElementById("paymentMethods");

document.getElementById("cartToggle").addEventListener("click", () => {
  cartPanel.classList.toggle("active");
});

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
  cartPanel.classList.add("active"); // abrir carrito al añadir
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    cartItems.innerHTML += `<li>${item.name} - $${item.price.toFixed(2)}</li>`;
  });
  cartCount.textContent = cart.length;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function emptyCart() {
  cart = [];
  updateCart();
}

function showPayment() {
  paymentMethods.style.display = "block";
}
