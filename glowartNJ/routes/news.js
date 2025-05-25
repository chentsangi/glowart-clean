const express = require("express")
const router = express.Router();
const pool = require('../db');


// 獲取最新公告 (Exhibition_News 表格)
router.get('/api/news', async (req, res) => {
    try {
        let result = await pool.query(
            `SELECT 
                id, 
                title, 
                TO_CHAR(news_date, 'YYYY/MM/DD') AS date,
                description,
                exhibition_id
            FROM 
                news 
            ORDER BY 
                news_date DESC `
        );
        res.json(result.rows);
    } catch (error) {
        // console.error(error);
        res.status(500).send("資料庫錯誤");
    }
});


// 獲取演藝快訊 (Exhibition_Highlight 表格)
router.get('/api/announcements', async (req, res) => {
    try {
        let result = await pool.query(
            `SELECT 
                id, 
                title, 
                TO_CHAR(news_date, 'YYYY/MM/DD') AS date,
                description,
                author,
                exhibition_id 
            FROM 
                exhibition_highlight 
            ORDER BY 
                news_date DESC `
        );
        res.json(result.rows);
    } catch (error) {
        // console.error(error);
        res.status(500).send("資料庫錯誤");
    }
});
module.exports = router;
