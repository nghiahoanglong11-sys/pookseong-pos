export const seedData = {
  shop: { name: 'PookSeong Korean Chicken', address: '889 Tỉnh lộ 884, Bến Tre', zalo: '0777775764', pointRate: 10000, pointValue: 500 },
  menu: [
    { id: 'm1', name: 'Gà rán sốt mật ong cay', category: 'Gà sốt', price: 45000, active: true, recipe: [{ inventoryId: 'ing-1', qty: 0.15 }, { inventoryId: 'ing-2', qty: 0.04 }] },
    { id: 'm2', name: 'Gà sốt chua ngọt Hàn Quốc', category: 'Gà sốt', price: 45000, active: true, recipe: [{ inventoryId: 'ing-1', qty: 0.15 }, { inventoryId: 'ing-2', qty: 0.04 }] },
    { id: 'm3', name: 'Khoai tây lắc phô mai', category: 'Ăn vặt', price: 25000, active: true, recipe: [{ inventoryId: 'ing-4', qty: 0.15 }] },
    { id: 'm4', name: 'Trà đào cam sả', category: 'Đồ uống', price: 22000, active: true, recipe: [{ inventoryId: 'ing-3', qty: 0.12 }] },
    { id: 'm5', name: 'Coca-Cola', category: 'Đồ uống', price: 15000, active: true, recipe: [] },
    { id: 'm6', name: 'Tokbokki phô mai kéo sợi', category: 'Ăn vặt', price: 35000, active: true, recipe: [] }
  ],
  inventory: [
    { id: 'ing-1', name: 'Thịt gà tươi', unit: 'kg', stock: 15, min: 5 },
    { id: 'ing-2', name: 'Bột chiên giòn', unit: 'kg', stock: 8, min: 3 },
    { id: 'ing-3', name: 'Sốt / trà đào', unit: 'lít', stock: 4, min: 1 },
    { id: 'ing-4', name: 'Khoai tây', unit: 'kg', stock: 6, min: 1 }
  ],
  customers: [
    { id: 'c1', name: 'Nguyễn Minh Anh', phone: '0901234567', code: 'PS-8899AA', points: 45, totalSpent: 680000, visits: 6 },
    { id: 'c2', name: 'Trần Hoàng Nam', phone: '0987654321', code: 'PS-7766BB', points: 120, totalSpent: 2150000, visits: 14 }
  ],
  orders: [],
  promotions: [
    { id: 'p1', name: 'Chào bạn mới - Giảm 10%', type: 'percent', value: 10, minTotal: 50000, from: '', to: '', code: 'POOK10', maxUses: 0, uses: 0, active: true },
    { id: 'p2', name: 'Giảm 15.000đ đơn từ 120.000đ', type: 'amount', value: 15000, minTotal: 120000, from: '', to: '', code: 'GIAM15K', maxUses: 0, uses: 0, active: true }
  ],
  stockLog: []
};
