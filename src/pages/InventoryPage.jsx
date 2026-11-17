import { usePosStore } from '../store/usePosStore';

export function InventoryPage() {
  const inventory = usePosStore(state => state.inventory);
  const addInventory = usePosStore(state => state.addInventory);

  return (
    <section className="panel">
      <div className="page-header">
        <h2>Kho nguyên liệu</h2>
        <button className="primary-btn" onClick={addInventory}>Nhập kho</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Đơn vị</th>
              <th>Tồn</th>
              <th>Ngưỡng</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>{item.stock}</td>
                <td>{item.min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
