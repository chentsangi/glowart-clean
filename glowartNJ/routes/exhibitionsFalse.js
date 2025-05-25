const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");

router.get("/Exhibitionfalse", async (req, res) => {
  const { keyword, city, has_ticket, status, timeRange, categories } =
    req.query;

  // 📝 SQL 初始化
  let sql = `SELECT * FROM exhibition WHERE 1=1 AND is_submission = False `;
  const values = [];

  // 🔎 關鍵字篩選
  if (keyword && keyword.trim() !== "") {
    values.push(`%${keyword}%`);
    values.push(`%${keyword}%`);
    sql += ` AND (title ILIKE $${values.length - 1} OR creator_name ILIKE $${values.length})`;
  }

  // 🏙 地區篩選
  if (city) {
    values.push(city);
    sql += ` AND city = $${values.length}`;
  }

  // 🎟 是否購票
  if (has_ticket === "true" || has_ticket === "false") {
    values.push(has_ticket === "true");
    sql += ` AND has_ticket = $${values.length}`;
  }

// 📅 狀態篩選
  if (status === "1") {
    sql +=  ` AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE`;
  } else if (status === "0") {
    sql +=  ` AND end_date < CURRENT_DATE`;
  } else if (status === "2") {
    // 尚未開始（即將展出）
    sql +=  ` AND start_date > CURRENT_DATE`;
  }  
  
  // ⏳ 時間篩選
  if (timeRange) {
    sql += ` AND start_date <= CURRENT_DATE + INTERVAL '${timeRange} days' AND end_date > CURRENT_DATE;`
  }

  // 🎨 **類別篩選 → 呼叫 categoryFilter API**
  if (categories) {
    try {
      console.log("📡 呼叫 API 篩選類別");

      // 如果前端傳來的是陣列，轉成逗號分隔的字串
      const categoryParams = Array.isArray(categories)
        ? categories.join(",")
        : categories;

      if (!categoryParams || categoryParams.length === 0) {
        console.warn("類別篩選是空的，跳過 API 呼叫")
      } else {
        const response = await axios.get(
          `http://localhost:8000/api/Exhibition/categoryFilter`,
          {
            params: {
              categories: categoryParams,
            },
          });

        // 取得所有符合的展覽 ID
        const categoryFilteredIds = response.data.map((ex) => ex.id);

        console.log("🔎 類別篩選的展覽 ID：", categoryFilteredIds);

        if (categoryFilteredIds.length > 0) {
          sql += ` AND id = ANY($${values.length + 1}::int[])`;
          values.push(categoryFilteredIds);
        } else {
          // 如果 API 回來是空的，直接回傳空陣列
          return res.json([]);
        }

      }

    } catch (error) {
      console.error("分類篩選失敗:", error.message);
      return res.status(500).send("分類篩選失敗");
    }
  }


  console.log("🗂 最終 SQL：", sql);
  console.log("🔍 查詢值：", values);
  console.log("接收到的 city:", city);

  try {
    const results = await pool.query(sql, values);
    res.json(results.rows);
  } catch (error) {
    console.error("搜尋失敗:", error.stack);
    res.status(500).send("伺服器錯誤");
  }

});

module.exports = router;
