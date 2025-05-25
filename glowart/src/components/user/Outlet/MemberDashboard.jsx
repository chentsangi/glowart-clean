//會員資料
import { useEffect, useState } from 'react';
import axios from 'axios';
import style from "../css/MemberDashboard.module.css";


function MemberDashboard() {
  const [user, setUser] = useState(null); //判斷是不是使用者本人的登入狀態
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true); // ✅ 新增 loading 狀態
  useEffect(() => {
    axios.get('http://localhost:8000/login/me')
      .then(res => {
        setUser(res.data.user);
        setEditedData({
          username: res.data.user.username,
          email: res.data.user.email,
          phone: res.data.user.phone
        });
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false); // ✅ 資料請求完成後更新 loading 狀態
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 規則條件
    if (name === "phone" && !/^\d*$/.test(value)) return; // 只能數字
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const dataToSend = { ...editedData };
    console.log(dataToSend);
    if (!/^\S+@\S+\.\S+$/.test(editedData.email)) {
      alert("電子信箱格式不正確");
      return;
    }
    if (editedData.username === "") {
      alert("請輸入姓名");
      return;
    }
    if (!/^\d{10}$/.test(editedData.phone)) {
      alert("手機號碼必須是 10 位數字");
      return;
    }
    if (!/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(editedData.username)) {
      alert("會員名稱只能包含中英文與空格");
      return;
    }
    axios.put("http://localhost:8000/user/member/profile", dataToSend)
      .then(() => {
        return axios.get("http://localhost:8000/login/me"); // ✨ 重新抓資料
      })
      .then(res => {
        setUser(res.data.user); // ✅ 同步最新資料
        setEditedData({
          username: res.data.user.username,
          email: res.data.user.email,
          phone: res.data.user.phone,
        });
        setIsEditing(false);
        alert("更新成功！");
      })
      .catch(err => {
        console.error("更新失敗", err);
      });
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>載入中...</p>; // ✅ 正在載入
  }
  if (!user) return <p style={{ textAlign: "center" }}>請先登入查看會員資訊</p>;

  return (
    <>
      <div className={style.profileBox}>
        {/* username */}
        <div className={style.profileRow}>
          <span className={style.label}>會員名稱：</span>
          {isEditing ? (
            <input name="username" value={editedData.username} onChange={handleChange} className={style.input}/>
          ) : (
            <span className={style.value}>{user.username}</span>
          )}
        </div>
        <div className={style.divider}></div>

        {/* email */}
        <div className={style.profileRow}>
          <span className={style.label}>電子信箱：</span>
          {isEditing ? (
            <input name="email" value={editedData.email} onChange={handleChange} className={style.input} />
          ) : (
            <span className={style.value}>{user.email}</span>
          )}
        </div>
        <div className={style.divider}></div>

        {/* phone */}
        <div className={style.profileRow}>
          <span className={style.label}>手機號碼：</span>
          {isEditing ? (
            <input name="phone" value={editedData.phone} onChange={handleChange} className={style.input}/>
          ) : (
            <span className={style.value}>{user.phone}</span>
          )}
        </div>
        <div className={style.divider}></div>

        {/* birth_date */}
        <div className={style.profileRow}>
          <span className={style.label}>出生日期：</span>
          <span className={style.value}>{new Date(user.birth_date).toLocaleDateString()}</span>
        </div>
        <div className={style.divider}></div>

        {/* Buttons */}
        <div style={{ textAlign: "center", marginTop: "16px" }} >
          {isEditing ? (
            <>
              <button onClick={handleSave} className={style.saveBtn}>儲存</button>
              <button onClick={() => setIsEditing(false)} style={{ marginLeft: "10px" }}>取消</button>
            </>
          ) : (<button onClick={() => setIsEditing(true)} className={style.but}>修改</button>)}
        </div>
      </div>
    </>
  );
}
export default MemberDashboard;
