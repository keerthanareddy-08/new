/* ============================================
   DEALRADAR — Global JavaScript (app.js)
   Handles: Landing, Auth, Customer, Store Owner
   ============================================ */

'use strict';

// ============================================
// GLOBAL STATE
// ============================================
const State = {
  currentUser: null,
  currentStore: null,
  cart: [],
  orders: [],
  products: [],
  page: '', // 'landing' | 'customer' | 'store'
};

// ============================================
// SAMPLE DATA
// ============================================
const CATEGORIES = {
  grocery: {
    name: 'Grocery', emoji: '🛒',
    items: [
      { id: 'g1', name: 'Basmati Rice 1kg', emoji: '🍚' },
      { id: 'g2', name: 'Toor Dal 500g', emoji: '🫘' },
      { id: 'g3', name: 'Sunflower Oil 1L', emoji: '🛢️' },
      { id: 'g4', name: 'Amul Butter 100g', emoji: '🧈' },
      { id: 'g5', name: 'Bread Loaf', emoji: '🍞' },
      { id: 'g6', name: 'Eggs (12 pack)', emoji: '🥚' },
    ]
  },
  food: {
    name: 'Food', emoji: '🍔',
    items: [
      { id: 'f1', name: 'Veg Biryani', emoji: '🍛' },
      { id: 'f2', name: 'Paneer Butter Masala', emoji: '🥘' },
      { id: 'f3', name: 'Masala Dosa', emoji: '🥞' },
      { id: 'f4', name: 'Chicken Burger', emoji: '🍔' },
      { id: 'f5', name: 'Fresh Juice 250ml', emoji: '🧃' },
      { id: 'f6', name: 'Samosa (4 pcs)', emoji: '🫓' },
    ]
  },
  toys: {
    name: 'Toys', emoji: '🧸',
    items: [
      { id: 't1', name: 'Lego Classic Set', emoji: '🧱' },
      { id: 't2', name: 'Teddy Bear', emoji: '🧸' },
      { id: 't3', name: 'Remote Car', emoji: '🚗' },
      { id: 't4', name: 'Board Game', emoji: '🎲' },
    ]
  },
  clothing: {
    name: 'Clothing', emoji: '👗',
    items: [
      { id: 'cl1', name: 'Cotton Kurta', emoji: '👘' },
      { id: 'cl2', name: 'Denim Jeans', emoji: '👖' },
      { id: 'cl3', name: 'Sneakers', emoji: '👟' },
      { id: 'cl4', name: 'Summer Dress', emoji: '👗' },
    ]
  },
  pharmacy: {
    name: 'Pharmacy', emoji: '💊',
    items: [
      { id: 'p1', name: 'Paracetamol 500mg', emoji: '💊' },
      { id: 'p2', name: 'Vitamin C Tablets', emoji: '🍊' },
      { id: 'p3', name: 'Hand Sanitizer 200ml', emoji: '🧴' },
      { id: 'p4', name: 'Band-Aid Pack', emoji: '🩹' },
    ]
  },
  electronics: {
    name: 'Electronics', emoji: '📱',
    items: [
      { id: 'e1', name: 'USB-C Cable 1m', emoji: '🔌' },
      { id: 'e2', name: 'Wireless Earbuds', emoji: '🎧' },
      { id: 'e3', name: 'Power Bank 10000mAh', emoji: '🔋' },
      { id: 'e4', name: 'Phone Case', emoji: '📱' },
    ]
  }
};

const STORES_DATA = [
  { name: 'Reliance Smart', distance: '0.4 km', delivery: '15 min', rating: '4.5' },
  { name: 'D-Mart', distance: '0.9 km', delivery: '22 min', rating: '4.3' },
  { name: 'More Supermarket', distance: '1.2 km', delivery: '28 min', rating: '4.1' },
];

function generateStoreOffers(itemName) {
  const basePrice = Math.floor(Math.random() * 200) + 50;
  return STORES_DATA.map((store, i) => {
    const hasOffer = Math.random() > 0.5;
    const discountPct = [10, 15, 20][Math.floor(Math.random() * 3)];
    const originalPrice = basePrice + (i * 12);
    const discountedPrice = hasOffer ? Math.floor(originalPrice * (1 - discountPct / 100)) : null;
    return {
      ...store,
      itemName,
      price: discountedPrice || originalPrice,
      originalPrice: hasOffer ? originalPrice : null,
      discount: hasOffer ? discountPct : null,
    };
  });
}

