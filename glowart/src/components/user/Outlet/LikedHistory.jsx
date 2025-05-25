//按讚紀錄
import axios from "axios";
import { useEffect, useState } from "react";
import style from "../css/LikedHistory.module.css";
axios.defaults.withCredentials = true
function LikedHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); //loading狀態
  const [isEditing, setIsEditing] = useState(false); //修改狀態

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get("http://localhost:8000/user/member/favorite-liked");
        setItems(result.data);
      } catch (error) {
        console.error("資料庫連線失敗", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>載入中...</p>;

  const HistoryDelete = async (id) => {
    if (!window.confirm("確定要移除最愛嗎？")) return;
    try {
      await axios.delete(`http://localhost:8000/user/member/like/${id}`)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error("刪除失敗", error);
    }
  }
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
      {items.length === 0 ? (
        <p style={{ textAlign: "center" }}>尚無「最愛」的展覽</p>
      ) : (
        items.map((item, index) => (
          <div className={style.block} key={item.id || index}>
            <div>
              <img src={item.image_long} alt={item.title} onClick={()=>toLink(item)}/>
            </div>
            <div>
              <h3>展覽名稱:</h3>
              <span>{item.title}</span>
              <h3>展覽時間:</h3>
              <span>
                {new Date(item.start_date).toLocaleDateString()} ~ {new Date(item.end_date).toLocaleDateString()}
              </span>
            </div>
            {isEditing && (
              <div style={{ marginTop: "10px" }}>
                <button className={style.butdel} onClick={() => HistoryDelete(item.id)}><img style={{ width: "150%",height:"150%" }} src="/images/closeBtn.png" alt="叉叉"/></button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default LikedHistory;
