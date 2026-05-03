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
   10. Toast Notification
   11. Init
============================================================ */


/* ── 1. PRODUCT DATA ──────────────────────────────────────── */

const products = [
  {
    id: 1,
    name: 'Cotton Kurti',
    category: 'cotton-kurti',
    price: 420,
    original: 600,
    emoji: '🎪',
    badge: '',
    colors: ['#E87B7B', '#7BB5E8', '#7BE87E'],
    rating: 4,
    reviews: 128
  },
  {
    id: 2,
    name: 'Anarkali Kurti',
    category: 'anarkali',
    price: 800,
    original: 1100,
    emoji: '💜',
    badge: 'sale',
    colors: ['#FFD700', '#FF6B6B', '#9B59B6'],
    rating: 5,
    reviews: 89
  },
  {
    id: 3,
    name: 'Crepe Kurti',
    category: 'crepe',
    price: 275,
    original: 400,
    emoji: '🧡',
    badge: 'new',
    colors: ['#2E7D8A', '#8A2E7D', '#2E8A4C'],
    rating: 4,
    reviews: 56
  },
  {
    id: 4,
    name: 'Printed Kurti',
    category: 'printed',
    price: 350,
    original: 500,
    emoji: '🌸',
    badge: '',
    colors: ['#FF8C42', '#FF4242', '#42B8FF'],
    rating: 4,
    reviews: 203
  },
  {
    id: 5,
    name: 'Embroidered Kurti',
    category: 'embroidered',
    price: 950,
    original: 1400,
    emoji: '🎠',
    badge: 'sale',
    colors: ['#C8963E', '#8B0000', '#006400'],
    rating: 5,
    reviews: 44
  },
  {
    id: 6,
    name: 'Rayon Kurti',
    category: 'cotton-kurti',
    price: 380,
    original: 520,
    emoji: '💠',
    badge: 'new',
    colors: ['#FF69B4', '#4169E1', '#32CD32'],
    rating: 4,
    reviews: 71
  },
  {
    id: 7,
    name: 'Floral Anarkali',
    category: 'anarkali',
    price: 1100,
    original: 1600,
    emoji: '🍓',
    badge: '',
    colors: ['#FF6347', '#FFA500', '#ADFF2F'],
    rating: 5,
    reviews: 36
  },
  {
    id: 8,
    name: 'Block Print Kurti',
    category: 'printed',
    price: 490,
    original: 700,
    emoji: '🌎',
    badge: 'new',
    colors: ['#8B4513', '#2F4F4F', '#800000'],
    rating: 4,
    reviews: 92
  }
];


/* ── 2. STATE VARIABLES ───────────────────────────────────── */

let cart            = {};       // { productId: { ...product, qty } }
let currentCategory = 'all';   // active filter pill
let searchQuery     = '';       // live search text
let sortOrder       = 'default'; // dropdown sort value


/* ── 3. HELPER FUNCTIONS ──────────────────────────────────── */

/**
 * Calculate discount percentage between sale and original price.
 * @param {number} price    - Sale price
 * @param {number} original - Original price
 * @returns {number} Discount as a whole percentage
 */
function getDiscount(price, original) {
  return Math.round((1 - price / original) * 100);
}

/**
 * Return a soft background colour for each product category.
 * Used in the image placeholder and cart item thumbnail.
 * @param {string} cat - Category slug
 * @returns {string} CSS colour value
 */
function getCategoryBg(cat) {
  const map = {
    'cotton-kurti': '#FFF0F0',
    'anarkali':     '#FFF8E1',
    'crepe':        '#E8F5E9',
    'printed':      '#E3F2FD',
    'embroidered':  '#FCE4EC'
  };
  return map[cat] || '#F9F4EE';
}

/**
 * Build star-rating HTML string.
 * @param {number} rating - Integer 1–5
 * @returns {string} HTML with filled and empty stars
 */
function buildStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}


/* ── 4. RENDER PRODUCTS ───────────────────────────────────── */

/**
 * Filter, sort and inject product cards into #product-grid.
 * Called on load and whenever filters change.
 */
