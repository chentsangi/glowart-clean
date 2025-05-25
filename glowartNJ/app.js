const express = require("express")
const cors = require('cors');
const cookieParser = require('cookie-parser'); //可以使用cookie
require('dotenv').config(); //可以使用.env檔案
const app = express()
app.listen(8000, function () {
  console.log("伺服器 啟動!");
})
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
const login = require("./routes/login.js")
const submit = require("./routes/submit.js")
const user = require("./routes/user.js")
const announcement = require("./routes/announcement.js")
const index = require("./routes/index.js")
const news = require("./routes/news.js")
const newsSearch = require("./routes/newsSearch.js")
const mapNN = require("./routes/mapNN.js")
const CreatorPage = require("./routes/CreatorPage.js")
const exhibitionPage = require("./routes/exhibitionPage.js")
const ExhiActNN = require("./routes/ExhiActNN.js")
const categoryFilter = require("./routes/categoryFilter.js")
const exhibitions = require("./routes/exhibitions.js")
const exhibitionsFalse = require("./routes/exhibitionsFalse.js")
const searchBar = require("./routes/searchBar.js")
const ExhiCardNN = require("./routes/ExhiCardNN.js")
const ticketFilter = require("./routes/ticketFilter.js") //抓取categoryFilter的檔案
const ticketEcpay = require("./ECPay/ticketEcpay.js") //抓取ticketEcpay的檔案
const highlight = require("./routes/highlight.js")
app.use("/login", login)
app.use("/user", user)
app.use("/submit", submit)
app.use("/", announcement)
app.use("/", index)
app.use("/", news)
app.use("/api/news", newsSearch)
app.use("/map", mapNN)
app.use("/ExhiAct", ExhiActNN)
app.use("/api", categoryFilter)
app.use("/api", exhibitions)
app.use("/api", exhibitionsFalse)
app.use("/api", searchBar)
app.use("/ExhiCard", ExhiCardNN)
app.use("/", CreatorPage)
app.use("/", exhibitionPage)
app.use("/api", ticketFilter)
app.use("/ticketEcpay", ticketEcpay)
app.use("/", highlight)







