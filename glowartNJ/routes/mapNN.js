const pool = require("../db.js");
const express = require("express");
const mapAll = express.Router()
mapAll.use(express.json())
// 抓"北"資料
mapAll.get('/N', async function (req, res) {
    try {
        let exhibition = await pool.query(
            `select * from Exhibition where region='北'`
        )
        res.json(exhibition.rows)
    } catch (error) {
        console.log('撮撮N');
        console.log(error);
    }
})
// 抓"中"資料
mapAll.get('/C', async function (req, res) {
    try {
        let exhibition = await pool.query(
            `select * from Exhibition where region='中'`
        )
        res.json(exhibition.rows)
    } catch (error) {
        console.log('撮撮C');
        console.log(error);
    }
})
// 抓"南"資料
mapAll.get('/S', async function (req, res) {
    try {
        let exhibition = await pool.query(
            `select * from Exhibition where region='南'`
        )
        res.json(exhibition.rows)
    } catch (error) {
        console.log('撮撮S');
        console.log(error);
    }
})
// 抓"東"資料
mapAll.get('/E', async function (req, res) {
    try {
        let exhibition = await pool.query(
            `select * from Exhibition where region='東'`
        )
        res.json(exhibition.rows)
    } catch (error) {
        console.log('撮撮Ee');
        console.log(error);
    }
})

module.exports = mapAll