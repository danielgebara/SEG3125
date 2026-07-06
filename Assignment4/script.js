// ── Products ──────────────────────────────────────────
const PRODUCTS = [
  { id:1,  brand:'Nike',        name:'Air Max 90',          category:'Casual',     price:130, sale:null,  sizes:[8,9,10,11,12], emoji:'👟', desc:'A timeless silhouette with visible Air cushioning in the heel. Available in multiple colourways.' },
  { id:2,  brand:'Nike',        name:'Air Force 1',         category:'Casual',     price:110, sale:null,  sizes:[8,9,10,11],    emoji:'👟', desc:'The classic low-top basketball shoe turned streetwear icon. Clean, versatile, and always in style.' },
  { id:3,  brand:'Nike',        name:'Pegasus 40',          category:'Running',    price:140, sale:null,  sizes:[9,10,11,12],   emoji:'🏃', desc:'Built for everyday runs. Responsive foam and a breathable mesh upper keep you comfortable mile after mile.' },
  { id:4,  brand:'Adidas',      name:'Stan Smith',          category:'Casual',     price:90,  sale:70,    sizes:[8,9,10,11,12], emoji:'🎾', desc:'A clean leather sneaker with perforated 3-Stripes branding. A wardrobe staple since the 70s.' },
  { id:5,  brand:'Adidas',      name:'Ultraboost 23',       category:'Running',    price:190, sale:150,   sizes:[8,9,10,11],    emoji:'🏃', desc:'Full-length Boost midsole for maximum energy return. Ideal for long runs or all-day wear.' },
  { id:6,  brand:'Adidas',      name:'Forum Low',           category:'Basketball', price:100, sale:null,  sizes:[9,10,11,12],   emoji:'🏀', desc:'Inspired by the original 80s basketball shoe. A bold silhouette with ankle strap detail.' },
  { id:7,  brand:'New Balance', name:'990v6',               category:'Running',    price:185, sale:null,  sizes:[8,9,10,11,12], emoji:'🏃', desc:'Made in USA. Premium suede and mesh upper with ENCAP midsole technology for long-lasting support.' },
  { id:8,  brand:'New Balance', name:'550',                 category:'Basketball', price:110, sale:85,    sizes:[8,9,10,11],    emoji:'🏀', desc:'A retro court sneaker with a chunky profile. One of the most coveted silhouettes right now.' },
  { id:9,  brand:'Vans',        name:'Old Skool',           category:'Skate',      price:75,  sale:null,  sizes:[8,9,10,11,12], emoji:'🛹', desc:'The original Vans skate shoe with the iconic side stripe. Durable canvas and suede upper.' },
  { id:10, brand:'Vans',        name:'Era',                 category:'Skate',      price:65,  sale:50,    sizes:[8,9,10,11],    emoji:'🛹', desc:'A low-profile lace-up with padded collar. Clean, simple, and great for any occasion.' },
  { id:11, brand:'Nike',        name:'Dunk Low',            category:'Casual',     price:110, sale:null,  sizes:[9,10,11,12],   emoji:'👟', desc:'Originally a basketball shoe, the Dunk Low is now a streetwear essential with countless colourway releases.' },
  { id:12, brand:'Adidas',      name:'Samba OG',            category:'Casual',     price:100, sale:null,  sizes:[8,9,10,11,12], emoji:'⚽', desc:'A football-inspired trainer with a gum sole and suede upper. One of the hottest shoes of the year.' },
];

let activeFilters = { brand:'all', category:'all', price:'all', size:'all' };
let cart = [];
let currentProduct = null;
let selectedSize = null;
let checkoutStep = 1;
let selectedRating = null;

// ── Pages ──────────────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById('page-' + page).classList.remove('hidden');
  window.scrollTo(0, 0);
  if (page === 'shop') renderProducts();
  if (page === 'cart') renderCart();
  if (page === 'checkout') { checkoutStep = 1; renderCheckoutStep(); }
}

