import { usePosStore } from '../store/usePosStore';

export function CustomersPage() {
  const customers = usePosStore(state => state.customers);

  return (
    <section className="panel">
      <div className="page-header">
        <h2>Khách hàng thân thiết</h2>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>SĐT</th>
              <th>Mã</th>
              <th>Điểm</th>
              <th>Tổng chi</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.code}</td>
                <td>{customer.points}</td>
                <td>{customer.totalSpent.toLocaleString('vi-VN')}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
