let express = require("express") //抓取express
let pool = require("../db") //抓取db檔案的pool變數
let router = express()  //建立router路由

// 演藝快訊(內頁) http://localhost:8000/news/highlight/1
router.get('/news/highlight/:id', async function (req, res) {
    const { id } = req.params; // 取得 URL 中的 id
    try {
        let artNews = await pool.query(
            `SELECT * 
             FROM Exhibition_Highlight 
             WHERE id = $1`, // 修改為依特定 id 查詢
            [id]
        );
        // console.log("查詢結果:", artNews.rows); // 印出查詢結果
        res.json(artNews.rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "No快訊資料" });
    }
})

// 演藝快訊-延伸閱讀 http://localhost:8000/newspage
router.get('/newspage', async function (req, res) {
    try {
        let artNewsMore = await pool.query(
            `select id, title, news_date, image_square 
            from Exhibition_Highlight
            WHERE id BETWEEN 1 AND 20`
        );
        // console.log("查詢結果:", artNews.rows); // 印出查詢結果
        res.json(artNewsMore.rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "No快訊資料" });
    }
})

module.exports = router;
