// ---- Productos ----
const PRODUCTS=[
 {id:'netflix',name:'Netflix Premium',price:6.99,img:'https://i.imgur.com/YYK8GxW.jpg'},
 {id:'spotify',name:'Spotify Premium',price:3.49,img:'https://i.imgur.com/NTkHMQg.jpg'},
 {id:'disney',name:'Disney+',price:5.49,img:'https://i.imgur.com/hjEc4FS.jpg'},
 {id:'hbo',name:'HBO Max',price:6.49,img:'https://i.imgur.com/Zt0XuwS.jpg'},
 {id:'prime',name:'Prime Video',price:5.99,img:'https://i.imgur.com/Gh8WdxN.jpg'},
 {id:'paramount',name:'Paramount+',price:4.99,img:'https://i.imgur.com/7hNRcMA.jpg'},
 {id:'vix',name:'ViX Premium',price:3.99,img:'https://i.imgur.com/vQyO4EX.jpg'}
];

// --- Render productos ---
const grid=document.getElementById('products-grid');
grid.innerHTML=PRODUCTS.map(p=>`
 <article class="card">
   <img src="${p.img}" alt="${p.name}">
   <h3>${p.name}</h3>
   <div class="price">$${p.price.toFixed(2)}</div>
   <button class="btn" data-id="${p.id}">Agregar</button>
 </article>`).join('');

// --- Carrito ---
let cart=[];
const overlay=document.getElementById('overlay');
const panel=document.getElementById('cart-panel');
const badge=document.getElementById('cart-badge');
const itemsBox=document.getElementById('cart-items');
const totalBox=document.getElementById('cart-total');

function openCart(){panel.classList.add('open');overlay.classList.add('show');}
function closeCart(){panel.classList.remove('open');overlay.classList.remove('show');}
function updateCart(){
  badge.textContent=cart.reduce((a,b)=>a+b.qty,0);
  if(cart.length===0){itemsBox.innerHTML="<p>Carrito vacío</p>";totalBox.textContent="—";return;}
  itemsBox.innerHTML=cart.map(it=>{
   return `<div class="cart-item">
      <span>${it.name}</span>
      <span>${it.qty}×$${it.price.toFixed(2)}</span>
      <button data-id="${it.id}" class="btn btn-ghost remove">❌</button>
    </div>`;
  }).join('');
  totalBox.textContent="$"+cart.reduce((a,b)=>a+b.price*b.qty,0).toFixed(2);
}

grid.addEventListener('click',e=>{
  const btn=e.target.closest('button[data-id]');
  if(!btn)return;
  const prod=PRODUCTS.find(p=>p.id===btn.dataset.id);
  const found=cart.find(i=>i.id===prod.id);
  if(found)found.qty++; else cart.push({...prod,qty:1});
  btn.style.background="#ff3b5c";setTimeout(()=>btn.style.background="#22232e",300);
  updateCart();openCart();
});
itemsBox.addEventListener('click',e=>{
 if(e.target.classList.contains('remove')){
   const id=e.target.dataset.id;
   cart=cart.filter(i=>i.id!==id);
   updateCart();
 }
});
document.getElementById('btn-cart').onclick=openCart;
document.getElementById('close-cart').onclick=closeCart;
overlay.onclick=closeCart;
document.getElementById('clear-cart').onclick=()=>{cart=[];updateCart();}
document.getElementById('checkout').onclick=()=>{alert("Compra simulada, gracias!");cart=[];updateCart();closeCart();}
updateCart();

// --- Contacto ---
document.getElementById('contact-form').addEventListener('submit',e=>{
 e.preventDefault();
 document.getElementById('contact-feedback').textContent="✅ Mensaje enviado, te responderemos pronto.";
 e.target.reset();
});

// --- Reseñas ---
const stars=document.querySelectorAll('#stars span');
let rating=0;
stars.forEach(s=>{
 s.addEventListener('click',()=>{
   rating=s.dataset.val;
   stars.forEach(st=>st.classList.toggle('active',st.dataset.val<=rating));
 });
});
const reviewsList=document.getElementById('reviews-list');
function renderReviews(){
 const reviews=JSON.parse(localStorage.getItem('reviews')||'[]');
 reviewsList.innerHTML=reviews.map(r=>`
   <div class="review-item">
     <div class="stars">${'★'.repeat(r.rating)}</div>
     <p>${r.text}</p>
   </div>`).join('');
}
renderReviews();

document.getElementById('review-form').addEventListener('submit',e=>{
 e.preventDefault();
 if(!rating)return alert("Selecciona estrellas");
 const text=document.getElementById('r-text').value.trim();
 const reviews=JSON.parse(localStorage.getItem('reviews')||'[]');
 reviews.push({rating:Number(rating),text});
 localStorage.setItem('reviews',JSON.stringify(reviews));
 document.getElementById('r-text').value="";rating=0;
 stars.forEach(st=>st.classList.remove('active'));
 renderReviews();
});
