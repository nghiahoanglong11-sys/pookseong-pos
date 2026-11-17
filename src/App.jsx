import { useEffect, useState } from 'react';
import { usePosStore } from './store/usePosStore';
import { POSPage } from './pages/POSPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { SettingsPage } from './pages/SettingsPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';
import { OrdersPage } from './pages/OrdersPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { DashboardPage } from './pages/DashboardPage';

const pages = [
  ['dashboard', 'Dashboard', DashboardPage],
  ['pos', 'Bán hàng', POSPage],
  ['orders', 'Đơn hàng', OrdersPage],
  ['inventory', 'Kho', InventoryPage],
  ['customers', 'Khách hàng', CustomersPage],
  ['promotions', 'Khuyến mãi', PromotionsPage],
  ['customerPortal', 'Cổng khách', CustomerPortalPage],
  ['settings', 'Cài đặt', SettingsPage]
];

export default function App() {
  const shop = usePosStore(state => state.shop);
  const init = usePosStore(state => state.init);
  const orders = usePosStore(state => state.orders);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => { init(); }, [init]);

  const PageContent = pages.find(([key]) => key === activePage)?.[2] ?? DashboardPage;
  const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString());

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-logo" aria-hidden="true">P</div>
          <div>
            <strong>{shop.name}</strong>
            <div className="subtle">{shop.address}</div>
          </div>
        </div>
        <div className="topbar-meta">
          <span>{todayOrders.length} đơn hôm nay</span>
          <strong>{todayOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString('vi-VN')}đ</strong>
        </div>
      </header>

      <nav className="topnav" aria-label="Điều hướng chính">
        {pages.map(([key, label]) => (
          <button
            key={key}
            className={activePage === key ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActivePage(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="main-layout">
        <PageContent />
      </main>

      <footer className="app-footer">
        Dữ liệu được lưu trên trình duyệt và đồng bộ qua API nội bộ khi bạn chạy backend.
      </footer>
    </div>
  );
}
