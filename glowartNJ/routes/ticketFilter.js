const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios")
router.get("/ticket", async (req, res) => {
  const { keyword, city, timeRange, categories } =
    req.query;

  // 📝 SQL 初始化
  let sql = `SELECT * FROM exhibition WHERE 1=1 `;
  sql += ` AND has_ticket = true`;
  sql += ` AND is_submission = true`;
  sql += ` AND end_date >= CURRENT_DATE`;
  const values = [];
  // 🔎 關鍵字篩選
  if (keyword && keyword.trim() !== "") {
    values.push(`%${keyword}%`);
    values.push(`%${keyword}%`);
    sql += ` AND (title ILIKE $${values.length - 1} OR creator_name ILIKE $${values.length
      })`;
  }
  // 🏙 地區篩選
  if (city) {
    values.push(city);
    sql += ` AND city = $${values.length}`;
  }

  // ⏳ 時間篩選
  if (timeRange) {
    sql += ` AND start_date <= CURRENT_DATE + INTERVAL '${timeRange} days' AND end_date > CURRENT_DATE`
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
          `http://localhost:8000/api/ticket/categoryFilter`,
          {
            params: {
              categories: categoryParams,
            },
          });

        // 取得所有符合的展覽 ID
        const categoryFilteredIds = response.data; // ✅ 已經是 ID 陣列了

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

  try {
    const results = await pool.query(sql, values);
    res.json(results.rows);
  } catch (error) {
    console.error("搜尋失敗:", error.stack);
    res.status(500).send("伺服器錯誤");
  }

});


router.get("/ticket/categoryFilter", async (req, res) => {
  let categories = req.query.categories;

  if (!categories) {
    return res.status(400).json({ message: "沒有提供分類篩選" });
  }

  let categoryIds = [];
  if (Array.isArray(categories)) {
    categoryIds = categories.map(Number);
  } else if (typeof categories === "string") {
    categoryIds = categories.split(",").map(Number);
  }


  console.log("收到的 Category IDs：", categoryIds);

  try {
    const sql = `
    SELECT DISTINCT e.id
    FROM exhibition AS e
    JOIN exhibition_category AS ec ON e.id = ec.exhibition_id
    WHERE ec.category_id = ANY($1::int[])
    AND e.has_ticket = TRUE
    AND e.is_submission = TRUE
    AND e.end_date >= CURRENT_DATE
    `;
    const result = await pool.query(sql, [categoryIds]);
    res.json(result.rows.map(r => r.id)); // ✅ 回傳純 ID 陣列
  } catch (error) {
    console.error("分類篩選失敗:", error.stack);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// 抓取資料庫展覽資訊
router.get('/Packages', async function (req, res) {
  try {
    let Packages = await pool.query(
      //查詢資料庫的語法 有售票、投稿來源、過期的不要
      'SELECT * FROM Exhibition WHERE has_ticket = TRUE and is_submission = TRUE and end_date >= CURRENT_DATE'
    )
    res.json(Packages.rows) //rows => 將Packages物件的屬性存放在查詢的結果(資料)。 然後轉成json格式
  } catch (error) {
    console.log("抓不到套票", error); //如果有錯誤，則印出錯誤訊息
  }
})
module.exports = router;
