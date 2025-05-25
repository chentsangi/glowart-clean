// 忘記密碼
import React, { useState } from "react";
import style from "./css/login.module.css";
import axios from "axios";

const ForgetPwdModal = ({ switchTo }) => {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("請輸入正確的電子信箱");
      return;
    }

    axios.post("http://localhost:8000/login/forget-password", { email })
      .then(res => {
        switchTo("verify", { email });
      })
      .catch(err => {
        console.error("發送失敗", err);
        setMessage("發送失敗，請確認信箱是否正確");
      });
  };

  return (
    <div className={style.forgetPwd} onClick={() => switchTo("none")}>
      <div className={style["forgetPwd-content"]} onClick={(e) => e.stopPropagation()}>
        <p>忘記密碼?</p>
        <input
          name="femail"
          placeholder="電子信箱"
          className={style.loginPut}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSend}>確認</button>
        {message && <p style={{ color: "red", marginTop: "8px" }}>{message}</p>}
        <div>
          <span onClick={() => switchTo("login")} style={{ cursor: "pointer",position:"relative",top:"15px"}}>返回登入</span> 
        </div>
      </div>
    </div>
  );
};

export default ForgetPwdModal;
