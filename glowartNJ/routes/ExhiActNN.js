const pool = require("../db.js");
const express = require("express");
const exhiActAll = express.Router()



// 展覽活動
exhiActAll.get('/', async function (req, res) {
    try {
        let exhibitionAct = await pool.query(
            `select * from Exhibition where is_submission = false`
        )
        res.json(exhibitionAct.rows)
    } catch (error) {
        console.log(error);
        console.log("No展覽資料");
    }
})

module.exports = exhiActAll