// Store owner sample products
let soProducts = [
  { id: 'sp1', name: 'Basmati Rice 1kg', price: 120, stock: 45, img: '', emoji: '🍚' },
  { id: 'sp2', name: 'Toor Dal 500g', price: 75, stock: 8, img: '', emoji: '🫘' },
  { id: 'sp3', name: 'Sunflower Oil 1L', price: 160, stock: 0, img: '', emoji: '🛢️' },
  { id: 'sp4', name: 'Amul Butter 100g', price: 55, stock: 30, img: '', emoji: '🧈' },
];

// Store owner sample orders
const soOrders = [
  { id: 'o1', item: 'Basmati Rice 1kg', emoji: '🍚', customer: 'Rahul Sharma', time: '09:14 AM', price: 120, status: 'delivered', date: new Date() },
  { id: 'o2', item: 'Toor Dal 500g', emoji: '🫘', customer: 'Priya Nair', time: '10:30 AM', price: 75, status: 'processing', date: new Date() },
  { id: 'o3', item: 'Amul Butter 100g', emoji: '🧈', customer: 'Arjun Patel', time: '11:05 AM', price: 55, status: 'pending', date: new Date() },
  { id: 'o4', item: 'Sunflower Oil 1L', emoji: '🛢️', customer: 'Sneha Reddy', time: '08:50 AM', price: 160, status: 'delivered', date: new Date(Date.now() - 864e5 * 2) },
  { id: 'o5', item: 'Bread Loaf', emoji: '🍞', customer: 'Kiran Kumar', time: '02:10 PM', price: 40, status: 'pending', date: new Date(Date.now() - 864e5 * 5) },
];

// ============================================
// PAGE DETECTION
// ============================================
function detectPage() {
  const path = window.location.pathname;
  if (path.includes('customer')) State.page = 'customer';
  else if (path.includes('store-owner')) State.page = 'store';
  else State.page = 'landing';
}

window.addEventListener('DOMContentLoaded', () => {
  detectPage();
  if (State.page === 'landing') initLanding();
  else if (State.page === 'customer') initCustomer();
  else if (State.page === 'store') initStore();
});

// ============================================
// TOAST
// ============================================
function showToast(msg, type = '') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast${type ? ' ' + type : ''}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2700);
}

// ============================================
// PANEL HELPERS
// ============================================
function showPanel(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}
function hidePanel(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}
function showModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}
function hideModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

// ============================================
// LANDING PAGE
// ============================================
function initLanding() {
  // Logo images — user will paste src
}

function openAuth(type) {
  const id = type === 'customer' ? 'auth-customer' : 'auth-store';
  showPanel(id);
}
function closeAuth(type) {
  const id = type === 'customer' ? 'auth-customer' : 'auth-store';
  hidePanel(id);
}

function switchAuthTab(portal, tab, btn) {
  const prefix = portal === 'customer' ? 'customer' : 'store';
  const loginForm = document.getElementById(`${prefix}-login-form`);
  const regForm = document.getElementById(`${prefix}-register-form`);
  const tabs = btn.closest('.auth-tabs').querySelectorAll('.auth-tab');
  tabs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
  } else {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
  }
}

// Customer Login
function customerLogin() {
  const u = document.getElementById('c-username')?.value.trim();
  const p = document.getElementById('c-password')?.value.trim();
  if (!u || !p) { showToast('Please enter username and password', 'error'); return; }
  // Simulate login
  State.currentUser = {
    name: u,
    email: `${u.toLowerCase()}@email.com`,
    phone: '+91 98765 43210',
    address: '12, MG Road, Bengaluru, Karnataka 560001',
    username: u,
  };
  sessionStorage.setItem('dealradar_user', JSON.stringify(State.currentUser));
  window.location.href = 'customer.html';
}

// Customer Register
function customerRegister() {
  const name = document.getElementById('c-reg-name')?.value.trim();
  const email = document.getElementById('c-reg-email')?.value.trim();
  const phone = document.getElementById('c-reg-phone')?.value.trim();
  const password = document.getElementById('c-reg-password')?.value.trim();
  const address = document.getElementById('c-reg-address')?.value.trim();
  if (!name || !email || !phone || !password || !address) {
    showToast('Please fill all fields', 'error'); return;
  }
  State.currentUser = { name, email, phone, address, username: name.split(' ')[0].toLowerCase() };
  sessionStorage.setItem('dealradar_user', JSON.stringify(State.currentUser));
  showToast('Account created! Logging in...', 'success');
  setTimeout(() => { window.location.href = 'customer.html'; }, 1000);
}

