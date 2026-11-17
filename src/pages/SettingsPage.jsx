import { usePosStore } from '../store/usePosStore';

export function SettingsPage() {
  const shop = usePosStore(state => state.shop);
  const updateShop = usePosStore(state => state.updateShop);

  return (
    <section className="panel">
      <div className="page-header">
        <h2>Cài đặt quán</h2>
      </div>

      <div className="settings-grid">
        <label>
          Tên quán
          <input value={shop.name} onChange={e => updateShop({ name: e.target.value })} />
        </label>
        <label>
          Địa chỉ
          <input value={shop.address} onChange={e => updateShop({ address: e.target.value })} />
        </label>
        <label>
          Zalo
          <input value={shop.zalo} onChange={e => updateShop({ zalo: e.target.value })} />
        </label>
        <label>
          Tỷ lệ tích điểm
          <input value={shop.pointRate} onChange={e => updateShop({ pointRate: Number(e.target.value) || 0 })} />
        </label>
        <label>
          Giá trị 1 điểm
          <input value={shop.pointValue} onChange={e => updateShop({ pointValue: Number(e.target.value) || 0 })} />
        </label>
      </div>
    </section>
  );
}
