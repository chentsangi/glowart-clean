const pool = require("../db.js");
const express = require("express");

const exhicardAll = express.Router()


// 投稿藝廊
exhicardAll.get('/', async function (req, res) {
    try {
        let exhibitionCard = await pool.query(
            `select * from Exhibition where is_submission = True`
        )
        res.json(exhibitionCard.rows)
    } catch (error) {
        console.log(error);
        console.log("找不到投稿資料");
    }
})

module.exports = exhicardAll