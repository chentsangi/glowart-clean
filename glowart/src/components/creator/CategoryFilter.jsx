import { useState } from "react";
import style from "./css/creator.module.css";
import { useEffect } from "react";
import axios from "axios";


function CategoryFilter({ onChange }) {
  const [categories, setcategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await axios.get("http://localhost:8000/user/Category");
        setcategories(categories.data)
        console.log(categories.data);

      } catch (err) {
        console.error("❌ 錯誤發生：", err);
      }
    }
    fetchData()
  }, []);
  // 狀態儲存被勾選的項目
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (category) => {
    // 勾選 → 新增到陣列
    // 取消 → 從陣列移除
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    onChange(updatedCategories); // 呼叫父元件的函式 回傳選中的分類陣列
  };

  return (
    <>
      <label htmlFor="filterClass" style={{ "margin": "10px" }}>依類別</label>
      <div id="filterClass" className={style.labCategory}>
        {categories.map((category) => (
          <div key={category.name}>
            <input
              type="checkbox"
              id={category.name}
              checked={selectedCategories.includes(category.name)}
              onChange={() => handleCheckboxChange(category.name)}
            />
            <label htmlFor={category.name}>{category.name}</label>
          </div>
        ))}
      </div>
    </>
  );
}

export default CategoryFilter;
