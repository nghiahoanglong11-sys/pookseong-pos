import { create } from 'zustand';
import { seedData } from '../data/seed';

const STORAGE_KEY = 'pookseong-pos-store';
const seedEmployees = [
  { id: 'emp-admin', name: 'Quản lý chính', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 'emp-manager', name: 'Quản lý', username: 'manager', password: 'manager123', role: 'manager' },
  { id: 'emp-cashier', name: 'Thu ngân', username: 'cashier', password: 'cashier123', role: 'cashier' },
  { id: 'emp-kitchen', name: 'Bếp', username: 'kitchen', password: 'kitchen123', role: 'kitchen' }
];

const safeLoad = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const clone = value => JSON.parse(JSON.stringify(value));

export const usePosStore = create((set, get) => ({
  shop: clone(seedData.shop),
  menu: clone(seedData.menu),
  inventory: clone(seedData.inventory),
  customers: clone(seedData.customers),
  orders: [],
  promotions: clone(seedData.promotions),
  stockLog: [],
  cart: [],
  customer: null,
  orderType: 'take',
  selectedCustomerId: '',
  promoCode: '',
  currentUser: null,
  employees: seedEmployees,

  init: () => {
    const saved = safeLoad();
    if (!saved) {
      set({ employees: seedEmployees, currentUser: null });
      return;
    }

    set({
      shop: { ...clone(seedData.shop), ...(saved.shop || {}) },
      menu: Array.isArray(saved.menu) ? saved.menu : clone(seedData.menu),
      inventory: Array.isArray(saved.inventory) ? saved.inventory : clone(seedData.inventory),
      customers: Array.isArray(saved.customers) ? saved.customers : clone(seedData.customers),
      orders: Array.isArray(saved.orders) ? saved.orders : [],
      promotions: Array.isArray(saved.promotions) ? saved.promotions : clone(seedData.promotions),
      stockLog: Array.isArray(saved.stockLog) ? saved.stockLog : [],
      cart: Array.isArray(saved.cart) ? saved.cart : [],
      customer: saved.customer ?? null,
      orderType: saved.orderType || 'take',
      selectedCustomerId: saved.selectedCustomerId || '',
      promoCode: saved.promoCode || '',
      employees: Array.isArray(saved.employees) && saved.employees.length ? saved.employees : seedEmployees,
      currentUser: saved.currentUser ?? null
    });
  },

  persist: () => {
    const state = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      shop: state.shop,
      menu: state.menu,
      inventory: state.inventory,
      customers: state.customers,
      orders: state.orders,
      promotions: state.promotions,
      stockLog: state.stockLog,
      cart: state.cart,
      customer: state.customer,
      orderType: state.orderType,
      selectedCustomerId: state.selectedCustomerId,
      promoCode: state.promoCode,
      employees: state.employees,
      currentUser: state.currentUser
    }));
  },

  login: ({ username, password }) => {
    const trimmedUser = (username || '').trim();
    const trimmedPassword = (password || '').trim();
    const match = get().employees.find(
      employee => employee.username === trimmedUser && employee.password === trimmedPassword
    );

    if (!match) {
      return { ok: false, error: 'Tên đăng nhập hoặc mật khẩu sai.' };
    }

    const currentUser = {
      id: match.id,
      name: match.name,
      username: match.username,
      role: match.role
    };

    set({ currentUser });
    get().persist();
    return { ok: true, user: currentUser };
  },

  logout: () => {
    set({ currentUser: null });
    get().persist();
    return true;
  },

  registerEmployee: employee => {
    const name = (employee.name || '').trim();
    const username = (employee.username || '').trim();
    const password = (employee.password || '').trim();
    const role = employee.role || 'cashier';

    if (!name || !username || !password) {
      return { ok: false, error: 'Vui lòng điền đầy đủ tên, tài khoản và mật khẩu.' };
    }

    if (get().employees.some(item => item.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, error: 'Tên tài khoản đã tồn tại.' };
    }

    const newEmployee = {
      id: `emp-${Date.now()}`,
      name,
      username,
      password,
      role
    };

    set(state => ({ employees: [...state.employees, newEmployee] }));
    get().persist();
    return { ok: true, employee: newEmployee };
  },

  updateShop: patch => {
    set(state => ({ shop: { ...state.shop, ...patch } }));
    get().persist();
  },

  addToCart: item => {
    const cart = get().cart;
    const exists = cart.find(entry => entry.productId === item.id);

    if (exists) {
      set({ cart: cart.map(entry => entry.productId === item.id ? { ...entry, qty: entry.qty + 1 } : entry) });
    } else {
      set({ cart: [...cart, { productId: item.id, name: item.name, category: item.category, price: item.price, qty: 1 }] });
    }

    get().persist();
  },

  changeQty: (id, delta) => {
    set(state => ({
      cart: state.cart
        .map(item => item.productId === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
        .filter(item => item.qty > 0)
    }));
    get().persist();
  },

  removeFromCart: id => {
    set(state => ({ cart: state.cart.filter(item => item.productId !== id) }));
    get().persist();
  },

  clearCart: () => {
    set({ cart: [], promoCode: '', selectedCustomerId: '' });
    get().persist();
  },

  setOrderType: orderType => {
    set({ orderType });
    get().persist();
  },

  selectCustomer: selectedCustomerId => {
    set({ selectedCustomerId });
    get().persist();
  },

  setPromoCode: promoCode => {
    set({ promoCode });
    get().persist();
  },

  addInventory: ({ name, unit, quantity, min = 0 }) => {
    const qty = Number(quantity);
    const threshold = Number(min);
    if (!name?.trim() || !Number.isFinite(qty) || qty < 0 || !Number.isFinite(threshold) || threshold < 0) {
      return { ok: false, error: 'Vui lòng nhập tên, số lượng và ngưỡng hợp lệ.' };
    }

    const id = `ing-${Date.now()}`;
    set(state => ({
      inventory: [...state.inventory, { id, name: name.trim(), unit: (unit || 'cái').trim(), stock: qty, min: threshold }],
      stockLog: [
        ...state.stockLog,
        { id: `sl-${Date.now()}`, at: new Date().toISOString(), name: name.trim(), change: qty, note: 'Tạo nguyên liệu' }
      ]
    }));
    get().persist();
    return { ok: true };
  },

  adjustStock: (id, amount, note) => {
    const delta = Number(amount);
    const item = get().inventory.find(entry => entry.id === id);
    if (!item || !Number.isFinite(delta) || !delta || item.stock + delta < 0) {
      return { ok: false, error: 'Số lượng điều chỉnh không hợp lệ.' };
    }

    set(state => ({
      inventory: state.inventory.map(entry => entry.id === id ? { ...entry, stock: Number((entry.stock + delta).toFixed(3)) } : entry),
      stockLog: [...state.stockLog, {
        id: `sl-${Date.now()}`,
        at: new Date().toISOString(),
        name: item.name,
        change: delta,
        note: note?.trim() || 'Điều chỉnh tồn kho'
      }]
    }));
    get().persist();
    return { ok: true };
  },

  addCustomer: ({ name, phone }) => {
    const normalized = (phone || '').replace(/\D/g, '');
    const cleanedName = (name || '').trim();
    if (!cleanedName || normalized.length < 9 || normalized.length > 11) {
      return { ok: false, error: 'Nhập tên và số điện thoại hợp lệ.' };
    }

    if (get().customers.some(customer => customer.phone === normalized)) {
      return { ok: false, error: 'Số điện thoại đã được đăng ký.' };
    }

    const customer = {
      id: `c-${Date.now()}`,
      name: cleanedName,
      phone: normalized,
      code: `PS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      points: 0,
      totalSpent: 0,
      visits: 0
    };

    set(state => ({ customers: [...state.customers, customer] }));
    get().persist();
    return { ok: true, customer };
  },

  savePromotion: promo => {
    const normalizedName = (promo.name || '').trim();
    const value = Number(promo.value);
    if (!normalizedName || !Number.isFinite(value) || value <= 0 || (promo.type === 'percent' && value > 100)) {
      return { ok: false, error: 'Nhập tên và giá trị khuyến mãi hợp lệ.' };
    }

    const item = {
      ...promo,
      id: promo.id || `promo-${Date.now()}`,
      name: normalizedName,
      value,
      minTotal: Number(promo.minTotal || 0),
      uses: Number(promo.uses || 0),
      maxUses: Number(promo.maxUses || 0),
      code: (promo.code || '').trim().toUpperCase(),
      active: promo.active !== false
    };

    set(state => ({
      promotions: promo.id ? state.promotions.map(existing => existing.id === promo.id ? item : existing) : [...state.promotions, item]
    }));
    get().persist();
    return { ok: true };
  },

  exportBackup: () => JSON.stringify({
    shop: get().shop,
    menu: get().menu,
    inventory: get().inventory,
    customers: get().customers,
    orders: get().orders,
    promotions: get().promotions,
    stockLog: get().stockLog,
    employees: get().employees
  }, null, 2),

  calculateCart: () => {
    const { cart, promoCode, promotions } = get();
    const subtotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0);
    const today = new Date().toISOString().slice(0, 10);
    const code = (promoCode || '').trim().toUpperCase();
    const promo = promotions.find(item => item.active && (!item.code || item.code.toUpperCase() === code) && (!item.from || today >= item.from) && (!item.to || today <= item.to) && subtotal >= (item.minTotal || 0) && (!item.maxUses || item.uses < item.maxUses)) || null;
    const discount = promo ? Math.min(subtotal, promo.type === 'percent' ? Math.round(subtotal * promo.value / 100) : promo.value) : 0;
    return { subtotal, discount, promo, total: Math.max(0, subtotal - discount) };
  },

  checkout: ({ paymentMethod = 'cash', received } = {}) => {
    const state = get();
    if (!state.cart.length) return { ok: false, error: 'Đơn hàng chưa có món.' };

    const totals = state.calculateCart();
    if (paymentMethod === 'cash' && Number(received) < totals.total) {
      return { ok: false, error: 'Số tiền khách đưa chưa đủ.' };
    }

    const order = {
      id: `ord-${Date.now()}`,
      number: `PS-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'paid',
      type: state.orderType,
      lines: state.cart.map(line => ({ ...line })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      paymentMethod,
      received: paymentMethod === 'cash' ? Number(received) : totals.total,
      change: paymentMethod === 'cash' ? Math.max(0, Number(received) - totals.total) : 0,
      customerName: state.customers.find(item => item.id === state.selectedCustomerId)?.name || 'Khách lẻ'
    };

    set(state => ({
      orders: [order, ...state.orders],
      cart: [],
      promoCode: '',
      selectedCustomerId: '',
      orderType: 'take'
    }));
    get().persist();
    return { ok: true, order };
  }
}));
