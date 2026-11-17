import { useMemo } from 'react';

export function StatCard({ label, value, tone = 'default' }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export function ProductGrid({ products, onAdd }) {
  return (
    <div className="product-grid">
      {products.map(item => (
        <button key={item.id} className="product-card" onClick={() => onAdd(item)}>
          <div className="product-name">{item.name}</div>
          <div className="product-meta">{item.category}</div>
          <div className="product-price">{item.price.toLocaleString('vi-VN')}đ</div>
        </button>
      ))}
    </div>
  );
}

export function CartPanel({ items, onRemove, onQtyChange, onCheckout }) {
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  return (
    <aside className="cart-panel">
      <div className="panel-header">
        <h3>Đơn hiện tại</h3>
        <span className="badge">{items.reduce((q, i) => q + i.qty, 0)} món</span>
      </div>

      <div className="cart-items">
        {items.length === 0 ? (
          <div className="empty-state">Chưa có món nào.</div>
        ) : (
          items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-main">
                <strong>{item.name}</strong>
                <span>{item.price.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="qty-control">
                <button onClick={() => onQtyChange(item.id, -1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => onQtyChange(item.id, 1)}>+</button>
              </div>
              <button className="remove-btn" onClick={() => onRemove(item.id)}>Xóa</button>
            </div>
          ))
        )}
      </div>

      <div className="summary-box">
        <div className="row">
          <span>Tổng</span>
          <strong>{total.toLocaleString('vi-VN')}đ</strong>
        </div>
        <button className="primary-btn" onClick={onCheckout}>Thanh toán</button>
      </div>
    </aside>
  );
}
