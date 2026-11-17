* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  height: 100%;
}

body {
  font-family: 'Be Vietnam Pro', Arial, sans-serif;
  background: #f5f7fa;
  color: #1f2937;
}

button, input, select, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  background: linear-gradient(135deg, #0A4396, #1E6FEB);
  color: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255,255,255,.16);
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 1.3rem;
}

.subtle, .muted {
  opacity: .85;
  font-size: .8rem;
}

.topnav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 20px 0;
}

.nav-btn, .secondary-btn, .primary-btn, .text-btn, .icon-btn, .category-chip, .segmented button {
  border: 0;
  border-radius: 10px;
  padding: 8px 12px;
  transition: .2s ease;
}

.nav-btn {
  background: rgba(10, 67, 150, 0.08);
  color: #0A4396;
  border: 1px solid rgba(10, 67, 150, 0.12);
}

.nav-btn.active {
  background: #0A4396;
  color: #fff;
}

.main-layout {
  padding: 20px;
}

.topbar-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.user-pill {
  display: inline-flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px;
  padding: 6px 10px;
  min-width: 100px;
}

.user-pill span {
  font-weight: 700;
}

.user-pill small {
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.page-stack {
  display: grid;
  gap: 16px;
}

.page-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.page-title h1, h2, h3 {
  margin: 0 0 6px;
}

.page-title p {
  margin: 0;
  color: #5b6677;
}

.panel {
  background: #fff;
  border: 1px solid #e2e6ec;
  border-radius: 16px;
  padding: 16px;
}

.pos-page {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 0.9fr);
  gap: 16px;
}

.main-panel {
  min-height: 70vh;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.toolbar input, .search-input, .field-label input, .field-label select {
  flex: 1;
  min-width: 0;
  border: 1px solid #d9dee5;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
}

.category-row, .segmented {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-chip, .segmented button {
  background: #eef4ff;
  color: #0A4396;
  border: 1px solid #dbeafe;
}

.category-chip.selected, .segmented .selected {
  background: #0A4396;
  color: #fff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.product-card {
  border: 1px solid #dfe5ee;
  border-radius: 14px;
  background: #fdfdff;
  text-align: left;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 120px;
}

.product-icon {
  font-size: 1.25rem;
}

.product-name {
  font-weight: 700;
  line-height: 1.35;
}

.product-meta {
  color: #5b6677;
  font-size: .8rem;
}

.product-price {
  margin-top: auto;
  color: #0A4396;
  font-weight: 800;
}

.cart-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 70vh;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge {
  display: inline-flex;
  align-items: center;
  background: #e8f1fe;
  color: #0A4396;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 700;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow: auto;
}

.cart-item {
  border: 1px solid #edf0f5;
  border-radius: 12px;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.cart-item-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  margin-top: 6px;
}

.qty-control button,
.remove-btn,
.primary-btn,
.secondary-btn,
.text-btn,
.icon-btn {
  border-radius: 10px;
  padding: 8px 10px;
}

.qty-control button {
  background: #eef4ff;
  color: #0A4396;
}

.remove-btn {
  background: #fee2e2;
  color: #991b1b;
  font-size: .8rem;
}

.summary-box {
  border-top: 1px solid #edf0f5;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.total-row {
  margin-top: 8px;
}

.discount-row {
  color: #166534;
}

.primary-btn {
  background: #0A4396;
  color: #fff;
  font-weight: 700;
}

.secondary-btn {
  background: #eef4ff;
  color: #0A4396;
}

.text-btn {
  background: transparent;
  color: #0A4396;
}

.empty-state, .empty-cell {
  color: #5b6677;
  padding: 20px 0;
  text-align: center;
}

.notice {
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid transparent;
}

.notice.info {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.notice.warning {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #9a5b00;
}

.notice.error {
  background: #fee2e2;
  border-color: #fecaca;
  color: #991b1b;
}

.field-label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-weight: 600;
  color: #5b6677;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px 8px;
  border-bottom: 1px solid #edf0f5;
  text-align: left;
}

th {
  color: #5b6677;
  font-size: .8rem;
  text-transform: uppercase;
}

.right {
  text-align: right;
}

.row-warning {
  background: #fff7ed;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 999px;
  font-weight: 700;
  font-size: .72rem;
}

.status.success {
  background: #dcfce7;
  color: #166534;
}

.status.warning {
  background: #fff7ed;
  color: #9a5b00;
}

.auth-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #0A4396, #173b84 35%, #eaf2ff);
  padding: 24px;
}

.auth-card {
  width: min(440px, 100%);
  background: rgba(255,255,255,0.96);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.18);
  padding: 24px;
}

.auth-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.auth-header h1 {
  margin: 0 0 4px;
  font-size: 1.6rem;
}

.auth-header p {
  margin: 0;
  color: #5b6677;
}

.auth-form {
  display: grid;
  gap: 14px;
}

.auth-demo-box {
  margin-top: 18px;
  background: #f4f8ff;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 4px;
  color: #1e3a8a;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.45);
  z-index: 50;
  padding: 20px;
}

.modal-card {
  width: min(480px, 100%);
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid #e2e6ec;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.16);
}

.modal-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.icon-btn {
  background: #eef4ff;
  color: #0A4396;
}

.payment-total {
  margin: 18px 0;
  font-size: 2rem;
  font-weight: 900;
  color: #0A4396;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.portal-hero {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #eff6ff, #ffffff);
  border: 1px solid #dbeafe;
  border-radius: 18px;
  padding: 18px;
}

.portal-hero span {
  font-size: 2rem;
}

.portal-tabs {
  margin-top: 8px;
}

.portal-product {
  border: 1px solid #dfe5ee;
  border-radius: 14px;
  background: #fdfdff;
  padding: 12px;
  display: grid;
  gap: 8px;
}

.promo-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  padding: 12px;
  background: #f8fbff;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.role-badge.admin { background: #dbeafe; color: #1d4ed8; }
.role-badge.manager { background: #dcfce7; color: #166534; }
.role-badge.cashier { background: #fef3c7; color: #92400e; }
.role-badge.kitchen { background: #fce7f3; color: #9d174d; }

.app-footer {
  padding: 18px 20px 28px;
  color: #5b6677;
  text-align: center;
  font-size: .84rem;
}

@media (max-width: 900px) {
  .pos-page {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-meta {
    width: 100%;
    justify-content: flex-start;
  }
}
