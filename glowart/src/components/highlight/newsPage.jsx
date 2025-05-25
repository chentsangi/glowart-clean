import React, { useState, useEffect, useRef } from 'react';
import style from "./css/newsPage.module.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns'; import { useParams } from 'react-router-dom';
import HeaderVer2 from "../index/headerVer2"
import Footer from "../index/footer"
// 分享連結
const generateShareUrl = (path) => {
    return `${window.location.origin}${path}`;
};

function ShareLink() {
    // 複製連結函數
    const copyURL = () => {
        const artURL = window.location.href;

        navigator.clipboard.writeText(artURL)
            .then(() => {
                alert("已複製連結至剪貼簿!👍");
            })
            .catch(err => {
                alert("複製失敗，殘念得很!!! " + err);
            });
    };

    return (
        <img
            onClick={copyURL}
            src="/images/Link.png"
            alt="複製連結"
            style={{ cursor: 'pointer' }} // 添加滑鼠指標樣式
        />
    );
}

// 格式化日期 FEB 05, 2025
function formatDate(dateString) {
    const parsedDate = parseISO(dateString);
    return format(parsedDate, 'MMM dd, yyyy').toUpperCase();
}

function NewsSection() {
    // 網址
    const { id } = useParams(); // 取得網址中的 id

    const [news, setNews] = useState(null);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState('medium');
    const contentRef = useRef(null);


    const handleFontSizeChange = (selectedFont) => {
        setFontSize(selectedFont);
    };


    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                console.log("嘗試獲取 ID:", id);
                const response = await axios.get(`http://localhost:8000/news/highlight/${id}`);

                console.log("伺服器返回:", response.data);

                if (response.data.length === 0) {
                    setError("找不到新聞資料");
                    return;
                }

                setNews(response.data[0]);
            } catch (error) {
                console.error("新聞詳細資料載入失敗", error.response || error);
                setError("載入失敗");
            }
        };

        fetchNewsDetail();
    }, [id]);

    useEffect(() => {

        const fontClassMap = {
            small: style.sFont,
            medium: '',
            large: style.lFont
        };
        if (contentRef.current) {
            // 清除所有字級 class
            contentRef.current.classList.remove(style.sFont, style.lFont);

            // 根據選擇的字體大小添加對應的 class
            if (fontClassMap[fontSize]) {
                contentRef.current.classList.add(fontClassMap[fontSize]);
            }
        }
    }, [fontSize]);

    if (error) {
        return <div>錯誤：{error}</div>;
    }

    // 如果資料尚未載入，顯示載入中
    if (!news) {
        return <div>載入中...</div>;
    }

    return (
        <>
            <article className={style.glowNews}>
                <section className={style.flex}>
                    <div className={style.title}>
                        <h5>NEW PUBLISHED {formatDate(news.news_date)}</h5>
                        <h1>{news.title}</h1>
                    </div>
                    <div className={style.banner}>
                        <img src={news.image_long} alt={news.title} />
                    </div>
                    <div className={style.share}>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${generateShareUrl(`/news/highlight/${id}`)}`} target="_blank" rel="noopener noreferrer"><img src="/images/FB.png" alt="Facebook分享" /></a>
                        <a href={`https://social-plugins.line.me/lineit/share?url=${generateShareUrl(`/news/highlight/${id}`)}`} target="_blank" rel="noopener noreferrer"><img src="/images/Line.png" alt="Line分享" /></a>
                        <a href={`mailto:?subject=分享這篇文章給你&body=希望你會喜歡：${generateShareUrl(`/news/highlight/${id}`)}`}><img src="/images/Mail.png" alt="郵件分享" /></a>
                        <ShareLink />
                        <div className={style.like}>
                            <div className={style.fontpt}>
                                <a href='/'
                                    className={`${style.s} ${style.fontBtn} ${fontSize === 'small' ? 'fontnow' : ''}`}
                                    data-font="small"
                                    onClick={(e) => {e.preventDefault() ; handleFontSizeChange('small')}}
                                >A</a>
                                <a href='/'
                                    className={`${style.m} ${style.fontBtn} ${fontSize === 'medium' ? 'fontnow' : ''}`}
                                    data-font="medium"
                                    onClick={(e) => {e.preventDefault();handleFontSizeChange('medium')}}
                                >A</a>
                                <a href='/'
                                    className={`${style.l} ${style.fontBtn} ${fontSize === 'large' ? 'fontnow' : ''}`}
                                    data-font="large"
                                    onClick={(e) => {e.preventDefault() ;handleFontSizeChange('large')}}
                                >A</a>
                            </div>
                        </div>
                    </div>
                </section> 
                <div className={style.twoContent}>
                    <div className={`${style.fontpt} ${style.fontptSmall}`}>
                        <a href='/'
                            className={`${style.s} ${style.fontBtn} ${fontSize === 'small' ? 'fontnow' : ''}`}
                            data-font="small"
                            onClick={(e) =>{ e.preventDefault() ;handleFontSizeChange('small')}}
                        >A</a>
                        <a href='/'
                            className={`${style.m} ${style.fontBtn} ${fontSize === 'medium' ? 'fontnow' : ''}`}
                            data-font="medium"
                            onClick={(e) =>{ e.preventDefault() ;handleFontSizeChange('medium')}}
                        >A</a>
                        <a href='/'
                            className={`${style.l} ${style.fontBtn} ${fontSize === 'large' ? 'fontnow' : ''}`}
                            data-font="large"
                            onClick={(e) => {e.preventDefault();handleFontSizeChange('large')}}
                        >A</a>
                    </div>
                    <section ref={contentRef} className="content">
                        <p>【{news.author}】</p>
                        <p>
                            {news.description &&
                                news.description
                                    .replace(/\\n\\n/g, '\n\n')
                                    .split('\n\n')
                                    .map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))
                            }
                        </p>
                    </section>
                </div>
            </article>
        </>
    );
}


