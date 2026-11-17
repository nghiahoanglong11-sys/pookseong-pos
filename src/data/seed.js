export const seedData = {
  shop: {
    name: 'PookSeong Korean Chicken',
    address: '889 Tỉnh lộ 884, Bến Tre',
    zalo: '0777775764',
    pointRate: 10000,
    pointValue: 500
  },
  menu: [
    { id: 'm1', name: 'Gà rán sốt mật ong cay', category: 'Gà sốt', price: 45000, active: true },
    { id: 'm2', name: 'Gà sốt chua ngọt Hàn Quốc', category: 'Gà sốt', price: 45000, active: true },
    { id: 'm3', name: 'Khoai tây lắc phô mai', category: 'Ăn vặt', price: 25000, active: true },
    { id: 'm4', name: 'Trà đào cam sả', category: 'Đồ uống', price: 22000, active: true },
    { id: 'm5', name: 'Coca-Cola', category: 'Đồ uống', price: 15000, active: true },
    { id: 'm6', name: 'Tokbokki phô mai kéo sợi', category: 'Ăn vặt', price: 35000, active: true }
  ],
  inventory: [
    { id: 'ing-1', name: 'Thịt gà tươi', unit: 'kg', stock: 15, min: 5 },
    { id: 'ing-2', name: 'Bột chiên giòn', unit: 'kg', stock: 8, min: 3 },
    { id: 'ing-3', name: 'Sốt mật ong cay', unit: 'lít', stock: 4, min: 1 },
    { id: 'ing-4', name: 'Phô mai', unit: 'kg', stock: 2.5, min: 1 }
  ],
  customers: [
    { id: 'c1', name: 'Nguyễn Minh Anh', phone: '0901234567', code: 'PS-8899AA', points: 45, totalSpent: 680000 },
    { id: 'c2', name: 'Trần Hoàng Nam', phone: '0987654321', code: 'PS-7766BB', points: 120, totalSpent: 2150000 }
  ]
};
