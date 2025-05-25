// 會員登入
import React from "react";
import style from "./css/login.module.css";
import axios from "axios";
const LoginModal = ({ switchTo, onLoginSuccess }) => {
  const [email, setemail] = React.useState("")
  const [password, setpassword] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("");
  // 處理輸入變更             
  const handleLogin = async function () {
    try {
      const response = await axios.post(
        "http://localhost:8000/login/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.data.message === "登入成功") {
        alert("登入成功");
        switchTo("none");
        window.location.reload();
        if (onLoginSuccess){ 
          onLoginSuccess()
        }else {
          window.location.reload();
        }
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("登入失敗，請稍後再試。");
      }
    }
  };

  return (
    <div className={style.login} onClick={() => { switchTo("none") }}>
      <div className={style["login-content"]} onClick={(e) => e.stopPropagation()}> {/*阻止事件冒泡*/}
        <p>會員登入</p>
        <input
          name="email"
          value={email}
          placeholder="電子信箱"
          onChange={(e) => { setemail(e.target.value) }}
          className={style.loginPut} />
        <input
          name="password"
          type="password"
          value={password}
          placeholder="會員密碼"
          onChange={(e) => { setpassword(e.target.value) }}
          className={style.loginPut} />
        <button type="button" onClick={handleLogin} className={style.loginText}>登入</button><br />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <div>
          <span onClick={() => switchTo("forget")} style={{ cursor: "pointer" }}>忘記密碼？</span> |
          <span onClick={() => switchTo("register")} style={{ cursor: "pointer" }}>立即註冊</span>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;