import { useMemo } from 'react';
import { usePosStore } from '../store/usePosStore';

export function ProductGrid() {
  const menu = usePosStore(state => state.menu);
  const addToCart = usePosStore(state => state.addToCart);

  return (
    <div className="product-grid">
      {menu.filter(item => item.active).map(item => (
        <button key={item.id} className="product-card" onClick={() => addToCart(item)}>
          <div className="product-name">{item.name}</div>
          <div className="product-meta">{item.category}</div>
          <div className="product-price">{item.price.toLocaleString('vi-VN')}đ</div>
        </button>
      ))}
    </div>
  );
}

export function CartPanel() {
  const cart = usePosStore(state => state.cart);
  const changeQty = usePosStore(state => state.changeQty);
  const removeFromCart = usePosStore(state => state.removeFromCart);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  return (
    <aside className="cart-panel">
      <div className="panel-header">
        <h3>Đơn hiện tại</h3>
        <span className="badge">{cart.reduce((q, item) => q + item.qty, 0)} món</span>
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="empty-state">Chưa có món nào.</div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-main">
                <strong>{item.name}</strong>
                <small>{item.price.toLocaleString('vi-VN')}đ</small>
              </div>
              <div className="qty-control">
                <button onClick={() => changeQty(item.id, -1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => changeQty(item.id, 1)}>+</button>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Xóa</button>
            </div>
          ))
        )}
      </div>

      <div className="summary-box">
        <div className="row">
          <span>Tổng</span>
          <strong>{total.toLocaleString('vi-VN')}đ</strong>
        </div>
        <button className="primary-btn">Thanh toán</button>
      </div>
    </aside>
  );
}
