import style from "./css/news.module.css";
import NewsSearch from "./newsSearch";
import React, { useState, useEffect } from "react";
import api from "../api";
// import { motion } from "framer-motion"; // 導入 motion
import"./css/arrow.module.css"
import Arrow from "./arrow"; 
import Arrow2 from "./arrow2"; 
function News() {
  const [highlightData, setHighlightData] = useState([]); // 儲存新聞資料
  const [searchResults, setSearchResults] = useState([]); // 儲存搜尋結果
  const [isSearching, setIsSearching] = useState(false); // 是否處於搜尋模式
  const [announcementData, setAnnouncementData] = useState([]); // 儲存最新公告資料

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("zh-TW");
    } catch (e) {
      console.error("❌ 日期格式錯誤:", dateString);
      return "日期格式錯誤";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/news/news");

        console.log("✅ 全部資料:", res.data);
        setHighlightData(res.data);
      } catch (err) {
        console.error("❌ 錯誤發生：", err);
      }
    };

    const fetchAnnouncement = async () => {
      try {
        const res = await api.get("/news/announcement");
        console.log("✅ 最新公告資料:", res.data);
        setAnnouncementData(res.data);
      } catch (err) {
        console.error("❌ 錯誤發生：", err);
      }
    };
    fetchData();
    fetchAnnouncement();
  }, []);

  // 🚀 處理搜尋結果
  const handleSearchResults = async (searchData) => {

    // 🔍 如果是 "ALL"，代表顯示全部資料
    if (searchData === "ALL") {
      setIsSearching(false);
      setSearchResults([]);
      try {
        const res = await api.get("/news/news");
        console.log("✅ 全部資料:", res.data);
        setHighlightData(res.data);
      } catch (err) {
        console.error("❌ 錯誤發生：", err);
      }
      return;
    }

    // 🚀 如果有資料則顯示，沒有資料則顯示找不到
    if (searchData.length > 0) {
      console.log("🔍 顯示搜尋結果:", searchData);
      setSearchResults(searchData);
      setIsSearching(true);
    } else {
      console.log("⚠️ 沒有找到符合條件的資料");
      setSearchResults([]);
      setIsSearching(true);
    }
  };

  return (
    <>
     <Arrow />

      <div className={style.Box}>
        {/* {搜尋元件} */}
        <NewsSearch onSearch={handleSearchResults} />
        <div id={style.newsBox}>
          <ul className={style.newsList}>
            {
              // 🔥 根據是否在搜尋模式切換顯示
              (isSearching ? searchResults : highlightData).map((item) => {
                return (
                  <li key={item.id}>
                    <a href= {`/news/highlight/${item.id}`} className={style.newsA}>
                      <span className={style.newsTitle}>{item.title}</span>
                      <span className={style.newsDate}>
                        {formatDate(item.news_date)}
                      </span>
                    </a>
                  </li>
                );
              })
            }
          </ul>
          {/* 顯示 "找不到資料" 的提示 */}
          {isSearching && searchResults.length === 0 && (
            <p className={style.noResults}>找不到符合條件的資料</p>
          )}
        </div>
      </div>

      {/* 公告箭頭 - 從左到右的動畫 */}
      <Arrow2 />
      
      <div id={style.announcementBox}>
        <ul className={style.announcementList}>
          {announcementData.map((item) => (
            <li key={item.id}>
              <a href={`/news/announcement/${item.id}`} className={style.announcementA}>
                <span className={style.announcementTitle}>{item.title}</span>
                <span className={style.announcementDate}>
                  {formatDate(item.news_date)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default News;