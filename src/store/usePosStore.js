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
import { EmployeesPage } from './pages/EmployeesPage';

const pages = [
  ['dashboard', 'Dashboard', DashboardPage, ['admin', 'manager', 'cashier', 'kitchen']],
  ['pos', 'Bán hàng', POSPage, ['admin', 'manager', 'cashier']],
  ['orders', 'Đơn hàng', OrdersPage, ['admin', 'manager', 'cashier']],
  ['inventory', 'Kho', InventoryPage, ['admin', 'manager']],
  ['customers', 'Khách hàng', CustomersPage, ['admin', 'manager', 'cashier']],
  ['promotions', 'Khuyến mãi', PromotionsPage, ['admin', 'manager']],
  ['employees', 'Nhân viên', EmployeesPage, ['admin', 'manager']],
  ['customerPortal', 'Cổng khách', CustomerPortalPage, ['admin', 'manager', 'cashier', 'kitchen']],
  ['settings', 'Cài đặt', SettingsPage, ['admin']]
];

export default function App() {
  const shop = usePosStore(state => state.shop);
  const currentUser = usePosStore(state => state.currentUser);
  const init = usePosStore(state => state.init);
  const login = usePosStore(state => state.login);
  const logout = usePosStore(state => state.logout);
  const orders = usePosStore(state => state.orders);
  const [activePage, setActivePage] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin123' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => { init(); }, [init]);

  const userRole = currentUser?.role || 'guest';
  const visiblePages = pages.filter(([, , , roles]) => roles.includes(userRole));
  const PageContent = visiblePages.find(([key]) => key === activePage)?.[2] ?? DashboardPage;
  const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString());

  const handleLogin = event => {
    event.preventDefault();
    const result = login(loginForm);
    if (!result.ok) {
      setLoginError(result.error);
      return;
    }
    setLoginError('');
    setActivePage('dashboard');
  };

  if (!currentUser) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-logo" aria-hidden="true">P</div>
            <div>
              <h1>PookSeong POS</h1>
              <p>Đăng nhập để bắt đầu ca làm việc</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <label className="field-label">
              Tên đăng nhập
              <input
                value={loginForm.username}
                onChange={event => setLoginForm({ ...loginForm, username: event.target.value })}
                placeholder="admin"
              />
            </label>

            <label className="field-label">
              Mật khẩu
              <input
                type="password"
                value={loginForm.password}
                onChange={event => setLoginForm({ ...loginForm, password: event.target.value })}
                placeholder="••••••••"
              />
            </label>

            {loginError && <div className="notice error">{loginError}</div>}

            <button className="primary-btn" type="submit">Đăng nhập</button>
          </form>

          <div className="auth-demo-box">
            <strong>Tài khoản demo</strong>
            <div>admin / admin123</div>
            <div>cashier / cashier123</div>
            <div>manager / manager123</div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="user-pill">
            <span>{currentUser.name}</span>
            <small>{currentUser.role}</small>
          </div>
          <span>{todayOrders.length} đơn hôm nay</span>
          <strong>{todayOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString('vi-VN')}đ</strong>
          <button className="secondary-btn" onClick={logout}>Đăng xuất</button>
        </div>
      </header>

      <nav className="topnav" aria-label="Điều hướng chính">
        {visiblePages.map(([key, label]) => (
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
        Đăng nhập với vai trò: {currentUser.role}. Dữ liệu đang lưu trên trình duyệt và qua API nội bộ khi chạy backend.
      </footer>
    </div>
  );
}
