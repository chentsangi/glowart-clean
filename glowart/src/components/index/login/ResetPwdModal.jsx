//重設密碼
import React, { useState } from "react";
import axios from "axios";
import style from "./css/login.module.css";

const ResetPwdModal = ({ switchTo, email, code }) => {
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = () => {
    if (pwd !== pwd2) {
      setMessage("兩次密碼輸入不一致");
      return;
    }
    axios.post("http://localhost:8000/login/reset-password", {
      email,
      code,
      newPassword: pwd
    })
    .then(res => {
      // 重設成功 → 回到登入或關閉 Modal
      switchTo("login");
    })
    .catch(err => {
      console.error("重設失敗", err);
      setMessage("重設密碼失敗，請稍後再試");
    });
  };

  return (
    <div className={style.forgetPwd} onClick={() => switchTo("none")}>
      <div className={style["forgetPwd-content"]} onClick={e => e.stopPropagation()}>
        <p>請輸入新密碼</p>
        <input
          type="password"
          placeholder="新密碼"
          className={style.loginPut}
          value={pwd}
          onChange={e => setPwd(e.target.value)}
        />
        <input
          type="password"
          placeholder="再次輸入新密碼"
          className={style.loginPut}
          value={pwd2}
          onChange={e => setPwd2(e.target.value)}
        />
        <button onClick={handleReset}>重設密碼</button>
        {message && <p style={{ color: "red", marginTop: 8 }}>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPwdModal;