// Store Login
function storeLogin() {
  const sid = document.getElementById('s-storeid')?.value.trim();
  const p = document.getElementById('s-password')?.value.trim();
  if (!sid || !p) { showToast('Please enter Store ID and password', 'error'); return; }
  State.currentStore = {
    storeId: sid,
    storeName: 'My Local Store',
    ownerName: 'Store Owner',
    email: 'store@email.com',
    phone: '+91 99887 76655',
    address: '45, Commercial Street, Bengaluru',
    category: 'grocery',
  };
  sessionStorage.setItem('dealradar_store', JSON.stringify(State.currentStore));
  window.location.href = 'store-owner.html';
}

// Store Owner Register Request
function storeRegisterRequest() {
  const name = document.getElementById('s-reg-name')?.value.trim();
  const storeName = document.getElementById('s-reg-storename')?.value.trim();
  const category = document.getElementById('s-reg-category')?.value;
  const phone = document.getElementById('s-reg-phone')?.value.trim();
  const email = document.getElementById('s-reg-email')?.value.trim();
  const address = document.getElementById('s-reg-address')?.value.trim();
  const password = document.getElementById('s-reg-password')?.value.trim();
  if (!name || !storeName || !category || !phone || !email || !address || !password) {
    showToast('Please fill all fields', 'error'); return;
  }
  // Save pending store data
  const pendingStore = { name, storeName, category, phone, email, address };
  sessionStorage.setItem('dealradar_pending_store', JSON.stringify(pendingStore));
  showModal('modal-request-submitted');
}

function simulateApproval() {
  hideModal('modal-request-submitted');
  // Generate store ID
  const sid = 'STR-' + Math.floor(10000 + Math.random() * 90000);
  document.getElementById('generated-store-id').textContent = sid;

  const pending = JSON.parse(sessionStorage.getItem('dealradar_pending_store') || '{}');
  pending.storeId = sid;
  sessionStorage.setItem('dealradar_pending_store', JSON.stringify(pending));

  setTimeout(() => { showModal('modal-approved'); }, 400);
}

function goToStoreLogin() {
  hideModal('modal-approved');
  const pending = JSON.parse(sessionStorage.getItem('dealradar_pending_store') || '{}');
  // Pre-fill store id in login
  const sidInput = document.getElementById('s-storeid');
  if (sidInput && pending.storeId) sidInput.value = pending.storeId;
  switchAuthTab('store', 'login', document.querySelectorAll('#auth-store .auth-tab')[0]);

  // Also store info for post-login use
  sessionStorage.setItem('dealradar_store', JSON.stringify({
    storeId: pending.storeId,
    storeName: pending.storeName,
    ownerName: pending.name,
    email: pending.email,
    phone: pending.phone,
    address: pending.address,
    category: pending.category,
  }));
}

// Forgot Password — Customer
function sendOTP() {
  const email = document.getElementById('forgot-email')?.value.trim();
  if (!email) { showToast('Please enter your email', 'error'); return; }
  showToast('Verification code sent! (use: 123456)', 'success');
  document.getElementById('forgot-step-1').classList.add('hidden');
  document.getElementById('forgot-step-2').classList.remove('hidden');
}
function verifyOTP() {
  const otp = document.getElementById('forgot-otp')?.value.trim();
  if (otp !== '123456') { showToast('Invalid code. Try 123456', 'error'); return; }
  showToast('Code verified!', 'success');
  document.getElementById('forgot-step-2').classList.add('hidden');
  document.getElementById('forgot-step-3').classList.remove('hidden');
}
function resetPassword() {
  const np = document.getElementById('new-pass')?.value.trim();
  const cp = document.getElementById('confirm-pass')?.value.trim();
  if (!np || !cp) { showToast('Please fill both fields', 'error'); return; }
  if (np !== cp) { showToast('Passwords do not match', 'error'); return; }
  showToast('Password reset successfully!', 'success');
  setTimeout(() => hidePanel('panel-c-forgot'), 800);
}

