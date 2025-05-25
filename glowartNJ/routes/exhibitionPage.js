let express = require("express") //抓取express
let pool = require("../db") //抓取db檔案的pool變數
let router = express()  //建立router路由
const jwt = require('jsonwebtoken');
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


// 展覽（內頁） http://localhost:8000/exhibition/:id
router.get('/exhibition/:id', async function (req, res) {
    const { id } = req.params;
    try {
        // 並行查詢
        const [exhibition, categories, exhibitionCategories] = await Promise.all([
            pool.query(`SELECT * FROM Exhibition WHERE id = $1 AND is_submission = false`, [id]),
            pool.query(`
                SELECT c.* 
                FROM category c
                JOIN Exhibition_Category ec ON c.id = ec.category_id
                JOIN Exhibition e ON ec.exhibition_id = e.id
                WHERE ec.exhibition_id = $1 AND e.is_submission = false
            `, [id]),
            pool.query(`
                SELECT * 
                FROM Exhibition_Category ec
                JOIN Exhibition e ON ec.exhibition_id = e.id
                WHERE ec.exhibition_id = $1 AND e.is_submission = false
            `, [id])
        ]);

        if (exhibition.rows.length === 0) {
            return res.status(404).json({ message: "找不到該展覽或展覽已下架" });
        }

        res.json({
            exhibition: exhibition.rows[0],
            categories: categories.rows,
            exhibitionCategories: exhibitionCategories.rows
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "查詢展覽資料失敗" });
    }
});

// 愛心路由
router.post('/exhibition/:id/like', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // 檢查是否已經按過愛心
        const existingLike = await pool.query(
            `SELECT * FROM Exhibition_like 
             WHERE exhibition_id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (existingLike.rows.length > 0) {
            // 已經按過愛心，執行取消
            await pool.query(
                `DELETE FROM Exhibition_like 
                 WHERE exhibition_id = $1 AND user_id = $2`,
                [id, userId]
            );

            res.json({ active: false, message: '已取消按讚' });
        } else {
            // 新增愛心
            await pool.query(
                `INSERT INTO Exhibition_like (exhibition_id, user_id) 
                 VALUES ($1, $2)`,
                [id, userId]
            );

            res.json({ active: true, message: '已成功按讚' });
        }
    } catch (error) {
        console.error('按讚操作失敗:', error);
        res.status(500).json({ message: '按讚操作失敗' });
    }
});

// 檢查是否已按愛心
router.get('/exhibition/:id/like-status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const likeStatus = await pool.query(
            `SELECT * FROM Exhibition_like 
             WHERE exhibition_id = $1 AND user_id = $2`,
            [id, userId]
        );

        res.json({ active: likeStatus.rows.length > 0 });
    } catch (error) {
        console.error('檢查按讚狀態失敗:', error);
        res.status(500).json({ message: '檢查按讚狀態失敗' });
    }
});

// 收藏路由（類似按讚路由）
router.post('/exhibition/:id/collect', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // 檢查是否已經按過收藏
        const existingFavorite = await pool.query(
            `SELECT * FROM Exhibition_Favorite 
             WHERE exhibition_id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (existingFavorite.rows.length > 0) {
            // 已經按過收藏，執行取消
            await pool.query(
                `DELETE FROM Exhibition_Favorite 
                 WHERE exhibition_id = $1 AND user_id = $2`,
                [id, userId]
            );

            res.json({ active: false, message: '已取消收藏' });
        } else {
            // 新增收藏
            await pool.query(
                `INSERT INTO Exhibition_Favorite (exhibition_id, user_id) 
                 VALUES ($1, $2)`,
                [id, userId]
            );

            res.json({ active: true, message: '已成功收藏' });

        }
    } catch (error) {
        console.error('收藏操作失敗:', error);
        res.status(500).json({ message: '收藏操作失敗' });
    }
});

