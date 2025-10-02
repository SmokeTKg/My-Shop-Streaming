const productos = [
  { id: 1, nombre: "Netflix HD 4K", precio: 10.99 },
  { id: 2, nombre: "Spotify Premium", precio: 7.99 },
  { id: 3, nombre: "Crunchyroll", precio: 6.99 },
  { id: 4, nombre: "Prime Video", precio: 8.99 },
  { id: 5, nombre: "Disney+", precio: 9.99 },
  { id: 6, nombre: "HBO Max", precio: 11.99 },
  { id: 7, nombre: "Apple TV+", precio: 5.99 },
  { id: 8, nombre: "Paramount+", precio: 7.50 }
];

let carrito = [];

const productosDiv = document.getElementById("productos");
const cartBtn = document.getElementById("cart-btn");
const carritoDiv = document.getElementById("carrito");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const vaciarCarrito = document.getElementById("vaciar-carrito");
const finalizarCompra = document.getElementById("finalizar-compra");
const metodosPago = document.getElementById("metodos-pago");

function renderProductos() {
  productosDiv.innerHTML = "";
  productos.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("producto");
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p class="precio">$${p.precio.toFixed(2)}</p>
      <button onclick="agregarAlCarrito(${p.id})">Añadir</button>
    `;
    productosDiv.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  actualizarCarrito();
  carritoDiv.classList.add("show");
}

function actualizarCarrito() {
  cartItems.innerHTML = "";
  let total = 0;
  carrito.forEach((p, i) => {
    total += p.precio;
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - $${p.precio.toFixed(2)}`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = carrito.length;
}

vaciarCarrito.addEventListener("click", () => {
  carrito = [];
  actualizarCarrito();
});

finalizarCompra.addEventListener("click", () => {
  metodosPago.style.display = "block";
});

cartBtn.addEventListener("click", () => {
  carritoDiv.classList.toggle("show");
});

renderProductos();
