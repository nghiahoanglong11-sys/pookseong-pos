import { usePosStore } from '../store/usePosStore';

export function InventoryPage() {
  const inventory = usePosStore(state => state.inventory);
  const addInventory = usePosStore(state => state.addInventory);

  const lowStock = inventory.filter(item => item.stock <= item.min);

  return (
    <section className="panel">
      <div className="page-header">
        <h2>Kho nguyên liệu</h2>
        <button className="primary-btn" onClick={addInventory}>Nhập kho</button>
      </div>

      {lowStock.length > 0 && (
        <div className="alert alert-warning">
          Sắp hết: {lowStock.map(item => `${item.name} (${item.stock}${item.unit})`).join(', ')}
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Đơn vị</th>
              <th className="right">Tồn</th>
              <th className="right">Ngưỡng</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className={item.stock <= item.min ? 'row-warning' : ''}>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td className="right">{item.stock}</td>
                <td className="right">{item.min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
