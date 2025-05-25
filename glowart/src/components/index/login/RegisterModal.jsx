//註冊
import React from "react";
import style from "./css/login.module.css";
import axios from "axios";

const RegisterModal = ({ switchTo }) => {

  const [fordata, setFordata] = React.useState({
    username: "",
    email: "",
    password: "",
    birth_date: "",
    phone: ""
  });
  const [message, setMessage] = React.useState("");  // ← 新增

  const handleRegister = () => {
    // 基本前端檢查，同您原本的...
    if (!fordata.username || !fordata.email || !fordata.password || !fordata.birth_date || !fordata.phone) {
      setMessage("請填寫所有欄位");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(fordata.email)) {
      setMessage("請輸入有效的電子信箱");
      return;
    }
    if (!/^\d{10}$/.test(fordata.phone)) {
      setMessage("手機號碼必須是 10 位數字");
      return;
    }

    // 真正呼叫後端
    axios.post("http://localhost:8000/login/register", fordata)
      .then(res => {
        // 註冊成功，跳回登入
        alert("註冊成功，將跳回登入畫面")
        switchTo("login");
      })
      .catch(err => {
        // 如果有收到 response，才進行判斷
        if (err.response) {
          const { status, data } = err.response;
          // 衝突錯誤
          if (status === 409 && data.errorCode === "DUPLICATE_RESOURCE") {
            if (data.field === "email") {
              setMessage("電子信箱已被使用");
            } else if (data.field === "phone") {
              setMessage("手機號碼已被使用");
            } else {
              setMessage(data.message || "註冊失敗，資源衝突");
            }
          }
          // 欄位驗證錯誤
          else if (status === 400 && data.errorCode === "VALIDATION_ERROR") {
            setMessage(data.message);
          }
          // 其他錯誤
          else {
            setMessage(data.message || "註冊失敗，請稍後再試");
          }
        } else {
          setMessage("無法連線到伺服器");
        }
        console.error("註冊失敗", err);
      });
  };

  return (
    <div className={style.register} onClick={() => switchTo("none")}>
      <div className={style["register-content"]} onClick={e => e.stopPropagation()}>
        <p>會員註冊</p>
        <input
          name="username"
          className={style.loginPut}
          value={fordata.username}
          placeholder="會員姓名"
          onChange={e => setFordata({ ...fordata, username: e.target.value })}
        />
        <input
          name="email"
          className={style.loginPut}
          value={fordata.email}
          placeholder="電子信箱"
          onChange={e => setFordata({ ...fordata, email: e.target.value })}
        />
        <input
          name="password"
          className={style.loginPut}
          value={fordata.password}
          type="password"
          placeholder="會員密碼"
          onChange={e => setFordata({ ...fordata, password: e.target.value })}
        />
        <input
          name="birth_date"
          className={style.loginPut}
          value={fordata.birth_date}
          type="date"
          placeholder="生日"
          onChange={e => setFordata({ ...fordata, birth_date: e.target.value })}
        />
        <input
          name="phone"
          className={style.loginPut}
          value={fordata.phone}
          placeholder="手機號碼"
          onChange={e => setFordata({ ...fordata, phone: e.target.value })}
        />
        <button onClick={handleRegister}>註冊</button>
        {message && <p style={{ color: "red", marginTop: 8 }}>{message}</p>}
        <div>
          <span onClick={() => switchTo("login")} style={{ cursor: "pointer",position:"relative",top:"15px"}}>返回登入</span> 
        </div>
      </div>

    </div>
  );
};

export default RegisterModal;