// Forgot Password — Store Owner
function storeSendOTP() {
  const email = document.getElementById('s-forgot-email')?.value.trim();
  if (!email) { showToast('Please enter your email', 'error'); return; }
  showToast('Verification code sent! (use: 123456)', 'success');
  document.getElementById('s-forgot-step-1').classList.add('hidden');
  document.getElementById('s-forgot-step-2').classList.remove('hidden');
}
function storeVerifyOTP() {
  const otp = document.getElementById('s-forgot-otp')?.value.trim();
  if (otp !== '123456') { showToast('Invalid code. Try 123456', 'error'); return; }
  showToast('Code verified!', 'success');
  document.getElementById('s-forgot-step-2').classList.add('hidden');
  document.getElementById('s-forgot-step-3').classList.remove('hidden');
}
function storeResetPassword() {
  const np = document.getElementById('s-new-pass')?.value.trim();
  const cp = document.getElementById('s-confirm-pass')?.value.trim();
  if (!np || !cp) { showToast('Please fill both fields', 'error'); return; }
  if (np !== cp) { showToast('Passwords do not match', 'error'); return; }
  showToast('Password reset successfully!', 'success');
  setTimeout(() => hidePanel('panel-s-forgot'), 800);
}

// ============================================
// CUSTOMER PAGE
// ============================================
function initCustomer() {
  const user = JSON.parse(sessionStorage.getItem('dealradar_user') || 'null');
  if (!user) { window.location.href = 'index.html'; return; }
  State.currentUser = user;
  State.cart = JSON.parse(sessionStorage.getItem('dealradar_cart') || '[]');
  State.orders = JSON.parse(sessionStorage.getItem('dealradar_orders') || '[]');
  loadAccountInfo();
}

function loadAccountInfo() {
  const u = State.currentUser;
  if (!u) return;
  setVal('acc-name', u.name);
  setVal('acc-phone', u.phone);
  setVal('acc-email', u.email);
  setVal('acc-address', u.address);
  setVal('account-display-name', u.name, true);
  setVal('account-display-email', u.email, true);
  setVal('home-address-display', u.address || 'Your home address', true);
}

function setVal(id, val, isText = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (isText) el.textContent = val;
  else el.value = val || '';
}

// Nav
function switchCustomerNav(tab) {
  ['home', 'cart', 'reorder', 'account'].forEach(t => {
    document.getElementById(`nav-${t}`)?.classList.remove('active');
  });
  document.getElementById(`nav-${tab}`)?.classList.add('active');

  if (tab === 'cart') { renderCart(); showPanel('panel-cart'); }
  else if (tab === 'reorder') { renderReorder(); showPanel('panel-reorder'); }
  else if (tab === 'account') { showPanel('panel-account'); }
  else {
    hidePanel('panel-cart'); hidePanel('panel-reorder'); hidePanel('panel-account');
  }
}

// Search
function handleSearch(q) {
  const wrap = document.getElementById('search-results-wrap');
  const grid = document.getElementById('search-results-grid');
  const label = document.getElementById('search-results-label');
  if (!q.trim()) { wrap.classList.add('hidden'); return; }
  wrap.classList.remove('hidden');
  label.textContent = `Results for "${q}"`;
  const results = [];
  Object.values(CATEGORIES).forEach(cat => {
    cat.items.forEach(item => {
      if (item.name.toLowerCase().includes(q.toLowerCase())) results.push({ ...item, catEmoji: cat.emoji });
    });
  });
  if (results.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-light);font-size:14px;grid-column:1/-1;">No items found.</p>';
    return;
  }
  grid.innerHTML = results.map(item => buildItemCard(item)).join('');
}

// Category
function openCategory(cat) {
  const data = CATEGORIES[cat];
  if (!data) return;
  document.getElementById('category-panel-title').textContent = `${data.emoji} ${data.name}`;
  document.getElementById('category-items-grid').innerHTML = data.items.map(item => buildItemCard(item)).join('');
  showPanel('panel-category');
}

function buildItemCard(item) {
  return `
    <div class="item-card" onclick="openItemStores('${item.id}', '${item.name}', '${item.emoji}')">
      <div class="item-card-img">${item.emoji}</div>
      <div class="item-card-body">
        <div class="item-card-name">${item.name}</div>
      </div>
    </div>`;
}

// Item Store Comparison
function openItemStores(id, name, emoji) {
  document.getElementById('item-stores-title').textContent = name;
  const stores = generateStoreOffers(name);
  const list = document.getElementById('store-compare-list');
  list.innerHTML = stores.map((s, i) => `
    <div class="store-compare-card">
      <div class="store-compare-img">${emoji}</div>
      <div class="store-compare-info">
        <div class="store-compare-name">${s.name}</div>
        <div class="store-compare-price-row">
          <span class="price-current">₹${s.price}</span>
          ${s.originalPrice ? `<span class="price-original">₹${s.originalPrice}</span><span class="discount-badge">${s.discount}% OFF</span>` : ''}
        </div>
        <div class="store-meta">
          <span>📍 ${s.distance}</span>
          <span>🕐 ${s.delivery}</span>
          <span>⭐ ${s.rating}</span>
        </div>
        <button class="add-to-cart-btn" id="atc-${i}-${id}" onclick="addToCart('${id}','${name}','${emoji}','${s.name}',${s.price},${i})">+ Add to Cart</button>
      </div>
    </div>`).join('');
  showPanel('panel-item-stores');
}

