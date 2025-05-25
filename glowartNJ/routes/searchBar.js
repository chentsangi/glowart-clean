const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/Exhibition/searchBar", async (req, res) => {
  const { keyword, is_submission } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: "請提供搜尋關鍵字" });
  }
  // 將 "true" / "false" 字串轉換為布林值
  const isSubmissionBool = is_submission === "true"

  try {
    const sql = `
      SELECT e.* 
      FROM exhibition AS e
      WHERE (e.title ILIKE $1 OR e.creator_name ILIKE $1)
      AND e.is_submission = $2 
      ORDER BY e.start_date DESC
    `;

    const values = [`%${keyword}%`, isSubmissionBool];
    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (error) {
    console.error("關鍵字搜尋失敗:", error.stack);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

module.exports = router;