import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import style from './css/annoucementInside.module.css';
import Footer from '../index/footer';
import HeaderVer2 from '../index/headerVer2';
import Arrow2 from './arrow2';
function AnnouncementInside() {
    const [announcement, setAnnouncement] = useState({
        date: '',
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 從URL獲取公告ID
    const { id } = useParams();

    useEffect(() => {
        // 從API獲取特定公告的資料
        const fetchAnnouncementData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/api/announcement/${id}`);

                // 處理描述中description的 \n\n 字符，轉成真正的換行符
                if (response.data && response.data.description) {
                    response.data.description = response.data.description
                        .replace(/\\n\\n/g, '\n\n')  // 雖然在資料庫寫的是字面上的 "\n\n",但"\n\n"在Node.js 讀出來它當作字串處理時，會是 "\\n\\n",所以要進行轉換
                }
                //   舉例:   
                //   /text/g   // 找出所有 text
                //   /\n/g     // 找出所有換行符號
                //   /\\n/g    // 找出「反斜線 + n」這兩個字元
                //   另外:
                //   沒有 g 標誌時(第28行)只會匹配並替換第一個出現的 \\n\\n 
                //   有 g 標誌時 會找到並替換檔案中所有出現的 \\n\\n



                setAnnouncement(response.data);
                setLoading(false);
            } catch (err) {
                console.error('獲取公告資料時發生錯誤:', err);
                setError('無法載入公告資料。請稍後再試。');
                setLoading(false);
            }
        };

        fetchAnnouncementData();
    }, [id]);

    if (loading) return <div>載入中...</div>;
    if (error) return <div className={style.errorMessage}>{error}</div>;

    // 分割描述成段落
    const paragraphs = announcement.description ? announcement.description.split('\n\n') : [];

    return (
        <>
            <HeaderVer2 />
            <Arrow2/>

            <main className={style.newsMain}>
                <div className={style.newsHeader}>
                    <h5 id={style.artNewsDate}>
                        NewPublished {announcement.date}
                    </h5>
                    <h2 id={style.artNewsTitle}>
                        {announcement.title}
                    </h2>
                </div>

                <div>
                    <p id={style.artNewsAuthor}>【掘光GlowArt 更新】</p>
                    <div id={style.artNewsDescription}>
                        {paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default AnnouncementInside;


// 流程
// [後端資料字串: 含 \\n\\n]
// .replace(/\\n\\n/g, '\n\n') → 轉換為真正的換行符
// .split('\n\n') → 依照段落分隔，產出 paragraphs 陣列
// .map(...) → 每段包一個 <p> 元素渲染在畫面