// 檢查是否已按收藏
router.get('/exhibition/:id/collect-status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const collectStatus = await pool.query(
            `SELECT * FROM Exhibition_Favorite 
             WHERE exhibition_id = $1 AND user_id = $2`,
            [id, userId]
        );

        res.json({ active: collectStatus.rows.length > 0 });
    } catch (error) {
        console.error('檢查收藏狀態失敗:', error);
        res.status(500).json({ message: '檢查收藏狀態失敗' });
    }
});

// 展覽-推薦展覽 http://localhost:8000/exhibition/:id/recommended
async function findRecommendedExhibitions(exhibitionId, isSubmission) {
    try {
        // 查找當前展覽的類別
        const categoriesResult = await pool.query(`
            SELECT category_id 
            FROM Exhibition_Category 
            WHERE exhibition_id = $1
        `, [exhibitionId]);

        // 如果沒有找到類別，則隨機選取展覽
        if (categoriesResult.rows.length === 0) {
            const randomExhibitions = await pool.query(`
                SELECT * 
                FROM Exhibition 
                WHERE id != $1 
                AND is_submission = $2
                ORDER BY RANDOM()
                LIMIT 3
            `, [exhibitionId, isSubmission]);

            return {
                status: 200,
                data: randomExhibitions.rows
            };
        }

        const categoryIds = categoriesResult.rows.map(row => row.category_id);

        // 找出同類別的展覽
        const sameCategoryExhibitions = await pool.query(`
            SELECT DISTINCT e.* 
            FROM Exhibition e
            JOIN Exhibition_Category ec ON e.id = ec.exhibition_id
            WHERE ec.category_id = ANY($1) 
            AND e.id != $2
            AND e.is_submission = $3
        `, [categoryIds, exhibitionId, isSubmission]);

        // 如果同類別展覽不足3個，從所有指定狀態展覽中補足
        let recommendedExhibitions = sameCategoryExhibitions.rows;
        
        if (recommendedExhibitions.length < 3) {
            const additionalExhibitions = await pool.query(`
                SELECT * 
                FROM Exhibition 
                WHERE id != $1 
                AND is_submission = $2
                AND id NOT IN (
                    SELECT id 
                    FROM Exhibition 
                    WHERE id = ANY($3)
                )
                ORDER BY RANDOM()
                LIMIT ${3 - recommendedExhibitions.length}
            `, [exhibitionId, isSubmission, recommendedExhibitions.map(e => e.id)]);

            recommendedExhibitions = [
                ...recommendedExhibitions, 
                ...additionalExhibitions.rows
            ];
        }

        return {
            status: 200,
            data: recommendedExhibitions.slice(0, 3)
        };
    } catch (error) {
        console.error('推薦展覽查詢錯誤:', error);
        return {
            status: 500,
            message: '推薦展覽載入失敗',
            error: error.message
        };
    }
}

// 已發佈展覽的推薦路由
router.get('/exhibition/:id/recommended', async (req, res) => {
    const { id } = req.params;
    const exhibitionId = parseInt(id, 10);

    // 型別和有效性檢查
    if (isNaN(exhibitionId)) {
        return res.status(400).json({ 
            message: '無效的展覽 ID', 
            error: 'ID 必須是數字' 
        });
    }

    // 檢查展覽狀態
    const exhibitionResult = await pool.query(`
        SELECT is_submission 
        FROM Exhibition 
        WHERE id = $1
    `, [exhibitionId]);

    // 如果展覽不存在
    if (exhibitionResult.rows.length === 0) {
        return res.status(404).json({ 
            message: '未找到該展覽' 
        });
    }

    const isSubmission = exhibitionResult.rows[0].is_submission;

    // 如果是提交狀態的展覽，返回跳轉信息
    if (isSubmission) {
        return res.status(301).json({
            redirectUrl: `/creator/${exhibitionId}`,
            message: '該展覽尚未發佈'
        });
    }

    // 查詢推薦展覽
    const result = await findRecommendedExhibitions(exhibitionId, false);

    // 根據查詢結果返回
    return res.status(result.status).json(
        result.status === 200 ? result.data : { message: result.message }
    );
});

module.exports = router;
