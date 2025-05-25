const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/Exhibition/categoryFilter", async (req, res) => {
  const categories = req.query.categories;

  if (!categories || categories.length === 0) {
    console.error("沒有提供分類篩選或陣列為空");
    return res.status(400).json({ message: "沒有提供分類篩選" });
  }

  // 如果是字串格式，例如 "畫作,攝影" 需要轉成陣列
  const categoryArray = Array.isArray(categories)
    ? categories
    : categories.split(",");

  console.log("篩選的類別：", categoryArray);

  try {
    // 1️⃣ 先找到對應的 Category IDs
    const categoryResult = await pool.query(
      `SELECT id FROM category WHERE name = ANY($1::text[])`,
      [categoryArray]
    );

    const categoryIds = categoryResult.rows.map((row) => row.id);

    if (categoryIds.length === 0) {
      return res.json([]); // 沒有找到對應類別，直接返回空陣列
    }

    console.log("對應的 Category IDs：", categoryIds);

    // 2️⃣ 使用 IDs 去找對應的展覽
    const sql = `
      SELECT e.* FROM exhibition AS e
      JOIN exhibition_category AS ec ON e.id = ec.exhibition_id
      WHERE ec.category_id = ANY($1::int[])
    `;

    const result = await pool.query(sql, [categoryIds]);
    res.json(result.rows);
  } catch (error) {
    console.error("分類篩選失敗:", error.stack);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

module.exports = router;
