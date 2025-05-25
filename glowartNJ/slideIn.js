const pool = require("./db.js");
const express = require("express");
const cors = require('cors');
const slideIn = express.Router()

slideIn.use(express.json())
slideIn.use(cors())

// 抓大圖輪播資料
slideIn.get('/', async function (req, res) {
    try {
        let CarouselExhibition = await pool.query(
            `select * from Exhibition`
        )
        res.json(CarouselExhibition.rows)
    } catch (error) {
        console.log(error);
        console.log('找不到展覽輪播資料')
    }
})

module.exports = slideIn
