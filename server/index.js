import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 4000);
const dataFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data.json');
const seed = {
  shop: { name: 'PookSeong Korean Chicken', address: '889 Tỉnh lộ 884, Bến Tre', phone: '0777775764' },
  menu: [
    { id: 'm1', name: 'Gà rán sốt mật ong cay', category: 'Gà sốt', price: 45000, active: true },
    { id: 'm2', name: 'Gà sốt chua ngọt Hàn Quốc', category: 'Gà sốt', price: 45000, active: true },
    { id: 'm3', name: 'Khoai tây lắc phô mai', category: 'Ăn vặt', price: 25000, active: true },
    { id: 'm4', name: 'Trà đào cam sả', category: 'Đồ uống', price: 22000, active: true },
    { id: 'm5', name: 'Coca-Cola', category: 'Đồ uống', price: 15000, active: true },
    { id: 'm6', name: 'Tokbokki phô mai kéo sợi', category: 'Ăn vặt', price: 35000, active: true }
  ],
  inventory: [
    { id: 'i1', name: 'Thịt gà tươi', unit: 'kg', stock: 15, min: 5 },
    { id: 'i2', name: 'Bột chiên giòn', unit: 'kg', stock: 8, min: 3 },
    { id: 'i3', name: 'Sốt mật ong cay', unit: 'lít', stock: 4, min: 1 }
  ],
  orders: []
};

function writeData(value) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  const temp = `${dataFile}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(value, null, 2), 'utf8');
  fs.renameSync(temp, dataFile);
}
function readData() {
  try {
    if (!fs.existsSync(dataFile)) writeData(seed);
    const saved = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    return {
      ...seed, ...saved,
      shop: { ...seed.shop, ...(saved.shop || {}) },
      menu: Array.isArray(saved.menu) ? saved.menu : seed.menu,
      inventory: Array.isArray(saved.inventory) ? saved.inventory : seed.inventory,
      orders: Array.isArray(saved.orders) ? saved.orders : []
    };
  } catch (error) {
    console.error('Cannot read POS data:', error.message);
    return structuredClone(seed);
  }
}
const bad = (res, error, status = 400) => res.status(status).json({ error });
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/state', (_req, res) => res.json(readData()));
app.get('/api/orders', (_req, res) => res.json(readData().orders));
app.get('/api/metrics', (_req, res) => {
  const data = readData();
  const paid = data.orders.filter(order => order.paymentStatus === 'paid');
  const today = new Date().toDateString();
  const orders = paid.filter(order => new Date(order.createdAt).toDateString() === today);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  return res.json({ revenue, orders: orders.length, average: orders.length ? revenue / orders.length : 0, lowStock: data.inventory.filter(item => Number(item.stock) <= Number(item.min)).length });
});
app.post('/api/orders', (req, res) => {
  const data = readData();
  const { lines, source = 'pos', type = 'take', paymentMethod = 'cash', received = 0 } = req.body || {};
  if (!Array.isArray(lines) || lines.length < 1 || lines.length > 80) return bad(res, 'Giỏ hàng trống hoặc quá nhiều món.');
  if (!['pos', 'qr'].includes(source) || !['take', 'table', 'delivery'].includes(type)) return bad(res, 'Loại đơn không hợp lệ.');
  const verified = [];
  for (const line of lines) {
    const product = data.menu.find(item => item.id === line.productId && item.active);
    const quantity = Number(line.qty);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return bad(res, 'Món hoặc số lượng không hợp lệ.');
    verified.push({ productId: product.id, name: product.name, price: Number(product.price), qty: quantity });
  }
  const subtotal = verified.reduce((sum, line) => sum + line.price * line.qty, 0);
  const isPaid = source === 'pos';
  if (isPaid && !['cash', 'transfer', 'card'].includes(paymentMethod)) return bad(res, 'Phương thức thanh toán không hợp lệ.');
  if (isPaid && paymentMethod === 'cash' && (!Number.isFinite(Number(received)) || Number(received) < subtotal)) return bad(res, 'Tiền khách đưa chưa đủ.');
  const timestamp = Date.now();
  const order = {
    id: `order-${timestamp}-${Math.random().toString(36).slice(2, 7)}`,
    number: `PS-${String(timestamp).slice(-8)}`,
    createdAt: new Date(timestamp).toISOString(), status: isPaid ? 'prep' : 'new',
    paymentStatus: isPaid ? 'paid' : 'pending', source, type, lines: verified,
    subtotal, discount: 0, total: subtotal,
    paymentMethod: isPaid ? paymentMethod : 'unpaid',
    received: isPaid ? Number(received) : 0,
    change: isPaid && paymentMethod === 'cash' ? Math.max(0, Number(received) - subtotal) : 0,
    customerName: source === 'qr' ? 'Khách đặt QR' : 'Khách lẻ'
  };
  data.orders = [order, ...data.orders];
  try { writeData(data); } catch (error) { console.error(error); return bad(res, 'Không lưu được đơn hàng.', 500); }
  return res.status(201).json(order);
});
app.patch('/api/orders/:id/status', (req, res) => {
  const allowed = ['new', 'prep', 'ready', 'done', 'cancelled'];
  const { status } = req.body || {};
  if (!allowed.includes(status)) return bad(res, 'Trạng thái không hợp lệ.');
  const data = readData();
  const index = data.orders.findIndex(order => order.id === req.params.id);
  if (index < 0) return bad(res, 'Không tìm thấy đơn hàng.', 404);
  data.orders[index] = { ...data.orders[index], status };
  try { writeData(data); } catch (error) { console.error(error); return bad(res, 'Không lưu được trạng thái.', 500); }
  return res.json(data.orders[index]);
});
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error instanceof SyntaxError && 'body' in error) return bad(res, 'JSON yêu cầu không hợp lệ.');
  return bad(res, 'Lỗi máy chủ nội bộ.', 500);
});
app.listen(port, () => console.log(`PookSeong POS API listening at http://localhost:${port}`));
