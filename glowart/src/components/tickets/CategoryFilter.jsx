import React, { useState } from "react";
import style from "./css/ExhibitionsSubmission_Filter_Search.module.css";
import { useEffect } from "react";
import axios from "axios";


function CategoryFilter({ onChange }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/Category"); // 抓取類別資料
        setCategories(response.data); // 設定資料到 state
        // console.log(response.data);

      } catch (error) {
        console.log("資料庫讀取失敗", error.message);
      }
    };
    // 呼叫函式
    fetchCategories();
  }, [])


  // 狀態儲存被勾選的項目
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    onChange(updatedCategories); // 呼叫父元件的函式
  };

  useEffect(() => {
    onChange(selectedCategories);
  }, [selectedCategories, onChange]);




  return (
    <div>
      <label htmlFor="filterClass" className={style.textType}>依類別</label>
      <div id="filterClass" className={style.gridContainer}>
        {categories.map(({ id, name }) => (
          <div key={`category-${id}`}>
            <input
              type="checkbox"
              id={id}
              checked={selectedCategories.includes(id)} // 綁定狀態
              onChange={() => handleCheckboxChange(id)}
            />
            <label htmlFor={id}>{name}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
