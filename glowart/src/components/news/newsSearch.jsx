import React, { Component } from "react";
import style from "./css/newsSearch.module.css";
import api from "../api";

class NewsSearch extends Component {
  state = {
    keyword: "",
    date: "",
  };

  handleSearch = async (e) => {
    e.preventDefault();
    const { keyword, date } = this.state;

    // 🔍 如果日期和關鍵字都空白，顯示全部資料
    if (!keyword && !date) {
      this.props.onSearch("ALL");
      return;
    }

    try {
      const response = await api.get("/news/search", {
        params: {
          keyword: keyword || "",
          date: date || "",
        },
      });

      console.log("🔍 查詢結果:", response.data);

      // 提交搜尋結果給父組件
      this.props.onSearch(response.data);
    } catch (error) {
      console.error("❌ 查詢失敗:", error);
      alert("搜尋失敗，請稍後再試");
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };



  render() {
    const { keyword, date } = this.state;
    return (
      <div className={style.searchWrapper}>
        <form className={style.searchForm} onSubmit={this.handleSearch}>
          {/* <!-- 關鍵字 --> */}
          <div className={style["form-group"]}>
            <label htmlFor="keyword">關鍵字</label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={keyword}
              onChange={this.handleInputChange}
            />
          </div>
          {/* <!-- 日期 --> */}
          <div className={style["form-group"]}>
            <label htmlFor="date">日期</label>
            <input 
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={this.handleInputChange}
            />
          </div>
          {/* <!-- 查詢按鈕 --> */}
          <button type="submit" className={style.searchBtn}>
            查詢
          </button>
        </form>
      </div>
    );
  }
}

export default NewsSearch;
