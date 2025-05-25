import { NavLink, useNavigate } from "react-router-dom";
import styles from "./css/MemberSidebar.module.css";
import axios from "axios";

function MemberSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/login/logout", {}, {
        withCredentials: true, // ✅ 重要：讓 cookie 傳給後端
      });
      navigate("/");
    } catch (error) {
      console.error("登出失敗：", error);
      navigate("/"); // 即使失敗也可先導回首頁
    }
  }; 

  return (
    <nav className={styles.sidebar}>
      <NavLink to="/user" end 
      className={({ isActive }) =>`${styles.link} ${isActive ? styles.active : ""}`}>會員資訊</NavLink>
      <NavLink to="/user/tickets" end 
      className={({ isActive }) =>`${styles.link} ${isActive ? styles.active : ""}`}>按讚紀錄</NavLink>
      <NavLink to="/user/orders" end 
      className={({ isActive }) =>`${styles.link} ${isActive ? styles.active : ""}`}>訂單紀錄</NavLink>
      <NavLink to="/user/submissions" end 
      className={({ isActive }) =>`${styles.link} ${isActive ? styles.active : ""}`}>投稿紀錄</NavLink>
      <NavLink to="/user/favorites" end 
      className={({ isActive }) =>`${styles.link} ${isActive ? styles.active : ""}`}>收藏</NavLink>
      <div className={styles.divider}></div>
      <button
        className={styles.logoutButton}
        onClick={handleLogout}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") handleLogout(); }}
      >
        登出
      </button>
    </nav>
  );
}

export default MemberSidebar;
