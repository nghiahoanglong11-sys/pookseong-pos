import { useMemo, useState } from 'react';
import { usePosStore, calculateCart } from '../store/usePosStore';
import { CartPanel } from '../components/CartPanel';

const money = value => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

export function POSPage() {
  const menu = usePosStore(state => state.menu);
  const cart = usePosStore(state => state.cart);
  const addToCart = usePosStore(state => state.addToCart);
  const checkout = usePosStore(state => state.checkout);
  const orderType = usePosStore(state => state.orderType);
  const setOrderType = usePosStore(state => state.setOrderType);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [method, setMethod] = useState('cash');
  const [received, setReceived] = useState('');
  const [notice, setNotice] = useState('');
  const categories = useMemo(() => ['Tất cả', ...new Set(menu.filter(item => item.active).map(item => item.category))], [menu]);
  const query = search.trim().toLocaleLowerCase('vi');
  const products = menu.filter(item => item.active && (category === 'Tất cả' || item.category === category) && (!query || `${item.name} ${item.category}`.toLocaleLowerCase('vi').includes(query)));
  const totals = calculateCart(cart, usePosStore.getState().promoCode, usePosStore.getState().promotions);

  function openPayment() { if (!cart.length) return; setReceived(String(totals.total)); setNotice(''); setPaymentOpen(true); }
  function confirmPayment() {
    const result = checkout({ paymentMethod: method, received: Number(received) });
    if (!result.ok) { setNotice(result.error); return; }
    setPaymentOpen(false); setMethod('cash'); setNotice('');
    window.alert(`Thanh toán thành công · ${result.order.number} · ${money(result.order.total)}${result.order.change ? ` · Tiền thừa ${money(result.order.change)}` : ''}`);
  }

  return <>
    <div className="page-title"><div><h1>Bán hàng</h1><p>Chọn món, kiểm tra đơn và hoàn tất thanh toán.</p></div><div className="segmented">{[['take','Mang đi'],['table','Tại bàn'],['delivery','Giao hàng']].map(([key,label]) => <button key={key} className={orderType === key ? 'selected' : ''} onClick={() => setOrderType(key)}>{label}</button>)}</div></div>
    <div className="pos-page">
      <section className="panel main-panel">
        <div className="toolbar"><input aria-label="Tìm món" value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm món..." /><button className="secondary-btn" onClick={() => { setSearch(''); setCategory('Tất cả'); }}>Xóa lọc</button></div>
        <div className="category-row">{categories.map(item => <button key={item} className={`category-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="product-grid">{products.map(item => <button key={item.id} className="product-card" onClick={() => addToCart(item)}><span className="product-icon">🍗</span><span className="product-name">{item.name}</span><span className="product-meta">{item.category}</span><span className="product-price">{money(item.price)}</span></button>)}</div>
        {!products.length && <div className="empty-state">Không tìm thấy món phù hợp.</div>}
      </section>
      <CartPanel onCheckout={openPayment} />
    </div>
    {paymentOpen && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPaymentOpen(false); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="pay-title"><div className="modal-heading"><div><h2 id="pay-title">Thanh toán</h2><p>Kiểm tra tổng tiền trước khi xác nhận.</p></div><button className="icon-btn" onClick={() => setPaymentOpen(false)} aria-label="Đóng">×</button></div><div className="payment-total">{money(totals.total)}</div><div className="segmented full">{[['cash','Tiền mặt'],['transfer','Chuyển khoản'],['card','Thẻ']].map(([key,label]) => <button key={key} className={method === key ? 'selected' : ''} onClick={() => setMethod(key)}>{label}</button>)}</div>{method === 'cash' && <label className="field-label">Khách đưa<input autoFocus inputMode="numeric" value={received} onChange={event => setReceived(event.target.value.replace(/[^\d]/g,''))} /></label>}{method !== 'cash' && <div className="notice info">Xác nhận sau khi đã kiểm tra thanh toán thành công.</div>}{notice && <div className="notice error">{notice}</div>}<div className="modal-actions"><button className="secondary-btn" onClick={() => setPaymentOpen(false)}>Quay lại</button><button className="primary-btn" onClick={confirmPayment}>Xác nhận thanh toán</button></div></section></div>}
  </>;
}
