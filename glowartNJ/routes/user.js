const express = require("express")
const router = express.Router();
const pool = require('../db');
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

// 查詢所有展覽資料
router.get('/exhibitions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM Exhibition
      order by id asc`);
    res.json(result.rows);
  } catch (error) {
    console.error('查詢展覽失敗', error);
    res.status(500).send('資料庫錯誤');
  }
});
// 查詢所有類別
router.get('/Category', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM Category
      order by id asc`);

    res.json(result.rows);
  } catch (error) {
    console.error('查詢展覽失敗', error);
    res.status(500).send('資料庫錯誤');
  }
});
// 查詢使用者的訂單紀錄
router.get("/member/order_item", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT 
         oi.*,
         o.status,
         o.created_at    AS order_date,
         e.title,
         e.start_date    AS exhi_start,
         e.end_date      AS exhi_end,
         e.image_long    AS exhi_image
       FROM order_item oi
       JOIN orders o 
         ON o.id = oi.order_id
       JOIN Exhibition e 
         ON e.id = oi.exhibition_id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("查詢訂單紀錄失敗：", err);
    return res.status(500).json({ message: "資料庫錯誤", error: err.message });
  }
});

//查詢使用者的投稿紀錄
router.get('/member/submissions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM Review WHERE creator_id = $1 ORDER BY start_date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('查詢投稿紀錄失敗：', err);
    res.status(500).json({ message: '資料庫錯誤' });
  }
});
//查詢使用者的收藏紀錄
router.get('/member/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT e.* 
      FROM Exhibition_Favorite ef
      JOIN Exhibition e ON ef.exhibition_id = e.id
      WHERE ef.user_id = $1
      ORDER BY ef.favorited_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("查詢收藏紀錄失敗：", err);
    res.status(500).json({ message: "資料庫錯誤" });
  }
});
//查詢使用者的按讚紀錄
router.get('/member/favorite-liked', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT e.* 
      FROM Exhibition_like ef
      JOIN Exhibition e ON ef.exhibition_id = e.id
      WHERE ef.user_id = $1
      ORDER BY ef.favorited_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("查詢最愛收藏展覽失敗：", err);
    res.status(500).json({ message: "資料庫錯誤" });
  }
});


//更新會員資料
router.put("/member/profile", authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { username, email, phone } = req.body
  try {
    await pool.query(
      `update users set username=$1,email=$2,phone=$3 where id = $4`, [username, email, phone, userId]
    )
    res.json({ message: "資料更新成功" })
  } catch (error) {
    console.error("更新失敗", error);
    res.status(500).json({ message: "資料庫錯誤" })
  }
})
//刪除收藏紀錄
router.delete("/member/favorites/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id
  const exhibitionId = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      `delete from Exhibition_Favorite where user_id = $1 and exhibition_id = $2`
      , [userId, exhibitionId])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "找不到收藏紀錄" });
    }
    res.json({ message: "收藏已成功移除" });
  } catch (error) {
    console.error("刪除收藏失敗：", error);
    res.status(500).json({ message: "資料庫錯誤" });
  }
})
//刪除按讚紀錄
router.delete("/member/like/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id
  const exhibitionId = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      `delete from Exhibition_like where user_id = $1 and exhibition_id = $2`
      , [userId, exhibitionId])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "找不到收藏紀錄" });
    }
    res.json({ message: "收藏已成功移除" });
  } catch (error) {
    console.error("刪除收藏失敗：", error);
    res.status(500).json({ message: "資料庫錯誤" });
  }
})
//刪除投稿紀錄
router.delete("/member/review/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id; // 取得使用者 ID
  const reviewId = req.params.id; // 取得 URL 路徑中的投稿 ID
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // 先刪除 review_category
    await client.query(
      `DELETE FROM review_category WHERE review_id = $1`,
      [reviewId]
    );
    // 再刪除 review
    const result = await client.query(
      `DELETE FROM review WHERE creator_id = $1 AND id = $2`,
      [userId, reviewId]
    );
    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "找不到投稿紀錄" });
    }
    await client.query("COMMIT");
    res.json({ message: "投稿已成功移除" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("刪除投稿失敗：", error);
    res.status(500).json({ message: "資料庫錯誤" });
  } finally {
    client.release();
  }
});
// 刪除訂單紀錄
router.delete("/member/order/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id; // 使用者 ID
  const orderItemId = req.params.id; // 要刪除的 order_item.id
  console.log(userId);
  console.log(orderItemId);
  try {
    // 1. 取得該 order_item 所屬的 order
    const check = await pool.query(
      `SELECT orders.id AS order_id
       FROM orders
       INNER JOIN order_item ON orders.id = order_item.order_id
       WHERE order_item.id = $1 AND orders.user_id = $2`,
      [orderItemId, userId]
    );
    if (check.rows.length === 0) {
      return res.status(403).json({ message: "無權限刪除此訂單或訂單不存在" });
    }
    const orderId = check.rows[0].order_id;
    console.log(orderId);
    // 2. 刪除 order_item
    await pool.query(`DELETE FROM order_item WHERE id = $1`, [orderItemId]);

    // 3. 檢查該訂單是否還有其他 order_item
    const remaining = await pool.query(
      `SELECT COUNT(*) FROM order_item WHERE order_id = $1`,
      [orderId]
    );
    if (parseInt(remaining.rows[0].count) === 0) {
      // 4. 如果沒有，刪除主訂單
      await pool.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
    }

    res.json({ message: "訂單刪除成功" });

  } catch (error) {
    console.error("刪除訂單失敗:", error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});


module.exports = router;