let express = require("express") //抓取express
let pool = require("../db") //抓取db檔案的pool變數
let router = express.Router();
const bodyParser = require("body-parser");
const ecpay_payment = require("ecpay-payment");
const moment = require('moment-timezone');

const taiwanTime = moment.tz(new Date(), "Asia/Taipei").format('YYYY-MM-DD HH:mm:ss');
console.log("台灣時間：", taiwanTime);

router.use(express.json()); //使app可以讀取json的資料  
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



// 上傳訂單資料至db
router.post('/checkout', async (req, res) => {
    try {
        const { cart, recipient, phone, address, email, userId } = req.body;

        const safeUserId = userId ?? 0; // 如果 userId 是 undefined，設為 0

        console.log("接收到的資料：", { cart, recipient, phone, address, email });

        // // 🔥 檢查是否有 userId
        // if (!userId) {
        //     console.error("❌ 缺少 userId，無法建立訂單");
        //     return res.status(400).send("無法建立訂單：缺少 userId");
        // }

        // ← 加入必要欄位檢查
        if (!cart || !recipient || !phone || !address || !email) {
            return res.status(400).send("缺少必要欄位");
        }

        // 商品描述與總金額
        const totalAmount = Math.round(cart.reduce((sum, item) => sum + item.quantity * item.price, 0));
        if (totalAmount <= 0) {
            return res.status(400).send("金額需大於 0");
        }
        const itemNames = cart.map(item => `${item.title}   x ${item.quantity}`).join('#');
        if (itemNames.length > 200) {
            return res.status(400).send("商品名稱過長");
        };

        // 建立不重複的交易編號
        const merchantTradeNo = 'EC' + Date.now() + Math.floor(Math.random() * 1000);

        // === 將訂單資料寫入資料庫 ===
        const insertOrder = await pool.query(`
            INSERT INTO orders (user_id, payment_method, status, total_amount, created_at, merchant_trade_no)
            VALUES ($1, $2, '準備付款', $3, $4, $5)
            RETURNING id `,
            [safeUserId, 'ecpay', totalAmount, taiwanTime, merchantTradeNo]);
        // [userId, 'ecpay', totalAmount, merchantTradeNo]);

        console.log(`💡 訂單已建立，編號：${merchantTradeNo}`);

        const orderId = insertOrder.rows[0].id;


        // === 將每個購物項目寫入 order_items ===
        for (let item of cart) {
            const subtotal = item.price * item.quantity;

            const exhibitionResult = await pool.query(
                `SELECT id FROM exhibition WHERE title = $1 LIMIT 1`, [item.title]
            );

            const exhibitionId = exhibitionResult.rows[0]?.id;

            if (!exhibitionId) {
                console.error(`找不到展覽名稱：${item.title}`);
            } else {
                console.log(`找到展覽 ID：${exhibitionId}`);
            }

            await pool.query(`
                INSERT INTO order_item (
                order_id, exhibition_id, quantity, unit_price, subtotal,
                recipient_phone, recipient_name, recipient_address, recipient_email, created_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                [
                    orderId,
                    exhibitionId,
                    item.quantity,
                    item.price,
                    subtotal,
                    phone,
                    recipient,
                    address,
                    email,
                    taiwanTime
                ]);
        }

        // === 設定綠界付款參數 ===
        const options = {
            OperationMode: "Test",
            MercProfile: {
                MerchantID: "2000132",
                HashKey: "5294y06JbISpM5x9",
                HashIV: "v77hoKGq4kWxNNIS"
            },
            IgnorePayment: [],
            IsProjectContractor: false
        };

        const create = new ecpay_payment(options);

        const pad = (n) => n.toString().padStart(2, '0');
        const now = new Date();
        const MerchantTradeDate = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;


        const base_param = {
            MerchantTradeNo: merchantTradeNo, // 不可重複
            MerchantTradeDate: MerchantTradeDate,
            TotalAmount: totalAmount.toString(), // ← 關鍵修正
            TradeDesc: '購票交易',
            ItemName: itemNames,
            ReturnURL: 'https://22c2-118-163-218-100.ngrok-free.app/ticketEcpay/ecpay-return', // 綠界回傳網址
            ClientBackURL: 'http://localhost:3000/tickets', // 返回你網站
            ChoosePayment: 'ALL',
            NeedExtraPaidInfo: 'N', // ← 常見忘記加會報錯
            EncryptType: 1 // ✅ 必加：測試環境需設定加密類型為 1
        };

        const html = create.payment_client.aio_check_out_all(base_param);
        res.send(html); // 直接將 HTML 表單回傳給前端
    } catch (err) {
        console.error("綠界付款錯誤：", err.message);
        res.status(500).send("付款失敗：" + err.message);
    }
});

// 綠界回傳的資料
router.post('/ecpay-return', express.urlencoded({ extended: false }), async (req, res) => {
    const data = req.body;
    console.log("💡 綠界回傳的資料：", data);

    const merchantTradeNo = data.MerchantTradeNo;

    if (!merchantTradeNo) {
        console.error("❌ 收到的資料中找不到 MerchantTradeNo");
        return res.send('0|FAIL');
    }

    if (data.RtnCode === '1') {
        console.log("✅ 綠界確認付款成功，嘗試更新資料庫...");

        try {
            // ✅ 更新資料庫訂單狀態
            const result = await pool.query(`
                UPDATE orders
                SET status = '付款完成',
                    payment_method = $1
                WHERE merchant_trade_no = $2
        `, [data.PaymentType, merchantTradeNo]);

            console.log("資料庫回應：", result.rowCount);

            // ✅ 檢查更新是否成功
            if (result.rowCount === 1) {
                console.log(`✅ 訂單 [${merchantTradeNo}] 狀態已更新為 '付款完成'`);
                res.send('1|OK');
            } else {
                console.error(`❌ 訂單 [${merchantTradeNo}] 更新失敗，找不到對應的資料`);
                res.send('0|FAIL');
            }
        } catch (err) {
            console.error("❌ 更新付款失敗：", err.message);
            res.send('0|FAIL');
        }
    } else {
        console.log("❌ 綠界付款失敗：", data);
        res.send('0|FAIL');
    }
});

// 上傳貨到付款訂單資料至db
router.post('/cashOnDelivery', async (req, res) => {
    try {
        console.log("📌 開始處理貨到付款 API");
        const { cart, recipient, phone, address, email, userId } = req.body;
        const totalAmount = Math.round(cart.reduce((sum, item) =>
            sum + item.quantity * item.price, 0));
        if (totalAmount <= 0) { return res.status(400).send('金額需大於 0'); }

        // 生成獨立訂單編號 COD + 年月日時分秒 + 隨機四碼
        const generateOrderId = () => {
            const now = new Date();
            const datePart = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
            const randomPart = Math.floor(1000 + Math.random() * 9000);
            return `COD${datePart}-${randomPart}`;
        };

        const merchantTradeNo = generateOrderId();
        console.log("生成的貨到付款訂單編號：", merchantTradeNo);

        // 寫入訂單資料
        const insertOrder = await pool.query(
            "INSERT INTO orders (user_id, payment_method, status, total_amount, created_at, merchant_trade_no) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [userId, 'cash on delivery', '備貨中', totalAmount, taiwanTime, merchantTradeNo]
        );
        console.log("資料庫回應：", insertOrder);

        if (!insertOrder.rows.length) {
            throw new Error('訂單無法寫入資料庫');
        }

        const orderId = insertOrder.rows[0].id;

        for (let item of cart) {
            const subtotal = item.price * item.quantity;
            const exhibitionResult = await pool.query(
                'SELECT id FROM exhibition WHERE title = $1 LIMIT 1', [item.title]
            );
            const exhibitionId = exhibitionResult.rows[0]?.id;
            if (exhibitionId) {
                await pool.query(
                    'INSERT INTO order_item (order_id, exhibition_id, quantity, unit_price, subtotal, recipient_phone, recipient_name, recipient_address, recipient_email, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
                    [orderId, exhibitionId, item.quantity, item.price, subtotal, phone, recipient, address, email, taiwanTime]
                );
            }
        }
        // 🔍 這邊回傳 merchantTradeNo，讓前端接收到
        console.log("✅ 資料庫寫入成功");
        console.log("📦 回傳資料給前端");
        res.status(200).json({ message: '貨到付款訂單已建立', merchantTradeNo });

    } catch (err) {
        console.error('❌建立貨到付款訂單失敗', err.message);
        res.status(500).send('建立訂單失敗');
    }
});

module.exports = router;   // 將 router 匯出