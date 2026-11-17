import { create } from 'zustand';
import { seedData } from '../data/seed';

const STORAGE_KEY = 'pookseong-pos-store';

const safeLoad = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const usePosStore = create((set, get) => ({
  shop: seedData.shop,
  menu: seedData.menu,
  inventory: seedData.inventory,
  customers: seedData.customers,
  cart: [],
  customer: null,

  init: () => {
    const saved = safeLoad();
    if (!saved) return;

    set({
      shop: { ...seedData.shop, ...saved.shop },
      menu: saved.menu ?? seedData.menu,
      inventory: saved.inventory ?? seedData.inventory,
      customers: saved.customers ?? seedData.customers,
      cart: saved.cart ?? [],
      customer: saved.customer ?? null
    });
  },

  persist: () => {
    const state = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      shop: state.shop,
      menu: state.menu,
      inventory: state.inventory,
      customers: state.customers,
      cart: state.cart,
      customer: state.customer
    }));
  },

  updateShop: patch => {
    set(state => ({ shop: { ...state.shop, ...patch } }));
    get().persist();
  },

  addToCart: item => {
    const cart = get().cart;
    const exists = cart.find(entry => entry.id === item.id);

    if (exists) {
      set({ cart: cart.map(entry => entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry) });
    } else {
      set({ cart: [...cart, { ...item, qty: 1 }] });
    }

    get().persist();
  },

  changeQty: (id, delta) => {
    set(state => ({
      cart: state.cart
        .map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
        .filter(item => item.qty > 0)
    }));
    get().persist();
  },

  removeFromCart: id => {
    set(state => ({ cart: state.cart.filter(item => item.id !== id) }));
    get().persist();
  },

  addInventory: () => {
    set(state => ({
      inventory: [
        ...state.inventory,
        { id: `ing-${Date.now()}`, name: 'Nguyên liệu mới', unit: 'kg', stock: 0, min: 5 }
      ]
    }));
    get().persist();
  }
}));
