let cart = [];
let total = 0;

function addToCart(product, price) {
  cart.push({ product, price });
  total += price;
  updateCart();
  document.getElementById('cart').classList.remove('hidden'); // mostrar carrito
}

function updateCart() {
  let cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    let li = document.createElement('li');
    li.textContent = `${item.product} - $${item.price.toFixed(2)}`;
    cartItems.appendChild(li);
  });
  document.getElementById('total').textContent = `Total: $${total.toFixed(2)}`;
  document.getElementById('cart-count').textContent = cart.length;
}

function clearCart() {
  cart = [];
  total = 0;
  updateCart();
  document.getElementById('cart').classList.add('hidden'); // ocultar carrito vacío
}

function showPayment() {
  document.getElementById('payment-methods').classList.remove('hidden');
}
