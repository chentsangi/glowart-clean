import { useEffect, useState } from 'react';
import style from './css/tickets.module.css'
import style2 from './css/cart.module.css'
import axios from 'axios';

function Tickets({ results }) {
    const mapPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const [packages, setPackages] = useState([]);  // 套票資料
    const [quantities, setQuantities] = useState({});
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);
    const [loading, setLoading] = useState(true); // 是否顯示載入中
    const [user, setUser] = useState(null); // 使用者的全部資料 
    const [isChecked, setIsChecked] = useState(false); // 是否勾選同會員本人資料
    const [formData, setFormData] = useState({  //表單資料
        recipient: "",
        phone: "",
        address: "",
        email: ""
    });
    useEffect(() => {
        console.log("🎯 Tickets.jsx 收到 results：", results);
        // 取得套票資料
        const takePackages = async function () {
            try {
                let response = await axios.get('http://localhost:8000/api/Packages');

                // console.log("API回傳資料1111", response.data);

                if (Array.isArray(response.data)) {
                    const transformedTickets = response.data.map((item) => ({
                        id: item.id,
                        title: item.title,
                        date: `${new Date(item.start_date).toLocaleDateString()} ~ ${new Date(item.end_date).toLocaleDateString()}`,
                        location: item.venue,
                        imgSrc: item.image_long,
                        price: item.ticket_price
                    }));
                    setPackages(transformedTickets)

                    const initialQuantities = {};
                    transformedTickets.forEach(ticket => {
                        initialQuantities[ticket.id] = 0;
                    });
                    setQuantities(initialQuantities);
                    setLoading(false);
                } else {
                    console.log("ApI回傳資料錯誤");
                }

            } catch (error) {
                console.error('API抓到資料失敗這裡失敗', results.error);
            }
        }
        if (Array.isArray(results) && results.length > 0) {
            setLoading(false);
            // .filter(item => new Date(item.end_date) >= today) // 過濾掉已經結束的展覽
            const transformedTickets = results.map((item) => ({
                id: item.id,
                title: item.title,
                date: `${new Date(item.start_date).toLocaleDateString()} ~ ${new Date(item.end_date).toLocaleDateString()}`,
                location: item.venue,
                imgSrc: item.image_long,
                price: item.ticket_price
            }));

            setPackages(transformedTickets)

            const initialQuantities = {};
            transformedTickets.forEach(ticket => {
                initialQuantities[ticket.id] = 0;
            });
            setQuantities(initialQuantities);

            setLoading(false);
        } else {
            console.log('沒有符合條件的展覽');

            takePackages()
        }
    }, [results]);
    useEffect(() => {
        async function login() {
            try {
                const user = await axios.get("http://localhost:8000/login/me") // 取得使用者 ID cookie
                setUser(user.data.user)
                console.log(user.data.user);
            } catch (err) {
                console.log("沒有使用者資料");
            }
        }
        login()
    }, [])



    // 數量加減
    const handleQuantityChange = (id, delta) => {
        setQuantities(prev => {      // 用 prev 計算出新的 state，然後 return 回去
            const newQty = Math.max(0, (prev[id] || 0) + delta);
            return { ...prev, [id]: newQty };
        });
    };

    // 加入購物車
    const handleAddToCart = async (ticket) => {
        if (user) {
            const quantity = quantities[ticket.id];
            if (quantity > 0) {
                setCart(prev => {  // 呼叫 setCart（React 的狀態更新函式），prev 代表購物車目前的狀態陣列。
                    const existing = prev.find(item => item.id === ticket.id);
                    if (existing) {
                        return prev.map(item =>
                            item.id === ticket.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        );
                    } else {
                        return [...prev, { ...ticket, quantity }];
                    }
                });
            }
        } else {
            alert("請先登入會員");
        }

    };

    // 移除購物車項目
    const handleRemoveItem = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalCartPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const startIdx = (currentPage - 1) * mapPage;
    const currentTickets = packages.slice(startIdx, startIdx + mapPage);
    const pageCount = Math.ceil(packages.length / mapPage);

    // 點擊購物車按鈕
    const handleCartClick = () => {
        setShowCart(true);
        setShowPayment(false);
        setShowOverlay(true);
    };

    // 點擊結帳按鈕
    const handleCheckoutClick = () => {
        if (cart.length > 0) {
            setShowPayment(true);
        }
    }

    // 點擊關閉購物車按鈕
    const handleCloseCart = () => {
        setShowCart(false);
        setShowOverlay(false);
        setShowPayment(false);
    };

    // 點擊貨到付款按鈕
    const handleCashOnDeliveryPayment = async () => {
        if (!cart || cart.length === 0) {
            alert('購物車是空的');
            return;
        }
        try {
            const res = await axios.post('http://localhost:8000/ticketEcpay/cashOnDelivery', {
                cart,
                recipient: formData.recipient,
                phone: formData.phone,
                address: formData.address,
                email: formData.email,
                userId: user.id
            });
            console.log('收到的資料：', res.data);
            alert(`訂單${res.data.merchantTradeNo}已建立，狀態為備貨中！`);
        } catch (err) {
            console.error('貨到付款錯誤', err);
            alert('訂單建立失敗，請重試');
        }
    };

    // 串接綠界付款畫面
    const handleSubmitPayment = async () => {
        if (!paymentMethod) {
            alert('請選擇付款方式');
            return;
        }
        if (paymentMethod === 'CashonDelivery') {
            await handleCashOnDeliveryPayment();
        } else if (paymentMethod === 'credit') {
            try {
                const res = await axios.post("http://localhost:8000/ticketEcpay/checkout", {
                    cart,
                    recipient: document.getElementById("recipient").value,
                    phone: document.getElementById("phone").value,
                    address: document.getElementById("address").value,
                    email: document.getElementById("email").value,
                    // // 還未建會員系統，先寫屎
                    // userId: 0
                    userId: user.id
                });

                const html = res.data;
                const win = window.open(); // 打開新視窗
                win.document.write(html);  // 顯示綠界付款畫面
            } catch (err) {
                console.error("付款錯誤", err);
                alert("付款失敗，請重試");
            }
        };
    }
    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
        if (e.target.checked) {
            if (user) {
                const { username, phone, email } = user
                setFormData({
                    recipient: username,
                    phone: phone,
                    email: email
                });
            } else {
                alert("未獲取到會員資料，請重新登入");
            }
        } else {
            setFormData({
                recipient: "",
                phone: "",
                email: ""
            });
        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div>
            <div style={{ display: "flex", margin: "5% 0" }}>
                <div className={style.Menu}>
                    <div id="fixedButton" className={style2.fixedButton}>
                        <div className={style2.cart} onClick={handleCartClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5" />
                                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                            </svg>
                            <span className={style2.cartCount}>{totalCartItems}</span>
                        </div>
                        <div className={style2.goTopBtn} onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            document.documentElement.scrollTop = 0;
                            document.body.scrollTop = 0;
                        }}>

                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5" />
                            </svg>
                        </div>
                    </div>

                    {/* 購物車 */}
                    {showCart && (
                        <div className={style2.cartContainer}>
                            <h3 className={style2.cartContainerH3}>訂單內容</h3>
                            <table className={style2.cartTable}>
                                <thead>
                                    <tr>
                                        <th>展覽</th><th>展期</th><th>地點</th><th>數量</th><th>單價</th><th>總價</th>
                                        {!showPayment && (<th id="rightTopCorner">操作</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{item.date}</td>
                                            <td>{item.location}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.price}</td>
                                            <td>${item.price * item.quantity}</td>
                                            {!showPayment && (
                                                <td>
                                                    <button onClick={() => handleRemoveItem(item.id)} style={{ border: "none", background: "none", cursor: "pointer", borderBlock: "0", color: "black", position: "relative", bottom: "7px" }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" >
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className={style2.cartTotalPrice}>總金額：${totalCartPrice} 元</p>
                            <div className={style2.cartButtons}>
                                {!showPayment && (
                                    <button className={style2.checkoutButton} onClick={handleCheckoutClick}>結帳</button>
                                )}
                                <div className={style2.closeCart} onClick={handleCloseCart}><img src="/images/closebtn.png" alt='' /></div>
                            </div>

                            {/* 付款區 */}
                            {showPayment && (
                                <div className={style2.showPayment}>
                                    <h3 className={style2.cartContainerH3}>付款資訊</h3>

                                    {/* 付款方式 */}
                                    <div id="paymentMethodsDiv" className={style2.paymentMethodsDiv}>
                                        <p style={{ color: "rgb(179, 13, 13)", position: "relative", left: "5%", fontSize: "20px" }}>歡迎使用以下付款方式</p>
                                        <label className={style2.paymentMethods}>
                                            <input
                                                className={style2.paymentRadio}
                                                type="radio"
                                                name="payment"
                                                value="CashonDelivery"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <img src="./images/CashonDelivery.png" alt="CashonDelivery" className={style2.paymentPic} />
                                        </label>

                                        <label className={style2.paymentMethods}>
                                            <input
                                                className={style2.paymentRadio}
                                                type="radio"
                                                name="payment"
                                                value="credit"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <img src="./images/creditcard.png" alt="credit" className={style2.paymentPic} />
                                        </label>
                                    </div>

                                    {/* 付款資訊 */}
                                    <h3 className={style2.cartContainerH3}>付款資訊</h3>
                                    <div id="paymentFormDiv" className={style2.paymentFormDiv}>
                                        <div className={style2.paymentCheckboxRow}>
                                            <label className={style2.paymentCheckboxLabel}>
                                                <input type="checkbox" id="useMemberInfo" className={style2.useMemberInfo} checked={isChecked} onChange={handleCheckboxChange} />
                                                同會員本人資料
                                            </label>
                                        </div>

                                        <div className={style2.paymentRow}>
                                            <label htmlFor="recipient" className={style2.paymentLabel}>收件人：</label>
                                            <input className={style2.paymentInput} type="text" name="recipient" id="recipient" value={formData.recipient} onChange={handleInputChange} required />
                                        </div>

                                        <div className={style2.paymentRow}>
                                            <label htmlFor="phone" className={style2.paymentLabel}>手機號碼：</label>
                                            <input className={style2.paymentInput} type="text" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} required />
                                        </div>

                                        <div className={style2.paymentRow}>
                                            <label htmlFor="address" className={style2.paymentLabel}>收件地址：</label>
                                            <input className={style2.paymentInput} type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} required />
                                        </div>

                                        <div className={style2.paymentRow}>
                                            <label htmlFor="email" className={style2.paymentLabel}>電子信箱：</label>
                                            <input className={style2.paymentInput} type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required />
                                        </div>

                                        <div className={style2.paymentButtonArea}>
                                            <button type="submit" id="submitPayment" className={style2.submitPayment} onClick={handleSubmitPayment}>結帳完成</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 防背景點擊的遮罩 */}
                {showOverlay && <div className={style2.noClick}></div>}

                {/* 套票區 */}
                {loading ? (
                    <p>資料加載中</p>
                ) : packages.length > 0 ? (

                    <div className={style.Ticket}>
                        {currentTickets.map(ticket => (
                            <div key={ticket.id} className={style.tickets}>
                                <div className={style.cardTop}>
                                    <img className={style.exhibit} src={ticket.imgSrc} alt="展覽" />
                                    <div className={style.ticketControl}>
                                        <div className={style.alteration}>
                                            <button className={style.push} onClick={() => handleQuantityChange(ticket.id, -1)}>−</button>
                                            <div className={style.PayNumber}>{quantities[ticket.id] || 0}</div>
                                            <button className={style.push} onClick={() => handleQuantityChange(ticket.id, 1)}>+</button>
                                        </div>
                                        <div className={style.MoneyArea}>
                                            <p className={style.Money}>${ticket.price} / 張</p>
                                            <p style={{ marginBlockStart: "0", marginBlockEnd: "0" }}><button className={style.incar} onClick={() => handleAddToCart(ticket)}>加入購物車</button></p>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.cardBottom}>
                                    <div className={style.show}>{ticket.title}</div>
                                    <div className={style.show}>{ticket.date}</div>
                                </div>
                            </div>
                        ))}

                    </div>

                ) : (
                    <p>沒有符合條件的展覽</p>)}
            </div>

            <div className={style.pagecontainer}>
                <div className={style.pagination}>
                    {Array.from({ length: pageCount }, (_, idx) => (
                        <button
                            key={idx}
                            className={`${idx + 1 === currentPage ? style.activePage : ""}`}
                            onClick={() => setCurrentPage(idx + 1)}>{idx + 1}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Tickets;