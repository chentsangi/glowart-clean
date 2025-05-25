// 訂單紀錄
import style from "../css/LikedHistory.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

function OrderHistory() {
  const [submissions, setSubmissions] = useState([]);
  const [isEditing, setIsEditing] = useState(false); //修改狀態
  useEffect(() => {
    axios
      .get("http://localhost:8000/user/member/order_item")
      .then(res => {
        setSubmissions(res.data);
        console.log(res.data);
      })
      .catch(err => {
        console.error("無法取得訂單紀錄：", err);
        if (err.response?.data) console.error(err.response.data);
      });
  }, []);
  const handleDelete = async (id) => {
    if (!window.confirm("確定要取消訂單嗎？")) return;
    try {
      await axios.delete(`http://localhost:8000/user/member/order/${id}`);
      setSubmissions(prev => prev.filter(item => item.id !== id));
      alert("訂單已成功刪除！");
    } catch (err) {
      console.error("刪除失敗", err);
      alert("刪除失敗，請稍後再試");
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <div>
        <button onClick={() => setIsEditing(prev => !prev)} className={style.but2}>
          {isEditing ? "完成" : "編輯"}
        </button>
      </div>
      {submissions.length === 0 ? (
        <p style={{ textAlign: "center" }}>尚無訂單紀錄</p>
      ) : (submissions.map((item, index) => (
        <div key={index} className={style.block}>
          <div>
            <img
              src={item.exhi_image}
              alt={item.title}
            />
          </div>
          <div>
            <h3>展覽名稱:</h3>
            <span>{item.title}</span>
            <h3>展覽時間:</h3>
            <span>
              {new Date(item.exhi_start).toLocaleDateString()} ~{" "}
              {new Date(item.exhi_end).toLocaleDateString()}
            </span>
            <div className={style.statusBox} >
              <span>訂單狀態:{item.status}</span>
            </div>
          </div>
          { (item.status === "備貨中" || item.status === "準備付款") && isEditing &&(
            <div style={{ marginTop: "10px" }}>
              <button className={style.butdel} onClick={() => handleDelete(item.id)}><img style={{ width: "150%", height: "150%" }} src="/images/closeBtn.png" alt="叉叉" /></button>
            </div>
          )}
        </div>
      ))
      )}
    </div>
  );
}

export default OrderHistory;
