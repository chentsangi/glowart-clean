//收藏紀錄
import { useEffect, useState } from "react";
import axios from "axios";
import style from "../css/LikedHistory.module.css";
function FavoriteList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ 新增 loading 狀態
  const [isEditing, setIsEditing] = useState(false); //修改狀態
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await axios.get("http://localhost:8000/user/member/favorites");
        setFavorites(res.data);
      } catch (err) {
        console.error("無法取得收藏紀錄：", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>載入中...</p>; // ✅ 正在載入
  }
  const handleDelete = async (id) => {
    if (!window.confirm("確定要移除這項收藏嗎？")) return;
    try {
      await axios.delete(`http://localhost:8000/user/member/favorites/${id}`);
      setFavorites(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("刪除失敗", err);
    }
  };
  const toLink = (item) => {
    console.log(item);
    if (item.is_submission) {
      window.location.href = `/creator/${item.id}`
    } else {
      window.location.href = `/exhibition/${item.id}`
    }
  }
  return (
    <div style={{ width: "100%" }}>
      <div>
        <button onClick={() => setIsEditing(prev => !prev)} className={style.but2}>
          {isEditing ? "完成" : "編輯"}
        </button>
      </div>
      {favorites.length === 0 ? (
        <p style={{ textAlign: "center" }}>尚無收藏展覽</p>
      ) : (favorites.map((item, index) => {
        return (
          <div key={index} className={style.block} >
            <div>
              <img src={item.image_long || `/images/Exhibition/${item.id}/long.jpg`} alt={item.title} onClick={() => toLink(item)} />
            </div>
            <div>
              <h3>展覽名稱:</h3><span>{item.title}</span>
              <h3>展覽時間:</h3><span>{new Date(item.start_date).toLocaleDateString()} ~ {new Date(item.end_date).toLocaleDateString()}</span>
            </div>
            {isEditing && (
              <div style={{ marginTop: "10px" }}>
                <button className={style.butdel} onClick={() => handleDelete(item.id)}><img style={{ width: "150%",height:"150%" }} src="/images/closeBtn.png" alt="叉叉"/></button>
              </div>
            )}
          </div>)
      }))
      }
    </div >
  );
}

export default FavoriteList;
