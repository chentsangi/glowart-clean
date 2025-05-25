const express = require("express")
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
// 會員註冊
const bcrypt = require('bcrypt');
require('dotenv').config();
//建立驗證中介層
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: '未登入，請先登入' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret');
    req.user = decoded; // 將解碼後的資料附加到請求物件上
    next(); // 通過驗證，繼續執行後續程式
  } catch (err) {
    return res.status(403).json({ message: 'Token 驗證失敗' });
  }
}
// 前端驗證登入
router.get('/me', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(`SELECT id, username, email, phone, birth_date FROM users WHERE id = $1`, [userId]);
    const user = result.rows[0];
    res.json({ user });
  } catch (err) {
    console.error("查詢 /me 失敗：", err);
    res.status(500).json({ message: "資料庫錯誤" });
  }
});
//cookie驗證登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ message: "帳號或密碼錯誤" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "帳號或密碼錯誤" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username, birth_date: user.birth_date, phone: user.phone },
    process.env.JWT_SECRET || "your-secret",
    { expiresIn: '1h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 365 * 100
  });
  res.json({ message: "登入成功", token });
});

router.post('/logout', (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  })
  res.json({ message: "已登出" })
})


//會員註冊
router.post("/register", async (req, res) => {
  const { username, email, password, birth_date, phone } = req.body;
  if (!username || !email || !password || !birth_date || !phone) {
    return res
      .status(400)
      .json({ errorCode: "VALIDATION_ERROR", message: "欄位不得為空" });
  }

  try {
    // 1. 檢查 email
    const byEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (byEmail.rows.length > 0) {
      return res
        .status(409)
        .json({
          errorCode: "DUPLICATE_RESOURCE",
          field: "email",
          message: "此信箱已註冊",
        });
    }

    // 2. 檢查 phone
    const byPhone = await pool.query(
      "SELECT id FROM users WHERE phone = $1",
      [phone]
    );
    if (byPhone.rows.length > 0) {
      return res
        .status(409)
        .json({
          errorCode: "DUPLICATE_RESOURCE",
          field: "phone",
          message: "此手機號碼已被使用",
        });
    }

    // 3. 雜湊密碼後寫入
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (username, email, password, birth_date, phone)
       VALUES ($1, $2, $3, $4, $5)`,
      [username, email, hashedPassword, birth_date, phone]
    );

    res.json({ message: "註冊成功" });
  } catch (err) {
    console.error("註冊錯誤：", err);
    res
      .status(500)
      .json({ errorCode: "SERVER_ERROR", message: "伺服器錯誤" });
  }
});

//mailgun-js
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY, // ✅ 你的 Private API Key
  domain: DOMAIN,
});
const tempCodes = {}; // { email: code }
//抓取信箱然後寄送郵件
router.post("/forget-password", async (req, res) => {
  const { email } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "帳號不存在" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  tempCodes[email] = code;

  const data = {
    from: "GlowArt <mailgun@" + DOMAIN + ">",
    to: "wes60145@gmail.com",
    subject: "GlowArt 驗證碼",
    text: `您的驗證碼是：${code}，請在 5 分鐘內使用。`,
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error("❌ 驗證碼寄送失敗", error);
      return res.status(500).json({ message: "寄信失敗，請稍後再試" });
    }

    console.log(`✅ 寄送成功！驗證碼 for ${email}: ${code}`);
    res.json({ message: "驗證碼已寄出" });
  });
});

//信箱驗證
router.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: "缺少參數" });
  }

  if (tempCodes[email] !== code) {
    return res.status(400).json({ success: false, message: "驗證碼錯誤" });
  }

  res.json({ success: true });
});

//輸入新的密碼
router.post("/reset-password", async (req, res) => {
  const { code, newPassword } = req.body;

  if (!code || !newPassword) {
    return res.status(400).json({ message: "所有欄位皆為必填" });
  }

  // 從驗證碼找出 email
  const email = Object.keys(tempCodes).find((key) => tempCodes[key] === code);

  if (!email) {
    return res.status(400).json({ message: "驗證碼錯誤或已過期" });
  }

  try {
    // ✅ 雜湊新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("重設密碼的 email：", email);
    console.log("新的雜湊密碼：", hashedPassword);
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    delete tempCodes[email];
    res.json({ message: "密碼已成功重設" });
  } catch (err) {
    console.error("❌ 重設密碼錯誤", err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});


module.exports = router;