function Card({ news }) {

    //  新聞卡片 
    return (
        <div className={style.exhibitionCard}>
            <Link to={'/news/highlight/' + news.id} reloadDocument>
                <div className={style.cardImageContainer}>
                    <img className={style.cardImage} src={news.image_square} alt="展覽圖片" />
                    <div className={style.overlay}></div>
                </div>
            </Link>
            <div className={style.cardText}>
                <Link to={'/news/highlight/' + news.id} reloadDocument>
                    <h2>{news.title}</h2>
                </Link>
                <p>{formatDate(news.news_date)}</p>
            </div>
        </div>
    )
}

function ReadMore() {
    const { id } = useParams(); // 取得當前頁面的 id
    console.log("當前頁面的ID:", id);

    // 接後端＆資料庫
    const [newsData, setNewsData] = useState([]);



    // 隨機選取數組中指定數量的元素
    function getRandomItems(arr, count) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    useEffect(() => {
        const takeNewsData = async function () {
            try {
                let getaxios = await axios.get(`http://localhost:8000/NewsPage`);

                // 過濾掉當前頁面的新聞
                const filteredNews = getaxios.data.filter(news => news.id !== Number(id));

                // 隨機選取3個不重複的新聞
                const randomNews = getRandomItems(filteredNews, 3);

                setNewsData(randomNews);
            } catch (error) {
                console.error("投稿新聞資料連線失敗", error);
            }
        }
        takeNewsData();
    }, [id]);

    //  延伸閱讀 
    return (
        <section className={style.flex}>
            <div className={style.recommandList}>
                <div className={style.recommand}>
                    <h4>延伸閱讀</h4>
                </div>
                <div className={style.listBox}>
                    {newsData.map((news) => (
                        <Card
                            key={news.id}
                            news={{
                                id: news.id,
                                image_square: news.image_square || "images/預設圖片.png",
                                title: news.title,
                                news_date: news.news_date
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className={style.return}>
                <Link className={style.linkStyle} href="#" onClick={(e) => {
                    e.preventDefault();
                    try {
                        // 優先使用 history.back()
                        if (window.history.length > 1) {
                            window.history.back();
                        } else {
                            // 如果沒有上一頁，可以導航到預設頁面
                            window.location.href = '/exhibitions';
                        }
                    } catch (error) {
                        console.error('返回上一頁出錯:', error);
                        // 備用方案
                        window.location.href = '/exhibitions';
                    }
                }}>
                    &#60;&ensp;回上頁
                </Link>
            </div>
        </section>
    )
}
function NewsPage() {
    return (
        <>
            <HeaderVer2 />
            <NewsSection />
            <ReadMore />
            <Footer />
        </>
    )
}

export default NewsPage;
