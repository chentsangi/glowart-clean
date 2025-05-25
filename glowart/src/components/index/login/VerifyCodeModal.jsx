// 輸入信箱驗證碼
import React, { useState } from "react";
import axios from "axios";
import style from "./css/login.module.css";

const VerifyCodeModal = ({ switchTo, email }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = () => {
    // call 後端 /verify-code
    axios.post("http://localhost:8000/login/verify-code", { email, code })
      .then(res => {
        // 驗證成功 → 切到重設密碼，並帶上 email + code
        switchTo("newPwd", { email, code });
      })
      .catch(err => {
        console.error("驗證失敗", err);
        setMessage("驗證碼錯誤或已過期");
      });
  };

  return (
    <div className={style.forgetPwd} onClick={() => switchTo("none")}>
      <div className={style["forgetPwd-content"]} onClick={e => e.stopPropagation()}>
        <p>請輸入信箱驗證碼</p>
        <input
          placeholder="驗證碼"
          className={style.loginPut}
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button onClick={handleVerify}>驗證</button>
        {message && <p style={{ color: "red", marginTop: 8 }}>{message}</p>}
      </div>
    </div>
  );
};

export default VerifyCodeModal;
