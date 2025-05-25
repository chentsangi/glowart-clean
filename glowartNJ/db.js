require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    // 連接資料庫的url
    connectionString: process.env.DATABASE_URL, // 這裡的DATABASE_URL是環境變數，會在.env檔案中設定(資料庫名?)
    timezone: "Asia/Taipei", // 時區設定
    ssl: {
        // 無設定密碼 FALSE
        // 有設定密碼 TRUE
        rejectUnauthorized: false
    }
})
module.exports = pool
