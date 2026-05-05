/* ============================================================
   script.js — Rang Indian Ethnic Wear
   Sections:
   1. Product Data
   2. State Variables
   3. Helper Functions
   4. Render Products
   5. Category & Filter Controls
   6. Cart Logic
   7. Cart UI
   8. Wishlist
   9. Search Toggle
   10. Mobile Menu
   11. Toast Notification
   12. Init
============================================================ */


/* ── 1. PRODUCT DATA ──────────────────────────────────────── */

const products = [
  {
    id: 1,
    name: 'Blue Floral Embroidered Kurti',
    category: 'embroidered',
    price: 950,
    original: 1400,
    image: 'img1.jpeg',
    badge: 'sale',
    colors: ['#1A4F8A', '#FFFFFF', '#C8963E'],
    rating: 5,
    reviews: 128
  },
  {
    id: 2,
    name: 'Purple Mirror Work Suit',
    category: 'anarkali',
    price: 800,
    original: 1100,
    image: 'img2.png',
    badge: 'sale',
    colors: ['#6A1B9A', '#C8963E', '#212121'],
    rating: 5,
    reviews: 89
  },
  {
    id: 3,
    name: 'Yellow Floral Anarkali Set',
    category: 'anarkali',
    price: 1100,
    original: 1600,
    image: 'img3.png',
    badge: '',
    colors: ['#F9A825', '#E53935', '#43A047'],
    rating: 5,
    reviews: 36
  },
  {
    id: 4,
    name: 'Maroon Block Print Kurti',
    category: 'printed',
    price: 420,
    original: 600,
    image: 'img4.png',
    badge: 'new',
    colors: ['#8D1A2A', '#3B4A6B', '#FAFAFA'],
    rating: 4,
    reviews: 203
  },
  {
    id: 5,
    name: 'Wine Chikankari Suit',
    category: 'embroidered',
    price: 1350,
    original: 1900,
    image: 'img5.png',
    badge: 'sale',
    colors: ['#6B1A3A', '#FFFFFF', '#C8963E'],
    rating: 5,
    reviews: 44
  },
  {
    id: 6,
    name: 'Red Mughal Print Kurti',
    category: 'printed',
    price: 490,
    original: 700,
    image: 'img6.png',
    badge: 'new',
    colors: ['#B71C1C', '#1A237E', '#FAFAFA'],
    rating: 4,
    reviews: 92
  },
  {
    id: 7,
    name: 'Blue Asymmetric Kurti',
    category: 'cotton-kurti',
    price: 750,
    original: 1050,
    image: 'img7.png',
    badge: '',
    colors: ['#1A4F8A', '#FFFFFF', '#C8963E'],
    rating: 4,
    reviews: 71
  },
  {
    id: 8,
    name: 'Crepe Straight Kurti',
    category: 'crepe',
    price: 275,
    original: 400,
    image: 'img2.png',
    badge: 'new',
    colors: ['#2E7D8A', '#8A2E7D', '#2E8A4C'],
    rating: 4,
    reviews: 56
  }
];


/* ── 2. STATE VARIABLES ───────────────────────────────────── */

let cart            = {};
let currentCategory = 'all';
let searchQuery     = '';
let sortOrder       = 'default';


/* ── 3. HELPER FUNCTIONS ──────────────────────────────────── */

function getDiscount(price, original) {
  return Math.round((1 - price / original) * 100);
}

function getCategoryBg(cat) {
  const map = {
    'cotton-kurti': '#EEF3FA',
    'anarkali':     '#FFF8E1',
    'crepe':        '#E8F5E9',
    'printed':      '#FDECEA',
    'embroidered':  '#F3E5F5'
  };
  return map[cat] || '#F9F4EE';
}

function buildStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}


/* ── 4. RENDER PRODUCTS ───────────────────────────────────── */

