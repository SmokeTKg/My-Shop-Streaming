let cart = [];
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const paymentSection = document.getElementById("paymentSection");

document.getElementById("cartToggle").addEventListener("click", () => {
  cartPanel.classList.toggle("active");
});

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
  cartPanel.classList.add("active");
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
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

function goToPayment() {
  cartPanel.classList.remove("active");
  paymentSection.classList.remove("hidden");
  window.scrollTo({ top: paymentSection.offsetTop, behavior: "smooth" });
}

function payWhatsApp() {
  const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  const message = encodeURIComponent(`Hola, quiero comprar: ${cart.map(i => i.name).join(", ")}. Total: $${total}`);
  window.open(`https://wa.me/573001112233?text=${message}`, "_blank");
}
