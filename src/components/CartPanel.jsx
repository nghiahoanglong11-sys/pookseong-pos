import { usePosStore, calculateCart } from '../store/usePosStore';
const money = value => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;
export function CartPanel({ onCheckout }) {
  const cart = usePosStore(state => state.cart);
  const changeQty = usePosStore(state => state.changeQty);
  const removeFromCart = usePosStore(state => state.removeFromCart);
  const customers = usePosStore(state => state.customers);
  const selectedCustomerId = usePosStore(state => state.selectedCustomerId);
  const selectCustomer = usePosStore(state => state.selectCustomer);
  const promoCode = usePosStore(state => state.promoCode);
  const setPromoCode = usePosStore(state => state.setPromoCode);
  const promotions = usePosStore(state => state.promotions);
  const totals = calculateCart(cart, promoCode, promotions);
  return <aside className="cart-panel panel"><div className="panel-header"><div><h2>Đơn hiện tại</h2><small className="muted">{cart.reduce((sum,item) => sum + item.qty, 0)} món</small></div><span className="badge">{cart.length ? 'Đang tạo' : 'Trống'}</span></div>
    <div className="cart-items">{cart.length ? cart.map(item => <div key={item.productId} className="cart-item"><div className="cart-item-main"><strong>{item.name}</strong><small>{money(item.price)} / món</small><b>{money(item.price * item.qty)}</b></div><div className="qty-control"><button aria-label={`Giảm ${item.name}`} onClick={() => changeQty(item.productId,-1)}>−</button><span>{item.qty}</span><button aria-label={`Tăng ${item.name}`} onClick={() => changeQty(item.productId,1)}>+</button></div><button className="remove-btn" onClick={() => removeFromCart(item.productId)}>Xóa</button></div>) : <div className="empty-state">Chọn món để bắt đầu đơn hàng.</div>}</div>
    <label className="field-label">Khách hàng<select value={selectedCustomerId} onChange={event => selectCustomer(event.target.value)}><option value="">Khách lẻ</option>{customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name} · {customer.code}</option>)}</select></label>
    <label className="field-label">Mã khuyến mãi<input value={promoCode} onChange={event => setPromoCode(event.target.value.toUpperCase())} placeholder="Ví dụ: POOK10" /></label>
    <div className="summary-box"><div className="row"><span>Tạm tính</span><span>{money(totals.subtotal)}</span></div>{totals.promo ? <div className="row discount-row"><span>{totals.promo.name}</span><span>−{money(totals.discount)}</span></div> : promoCode ? <small className="muted">Mã chưa áp dụng hoặc chưa đủ điều kiện.</small> : null}<div className="row total-row"><strong>Tổng thanh toán</strong><strong>{money(totals.total)}</strong></div><button className="primary-btn" disabled={!cart.length} onClick={onCheckout}>Thanh toán</button><button className="text-btn" disabled={!cart.length} onClick={() => usePosStore.getState().clearCart()}>Xóa đơn</button></div>
  </aside>;
}
