const express = require("express");
const router = express.Router();
const pool = require("../db");

// 🚀 抓取所有新聞資料
router.get("/news", async (req, res) => {
  try {
    const results = await pool.query(`SELECT * FROM exhibition_highlight ORDER BY news_date DESC`);
    res.json(results.rows);
  } catch (error) {
    console.error("❌ 抓取資料失敗:", error.stack);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});


// 🚀 抓取公告資料
router.get("/announcement", async (req, res) => {
  try {
    const results = await pool.query(`SELECT * FROM news ORDER BY news_date DESC `);
    res.json(results.rows);
  } catch (error) {
    console.error("❌ 抓取資料失敗:", error.stack);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});


// ✅ 搜尋新聞
router.get("/search", async (req, res) => {
  const { keyword, date } = req.query;
  const values = [];
  let sql = `SELECT * FROM exhibition_highlight WHERE 1=1`;
  console.log("🔍 收到的搜尋條件：", { keyword, date });

  // 🔍 關鍵字搜尋 (模糊搜尋)
  if (keyword && keyword.trim() !== "") {
    values.push(`%${keyword}%`);
    sql += ` AND title ILIKE $${values.length}`;
  }

  // 📅 日期搜尋
  if (date) {
    values.push(date);
    sql += ` AND DATE(news_date) = $${values.length}`;
  }

  try {
    const results = await pool.query(sql, values);
    res.json(results.rows);
  } catch (error) {
    console.error("❌ 搜尋失敗:", error.stack);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

module.exports = router;
