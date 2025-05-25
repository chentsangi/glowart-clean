const express = require("express")
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const path = require('path');

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


//指定資料夾
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ✅ 指定目標資料夾
    const targetPath = path.join(__dirname, '..', '..', 'Glowart', 'public', 'images', 'Review');
    cb(null, targetPath);
  },
  filename: function (req, file, cb) {
    // ✅ 用時間戳+原檔名來避免重複
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
    // 1. 拆出原始檔名的主檔名跟副檔名
    const parsed = path.parse(file.originalname);
    const name = parsed.name;   // 不含副檔名
    const ext = parsed.ext;    // 含「.png」「.jpg」等

    // 2. 把 name 裡面所有非 a–z A–Z 0–9 _ - 的字元都換成底線
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');

    // 3. 組回來
    const finalName = `${uniqueSuffix}-${safeName}${ext}`;
    cb(null, finalName);
  }
});
// 寫入投稿資料
// 必要的前置：emptyToNull、authenticateToken、pool 已設定
function emptyToNull(value) {
  return value === '' ? null : value;
}
const upload = multer({ storage }).any();

router.post('/submit', authenticateToken, upload, async (req, res) => {
  const client = await pool.connect();
  const filesMap = {};
    for (let f of req.files) {
    filesMap[f.fieldname] = f;
  }
  try {
    await client.query('BEGIN');

    const {
      isDraft = false,
      nickname,
      contact_email,
      contact_phone,
      title,
      has_ticket,
      ticket_price,
      ticket_remaining,
      address,
      start_date,
      end_date,
      open_time,
      close_time,
      description,
      remark,
      other_category,
      otherall,
      about_me = JSON.parse(req.body.otherall || '[]'),
    } = req.body;

    const creator_id = req.user.id;
    const review_status = isDraft ? '草稿' : '審核中';

    // ✅ 取得上傳後的檔名
    const imageLong = filesMap.image_long ? `/images/Review/${filesMap.image_long.filename}` : null;
    const imageSquare = filesMap.image_square ? `/images/Review/${filesMap.image_square.filename}` : null;

    console.log("圖片路徑：", imageLong, imageSquare);

    // 1️⃣ 插入 Review
    const insertReviewSql = `
      INSERT INTO review (
        nickname, contact_email, contact_phone,
        title, has_ticket, ticket_price, ticket_remaining,
        address, start_date, end_date,
        open_time, close_time,
        description, remark, other_category, otherall,
        image_long, image_square,
        submitted_at, creator_id, review_status, is_draft , about_me
      ) VALUES (
        $1, $2, $3,
        $4, $5, $6, $7,
        $8, $9, $10,
        $11, $12,
        $13, $14, $15, $16,
        $17, $18,
        CURRENT_TIMESTAMP, $19, $20, $21 ,$22
      ) RETURNING id
    `;
    const reviewParams = [
      nickname,
      contact_email,
      contact_phone,
      title,
      has_ticket === true || has_ticket === 'true',
      emptyToNull(ticket_price),
      emptyToNull(ticket_remaining),
      address || null,
      start_date || null,
      end_date || null,
      open_time || null,
      close_time || null,
      description || null,
      remark || null,
      other_category || null,
      JSON.stringify(otherall),  // 儲存多選
      imageLong,
      imageSquare,
      creator_id,
      review_status,
      isDraft === true,
      about_me
    ];
    const { rows } = await client.query(insertReviewSql, reviewParams);
    const reviewId = rows[0].id;

    // 2️⃣ 批次插入 Review_Category
    // 2️⃣ 批次插入 Review_Category
    if (otherall.length) {
      // 🟢 先檢查格式是否為字串，如果是的話轉成陣列
      let parsedCategories;
      if (typeof otherall === "string") {
        try {
          parsedCategories = JSON.parse(otherall);
        } catch (error) {
          console.error("❌ 無法解析 JSON 字串：", otherall);
          parsedCategories = [];
        }
      } else {
        parsedCategories = otherall;
      }

      // 🟢 確認解析後是否為陣列
      if (!Array.isArray(parsedCategories)) {
        console.error("❌ 解析後的分類資料不是陣列：", parsedCategories);
        return;
      }

      console.log("🚀 解析後的分類資料：", parsedCategories);

      // 🟢 批次插入 SQL 語法，使用 `map` 搭配 `index + 2` 來確保變數名稱正確
      const vals = parsedCategories.map((_, i) => `( $1, $${i + 2} )`).join(', ');

      const sql = `
      INSERT INTO review_category (review_id, category_id)
      VALUES ${vals}
  `;

      // 🟢 將類別 ID 轉成整數
      const catParams = [reviewId, ...parsedCategories.map(id => parseInt(id, 10))];

      console.log("🟢 SQL 語法：", sql);
      console.log("🟢 參數：", catParams);

      // 🟢 插入到資料庫
      await client.query(sql, catParams);
    }
    await client.query('COMMIT');
    res.json({ success: true, reviewId });

  } catch (error) {
    await client.query('ROLLBACK');

    // 🟡 顯示更多錯誤資訊
    console.error('❌ 寫入審核資料失敗：', error.message);
    console.error('🔍 錯誤詳細：', error.stack);

    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});
module.exports = router;