import { usePosStore } from '../store/usePosStore';

export function CustomerPortalPage() {
  const shop = usePosStore(state => state.shop);
  const customers = usePosStore(state => state.customers);

  return (
    <section className="panel customer-portal">
      <h2>{shop.name} - Cổng Khách Hàng</h2>
      <div className="portal-box">
        <div>
          <strong>Đăng nhập thành viên</strong>
          <p>Quét mã hoặc tạo tài khoản để tích điểm và nhận ưu đãi.</p>
        </div>
        <div className="customer-list">
          {customers.map(customer => (
            <div key={customer.id} className="customer-pill">
              {customer.name} · {customer.points} điểm
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
