import style from "./css/creator.module.css";
import React, { useState, useEffect, useCallback } from "react";
import api from "../api.js";
import axios from "axios"
//元件
import CategoryFilter from "./CategoryFilter.jsx";
import SearchBar from "./SearchBar.jsx";
import ExhiAct from "./ExhiAct.jsx";

function ExhibitionsSubmissionFilterSearch() {
  const [, setKeyword] = useState("");
  const [city, setCity] = useState("");  // 存所選的地區
  const [has_ticket, sethas_ticket] = useState(""); // 免費 or 購票
  const [status, setStatus] = useState(""); // 正在展 or 已過期
  const [timeRange, setTimeRange] = useState(""); // 近一周/一月/三月
  const [categories, setCategories] = useState([]); // 儲存選中的類別
  const [results, setResults] = useState([]);  // 儲存搜尋後的結果資料
  const [loading, setLoading] = useState(false); // 是否顯示載入中
  const [isSubmission] = useState(false); // 是否是投稿展覽
  // 初始API請求，一進入畫面就顯示所有展覽資料
  useEffect(() => {
    axios.get("http://localhost:8000/api/Exhibitionfalse") // 獲取展覽資料
      .then((response) => {
        if (response.data.length > 0) {
          console.log("🎯 資料獲取成功", response.data);
          setResults(response.data); // 存入results
        } else {
          console.warn(" 查無資料");
        }
      })
      .catch((error) => {
        console.error(" API 錯誤：", error.message);
      });
  }, []);



  // 篩選條件的搜尋
  const performSearch = useCallback(async () => {
    setLoading(true); // 畫面顯示「載入中」

    try { // 將收集篩選條件放進URLSearchParams
      const params = new URLSearchParams(); // 動態組合 URL 查詢參數

      // 有篩選條件就加進去
      if (city) params.append("city", city);
      if (has_ticket) params.append("has_ticket", has_ticket);
      if (status) params.append("status", status);
      if (timeRange) { // 將文字轉換成天數
        if (timeRange === "近一周") params.append("timeRange", "7");
        else if (timeRange === "近一月") params.append("timeRange", "30");
        else if (timeRange === "近三月") params.append("timeRange", "90");
      }

      if (categories.length > 0) {
        categories.forEach((category) => {
          params.append("categories", category);
        });
      }
      console.log(" 呼叫 API:", params.toString());

      // 發送 GET 請求到後端 API
      const response = await axios.get(
        `http://localhost:8000/api/Exhibitionfalse?${params.toString()}`
      );


      if (response.data.length > 0) {
        setResults(response.data); // 把回傳的資料放到 state
      } else {
        console.warn("查無符合條件的資料");
        setResults([]);
      }
    } catch (error) {
      console.error("API 呼叫失敗：", error.message);
    } finally {
      setLoading(false);
    }


  }, [city, has_ticket, status, timeRange, categories]);


  // 當篩選條件變更時觸發
  useEffect(() => {
    performSearch(); // 不傳參數 → includeKeyword = false
  }, [performSearch]);


  //關鍵字搜尋，獨立
  const performSearchBar = (newKeyword) => {
    if (!newKeyword.trim()) {
      const bb = axios.get("http://localhost:8000/api/Exhibitionfalse") // 獲取展覽資料
        .then((response) => {
          if (response.data.length > 0) {
            console.log("🎯 資料獲取成功", response.data);
            setResults(response.data);
          } else {
            console.warn("查無資料");
            setResults([]); // 清空結果避免顯示上一次結果
          }
        })
        .catch((error) => {
          console.error("API 錯誤：", error.message);
        });
      setResults(bb.data);
      return;
    }
    // API 回應資料，更新到 results
    api.get(`/Exhibition/searchBar`, {
      params: {
        keyword: newKeyword,
        is_submission: isSubmission
      }
    })
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => {
        console.error("搜尋失敗:", err);
        setResults([]);
      });
  };

  // 搜尋列的 callback，單獨處理關鍵字
  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword);
    performSearchBar(newKeyword);
  };

  return (
    <>
      {/* 使用 SearchBar  搜尋框 */}
      <SearchBar onSearch={handleSearch} />
      <div className={style.mainContent}>
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
          {/* <!-- 依展覽性質 --> */}
          <div className={style.formRow}>
            <label htmlFor="filterNature">依展覽性質</label>
            <select
              id="filterNature"
              onChange={(e) => sethas_ticket(e.target.value)}
            >
              <option value="">全部</option>
              <option value="false">免費入場</option>
              <option value="true">購票入場</option>
            </select>
          </div>
          {/* <!-- 依展覽狀態 --> */}
          <div className={style.formRow}>
            <label htmlFor="filterState">依展覽狀態</label>
            <select id="filterState" onChange={(e) => setStatus(e.target.value)}>
              <option value="">全部</option>
              <option value="1">正在展覽中</option>
              <option value="2">即將開始</option>
              <option value="0">已結束</option>
            </select>
          </div>
          {/* <!-- 依類別 --> */}
          <CategoryFilter onChange={setCategories} />
        </form>
        <ExhiAct results={results} loading={loading} />
      </div>
    </>
  );
}

export default ExhibitionsSubmissionFilterSearch;
