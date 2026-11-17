import { usePosStore } from '../store/usePosStore';

export function POSPage() {
  const menu = usePosStore(state => state.menu);
  const [search, setSearch] = useState('');

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

        <div className="product-grid">
          {filteredMenu.filter(item => item.active).map(item => (
            <button
              key={item.id}
              className="product-card"
              onClick={() => addToCart(item)}
            >
              <div className="product-name">{item.name}</div>
              <div className="product-meta">{item.category}</div>
              <div className="product-price">{item.price.toLocaleString('vi-VN')}đ</div>
            </button>
          ))}
        </div>
      </section>

      <CartPanel />
    </div>
  );
}
