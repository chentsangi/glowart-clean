import style from "./css/header.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from "react";
import LoginModal from "./login/LoginModal";
import RegisterModal from "./login/RegisterModal";
import ForgetPwdModal from "./login/ForgetPwdModal";
import VerifyCodeModal from "./login/VerifyCodeModal";
import ResetPwdModal from "./login/ResetPwdModal";

function Header() {
    const navigate = useNavigate()
    // 控制哪個 Modal
    const [view, setView] = useState("none");
    // 登入後要自動導向的路由
    const [redirectPath, setRedirectPath] = useState("/");

    const [authEmail, setAuthEmail] = useState("");
    const [authCode, setAuthCode] = useState("");

    // 切換 view
    const switchTo = (newView, data = {}) => {
        setView(newView);
        if (data.email) setAuthEmail(data.email);
        if (data.code) setAuthCode(data.code);
    };

    // Header 呼叫：打開登入並記下要導向的路由
    const handleOpenLogin = (path = "/") => {
        setRedirectPath(path);
        setView("login");
    };

    // LoginModal 登入成功後呼叫
    const handleLoginSuccess = () => {
        setView("none");
        navigate(redirectPath);
    };
    const checkLoginStatus = async () => {
        try {
            const response = await axios.get("http://localhost:8000/login/me", {
                withCredentials: true,
            });

            if (response.data.user) {
                console.log("已登入，跳轉到會員頁");
                navigate("/user");
            }
        } catch (error) {
            console.log("未登入，顯示登入畫面");
            handleOpenLogin("")
        }
    };
    const ToTerms = async function () {
        try {
            const response = await axios.get("http://localhost:8000/login/me", {
                withCredentials: true,
            });

            if (response.data.user) {
                navigate("/terms");
            }
        } catch (error) {
            console.log("未登入，顯示登入畫面");
            alert("請先登入會員")
            handleOpenLogin("/terms")

        }
    }
     const Jump = function (e){
        if(e.currentTarget.dataset.key=== "news"){
        navigate("/news");
        return
        }
         if(e.currentTarget.dataset.key === "map"){
        navigate("/map");
        return
        }
    }
    return (
        <>
            <div id={style['about-bg-wrapper']}>
                <div id={style.header}>
                    <div id={style.whiteStickLeft}></div>
                    <Link to="/">
                        <img
                            src="/images/LOGO2.png"
                            id={style.logoCircle}
                            alt="GLOW ART Logo"
                            style={{ cursor: 'pointer' }}
                        />
                    </Link>
                    <div id={style.leftNavText}>
                        <div className={style.dropdown}>
                            <span className={style.jump} onClick={Jump} data-key="news">最新消息</span>
                        </div>
                        <div className={style.dropdown}>
                            <span className={style.jump} onClick={Jump} data-key="map">|藝廊地圖</span>
                        </div>
                        <div className={style.dropdown}>
                            <span>|展覽活動 </span>
                            <div className={style.dropdownContent}>
                                <a href="/exhibition">展覽資訊</a>
                                <a href="/creator">投稿藝廊</a>
                            </div>
                        </div>
                    </div>

                    <div id={style.whiteStickRight}></div>
                    <div id={style.rightNavText}>
                        <div className={style.dropdown}>
                            <span className={style.jump} data-key="terms" onClick={e => {
                                    e.preventDefault();
                                    ToTerms();
                                }}>投稿專區</span>
                        </div>
                        <div className={style.dropdown}>
                            <span>|藝感選品</span>
                            <div className={style.dropdownContent}>
                                <a href="/tickets">套票專區</a>
                            </div>
                        </div>
                        <div className={style.dropdown}>
                            <span className={style.jump} data-key="user" onClick={e => {
                                    e.preventDefault();
                                    checkLoginStatus();
                                }}>|會員專區</span>
                        </div>
                    </div>
                </div>
            </div>
            {view === "login" && (
                <LoginModal
                    switchTo={switchTo}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
            {view === "register" && <RegisterModal switchTo={switchTo} />}
            {view === "forget" && <ForgetPwdModal switchTo={switchTo} />}
            {view === "verify" && (
                <VerifyCodeModal switchTo={switchTo} email={authEmail} />
            )}
            {view === "newPwd" && (
                <ResetPwdModal switchTo={switchTo} email={authEmail} code={authCode} />
            )}
        </>
    )
}

export default Header