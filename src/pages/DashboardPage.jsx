import { useEffect, useState } from 'react';

const money = (value = 0) => `${Math.round(value).toLocaleString('vi-VN')}đ`;

export function DashboardPage() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    ordersCount: 0,
    averageOrder: 0,
    lowInventory: 0,
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        setStats({
          todayRevenue: 0,
          ordersCount: 0,
          averageOrder: 0,
          lowInventory: 0,
          topProducts: []
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="page-stack">
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>
          <p>Tổng quan hoạt động và hiệu suất bán hàng.</p>
        </div>
      </div>

      {loading ? (
        <div className="panel"><p>Đang tải dữ liệu...</p></div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span>Doanh thu hôm nay</span>
              <strong>{money(stats.todayRevenue)}</strong>
            </div>
            <div className="stat-card">
              <span>Số đơn</span>
              <strong>{stats.ordersCount}</strong>
            </div>
            <div className="stat-card">
              <span>Giá trị đơn trung bình</span>
              <strong>{money(stats.averageOrder)}</strong>
            </div>
            <div className="stat-card warning">
              <span>Sắp hết hàng</span>
              <strong>{stats.lowInventory}</strong>
            </div>
          </div>

          <section className="panel">
            <h2>Món bán chạy</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Món</th>
                    <th className="right">Số lượng</th>
                    <th className="right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProducts.length ? stats.topProducts.map(product => (
                    <tr key={product.name}>
                      <td>{product.name}</td>
                      <td className="right">{product.qty}</td>
                      <td className="right">{money(product.revenue)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="empty-cell">Chưa có dữ liệu bán hàng.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
