# 掘光 GlowArt 展覽平台專案

本專案為一個展覽與藝文活動整合平台，包含前後端兩個主要模組：

## 專案結構

- `glowart/`：前端 React 網站，用於展示展覽資訊、最新消息與地圖導覽。
- `glowartN/`：後端 Node.js + Express，處理 API、投稿管理、使用者驗證與資料庫連接。

## 開發環境與需求

- Node.js v18+
- PostgreSQL（使用 Neon 平台）
- Mailgun SMTP API（帳號需自行註冊）

## 環境變數 `.env`

請根據 `.env.example` 建立 `.env` 檔案於 `glowartN/` 目錄下，包含：

- `MAILGUN_API_KEY`
- `MAILGUN_DOMAIN`
- `DATABASE_URL`

## 啟動方式

```bash
cd glowartN
npm install
npm run dev