function renderProducts() {
  let filtered = products.filter(function(p) {
    const matchCat    = (currentCategory === 'all') || (p.category === currentCategory);
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sortOrder === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
  if (sortOrder === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sortOrder === 'discount')   filtered.sort((a, b) => getDiscount(b.price, b.original) - getDiscount(a.price, a.original));

  const grid = document.getElementById('product-grid');

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);padding:2rem 0;">No products found. Try a different search or category.</p>';
    return;
  }

  grid.innerHTML = filtered.map(function(p) {
    const badgeHTML = p.badge
      ? `<span class="product-badge ${p.badge === 'new' ? 'new' : ''}">${p.badge === 'new' ? 'New' : 'Sale'}</span>`
      : '';

    const colorDots = p.colors
      .map(c => `<div class="color-dot" style="background:${c}" title="${c}"></div>`)
      .join('');

    return `
      <div class="product-card" id="card-${p.id}">
        <div class="product-img-wrapper">
          <img
            src="${p.image}"
            alt="${p.name}"
            loading="lazy"
            onerror="this.parentElement.style.background='${getCategoryBg(p.category)}'; this.style.display='none';"
          />
          ${badgeHTML}
          <button
            class="product-wishlist"
            id="wish-${p.id}"
            onclick="toggleWish(${p.id}, event)"
          >&#9825;</button>
        </div>

        <div class="product-info">
          <div class="product-category">${p.category.replace('-', ' ')}</div>
          <div class="product-name">${p.name}</div>

          <div class="product-price-row">
            <span class="product-price">&#x20B9;${p.price}</span>
            <span class="product-price-original">&#x20B9;${p.original}</span>
            <span class="product-discount">${getDiscount(p.price, p.original)}% off</span>
          </div>

          <div class="product-colors">${colorDots}</div>

          <div style="margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            <span class="stars">${buildStars(p.rating)}</span>
            <span style="font-size:0.75rem; color:var(--muted)">(${p.reviews})</span>
          </div>

          <button class="add-to-cart-btn" onclick="addToCart(${p.id})">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}


/* ── 5. CATEGORY & FILTER CONTROLS ───────────────────────── */

function setCategory(btn, cat) {
  currentCategory = cat;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

function showAll() {
  currentCategory = 'all';
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-cat="all"]').classList.add('active');
  renderProducts();
}

function filterProducts() {
  searchQuery = document.getElementById('search-input').value;
  sortOrder   = document.getElementById('sort-select').value;
  renderProducts();
}

function toggleSearch() {
  const bar = document.getElementById('search-bar');
  bar.classList.toggle('hidden');
  if (!bar.classList.contains('hidden')) {
    document.getElementById('search-input').focus();
  }
}


/* ── 6. CART LOGIC ────────────────────────────────────────── */

function addToCart(id) {
  const product = products.find(x => x.id === id);
  if (!product) return;

  if (!cart[id]) {
    cart[id] = { ...product, qty: 0 };
  }
  cart[id].qty++;

  updateCartUI();
  showToast(product.name + ' added to cart');
}

function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}


/* ── 7. CART UI ───────────────────────────────────────────── */

function updateCartUI() {
  const items    = Object.values(cart);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  document.getElementById('cart-count').textContent = totalQty;

  const body   = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');

  if (items.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">&#128722;</div>
        <p>Your cart is empty.<br>Start shopping to add items.</p>
      </div>
    `;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cart-total').textContent = '\u20B9' + total.toLocaleString('en-IN');

  body.innerHTML = items.map(function(item) {
    return `
      <div class="cart-item">
        <div class="cart-item-img" style="background:${getCategoryBg(item.category)}">
          <img src="${item.image}" alt="${item.name}"
               style="width:100%;height:100%;object-fit:cover;border-radius:8px;"
               onerror="this.style.display='none';" />
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">&#x20B9;${item.price}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  }).join('');
}

function openCart() {
  closeMobileMenu(); // close mobile nav if open
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
  document.body.style.overflow = '';
}


/* ── 8. WISHLIST ──────────────────────────────────────────── */

function toggleWish(id, e) {
  e.stopPropagation();
  const btn = document.getElementById('wish-' + id);
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    btn.innerHTML = '&#9829;';
    showToast('Added to wishlist \u2661');
  } else {
    btn.innerHTML = '&#9825;';
    showToast('Removed from wishlist');
  }
}


/* ── 9. MOBILE MENU ───────────────────────────────────────── */

function toggleMobileMenu() {
  const nav   = document.getElementById('mobile-nav');
  const btn   = document.getElementById('hamburger-btn');
  const isOpen = nav.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('hamburger-btn');
  nav.classList.remove('open');
  btn.classList.remove('open');
  document.body.style.overflow = '';
}


/* ── 10. TOAST NOTIFICATION ───────────────────────────────── */

let toastTimer;

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('show');
  }, 2200);
}


/* ── 11. INIT ─────────────────────────────────────────────── */

renderProducts();

// Close mobile nav on overlay click
document.addEventListener('click', function(e) {
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('hamburger-btn');
  if (nav && nav.classList.contains('open')) {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      closeMobileMenu();
    }
  }
});
