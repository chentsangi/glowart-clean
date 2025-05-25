import style from "./css/ExhibitionsSubmission_Filter_Search.module.css";
import { useState, useEffect } from "react";
import api from "../tickets/api.js";
// import { useCallback } from "react";

//元件
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";
import Tickets from "./tickets.jsx";

function ExhibitionsSubmissionFilterSearch() {
  const [keyword, setKeyword] = useState(""); //關鍵字
  const [results, setResults] = useState([]);
  const [city, setCity] = useState(""); //city
  const [timeRange, setTimeRange] = useState(""); // 近一周/一月/三月
  const [categories, setCategories] = useState([]); //catagory 

  // 當篩選條件變更時觸發
useEffect(() => {
  const params = new URLSearchParams();

  if (city) params.append("city", city);
  if (timeRange) {
    if (timeRange === "近一周") params.append("timeRange", "7");
    else if (timeRange === "近一月") params.append("timeRange", "30");
    else if (timeRange === "近三月") params.append("timeRange", "90");
  }
  if (keyword) params.append("keyword", keyword);
  if (categories.length > 0) {
    categories.forEach((category) => {
      params.append("categories", category);
    });
  }

  const hasAnyFilter =
    city || timeRange || keyword || categories.length > 0;

  if (!hasAnyFilter) {
    setResults([]);
    return;
  }

  api
    .get(`/ticket/?${params.toString()}`)
    .then((res) => {
      console.log("🎯 綜合篩選結果：", res.data);
      setResults(res.data); // ✅ 覆蓋，不保留舊資料
    })
    .catch((err) => {
      console.error("搜尋失敗:", err);
    });
}, [city, timeRange, keyword, categories]);




  // 搜尋列的 callback，單獨處理關鍵字
  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword); // ✅ 只要改變 keyword 狀態，useEffect 就會自動觸發
  };

  return (
    <>
      {/* 使用 SearchBar */}
      <SearchBar onSearch={handleSearch} />
      <div className={style.container}>
        {/* <!-- 篩選列 --> */}
        <form className={style.filterSearch}>
          {/* <!-- 依地區 --> */}
          <div className={style.formRow}>
            <label htmlFor="filterLocation">依地區</label>
            <select id="filterLocation" onChange={(e) => setCity(e.target.value)}>
              <option value="">全部地區</option>
              <optgroup label="北部" aria-placeholder="choice">
                <option value="台北市">台北市</option>
                <option value="新北市">新北市</option>
                <option value="基隆市">基隆市</option>
                <option value="宜蘭市">宜蘭縣</option>
                <option value="桃園市">桃園市</option>
                <option value="新竹市">新竹縣/市</option>
              </optgroup>
              <optgroup label="中部">
                <option value="苗栗縣">苗栗縣</option>
                <option value="台中市">台中市</option>
                <option value="彰化縣">彰化縣</option>
                <option value="南投縣">南投縣</option>
                <option value="雲林縣">雲林縣</option>
              </optgroup>
              <optgroup label="南部">
                <option value="嘉義市">嘉義縣/市</option>
                <option value="台南市">台南市</option>
                <option value="高雄市">高雄市</option>
                <option value="屏東縣">屏東縣</option>
              </optgroup>
              <optgroup label="東部">
                <option value="花蓮縣">花蓮縣</option>
                <option value="台東縣">台東縣</option>
              </optgroup>
            </select>
          </div>
          {/* <!-- 依時間 --> */}
          <div className={style.formRow}>
            <label htmlFor="filterTime">依時間</label>
            <select
              id="filterTime"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="">全部</option>
              <option>近一周</option>
              <option>近一月</option>
              <option>近三月</option>
            </select>
          </div>
          <CategoryFilter onChange={setCategories} />
        </form>
        <Tickets results={results} />
      </div>
    </>
  );
}

export default ExhibitionsSubmissionFilterSearch;
