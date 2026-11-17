import { useState } from 'react';
import { usePosStore } from '../store/usePosStore';
const money = value => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;
export function CustomerPortalPage() {
  const shop = usePosStore(state => state.shop);
  const menu = usePosStore(state => state.menu);
  const promotions = usePosStore(state => state.promotions);
  const [tab, setTab] = useState('menu');
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  function add(item) { setCart(current => { const exists = current.find(line => line.id === item.id); return exists ? current.map(line => line.id === item.id ? {...line,qty:line.qty+1} : line) : [...current,{id:item.id,name:item.name,price:item.price,qty:1}]; }); }
  const total = cart.reduce((sum,item) => sum + item.price * item.qty, 0);
  return <div className="page-stack"><div className="portal-hero"><span>🍗</span><div><h1>{shop.name}</h1><p>{shop.address} · Hỗ trợ Zalo {shop.zalo}</p></div></div><div className="segmented portal-tabs">{[['menu','Thực đơn'],['promo','Ưu đãi'],['cart',`Giỏ hàng (${cart.reduce((sum,item)=>sum+item.qty,0)})`]].map(([key,label]) => <button key={key} className={tab===key?'selected':''} onClick={()=>setTab(key)}>{label}</button>)}</div>{message && <div className="notice info">{message}</div>}
    {tab==='menu' && <div className="product-grid">{menu.filter(item=>item.active&&item.price>0).map(item=><article className="portal-product" key={item.id}><span className="product-icon">🍗</span><h3>{item.name}</h3><span className="product-price">{money(item.price)}</span><button className="primary-btn" onClick={()=>add(item)}>Thêm vào giỏ</button></article>)}</div>}
    {tab==='promo' && <section className="panel"><h2>Ưu đãi đang có</h2>{promotions.filter(p=>p.active).map(p=><div className="promo-card" key={p.id}><strong>{p.name}</strong><span>{p.type==='percent'?`${p.value}%`:`${money(p.value)}`} giảm · {p.code||'Tự áp dụng'}</span><small>Đơn tối thiểu {money(p.minTotal)}</small></div>)}</section>}
    {tab==='cart' && <section className="panel"><h2>Giỏ hàng</h2>{cart.map(item=><div className="cart-item" key={item.id}><div className="cart-item-main"><strong>{item.name}</strong><span>{money(item.price)} × {item.qty}</span></div><div className="qty-control"><button onClick={()=>setCart(current=>current.map(line=>line.id===item.id?{...line,qty:Math.max(0,line.qty-1)}:line).filter(line=>line.qty))}>−</button><span>{item.qty}</span><button onClick={()=>add({id:item.id,name:item.name,price:item.price})}>+</button></div></div>)}{!cart.length&&<p className="muted">Giỏ hàng đang trống.</p>}<div className="row total-row"><strong>Tạm tính</strong><strong>{money(total)}</strong></div><p className="muted">Đây là bản xem thực đơn và giỏ hàng tại chỗ. Đặt hàng online cần backend an toàn để gửi đơn tới quán.</p><button className="primary-btn" disabled={!cart.length} onClick={()=>setMessage('Vui lòng liên hệ cửa hàng để xác nhận đơn. Chức năng gửi đơn online cần máy chủ backend.')}>Gửi yêu cầu đặt món</button></section>}
  </div>;
}
