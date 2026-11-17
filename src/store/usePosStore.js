import { create } from 'zustand';
import { seedData } from '../data/seed';

const STORAGE_KEY = 'pookseong-pos-store';
const clone = value => JSON.parse(JSON.stringify(value));
function readSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { return null; }
}
function persist(state) {
  try {
    const { shop, menu, inventory, customers, cart, orders, promotions, stockLog, orderType, selectedCustomerId, promoCode } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ shop, menu, inventory, customers, cart, orders, promotions, stockLog, orderType, selectedCustomerId, promoCode }));
    return true;
  } catch { return false; }
}
export function calculateCart(cart, promoCode, promotions) {
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0);
  const today = new Date().toISOString().slice(0, 10);
  const code = (promoCode || '').trim().toUpperCase();
  const promo = promotions.find(item => item.active && (!item.code || item.code.toUpperCase() === code) && (!item.from || today >= item.from) && (!item.to || today <= item.to) && subtotal >= (item.minTotal || 0) && (!item.maxUses || item.uses < item.maxUses)) || null;
  const discount = promo ? Math.min(subtotal, promo.type === 'percent' ? Math.round(subtotal * promo.value / 100) : promo.value) : 0;
  return { subtotal, discount, promo, total: Math.max(0, subtotal - discount) };
}

