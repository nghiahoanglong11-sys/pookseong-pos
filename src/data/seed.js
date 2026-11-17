import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 4000;
const dataFile = path.resolve('server/data.json');

const defaultData = {
  shop: {
    name: 'PookSeong Korean Chicken',
    address: '889 Tỉnh lộ 884, Bến Tre',
    zalo: '0777775764',
    pointRate: 10000,
    pointValue: 500
  },
  menu: [
    { id: 'm1', name: 'Gà rán sốt mật ong cay', category: 'Gà sốt', price: 45000, active: true },
    { id: 'm2', name: 'Gà sốt chua ngọt Hàn Quốc', category: 'Gà sốt', price: 45000, active: true },
    { id: 'm3', name: 'Khoai tây lắc phô mai', category: 'Ăn vặt', price: 25000, active: true },
    { id: 'm4', name: 'Trà đào cam sả', category: 'Đồ uống', price: 22000, active: true },
    { id: 'm5', name: 'Coca-Cola', category: 'Đồ uống', price: 15000, active: true },
    { id: 'm6', name: 'Tokbokki phô mai kéo sợi', category: 'Ăn vặt', price: 35000, active: true }
  ],
  inventory: [
    { id: 'ing-1', name: 'Thịt gà tươi', unit: 'kg', stock: 15, min: 5 },
    { id: 'ing-2', name: 'Bột chiên giòn', unit: 'kg', stock: 8, min: 3 },
    { id: 'ing-3', name: 'Sốt / trà đào', unit: 'lít', stock: 4, min: 1 },
    { id: 'ing-4', name: 'Khoai tây', unit: 'kg', stock: 6, min: 1 }
  ],
  customers: [
    { id: 'c1', name: 'Nguyễn Minh Anh', phone: '0901234567', code: 'PS-8899AA', points: 45, totalSpent: 680000, visits: 6 },
    { id: 'c2', name: 'Trần Hoàng Nam', phone: '0987654321', code: 'PS-7766BB', points: 120, totalSpent: 2150000, visits: 14 }
  ],
  orders: [
    { id: 'ord-1', number: 'PS-000001', createdAt: new Date().toISOString(), status: 'paid', type: 'take', lines: [{ productId: 'm1', name: 'Gà rán sốt mật ong cay', qty: 2, price: 45000 }], subtotal: 90000, discount: 0, total: 90000, paymentMethod: 'cash', customerName: 'Nguyễn Minh Anh' },
    { id: 'ord-2', number: 'PS-000002', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'paid', type: 'table', lines: [{ productId: 'm3', name: 'Khoai tây lắc phô mai', qty: 3, price: 25000 }], subtotal: 75000, discount: 15000, total: 60000, paymentMethod: 'transfer', customerName: 'Khách lẻ' },
    { id: 'ord-3', number: 'PS-000003', createdAt: new Date(Date.now() - 172800000).toISOString(), status: 'paid', type: 'take', lines: [{ productId: 'm4', name: 'Trà đào cam sả', qty: 4, price: 22000 }], subtotal: 88000, discount: 0, total: 88000, paymentMethod: 'cash', customerName: 'Khách lẻ' }
  ],
  promotions: [
    { id: 'p1', name: 'Chào bạn mới - Giảm 10%', type: 'percent', value: 10, minTotal: 50000, code: 'POOK10', uses: 0, maxUses: 0, active: true },
    { id: 'p2', name: 'Giảm 15.000đ đơn từ 120.000đ', type: 'amount', value: 15000, minTotal: 120000, code: 'GIAM15K', uses: 0, maxUses: 0, active: true }
  ],
  employees: [
    { id: 'emp-admin', name: 'Quản lý chính', username: 'admin', password: 'admin123', role: 'admin' },
    { id: 'emp-manager', name: 'Quản lý', username: 'manager', password: 'manager123', role: 'manager' },
    { id: 'emp-cashier', name: 'Thu ngân', username: 'cashier', password: 'cashier123', role: 'cashier' },
    { id: 'emp-kitchen', name: 'Bếp', username: 'kitchen', password: 'kitchen123', role: 'kitchen' }
  ],
  stockLog: [],
  shopConfig: {
    pointRate: 10000,
    pointValue: 500
  }
};

function ensureSeed() {
  if (!fs.existsSync(dataFile)) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
  }
}

function readData() {
  ensureSeed();
  return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/menu', (req, res) => res.json(readData().menu));
app.get('/api/customers', (req, res) => res.json(readData().customers));
app.get('/api/inventory', (req, res) => res.json(readData().inventory));
app.get('/api/orders', (req, res) => res.json(readData().orders));
app.get('/api/employees', (req, res) => res.json(readData().employees));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const data = readData();
  const match = (data.employees || []).find(
    employee => employee.username === (username || '').trim() && employee.password === (password || '').trim()
  );

  if (!match) {
    return res.status(401).json({ ok: false, error: 'Tên đăng nhập hoặc mật khẩu sai.' });
  }

  return res.json({
    ok: true,
    user: {
      id: match.id,
      name: match.name,
      username: match.username,
      role: match.role
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, username, password, role } = req.body || {};
  const data = readData();

  if (!name || !username || !password) {
    return res.status(400).json({ ok: false, error: 'Thiếu thông tin.' });
  }

  if ((data.employees || []).some(item => item.username.toLowerCase() === String(username).toLowerCase())) {
    return res.status(409).json({ ok: false, error: 'Tên tài khoản đã tồn tại.' });
  }

  const employee = { id: `emp-${Date.now()}`, name, username, password, role: role || 'cashier' };
  data.employees = [...(data.employees || []), employee];
  writeData(data);
  res.status(201).json({ ok: true, employee });
});

app.get('/api/metrics', (req, res) => {
  const data = readData();
  const today = new Date();
  const todayOrders = (data.orders || []).filter(order => new Date(order.createdAt).toDateString() === today.toDateString());
  const revenue = todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStock = (data.inventory || []).filter(item => item.stock <= item.min).length;
  const products = {};

  todayOrders.forEach(order => {
    order.lines?.forEach(line => {
      const key = line.name || 'Món';
      if (!products[key]) products[key] = { qty: 0, revenue: 0 };
      products[key].qty += Number(line.qty || 0);
      products[key].revenue += Number(line.qty || 0) * Number(line.price || 0);
    });
  });

  const topProducts = Object.entries(products)
    .map(([name, value]) => ({ name, qty: value.qty, revenue: value.revenue }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  res.json({
    todayRevenue: revenue,
    ordersCount: todayOrders.length,
    averageOrder: todayOrders.length ? revenue / todayOrders.length : 0,
    lowInventory: lowStock,
    topProducts
  });
});

app.post('/api/orders', (req, res) => {
  const payload = req.body || {};
  const data = readData();
  const order = {
    id: `ord-${Date.now()}`,
    number: `PS-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: 'paid',
    type: payload.type || 'take',
    lines: payload.lines || [],
    subtotal: payload.subtotal || 0,
    discount: payload.discount || 0,
    total: payload.total || 0,
    paymentMethod: payload.paymentMethod || 'cash',
    customerName: payload.customerName || 'Khách lẻ'
  };

  data.orders = [order, ...(data.orders || [])];
  writeData(data);
  res.status(201).json(order);
});

app.listen(port, () => {
  console.log(`PookSeong API running at http://localhost:${port}`);
});
