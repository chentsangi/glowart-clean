const express = require("express")
const router = express.Router();
const pool = require('../db');
// 獲取單一最新公告詳細資料
router.get('/api/announcement/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(`嘗試獲取公告ID: ${id}`);
      
        let result = await pool.query(
            `SELECT 
                id, 
                title, 
                TO_CHAR(news_date, 'YYYY/MM/DD') AS date,
                description,
                exhibition_id 
            FROM
                news 
            WHERE
                id = $1`
                ,
            [id]
        );
      
        // console.log(`查詢結果: ${JSON.stringify(result.rows)}`);
      
        if (result.rows.length === 0) {
            // console.log(`未找到ID為 ${id} 的公告`);
            return res.status(404).send("找不到該公告");
        }
      
        res.json(result.rows[0]);
    } catch (error) {
        // console.error(`獲取公告 ${id} 時發生錯誤:`, error);
        res.status(500).send("資料庫錯誤");
    }
});

module.exports = router;