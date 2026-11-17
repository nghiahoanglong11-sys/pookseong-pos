import { useEffect, useMemo, useState } from 'react';
import { usePosStore } from './store/usePosStore';
import { ProductGrid } from './components/ProductGrid';
import { CartPanel } from './components/CartPanel';
import { POSPage } from './pages/POSPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { SettingsPage } from './pages/SettingsPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';

const pages = {
  pos: { label: 'Bán hàng', component: POSPage },
  inventory: { label: 'Kho', component: InventoryPage },
  customers: { label: 'Khách hàng', component: CustomersPage },
  settings: { label: 'Cài đặt', component: SettingsPage },
  customerPortal: { label: 'Khách hàng', component: CustomerPortalPage }
};

export default function App() {
  const { shop, menu, customer, cart, init, addToCart } = usePosStore();
  const [activePage, setActivePage] = useState('pos');

  useEffect(() => {
    init();
  }, [init]);

  const PageContent = pages[activePage]?.component ?? POSPage;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-logo">P</div>
          <div>
            <strong>{shop.name}</strong>
            <div className="subtle">{shop.address}</div>
          </div>
        </div>

        <nav className="topnav">
          {Object.entries(pages).map(([key, value]) => (
            <button
              key={key}
              className={activePage === key ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActivePage(key)}
            >
              {value.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main-layout">
        <PageContent />
      </main>
    </div>
  );
}