function addToCart(itemId, name, emoji, storeName, price, btnIdx) {
  State.cart.push({ itemId, name, emoji, storeName, price });
  sessionStorage.setItem('dealradar_cart', JSON.stringify(State.cart));
  showToast(`${name} added to cart! 🛒`, 'success');
  const btn = document.getElementById(`atc-${btnIdx}-${itemId}`);
  if (btn) { btn.classList.add('added'); btn.textContent = '✓ Added'; }
}

// Cart
function renderCart() {
  const list = document.getElementById('cart-items-list');
  const empty = document.getElementById('cart-empty');
  const totalBar = document.getElementById('cart-total-bar');
  if (!list) return;
  State.cart = JSON.parse(sessionStorage.getItem('dealradar_cart') || '[]');
  if (State.cart.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    totalBar.classList.add('hidden');
    return;
  }
  empty.classList.add('hidden');
  totalBar.classList.remove('hidden');
  const total = State.cart.reduce((sum, i) => sum + i.price, 0);
  document.getElementById('cart-total-value').textContent = `₹${total}`;
  list.innerHTML = State.cart.map((item, idx) => `
    <div class="cart-item-card">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-store">🏪 ${item.storeName}</div>
      </div>
      <div class="cart-item-price">₹${item.price}</div>
    </div>`).join('');
}

// Order
function openOrderPanel(source) {
  const content = document.getElementById('order-panel-content');
  if (content) {
    document.getElementById('order-main').classList.remove('hidden');
    document.getElementById('order-success').classList.add('hidden');
  }
  // Reset delivery selection
  document.getElementById('opt-home')?.classList.remove('selected');
  document.getElementById('opt-location')?.classList.remove('selected');
  const btn = document.getElementById('place-order-btn');
  if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }
  // Set home address
  if (State.currentUser) {
    setVal('home-address-display', State.currentUser.address || 'Your home address', true);
  }
  showPanel('panel-order');
}

function selectDelivery(type) {
  document.getElementById('opt-home')?.classList.remove('selected');
  document.getElementById('opt-location')?.classList.remove('selected');
  document.getElementById(`opt-${type}`)?.classList.add('selected');
  if (type === 'location') {
    setVal('current-loc-display', 'Fetching location...', true);
    setTimeout(() => setVal('current-loc-display', '📍 Detected: Near you, Bengaluru', true), 1200);
  }
  const btn = document.getElementById('place-order-btn');
  if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
}

function placeOrder() {
  // Save to orders
  State.cart.forEach(item => {
    State.orders.push({ ...item, orderedAt: new Date().toISOString() });
  });
  State.cart = [];
  sessionStorage.setItem('dealradar_cart', '[]');
  sessionStorage.setItem('dealradar_orders', JSON.stringify(State.orders));
  document.getElementById('order-main').classList.add('hidden');
  document.getElementById('order-success').classList.remove('hidden');
}

function goHomeAfterOrder() {
  hidePanel('panel-order');
  hidePanel('panel-cart');
  switchCustomerNav('home');
}

