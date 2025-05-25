const express = require("express")
const router = express.Router();
const pool = require('../db');


// 獲取演藝快訊首頁版 (Exhibition_Highlight 表格)
router.get('/api/newsBlock', async (req, res) => {
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
                id ASC  
                LIMIT 7`
        );
        res.json(result.rows);
    } catch (error) {
        // console.error(error);
        res.status(500).send("資料庫錯誤");
    }
});

// 聯合查詢版本的 SlideIn 路由
router.get('/SlideIn', async function (req, res) {
    try {
        // 用聯合查詢從 carousel_exhibition 和 exhibition 表獲取數據
        let CarouselExhibition = await pool.query(
            `SELECT 
                ce.id, 
                ce.carousel_img, 
                e.title, 
                e.venue, 
                e.start_date, 
                e.end_date
             FROM 
                carousel_exhibition ce
             LEFT JOIN 
                exhibition e ON ce.exhibition_id = e.id
             ORDER BY ce.id ASC
             LIMIT 5`
        );
        
        // 返回聯合查詢結果
        res.json(CarouselExhibition.rows);
    } catch (error) {
        console.log(error);
        console.log('找不到展覽輪播資料');
        res.status(500).json({ error: '找不到展覽輪播資料' });
    }
});
// 焦點展演 
router.get('/ImageSlider', async function (req, res) {
    try {
        let imageSpotlight = await pool.query(
            `select *
             from 
                Exhibition 
             where 
                is_submission = false`
        )
        res.json(imageSpotlight.rows)
    } catch (error) {
        console.log(error);
        console.log("No展覽資料");
    }
})
module.exports = router;
