// 連接綠界用=>轉址為公開網址
// 因綠界的回傳網址需要公開網址，ngrok可以將本地端的網址轉換成公開網址

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ngrok = require('ngrok');

const ticketEcpay_FILE = path.join(__dirname, 'ticketEcpay.js'); 

(async () => {
    try {
        console.log("🚀 正在啟動 ngrok...");

        // 1️⃣ 自動啟動 ngrok
        const publicUrl = await ngrok.connect({
            addr: 8000,
            region: 'ap', // 亞洲區域，減少延遲
        });

        console.log(`✅ ngrok 已啟動，URL：${publicUrl}`);

        // 2️⃣ 更新 `ReturnURL` 參數
        const fileContent = fs.readFileSync(ticketEcpay_FILE, 'utf-8');

        // 使用正規表達式替換 `ReturnURL`
        const updatedContent = fileContent.replace(
            /ReturnURL:\s*['"`](.*?)['"`]/,
            `ReturnURL: '${publicUrl}/ticketEcpay/ecpay-return'`
        );

        // 3️⃣ 寫回 `ticketEcpay.js`
        fs.writeFileSync(ticketEcpay_FILE, updatedContent, 'utf-8');
        console.log("🔄 ReturnURL 已自動更新至 ngrok URL!");

        // 4️⃣ 自動重啟伺服器
        console.log("♻️ 正在重啟伺服器...");
        require('child_process').exec('npx nodemon app.js');
        console.log("🚀 伺服器已重新啟動！");
    } catch (error) {
        console.error("❌ 無法啟動 ngrok 或更新檔案");
        console.error(error.message);
    }
})();