export const usePosStore = create((set, get) => ({
  ...clone(seedData), cart: [], orderType: 'take', selectedCustomerId: '', promoCode: '',
  init: () => {
    const saved = readSaved();
    if (!saved) return;
    set({
      shop: { ...clone(seedData.shop), ...(saved.shop || {}) },
      menu: Array.isArray(saved.menu) ? saved.menu : clone(seedData.menu),
      inventory: Array.isArray(saved.inventory) ? saved.inventory : clone(seedData.inventory),
      customers: Array.isArray(saved.customers) ? saved.customers.map(c => ({ ...c, totalSpent: c.totalSpent ?? c.total ?? 0 })) : clone(seedData.customers),
      cart: Array.isArray(saved.cart) ? saved.cart : [],
      orders: Array.isArray(saved.orders) ? saved.orders : [],
      promotions: Array.isArray(saved.promotions) ? saved.promotions : clone(seedData.promotions),
      stockLog: Array.isArray(saved.stockLog) ? saved.stockLog : [],
      orderType: saved.orderType || 'take', selectedCustomerId: saved.selectedCustomerId || '', promoCode: saved.promoCode || ''
    });
  },
  addToCart: product => {
    if (!product || !product.active || product.price <= 0) return;
    set(state => {
      const existing = state.cart.find(line => line.productId === product.id);
      return { cart: existing ? state.cart.map(line => line.productId === product.id ? { ...line, qty: line.qty + 1 } : line) : [...state.cart, { productId: product.id, name: product.name, category: product.category, price: product.price, qty: 1 }] };
    }); persist(get());
  },
  changeQty: (id, delta) => { set(state => ({ cart: state.cart.map(line => line.productId === id ? { ...line, qty: Math.max(0, line.qty + delta) } : line).filter(line => line.qty > 0) })); persist(get()); },
  removeFromCart: id => { set(state => ({ cart: state.cart.filter(line => line.productId !== id) })); persist(get()); },
  clearCart: () => { set({ cart: [], promoCode: '', selectedCustomerId: '' }); persist(get()); },
  setOrderType: orderType => { set({ orderType }); persist(get()); },
  selectCustomer: selectedCustomerId => { set({ selectedCustomerId }); persist(get()); },
  setPromoCode: promoCode => { set({ promoCode }); persist(get()); },
  checkout: ({ paymentMethod = 'cash', received } = {}) => {
    const state = get();
    if (!state.cart.length) return { ok: false, error: 'Đơn hàng chưa có món.' };
    const totals = calculateCart(state.cart, state.promoCode, state.promotions);
    if (paymentMethod === 'cash' && Number(received) < totals.total) return { ok: false, error: 'Số tiền khách đưa chưa đủ.' };
    const insuff = [];
    for (const line of state.cart) {
      const product = state.menu.find(item => item.id === line.productId);
      for (const recipe of product?.recipe || []) {
        const ingredient = state.inventory.find(item => item.id === recipe.inventoryId);
        if (ingredient && ingredient.stock < recipe.qty * line.qty) insuff.push(ingredient.name);
      }
    }
    if (insuff.length) return { ok: false, error: `Không đủ tồn kho: ${[...new Set(insuff)].join(', ')}.` };
    const customer = state.customers.find(item => item.id === state.selectedCustomerId);
    const now = new Date().toISOString();
    const order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      number: `PS-${Date.now().toString().slice(-6)}`, createdAt: now, status: 'paid', type: state.orderType,
      lines: state.cart.map(line => ({ ...line })), subtotal: totals.subtotal, discount: totals.discount,
      promoName: totals.promo?.name || '', total: totals.total, paymentMethod,
      received: paymentMethod === 'cash' ? Number(received) : totals.total,
      change: paymentMethod === 'cash' ? Math.max(0, Number(received) - totals.total) : 0,
      customerId: customer?.id || '', customerName: customer?.name || ''
    };
    const inventory = state.inventory.map(item => {
      let used = 0;
      for (const line of state.cart) {
        const product = state.menu.find(entry => entry.id === line.productId);
        used += (product?.recipe || []).filter(recipe => recipe.inventoryId === item.id).reduce((sum, recipe) => sum + recipe.qty * line.qty, 0);
      }
      return used ? { ...item, stock: Number((item.stock - used).toFixed(3)) } : item;
    });
    const customers = customer ? state.customers.map(item => item.id === customer.id ? { ...item, points: (item.points || 0) + Math.floor(totals.total / (state.shop.pointRate || 10000)), totalSpent: (item.totalSpent || 0) + totals.total, visits: (item.visits || 0) + 1 } : item) : state.customers;
    const promotions = totals.promo ? state.promotions.map(item => item.id === totals.promo.id ? { ...item, uses: (item.uses || 0) + 1 } : item) : state.promotions;
    const stockLog = [...state.stockLog];
    inventory.forEach(item => { const before = state.inventory.find(old => old.id === item.id); if (before && item.stock !== before.stock) stockLog.push({ id: `sl-${Date.now()}-${item.id}`, at: now, name: item.name, change: item.stock - before.stock, note: `Bán đơn ${order.number}` }); });
    set({ orders: [order, ...state.orders], inventory, customers, promotions, cart: [], promoCode: '', selectedCustomerId: '', orderType: 'take', stockLog });
    persist(get());
    return { ok: true, order };
  },
  addInventory: ({ name, unit, quantity, min = 0 }) => {
    const qty = Number(quantity), threshold = Number(min);
    if (!name?.trim() || !Number.isFinite(qty) || qty < 0 || !Number.isFinite(threshold) || threshold < 0) return { ok: false, error: 'Vui lòng nhập tên, số lượng và ngưỡng hợp lệ.' };
    const id = `ing-${Date.now()}`;
    set(state => ({ inventory: [...state.inventory, { id, name: name.trim(), unit: unit.trim() || 'cái', stock: qty, min: threshold }], stockLog: [...state.stockLog, { id: `sl-${Date.now()}`, at: new Date().toISOString(), name: name.trim(), change: qty, note: 'Tạo nguyên liệu' }] })); persist(get()); return { ok: true };
  },
  adjustStock: (id, amount, note) => {
    const delta = Number(amount), item = get().inventory.find(entry => entry.id === id);
    if (!item || !Number.isFinite(delta) || !delta || item.stock + delta < 0) return { ok: false, error: 'Số lượng điều chỉnh không hợp lệ.' };
    set(state => ({ inventory: state.inventory.map(entry => entry.id === id ? { ...entry, stock: Number((entry.stock + delta).toFixed(3)) } : entry), stockLog: [...state.stockLog, { id: `sl-${Date.now()}`, at: new Date().toISOString(), name: item.name, change: delta, note: note?.trim() || 'Điều chỉnh tồn kho' }] })); persist(get()); return { ok: true };
  },
  addCustomer: ({ name, phone }) => {
    const normalized = phone.replace(/\D/g, '');
    if (!name.trim() || normalized.length < 9 || normalized.length > 11) return { ok: false, error: 'Nhập tên và số điện thoại hợp lệ.' };
    if (get().customers.some(customer => customer.phone === normalized)) return { ok: false, error: 'Số điện thoại đã được đăng ký.' };
    const customer = { id: `c-${Date.now()}`, name: name.trim(), phone: normalized, code: `PS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, points: 0, totalSpent: 0, visits: 0 };
    set(state => ({ customers: [...state.customers, customer] })); persist(get()); return { ok: true, customer };
  },
  savePromotion: promo => {
    if (!promo.name.trim() || Number(promo.value) <= 0 || (promo.type === 'percent' && Number(promo.value) > 100)) return { ok: false, error: 'Nhập tên và giá trị khuyến mãi hợp lệ.' };
    const item = { ...promo, id: promo.id || `promo-${Date.now()}`, value: Number(promo.value), minTotal: Number(promo.minTotal || 0), uses: Number(promo.uses || 0), maxUses: Number(promo.maxUses || 0), active: promo.active !== false, code: (promo.code || '').trim().toUpperCase() };
    set(state => ({ promotions: promo.id ? state.promotions.map(existing => existing.id === promo.id ? item : existing) : [...state.promotions, item] })); persist(get()); return { ok: true };
  },
  updateShop: patch => { set(state => ({ shop: { ...state.shop, ...patch } })); persist(get()); },
  exportBackup: () => JSON.stringify(readSaved() || get(), null, 2)
}));
