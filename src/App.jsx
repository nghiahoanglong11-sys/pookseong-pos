import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';

const STORAGE_KEY = 'pookseong-pos-experience-v1';
const money = value => `${Math.round(Number(value) || 0).toLocaleString('vi-VN')}đ`;
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
const nav = [['pos', 'Bán hàng'], ['orders', 'Đơn hàng'], ['kitchen', 'Màn hình bếp'], ['reports', 'Báo cáo'], ['qr', 'Đặt món QR'], ['settings', 'Cài đặt']];
const statusLabel = { new: 'Chờ xác nhận', prep: 'Đang làm', ready: 'Sẵn sàng', done: 'Hoàn tất', cancelled: 'Đã hủy' };

function loadSaved() {
  try { return { ...seed, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return seed; }
}
function saveLocal(value) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); return true; }
  catch { return false; }
}

export default function App() {
  const customerMode = new URLSearchParams(location.search).has('order');
  const [data, setData] = useState(loadSaved);
  const [page, setPage] = useState(customerMode ? 'qr' : 'pos');
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [orderType, setOrderType] = useState('take');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [message, setMessage] = useState('');
  const [serverOnline, setServerOnline] = useState(false);
  const [qrImage, setQrImage] = useState('');
  const [range, setRange] = useState('today');
  const cartTotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0);
  const menu = data.menu.filter(item => item.active && (!search || `${item.name} ${item.category}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi'))));

  const sync = useCallback(async () => {
    try {
      const response = await fetch('/api/state');
      if (!response.ok) throw new Error('API error');
      const remote = await response.json();
      setData(current => ({ ...current, ...remote, shop: { ...current.shop, ...(remote.shop || {}) } }));
      setServerOnline(true);
    } catch { setServerOnline(false); }
  }, []);

  useEffect(() => {
    sync();
    const timer = window.setInterval(sync, 12000);
    return () => window.clearInterval(timer);
  }, [sync]);
  useEffect(() => { saveLocal(data); }, [data]);
  useEffect(() => {
    const customerUrl = `${window.location.origin}${window.location.pathname}?order=1`;
    QRCode.toDataURL(customerUrl, { width: 240, margin: 2, color: { dark: '#0a4396', light: '#ffffff' } })
      .then(setQrImage).catch(() => setQrImage(''));
  }, []);

  const reportOrders = useMemo(() => data.orders.filter(order => {
    const created = new Date(order.createdAt);
    const age = Date.now() - created.getTime();
    if (range === 'today') return created.toDateString() === new Date().toDateString();
    if (range === 'week') return age >= 0 && age < 7 * 86400000;
    if (range === 'month') return age >= 0 && age < 30 * 86400000;
    return true;
  }), [data.orders, range]);
  const todayPaid = data.orders.filter(order => order.paymentStatus === 'paid' && new Date(order.createdAt).toDateString() === new Date().toDateString());

  function addToCart(product) {
    setCart(current => {
      const existing = current.find(line => line.id === product.id);
      return existing
        ? current.map(line => line.id === product.id ? { ...line, qty: line.qty + 1 } : line)
        : [...current, { ...product, qty: 1 }];
    });
  }
  function updateQuantity(id, delta) {
    setCart(current => current.map(line => line.id === id ? { ...line, qty: Math.max(0, line.qty + delta) } : line).filter(line => line.qty > 0));
  }

  async function submitOrder(source) {
    if (!cart.length) return setMessage('Giỏ hàng đang trống.');
    if (source === 'pos' && paymentMethod === 'cash' && Number(cashReceived) < cartTotal) return setMessage('Tiền khách đưa chưa đủ.');
    const payload = {
      source,
      type: orderType,
      lines: cart.map(line => ({ productId: line.id, qty: line.qty })),
      paymentMethod: source === 'pos' ? paymentMethod : 'unpaid',
      received: Number(cashReceived) || 0
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Không thể tạo đơn.');
      setData(current => ({ ...current, orders: [result, ...current.orders.filter(order => order.id !== result.id)] }));
      setMessage(source === 'qr' ? `Đã gửi đơn ${result.number} đến quán.` : `Đã ghi nhận đơn ${result.number} · ${money(result.total)}.`);
      setCart([]); setCashReceived('');
      if (source === 'qr') setPage('orders');
      return;
    } catch (error) {
      if (serverOnline) return setMessage(error.message);
    }

    const lines = cart.map(({ id, name, price, qty }) => ({ productId: id, name, price, qty }));
    const isQr = source === 'qr';
    const localOrder = {
      id: `local-${Date.now()}`, number: `LOCAL-${String(Date.now()).slice(-6)}`, createdAt: new Date().toISOString(),
      status: isQr ? 'new' : 'prep', paymentStatus: isQr ? 'pending' : 'paid', source, type: orderType,
      lines, subtotal: cartTotal, discount: 0, total: cartTotal,
      paymentMethod: isQr ? 'unpaid' : paymentMethod, received: Number(cashReceived) || 0,
      customerName: isQr ? 'Khách đặt QR' : 'Khách lẻ'
    };
    setData(current => ({ ...current, orders: [localOrder, ...current.orders] }));
    setCart([]); setCashReceived('');
    setMessage(`Đã lưu ${localOrder.number} trên thiết bị này. Đơn ngoại tuyến không đồng bộ sang màn hình khác.`);
    if (isQr) setPage('orders');
  }

  async function setOrderStatus(order, status) {
    if (order.id.startsWith('local-')) {
      setData(current => ({ ...current, orders: current.orders.map(item => item.id === order.id ? { ...item, status } : item) }));
      return;
    }
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(order.id)}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
      });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || 'Không cập nhật được đơn.');
      setData(current => ({ ...current, orders: current.orders.map(item => item.id === updated.id ? updated : item) }));
    } catch (error) { setMessage(error.message); }
  }

  function exportCsv() {
    const columns = ['Mã đơn', 'Thời gian', 'Trạng thái', 'Loại đơn', 'Khách', 'Thanh toán', 'Tổng'];
    const rows = [columns, ...reportOrders.map(order => [order.number, new Date(order.createdAt).toLocaleString('vi-VN'), statusLabel[order.status] || order.status, order.type, order.customerName || 'Khách lẻ', order.paymentMethod, order.total])];
    const csv = '\ufeff' + rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `pookseong-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportBackup() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'pookseong-backup.json'; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const displayedOrders = page === 'kitchen'
    ? data.orders.filter(order => ['new', 'prep', 'ready'].includes(order.status))
    : data.orders;

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-logo">P</div><div><strong>{data.shop.name}</strong><small>{data.shop.address}</small></div></div>
      <div className="connection"><span className={`dot ${serverOnline ? 'online' : ''}`} />{serverOnline ? 'Máy chủ kết nối' : 'Chế độ lưu trên thiết bị'}<b>{todayPaid.length} đơn hôm nay · {money(todayPaid.reduce((sum, order) => sum + order.total, 0))}</b></div>
    </header>
    {!customerMode && <nav className="tabs" aria-label="Điều hướng chính">{nav.map(([key, label]) => <button key={key} className={page === key ? 'active' : ''} onClick={() => { setPage(key); setMessage(''); }}>{label}</button>)}</nav>}
    <main className="content">
      {message && <div className="notice" role="status">{message}<button aria-label="Đóng thông báo" onClick={() => setMessage('')}>×</button></div>}

      {(page === 'pos' || (page === 'qr' && customerMode)) && <>
        <div className="heading"><div><h1>{customerMode ? 'Thực đơn đặt món' : 'Bán hàng'}</h1><p>{customerMode ? 'Chọn món và gửi yêu cầu đến quán.' : 'Chọn sản phẩm để tạo đơn tại quầy.'}</p></div>{!customerMode && <div className="button-group">{[['take', 'Mang đi'], ['table', 'Tại bàn'], ['delivery', 'Giao hàng']].map(([value, label]) => <button key={value} className={orderType === value ? 'selected' : ''} onClick={() => setOrderType(value)}>{label}</button>)}</div>}</div>
        <div className="pos-grid">
          <section className="panel"><input className="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm món..." aria-label="Tìm món" /><div className="products">{menu.map(item => <button className="product" key={item.id} onClick={() => addToCart(item)}><span aria-hidden="true">🍗</span><strong>{item.name}</strong><small>{item.category}</small><b>{money(item.price)}</b></button>)}{!menu.length && <p className="empty">Không có món phù hợp.</p>}</div></section>
          <aside className="panel cart"><h2>Giỏ hàng <small>{cart.reduce((sum, line) => sum + line.qty, 0)} món</small></h2><div className="cart-lines">{cart.map(item => <div className="cart-line" key={item.id}><div><strong>{item.name}</strong><small>{money(item.price)} × {item.qty}</small></div><div className="qty"><button aria-label={`Giảm ${item.name}`} onClick={() => updateQuantity(item.id, -1)}>−</button><b>{item.qty}</b><button aria-label={`Tăng ${item.name}`} onClick={() => updateQuantity(item.id, 1)}>+</button></div></div>)}{!cart.length && <p className="empty">Chưa chọn món.</p>}</div><div className="total"><span>Tổng cộng</span><strong>{money(cartTotal)}</strong></div>{!customerMode && <><label>Phương thức thanh toán<select value={paymentMethod} onChange={event => setPaymentMethod(event.target.value)}><option value="cash">Tiền mặt</option><option value="transfer">Chuyển khoản (ghi nhận thủ công)</option><option value="card">Thẻ (ghi nhận thủ công)</option></select></label>{paymentMethod === 'cash' && <label>Khách đưa<input inputMode="numeric" value={cashReceived} onChange={event => setCashReceived(event.target.value.replace(/\D/g, ''))} placeholder={String(cartTotal)} /></label>}</>}<button className="primary block" disabled={!cart.length} onClick={() => submitOrder(customerMode ? 'qr' : 'pos')}>{customerMode ? 'Gửi đơn đến quán' : 'Xác nhận thanh toán'}</button></aside>
        </div>
      </>}

      {page === 'orders' && <><div className="heading"><div><h1>Đơn hàng</h1><p>Đơn đặt qua QR và giao dịch tại quầy.</p></div><button className="secondary" onClick={sync}>Làm mới</button></div><OrderList orders={displayedOrders} onStatus={setOrderStatus} /></>}

      {page === 'kitchen' && <><div className="heading"><div><h1>Màn hình bếp</h1><p>Cập nhật trạng thái chế biến đơn hàng.</p></div><button className="secondary" onClick={sync}>Làm mới</button></div><OrderList orders={displayedOrders} onStatus={setOrderStatus} kitchen /></>}

      {page === 'reports' && <><div className="heading"><div><h1>Báo cáo doanh thu</h1><p>Xuất CSV dùng với Excel hoặc in/lưu trang thành PDF.</p></div><div className="button-group"><button className="secondary" onClick={exportCsv}>Xuất CSV</button><button className="primary" onClick={() => window.print()}>In / Lưu PDF</button></div></div><div className="button-group">{[['today', 'Hôm nay'], ['week', '7 ngày'], ['month', '30 ngày'], ['all', 'Tất cả']].map(([value, label]) => <button key={value} className={range === value ? 'selected' : ''} onClick={() => setRange(value)}>{label}</button>)}</div><div className="metrics"><Metric label="Doanh thu đã thanh toán" value={money(reportOrders.filter(order => order.paymentStatus === 'paid').reduce((sum, order) => sum + order.total, 0))} /><Metric label="Số đơn đã thanh toán" value={reportOrders.filter(order => order.paymentStatus === 'paid').length} /><Metric label="Đơn trung bình" value={money(reportOrders.length ? reportOrders.reduce((sum, order) => sum + order.total, 0) / reportOrders.length : 0)} /><Metric label="Nguyên liệu cảnh báo" value={data.inventory.filter(item => item.stock <= item.min).length} /></div><section className="panel table-wrap"><table><thead><tr><th>Mã</th><th>Ngày giờ</th><th>Khách</th><th>Loại đơn</th><th>Trạng thái</th><th className="right">Tổng</th></tr></thead><tbody>{reportOrders.map(order => <tr key={order.id}><td>{order.number}</td><td>{new Date(order.createdAt).toLocaleString('vi-VN')}</td><td>{order.customerName || 'Khách lẻ'}</td><td>{order.type}</td><td>{statusLabel[order.status] || order.status}</td><td className="right">{money(order.total)}</td></tr>)}{!reportOrders.length && <tr><td className="empty" colSpan="6">Không có đơn trong khoảng thời gian này.</td></tr>}</tbody></table></section></>}

      {page === 'qr' && !customerMode && <><div className="heading"><div><h1>Đặt món QR</h1><p>Khách cần truy cập được URL này từ điện thoại.</p></div></div><div className="qr-layout"><section className="panel qr-card"><h2>Mã QR thực đơn</h2>{qrImage && <img src={qrImage} alt="Mã QR mở thực đơn đặt món" />}<code>{location.origin}{location.pathname}?order=1</code><button className="secondary" onClick={() => navigator.clipboard?.writeText(`${location.origin}${location.pathname}?order=1`).then(() => setMessage('Đã sao chép liên kết.')).catch(() => setMessage('Không thể sao chép tự động; hãy chép URL hiển thị.'))}>Sao chép liên kết</button><p className="muted">Không dùng localhost khi quét từ thiết bị khác. Cần mở app bằng địa chỉ mạng LAN hoặc tên miền.</p></section><section className="panel"><h2>Luồng xử lý</h2><p>Đơn QR được lưu ở trạng thái chờ xác nhận; khi backend hoạt động, đơn sẽ hiện trong màn hình đơn hàng và bếp.</p><button className="primary" onClick={() => setPage('kitchen')}>Mở màn hình bếp</button></section></div></>}

      {page === 'settings' && <><div className="heading"><div><h1>Sao lưu dữ liệu</h1><p>Tải dữ liệu hiện có trong trình duyệt.</p></div></div><section className="panel settings"><p>Đây là bản trải nghiệm. Khi backend hoạt động, đơn trực tuyến được lưu tại máy chủ; sao lưu này tải dữ liệu đang được hiển thị trên app.</p><button className="primary" onClick={exportBackup}>Tải sao lưu JSON</button><p className="muted">Thanh toán chuyển khoản/thẻ chỉ được ghi nhận thủ công, chưa tích hợp cổng thanh toán. Backend JSON phù hợp thử nghiệm nội bộ, không dùng công khai cho dữ liệu thật.</p></section></>}
    </main>
    <footer>{serverOnline ? 'API đang hoạt động' : 'Lưu cục bộ trên trình duyệt'} · PookSeong POS</footer>
  </div>;
}

function Metric({ label, value }) { return <article className="metric"><span>{label}</span><strong>{value}</strong></article>; }
function OrderList({ orders, onStatus, kitchen = false }) {
  if (!orders.length) return <div className="panel empty">{kitchen ? 'Bếp chưa có đơn đang xử lý.' : 'Chưa có đơn hàng.'}</div>;
  return <div className={kitchen ? 'kitchen-grid' : 'order-list'}>{orders.map(order => <article className="panel order-card" key={order.id}><div className="between"><div><strong>{order.number}</strong><small>{new Date(order.createdAt).toLocaleString('vi-VN')} · {order.customerName || 'Khách lẻ'}</small></div><span className={`status ${order.status}`}>{statusLabel[order.status] || order.status}</span></div><p>{order.lines.map((line, index) => <span key={`${order.id}-${index}`} className="order-line">{line.qty} × {line.name}</span>)}</p><div className="between"><span>{order.source === 'qr' ? 'Đặt qua QR' : order.type} · {order.paymentStatus === 'paid' ? order.paymentMethod : 'Chờ thanh toán'}</span><strong>{money(order.total)}</strong></div><div className="button-group">{order.status === 'new' && <button className="primary" onClick={() => onStatus(order, 'prep')}>Nhận đơn / bắt đầu làm</button>}{order.status === 'prep' && <button className="primary" onClick={() => onStatus(order, 'ready')}>Đánh dấu sẵn sàng</button>}{order.status === 'ready' && <button className="primary" onClick={() => onStatus(order, 'done')}>Hoàn tất</button>}</div></article>)}</div>;
}
