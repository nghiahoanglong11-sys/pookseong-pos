import { useEffect, useState } from 'react';
import { usePosStore } from '../store/usePosStore';
import { ProductGrid } from '../components/ProductGrid';
import { CartPanel } from '../components/CartPanel';

export function POSPage() {
  const menu = usePosStore(state => state.menu);
  const cart = usePosStore(state => state.cart);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // fix: only render after init
  }, []);

  const filteredMenu = menu.filter(item => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  return (
    <div className="pos-page">
      <section className="panel main-panel">
        <div className="toolbar">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm món..."
          />
        </div>

        <ProductGrid products={filteredMenu} />
      </section>

      <CartPanel />
    </div>
  );
}
