import { Outlet } from "react-router-dom";
import MemberSidebar from "./MemberSidebar";
import styles from "./css/MemberLayout.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import HeaderVer2 from "../index/headerVer2"
import Footer from "../index/footer"
import Arrow from "./arrow"


function MemberLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    // 🔄 使用 AbortController 來取消重複的請求
    const controller = new AbortController();
    const checkLoginStatus = async () => { 
      try {
        const response = await axios.get("http://localhost:8000/login/me", {
          withCredentials: true,
          signal: controller.signal, // 🔄 加入中斷的 Signal
        });

        if (response.data.user) {
          console.log("✅ 已登入會員頁");
        } else {
          console.log("❌ 未登入，跳轉到首頁");
          alert("請先登入才能進入會員專區");
          navigate("/");
        }
      } catch (error) {
        // 🔄 判斷是否是中斷錯誤
        if (error.name === 'CanceledError') {
          console.log("🔄 請求被中斷");
        } else {
          console.log("❌ 未登入，跳轉到首頁");
          alert("請先登入才能進入會員專區");
          navigate("/");
        }
      }
    };
    checkLoginStatus();
    // 🔄 組件卸載時中斷請求
    return () => {
      controller.abort();
    };
  }, [navigate]);
  return (
    <>
      <HeaderVer2 />
      <div>
        <Arrow />
        <div className={styles.layout}>
          <MemberSidebar />
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MemberLayout;