// Reorder
function renderReorder() {
  State.orders = JSON.parse(sessionStorage.getItem('dealradar_orders') || '[]');
  const list = document.getElementById('reorder-list');
  const empty = document.getElementById('reorder-empty');
  if (!list) return;
  if (State.orders.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  list.innerHTML = State.orders.map((item, i) => `
    <div class="reorder-card">
      <div class="reorder-img">${item.emoji}</div>
      <div class="reorder-info">
        <div class="reorder-name">${item.name}</div>
        <div class="reorder-store">🏪 ${item.storeName}</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="reorderItem(${i})">Reorder</button>
    </div>`).join('');
}

function reorderItem(idx) {
  const item = State.orders[idx];
  if (!item) return;
  // Put item in cart temporarily and open order panel
  State.cart = [item];
  sessionStorage.setItem('dealradar_cart', JSON.stringify(State.cart));
  openOrderPanel('reorder');
}

// Account
function toggleAccountEdit() {
  const inputs = document.querySelectorAll('#account-form .form-input');
  const editBtn = document.getElementById('acc-edit-btn');
  const saveBtn = document.getElementById('acc-save-btn');
  inputs.forEach(i => { i.disabled = false; });
  editBtn.classList.add('hidden');
  saveBtn.classList.remove('hidden');
}

function saveAccount() {
  const user = State.currentUser;
  user.name = document.getElementById('acc-name')?.value || user.name;
  user.phone = document.getElementById('acc-phone')?.value || user.phone;
  user.email = document.getElementById('acc-email')?.value || user.email;
  user.address = document.getElementById('acc-address')?.value || user.address;
  State.currentUser = user;
  sessionStorage.setItem('dealradar_user', JSON.stringify(user));
  const inputs = document.querySelectorAll('#account-form .form-input');
  inputs.forEach(i => { i.disabled = true; });
  document.getElementById('acc-edit-btn').classList.remove('hidden');
  document.getElementById('acc-save-btn').classList.add('hidden');
  setVal('account-display-name', user.name, true);
  setVal('account-display-email', user.email, true);
  showToast('Profile updated!', 'success');
}

function logoutCustomer() {
  sessionStorage.removeItem('dealradar_user');
  sessionStorage.removeItem('dealradar_cart');
  window.location.href = 'index.html';
}

// ============================================
// STORE OWNER PAGE
// ============================================
function initStore() {
  const store = JSON.parse(sessionStorage.getItem('dealradar_store') || 'null');
  if (!store) { window.location.href = 'index.html'; return; }
  State.currentStore = store;
  // Set hero info
  setVal('so-store-name', store.storeName, true);
  setVal('so-store-id', store.storeId, true);
  // Load account form
  setVal('so-acc-name', store.ownerName);
  setVal('so-acc-storename', store.storeName);
  setVal('so-acc-sid', store.storeId);
  setVal('so-acc-phone', store.phone);
  setVal('so-acc-email', store.email);
  setVal('so-acc-address', store.address);
  setVal('so-acc-store-name', store.storeName, true);
  setVal('so-acc-store-id', store.storeId, true);
  const catSelect = document.getElementById('so-acc-category');
  if (catSelect && store.category) catSelect.value = store.category;
  // Render products
  renderProducts();
  renderOrders('today');
  renderLowStock('today');
  renderMostOrdered();
}

// SO Nav
function switchSONav(tab) {
  ['home', 'products', 'orders', 'lowstock', 'account'].forEach(t => {
    document.getElementById(`so-nav-${t}`)?.classList.remove('active');
  });
  document.getElementById(`so-nav-${tab}`)?.classList.add('active');

  if (tab === 'products') showPanel('panel-products');
  else if (tab === 'orders') showPanel('panel-orders');
  else if (tab === 'lowstock') showPanel('panel-lowstock');
  else if (tab === 'account') showPanel('panel-so-account');
  else {
    ['panel-products','panel-orders','panel-lowstock','panel-so-account'].forEach(p => hidePanel(p));
  }
}

function hideSoPanel(id) {
  hidePanel(id);
  ['home','products','orders','lowstock','account'].forEach(t => {
    document.getElementById(`so-nav-${t}`)?.classList.remove('active');
  });
  document.getElementById('so-nav-home')?.classList.add('active');
}

// Products
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  document.getElementById('product-count-label').textContent = `${soProducts.length} products`;
  grid.innerHTML = soProducts.map(p => {
    const stockClass = p.stock > 10 ? 'in-stock' : p.stock > 0 ? 'low-stock' : 'out-stock';
    const stockLabel = p.stock > 10 ? '🟢 In Stock' : p.stock > 0 ? '🟡 Low Stock' : '🔴 Out of Stock';
    return `
      <div class="product-card">
        <div class="product-card-img">${p.img ? `<img src="${p.img}" alt="${p.name}">` : p.emoji}</div>
        <div class="product-card-body">
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-price">₹${p.price}</div>
          <span class="stock-badge ${stockClass}">${stockLabel} (${p.stock})</span>
          <div class="product-actions">
            <button class="btn btn-outline btn-sm" style="flex:1;font-size:12px;" onclick="openEditProduct('${p.id}')">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" style="flex:1;font-size:12px;" onclick="openDeleteProduct('${p.id}')">🗑️ Delete</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function addProduct() {
  const name = document.getElementById('new-prod-name')?.value.trim();
  const price = parseFloat(document.getElementById('new-prod-price')?.value) || 0;
  const stock = parseInt(document.getElementById('new-prod-stock')?.value) || 0;
  const img = document.getElementById('new-prod-img')?.value.trim();
  const cat = document.getElementById('new-prod-cat')?.value;
  if (!name || !price || !cat) { showToast('Please fill all required fields', 'error'); return; }
  const catEmojis = { grocery:'🛒', food:'🍔', toys:'🧸', clothing:'👗', pharmacy:'💊', electronics:'📱' };
  const newProd = {
    id: 'sp' + Date.now(),
    name, price, stock, img,
    emoji: catEmojis[cat] || '📦',
  };
  soProducts.push(newProd);
  renderProducts();
  showToast(`${name} added!`, 'success');
  hidePanel('panel-add-product');
  // Clear form
  ['new-prod-name','new-prod-price','new-prod-stock','new-prod-img'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('dc-products').textContent = soProducts.length;
}

function openEditProduct(id) {
  const p = soProducts.find(x => x.id === id);
  if (!p) return;
  setVal('edit-prod-id', id);
  setVal('edit-prod-name', p.name);
  setVal('edit-prod-price', p.price);
  setVal('edit-prod-stock', p.stock);
  showModal('modal-edit-product');
}

function saveProductEdit() {
  const id = document.getElementById('edit-prod-id')?.value;
  const idx = soProducts.findIndex(x => x.id === id);
  if (idx === -1) return;
  soProducts[idx].name = document.getElementById('edit-prod-name')?.value || soProducts[idx].name;
  soProducts[idx].price = parseFloat(document.getElementById('edit-prod-price')?.value) || soProducts[idx].price;
  soProducts[idx].stock = parseInt(document.getElementById('edit-prod-stock')?.value) || soProducts[idx].stock;
  renderProducts();
  hideModal('modal-edit-product');
  showToast('Product updated!', 'success');
}

function openDeleteProduct(id) {
  setVal('delete-prod-id', id);
  showModal('modal-delete-confirm');
}

function confirmDeleteProduct() {
  const id = document.getElementById('delete-prod-id')?.value;
  soProducts = soProducts.filter(x => x.id !== id);
  renderProducts();
  hideModal('modal-delete-confirm');
  showToast('Product deleted', '');
  document.getElementById('dc-products').textContent = soProducts.length;
}

// Orders
function filterOrders(period, btn) {
  document.querySelectorAll('.orders-filter .filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const customRange = document.getElementById('custom-date-range');
  if (period === 'custom') { customRange.classList.remove('hidden'); }
  else { customRange.classList.add('hidden'); renderOrders(period); }
}

function applyDateFilter() {
  const from = document.getElementById('date-from')?.value;
  const to = document.getElementById('date-to')?.value;
  if (!from || !to) { showToast('Please select both dates', 'error'); return; }
  document.getElementById('orders-period-label').textContent = `Showing orders from ${from} to ${to}`;
  renderOrders('custom', from, to);
}

function renderOrders(period, from, to) {
  const list = document.getElementById('orders-list');
  const label = document.getElementById('orders-period-label');
  if (!list) return;
  let filtered = soOrders;
  const now = new Date();
  if (period === 'today') {
    filtered = soOrders.filter(o => o.date.toDateString() === now.toDateString());
    if (label) label.textContent = 'Showing orders for today';
  } else if (period === '7days') {
    filtered = soOrders.filter(o => (now - o.date) <= 864e5 * 7);
    if (label) label.textContent = 'Showing orders for last 7 days';
  } else if (period === '30days') {
    filtered = soOrders.filter(o => (now - o.date) <= 864e5 * 30);
    if (label) label.textContent = 'Showing orders for last 30 days';
  }
  if (filtered.length === 0) {
    list.innerHTML = '<p style="color:var(--text-light);font-size:14px;text-align:center;padding:40px 0;">No orders found for this period.</p>';
    return;
  }
  list.innerHTML = filtered.map(o => {
    const statusClass = { delivered: 'status-delivered', processing: 'status-processing', pending: 'status-pending' }[o.status];
    const statusLabel = { delivered: '✅ Delivered', processing: '🔵 Processing', pending: '🟡 Pending' }[o.status];
    return `
      <div class="order-card">
        <div class="order-img">${o.emoji}</div>
        <div class="order-info">
          <div class="order-item-name">${o.item}</div>
          <div class="order-customer">👤 ${o.customer}</div>
          <div class="order-time">🕐 ${o.time}</div>
          <span class="order-status-badge ${statusClass}">${statusLabel}</span>
        </div>
        <div class="order-price">₹${o.price}</div>
      </div>`;
  }).join('');
}

// Low Stock
function filterLowStock(period, btn) {
  document.querySelectorAll('.low-stock-filter .filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const labels = { today: 'today', '7days': 'last 7 days', '30days': 'last 30 days' };
  const lbl = document.getElementById('ls-period-label');
  if (lbl) lbl.textContent = `Showing sales data for ${labels[period]}`;
  renderLowStock(period);
}

function renderLowStock(period) {
  const list = document.getElementById('low-stock-list');
  if (!list) return;
  const soldMap = { today: [12, 8, 0, 5], '7days': [84, 56, 0, 35], '30days': [360, 240, 0, 150] };
  const sold = soldMap[period] || soldMap['today'];
  const lowItems = soProducts.filter(p => p.stock <= 10);
  list.innerHTML = lowItems.map((p, i) => {
    const stockClass = p.stock > 0 ? 'low-stock' : 'out-stock';
    const stockLabel = p.stock > 0 ? `🟡 ${p.stock} left` : '🔴 Out of stock';
    return `
      <div class="low-stock-card">
        <div class="low-stock-img">${p.img ? `<img src="${p.img}" alt="${p.name}">` : p.emoji}</div>
        <div class="low-stock-info">
          <div class="low-stock-name">${p.name}</div>
          <div class="low-stock-price">₹${p.price}</div>
          <div class="low-stock-qty">${stockLabel}</div>
          <div class="low-stock-sold">📊 ${sold[i] || 0} units sold this period</div>
        </div>
      </div>`;
  }).join('') || '<p style="color:var(--text-light);font-size:14px;">No low stock items. Great job! ✅</p>';
}

function renderMostOrdered() {
  const list = document.getElementById('most-ordered-list');
  if (!list) return;
  const mostOrdered = [
    { name: 'Basmati Rice 1kg', emoji: '🍚', price: 120, orders: 48 },
    { name: 'Amul Butter 100g', emoji: '🧈', price: 55, orders: 34 },
    { name: 'Toor Dal 500g', emoji: '🫘', price: 75, orders: 27 },
    { name: 'Sunflower Oil 1L', emoji: '🛢️', price: 160, orders: 19 },
  ];
  list.innerHTML = mostOrdered.map((item, i) => `
    <div class="most-ordered-card">
      <div class="mo-rank">${i + 1}</div>
      <div class="mo-img">${item.emoji}</div>
      <div class="mo-info">
        <div class="mo-name">${item.name}</div>
        <div class="mo-price">₹${item.price}</div>
        <div class="mo-orders">🛒 ${item.orders} orders</div>
      </div>
    </div>`).join('');
}

// SO Account
function toggleSOAccountEdit() {
  const inputs = document.querySelectorAll('#so-account-form .form-input:not(.disabled-field)');
  const selects = document.querySelectorAll('#so-account-form .form-select');
  const editBtn = document.getElementById('so-acc-edit-btn');
  const saveBtn = document.getElementById('so-acc-save-btn');
  inputs.forEach(i => { i.disabled = false; });
  selects.forEach(s => { s.disabled = false; });
  editBtn.classList.add('hidden');
  saveBtn.classList.remove('hidden');
}

function saveSOAccount() {
  const store = State.currentStore;
  store.ownerName = document.getElementById('so-acc-name')?.value || store.ownerName;
  store.storeName = document.getElementById('so-acc-storename')?.value || store.storeName;
  store.phone = document.getElementById('so-acc-phone')?.value || store.phone;
  store.email = document.getElementById('so-acc-email')?.value || store.email;
  store.address = document.getElementById('so-acc-address')?.value || store.address;
  store.category = document.getElementById('so-acc-category')?.value || store.category;
  State.currentStore = store;
  sessionStorage.setItem('dealradar_store', JSON.stringify(store));

  const inputs = document.querySelectorAll('#so-account-form .form-input:not(.disabled-field)');
  const selects = document.querySelectorAll('#so-account-form .form-select');
  inputs.forEach(i => { i.disabled = true; });
  selects.forEach(s => { s.disabled = true; });
  document.getElementById('so-acc-edit-btn').classList.remove('hidden');
  document.getElementById('so-acc-save-btn').classList.add('hidden');

  setVal('so-store-name', store.storeName, true);
  setVal('so-acc-store-name', store.storeName, true);
  showToast('Profile updated!', 'success');
}

function logoutStore() {
  sessionStorage.removeItem('dealradar_store');
  window.location.href = 'index.html';
}