function renderProducts() {
  /* --- Filter --- */
  let filtered = products.filter(function(p) {
    const matchCat    = (currentCategory === 'all') || (p.category === currentCategory);
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  /* --- Sort --- */
  if (sortOrder === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
  if (sortOrder === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sortOrder === 'discount')   filtered.sort((a, b) => getDiscount(b.price, b.original) - getDiscount(a.price, a.original));

  /* --- Inject HTML --- */
  const grid = document.getElementById('product-grid');

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);padding:2rem 0;">No products found. Try a different search or category.</p>';
    return;
  }

  grid.innerHTML = filtered.map(function(p) {
    /* Badge markup — only if product has a badge */
    const badgeHTML = p.badge
      ? `<span class="product-badge ${p.badge === 'new' ? 'new' : ''}">${p.badge === 'new' ? 'New' : 'Sale'}</span>`
      : '';

    /* Colour swatches */
    const colorDots = p.colors
      .map(c => `<div class="color-dot" style="background:${c}" title="${c}"></div>`)
      .join('');

    return `
      <div class="product-card" id="card-${p.id}">

        <!-- Image / Emoji placeholder -->
        <div class="product-img-wrapper">
          <div style="
            width:100%; height:100%;
            display:flex; align-items:center; justify-content:center;
            font-size:4.5rem;
            background:${getCategoryBg(p.category)}
          ">${p.emoji}</div>

          ${badgeHTML}

          <!-- Wishlist heart -->
          <button
            class="product-wishlist"
            id="wish-${p.id}"
            onclick="toggleWish(${p.id}, event)"
          >&#9825;</button>
        </div>

        <!-- Text info -->
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

/**
 * Set active category pill and re-render.
 * Called from pill onclick in HTML.
 * @param {HTMLElement} btn - The clicked pill button
 * @param {string}      cat - Category slug
 */
function setCategory(btn, cat) {
  currentCategory = cat;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

/**
 * Show all products — resets category to 'all'.
 * Called from "View All" button.
 */
function showAll() {
  currentCategory = 'all';
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-cat="all"]').classList.add('active');
  renderProducts();
}

/**
 * Read search input and sort dropdown, then re-render.
 * Bound to oninput / onchange in HTML.
 */
function filterProducts() {
  searchQuery = document.getElementById('search-input').value;
  sortOrder   = document.getElementById('sort-select').value;
  renderProducts();
}

/**
 * Toggle the search bar visibility.
 * Called from Search nav button.
 */
function toggleSearch() {
  const bar = document.getElementById('search-bar');
  bar.classList.toggle('hidden');

  /* Auto-focus the input when opening */
  if (!bar.classList.contains('hidden')) {
    document.getElementById('search-input').focus();
  }
}


/* ── 6. CART LOGIC ────────────────────────────────────────── */

/**
 * Add a product to the cart or increment its quantity.
 * @param {number} id - Product ID
 */
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

/**
 * Remove a product entirely from the cart.
 * @param {number} id - Product ID
 */
function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

/**
 * Increment or decrement a cart item's quantity.
 * Removes the item if qty reaches 0.
 * @param {number} id    - Product ID
 * @param {number} delta - +1 or -1
 */
function changeQty(id, delta) {
  if (!cart[id]) return;

  cart[id].qty += delta;

  if (cart[id].qty <= 0) {
    delete cart[id];
  }

  updateCartUI();
}


/* ── 7. CART UI ───────────────────────────────────────────── */

/**
 * Re-render the entire cart drawer UI based on current cart state.
 * Updates: badge count, item list, subtotal, footer visibility.
 */
function updateCartUI() {
  const items = Object.values(cart);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  /* Update nav badge */
  document.getElementById('cart-count').textContent = totalQty;

  const body   = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');

  /* Empty state */
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

  /* Show footer with subtotal */
  footer.style.display = 'block';

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cart-total').textContent =
    '\u20B9' + total.toLocaleString('en-IN');

  /* Build cart item rows */
  body.innerHTML = items.map(function(item) {
    return `
      <div class="cart-item">

        <!-- Emoji thumbnail -->
        <div class="cart-item-img" style="background:${getCategoryBg(item.category)}">
          ${item.emoji}
        </div>

        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">&#x20B9;${item.price}</div>

          <!-- Qty controls -->
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

/**
 * Open the cart drawer (shows overlay + slides drawer in).
 */
function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
  document.body.style.overflow = 'hidden'; /* prevent background scroll */
}

/**
 * Close the cart drawer.
 */
function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
  document.body.style.overflow = '';
}


/* ── 8. WISHLIST ──────────────────────────────────────────── */

/**
 * Toggle the wishlist heart on a product card.
 * @param {number}     id - Product ID
 * @param {MouseEvent} e  - Click event (to stop propagation)
 */
function toggleWish(id, e) {
  e.stopPropagation(); /* don't trigger card click */

  const btn = document.getElementById('wish-' + id);
  btn.classList.toggle('active');

  if (btn.classList.contains('active')) {
    btn.innerHTML = '&#9829;'; /* filled heart */
    showToast('Added to wishlist \u2661');
  } else {
    btn.innerHTML = '&#9825;'; /* empty heart */
    showToast('Removed from wishlist');
  }
}


/* ── 9. TOAST NOTIFICATION ────────────────────────────────── */

let toastTimer; /* holds the auto-hide timeout reference */

/**
 * Show a brief toast message at the bottom of the screen.
 * Auto-hides after 2.2 seconds.
 * @param {string} msg - Message to display
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('show');
  }, 2200);
}


/* ── 10. INIT ─────────────────────────────────────────────── */

/* Render product grid as soon as the script loads */
renderProducts();
