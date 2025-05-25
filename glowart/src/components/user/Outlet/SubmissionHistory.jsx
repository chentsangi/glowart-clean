//投稿紀錄頁面
import style from "../css/LikedHistory.module.css"
import axios from "axios";
import { useEffect, useState } from "react";
axios.defaults.withCredentials = true
function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([]);
  const [isEditing, setIsEditing] = useState(false); //修改狀態
  useEffect(() => {
    axios.get("http://localhost:8000/user/member/submissions")
      .then(res => {
        setSubmissions(res.data);
      })
      .catch(err => {
        console.error("無法取得投稿紀錄：", err);
      });
  }, []);
  const HistoryDelete = async (id) => {
    if (!window.confirm("確定要刪除嗎?")) return;
    try {
      await axios.delete(`http://localhost:8000/user/member/review/${id}`)
      setSubmissions(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error("刪除失敗", error);
    }
  }
  return (
    <div style={{ width: "100%" }}>
      <div>
        <button onClick={() => setIsEditing(prev => !prev)} className={style.but2}>
          {isEditing ? "完成" : "編輯"}
        </button>
      </div>
      {submissions.length === 0 ? (
        <p style={{ textAlign: "center" }}>尚無投稿紀錄</p>
      ) : (
        submissions.map((item, index) => (
          <div key={index} className={style.block}>
            <div>
              <img src={item.image_long} alt={item.title} />
            </div>
            <div>
              <h3>展覽名稱:</h3><span>{item.title}</span>
              <h3>展覽時間:</h3><span>{new Date(item.start_date).toLocaleDateString()} ~ {new Date(item.end_date).toLocaleDateString()}</span>
              <span className={style.statusBox}><span>狀態:{item.review_status}</span></span>
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
export default SubmissionHistory;