// ── Filters ────────────────────────────────────────────
['brandFilter','categoryFilter','priceFilter','sizeFilter'].forEach(id => {
  const key = id.replace('Filter','').toLowerCase();
  document.getElementById(id).querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(id).querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters[key] = btn.dataset.value;
      renderProducts();
    });
  });
});

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const filtered = PRODUCTS.filter(p => {
    if (activeFilters.brand !== 'all' && p.brand !== activeFilters.brand) return false;
    if (activeFilters.category !== 'all' && p.category !== activeFilters.category) return false;
    if (activeFilters.size !== 'all' && !p.sizes.includes(parseInt(activeFilters.size))) return false;
    if (activeFilters.price === 'under100' && (p.sale || p.price) >= 100) return false;
    if (activeFilters.price === '100to150') { const eff = p.sale || p.price; if (eff < 100 || eff > 150) return false; }
    if (activeFilters.price === 'over150' && (p.sale || p.price) <= 150) return false;
    return true;
  });

  document.getElementById('resultCount').textContent = filtered.length + ' result' + (filtered.length !== 1 ? 's' : '');

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="showProduct(${p.id})">
      <span class="product-emoji">${p.emoji}</span>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-meta">${p.category} · Sizes ${p.sizes[0]}–${p.sizes[p.sizes.length-1]}</div>
      </div>
      <div class="product-price">
        ${p.sale ? `<span class="product-sale">$${p.sale}</span><span class="product-original">$${p.price}</span>` : `$${p.price}`}
      </div>
    </div>`).join('');

  if (filtered.length === 0) grid.innerHTML = '<p class="muted-text" style="padding:16px 0;">No results for those filters. Try adjusting your selection.</p>';
}

// ── Product Detail ─────────────────────────────────────
function showProduct(id) {
  currentProduct = PRODUCTS.find(p => p.id === id);
  selectedSize = null;
  const p = currentProduct;
  const priceHTML = p.sale
    ? `<span class="product-sale">$${p.sale}</span> <span class="product-original">$${p.price}</span>`
    : `$${p.price}`;

  document.getElementById('productDetail').innerHTML = `
    <span class="detail-emoji">${p.emoji}</span>
    <div class="detail-brand">${p.brand} · ${p.category}</div>
    <div class="detail-name">${p.name}</div>
    <div class="detail-price">${priceHTML}</div>
    <div class="detail-desc">${p.desc}</div>
    <div class="size-selector">
      <div class="filter-label">Select Size</div>
      <div class="size-options">
        ${p.sizes.map(s => `<button class="size-btn" data-size="${s}" onclick="selectSize(${s})">${s}</button>`).join('')}
      </div>
    </div>
    <div class="btn-row">
      <button class="btn-main" onclick="addToCart()">Add to Cart</button>
    </div>
    <p id="addMsg" style="margin-top:12px; font-size:0.82rem; color:#7aadff; display:none;"></p>`;

  showPage('product');
}

function selectSize(size) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('selected', parseInt(b.dataset.size) === size));
}

function addToCart() {
  if (!selectedSize) { alert('Please select a size.'); return; }
  const p = currentProduct;
  cart.push({ id: p.id, name: p.name, brand: p.brand, size: selectedSize, price: p.sale || p.price, emoji: p.emoji });
  updateCartCount();
  document.getElementById('addMsg').textContent = 'Added to cart!';
  document.getElementById('addMsg').style.display = 'block';
  setTimeout(() => document.getElementById('addMsg').style.display = 'none', 2000);
}

// ── Cart ───────────────────────────────────────────────
function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const summary = document.getElementById('cartSummary');

  if (cart.length === 0) {
    container.innerHTML = '';
    empty.classList.remove('hidden');
    summary.classList.add('hidden');
    return;
  }

  empty.classList.add('hidden');
  summary.classList.remove('hidden');

  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div>
        <div class="cart-item-info">${item.emoji} ${item.brand} ${item.name}</div>
        <div class="cart-item-sub">Size ${item.size}</div>
      </div>
      <div style="display:flex; align-items:center;">
        <span class="cart-item-price">$${item.price}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">Remove</button>
      </div>
    </div>`).join('');

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  document.getElementById('cartTotal').textContent = '$' + total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

// ── Checkout ───────────────────────────────────────────
function goCheckoutStep(step) {
  checkoutStep = step;
  renderCheckoutStep();
}

function renderCheckoutStep() {
  ['checkout-step1','checkout-step2','checkout-step3','checkout-confirm'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('checkout-step' + checkoutStep).classList.remove('hidden');

  [1,2,3].forEach(n => {
    const dot = document.getElementById('dot' + n);
    dot.classList.remove('active','done');
    if (n < checkoutStep) dot.classList.add('done');
    else if (n === checkoutStep) dot.classList.add('active');
  });

  if (checkoutStep === 3) {
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    document.getElementById('orderSummary').innerHTML =
      cart.map(item => `<div class="order-row"><span>${item.emoji} ${item.name} (Size ${item.size})</span><strong>$${item.price}</strong></div>`).join('') +
      `<div class="order-row" style="margin-top:4px;"><span>Total</span><strong>$${total}</strong></div>`;
  }
}

function placeOrder() {
  cart = [];
  updateCartCount();
  ['checkout-step1','checkout-step2','checkout-step3'].forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById('checkout-confirm').classList.remove('hidden');
  [1,2,3].forEach(n => { const d = document.getElementById('dot'+n); d.classList.remove('active'); d.classList.add('done'); });
}

// ── Survey ─────────────────────────────────────────────
document.querySelectorAll('.rating-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedRating = btn.dataset.value;
  });
});

function submitSurvey() {
  document.getElementById('surveyForm').classList.add('hidden');
  document.getElementById('surveyConfirm').classList.remove('hidden');
}

// ── Init ───────────────────────────────────────────────
showPage('home');