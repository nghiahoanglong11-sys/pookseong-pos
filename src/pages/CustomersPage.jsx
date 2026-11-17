import { useState } from 'react';
import { usePosStore } from '../store/usePosStore';
const money = value => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;
export function CustomersPage() {
  const customers = usePosStore(state => state.customers);
  const addCustomer = usePosStore(state => state.addCustomer);
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [query, setQuery] = useState(''); const [message, setMessage] = useState('');
  const filtered = customers.filter(customer => `${customer.name} ${customer.phone} ${customer.code}`.toLowerCase().includes(query.toLowerCase()));
  function submit(event) { event.preventDefault(); const result = addCustomer({ name, phone }); setMessage(result.ok ? `Đã tạo tài khoản ${result.customer.code}.` : result.error); if (result.ok) { setName(''); setPhone(''); } }
  return <div className="page-stack"><div className="page-title"><div><h1>Khách hàng thân thiết</h1><p>Tra cứu thành viên, điểm và tổng chi tiêu.</p></div><span className="badge">{customers.length} thành viên</span></div>{message && <div className="notice info" role="status">{message}</div>}
    <section className="panel"><h2>Tạo thành viên</h2><form className="form-grid" onSubmit={submit}><label className="field-label">Họ tên<input required value={name} onChange={e => setName(e.target.value)} /></label><label className="field-label">Số điện thoại<input required inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} /></label><button className="primary-btn">Tạo tài khoản</button></form></section>
    <section className="panel"><div className="section-heading"><h2>Danh sách thành viên</h2><input className="search-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm tên, số điện thoại, mã..." /></div><div className="table-wrap"><table><thead><tr><th>Tên</th><th>Số điện thoại</th><th>Mã thành viên</th><th className="right">Điểm</th><th className="right">Tổng chi</th><th className="right">Lượt mua</th></tr></thead><tbody>{filtered.map(customer => <tr key={customer.id}><td><strong>{customer.name}</strong></td><td>{customer.phone}</td><td><span className="badge">{customer.code}</span></td><td className="right">{customer.points || 0}</td><td className="right">{money(customer.totalSpent)}</td><td className="right">{customer.visits || 0}</td></tr>)}{!filtered.length && <tr><td colSpan="6" className="empty-cell">Không có khách phù hợp.</td></tr>}</tbody></table></div></section>
  </div>;
}
