import React, { useState, useEffect, useRef } from 'react';
import style from "./css/exhiPage.module.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderVer2 from '../index/headerVer2';
import Footer from '../index/footer';

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

// 自定義 Hook：useInteraction
function useInteraction(type) {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    // 定義預設和活動的圖片
    const images = {
        like: {
            default: '/images/heart.png',
            active: '/images/heartActive.png'
        },
        collect: {
            default: '/images/collect.png',
            active: '/images/collectActive.png'
        }
    };


    // 初始載入時檢查狀態
    useEffect(() => {
        // 檢查互動狀態
        const checkInteractionStatus = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/exhibition/${id}/${type}-status`,
                    { withCredentials: true }
                );
                setIsActive(response.data.active);
            } catch (error) {
                console.error(`檢查${type}狀態失敗`, error);
            }
        };
        checkInteractionStatus();
    }, [id, type]);

    // 處理互動點擊
    const handleInteractionClick = async () => {
        try {
            // 檢查登入狀態
            const userResponse = await axios.get(
                "http://localhost:8000/login/me",
                { withCredentials: true }
            );

            if (!userResponse.data.user) {
                alert("請先登入才能進行操作");
                navigate('/login');
                return;
            }

            // 執行互動操作
            const interactionResponse = await axios.post(
                `http://localhost:8000/exhibition/${id}/${type}`,
                {},
                { withCredentials: true }
            );

            // 更新互動狀態
            setIsActive(interactionResponse.data.active);

            // 按讚收藏訊息
            alert(interactionResponse.data.message)

        } catch (error) {
            console.error(`${type}操作失敗`, error);
            alert('請先登入會員');
        }
    };



    return {
        isActive,
        defaultImage: images[type].default,
        activeImage: images[type].active,
        handleClick: handleInteractionClick
    };
}

// 展覽詳情組件
function ExhibitionLikeCollect() {
    const {
        isActive: isHeartActive,
        defaultImage: heartDefault,
        activeImage: heartActive,
        handleClick: handleHeartClick
    } = useInteraction('like');

    const {
        isActive: isCollectActive,
        defaultImage: collectDefault,
        activeImage: collectActive,
        handleClick: handleCollectClick
    } = useInteraction('collect');

    return (
        <>
            <img
                className={style.heart}
                src={isHeartActive ? heartActive : heartDefault}
                alt="喜歡"
                onClick={handleHeartClick}
            />
            <img
                className={style.collect}
                src={isCollectActive ? collectActive : collectDefault}
                alt="收藏"
                onClick={handleCollectClick} />
        </>
    );
}

function ExhiSection() {
    const { id } = useParams();
    const [exhibition, setExhibition] = useState(null);
    const [categories, setCategories] = useState([]);
    const [fontSize, setFontSize] = useState('medium');
    const contentRef = useRef(null);
    const navigate = useNavigate();

    // 日期格式化函數
    const formatDate = (dateString) => {
        try {
            return format(parseISO(dateString), 'yyyy/MM/dd');
        } catch (error) {
            return dateString;
        }
    };



    useEffect(() => {
        // 把所有逻辑都搬进 effect，不再引用外部的 exhibitionData
        (async () => {
            try {
                const { data } = await axios.get(`http://localhost:8000/exhibition/${id}`);
                const exhibitionData = data.exhibition;

                // 若是投稿则重定向到 CreatorPage
                if (exhibitionData.is_submission) {
                    navigate(`/creator/${id}`);
                    return;  // 停止後續 setState
                }

                // 正常展覽頁面：先設定展覽與分類
                setExhibition(exhibitionData);
                setCategories(data.categories);
            } catch (error) {
                console.error('載入展覽詳細資料失敗', error);
            }
        })();
    }, [id, navigate]);
    const handleFontSizeChange = (selectedFont) => {
        setFontSize(selectedFont);
    };
    useEffect(() => {
        const map = { small: style.sFont, medium: '', large: style.lFont };
        if (contentRef.current) {
            contentRef.current.classList.remove(style.sFont, style.lFont);
            if (map[fontSize]) contentRef.current.classList.add(map[fontSize]);
        }
    }, [fontSize]);
    const processDescription = (text) => {
        // 確保傳入的是字串
        if (typeof text !== 'string') {
            console.error('Invalid input to processDescription:', text);
            return [];
        }

        // 移除開頭可能的空白，並統一處理換行符號
        return text
            .trim()
            .replace(/\\r\\n/g, '\n')  // 將 \r\n 轉換為 \n
            .replace(/\\n\\n/g, '\n')  // 將 \r\n 轉換為 \n
            .split('\n')  // 按換行分隔
            .filter(paragraph => paragraph.trim() !== '')  // 移除空段落
            .map(paragraph => paragraph.trim());  // 移除每段首尾空白
    };

    if (!exhibition) {
        return <div>載入中...</div>;
    }

    return (
        <article className={style.glowArtical}>
            <section className={style.flex}>
                <div className={style.title}>
                    <h1>{exhibition.title}</h1>
                </div>
                <div className={style.banner}>
                    <img src={exhibition.image_long} alt={exhibition.title} />
                </div>
                <div className={style.share}>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${generateShareUrl(`/exhibition/${id}`)}`} target="_blank" rel="noopener noreferrer"><img src="/images/FB.png" alt="Facebook分享" /></a>
                    <a href={`https://social-plugins.line.me/lineit/share?url=${generateShareUrl(`/exhibition/${id}`)}`} target="_blank" rel="noopener noreferrer"><img src="/images/Line.png" alt="Line分享" /></a>
                    <a href={`mailto:?subject=分享這篇文章給你&body=希望你會喜歡：${generateShareUrl(`/exhibition/${id}`)}`}><img src="/images/Mail.png" alt="郵件分享" /></a>
                    <ShareLink />
                    
                    <div className={style.like}>
                        <div className={style.fontpt}>
                            <a href='/'
                                className={`${style.s} ${style.fontBtn} ${fontSize === 'small' ? 'fontnow' : ''}`}
                                data-font="small"
                                onClick={(e) => { e.preventDefault(); handleFontSizeChange('small'); }}
                            >A</a>
                            <a href='/'
                                className={`${style.m} ${style.fontBtn} ${fontSize === 'medium' ? 'fontnow' : 'fontnow'}`}
                                data-font="medium"
                                onClick={(e) => { e.preventDefault(); handleFontSizeChange('medium') }}
                            >A</a>
                            <a href='/'
                                className={`${style.l} ${style.fontBtn} ${fontSize === 'large' ? 'fontnow' : ''}`}
                                data-font="large"
                                onClick={(e) => { e.preventDefault(); handleFontSizeChange('large') }}
                            >A</a>
                        </div>
                        <ExhibitionLikeCollect />
                    </div>
                </div>
            </section>
            <div className={`${style.twoCol} ${style.twoContent}`}>
                {/* 展覽資訊 */}
                <div className={style.leftRight}>
                    <div className={style.colLeft}>
                        <ul className={style.exbInfo}>
                            <li>
                                <h5>展期</h5>
                                <p>
                                    {formatDate(exhibition.start_date)} ~ {formatDate(exhibition.end_date)}
                                </p>
                            </li>
                            <li>
                                <h5>展館</h5>
                                <p>{exhibition.venue}</p>
                            </li>
                            <li>
                                <h5>地點</h5>
                                <p>{exhibition.address}</p>
                            </li>
                            <li>
                                <h5>參展藝術家</h5>
                                <p>{exhibition.creator_name}</p>
                            </li>
                        </ul>
                        <div className={style.hashTagContainer}>
                            {categories.map((category) => (
                                // <a href="#" key={category.id}>
                                <span className={style.hashTag}>#{category.name}</span>
                                // </a>
                            ))}
                        </div>
                    </div>
                    {/* 展覽內文 */}
                    <div className={style.colRight}>
                        {/* 字體大小切換區域保持不變 */}
                        <section ref={contentRef} className="content">
                            {Array.isArray(processDescription(exhibition.description))
                                ? processDescription(exhibition.description).map((paragraph, index) => (
                                    <p key={index}>
                                        {paragraph.split('<br>').map((line, lineIndex, array) => (
                                            lineIndex < array.length - 1 ?
                                                <>
                                                    {line}
                                                    <br />
                                                </> :
                                                line
                                        ))}
                                    </p>
                                ))
                                : null}
                        </section>
                    </div>
                </div>
            </div>
        </article>
    );
}

const ExhibitionCard = ({ detailUrl, ...props }) => {
    // 如果 props 為 null，渲染一個空白佔位卡片
    if (!props.id) {
        return (
            <div className={`${style.exhibitionCard} ${style.exhibitionCardPlaceholder}`}>
                {/* 空白佔位 */}
            </div>
        );
    }

    const {
        image_square, // 展覽首圖
        start_date, // 開始日期
        end_date, // 結束日期
        title, // 展名
        venue, // 地點
        status, // 展覽狀態
        daysLeft, // 剩餘天數
        id // 網址
    } = props;

    return (
        <div className={style.exhibitionCard}>
            <Link to={detailUrl} className={style.linkStyle} reloadDocument>
                <div className={style.cardImageContainer}>
                    <img className={style.cardImage} src={image_square} alt={title} />
                    <div className={style.overlay}>
                        <div className={style.dateGroup}>
                            {/* 開始日期 */}
                            <div className={style.dateBlock}>
                                <div className={style.textMask}>
                                    <div className={`${style.textBox} ${style.slideUp}`}>
                                        <p className={style.year}>{new Date(start_date).getFullYear()}</p>
                                    </div>
                                </div>
                                <div className={style.textMask}>
                                    <div className={`${style.textBox} ${style.slideDown}`}>
                                        <p className={style.date}>{new Date(start_date).getMonth() + 1}/{new Date(start_date).getDate()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 分隔線 */}
                            <div className={style.symbolMask}>
                                <div className={style.line}></div>
                            </div>

                            {/* 結束日期 */}
                            <div className={style.dateBlock}>
                                <div className={style.textMask}>
                                    <div className={`${style.textBox} ${style.slideUp}`}>
                                        <p className={style.year}>{new Date(end_date).getFullYear()}</p>
                                    </div>
                                </div>
                                <div className={style.textMask}>
                                    <div className={`${style.textBox} ${style.slideDown}`}>
                                        <p className={style.date}>{new Date(end_date).getMonth() + 1}/{new Date(end_date).getDate()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <div className={style.cardText}>
                <a href={'/exhibition/' + id}><h2>{title}</h2></a>
                <p>{venue}</p>
                <div className={`${style.status} ${status === 'soon' ? style.soon : status === 'ended' ? style.end : ''}`}>
                    {status === 'ongoing' && '正在進行'}
                    {status === 'soon' && '即將開始'}
                    {status === 'ended' && '已結束'}
                    {daysLeft && <span>{daysLeft} days left</span>}
                </div>
            </div>
        </div>
    );
};


function ReadMore() {
    //  推薦展覽 

    const { id } = useParams();
    const [exhibition, setExhibition] = useState(null);
    const [recommendedExhibitions, setRecommendedExhibitions] = useState([]);
    useEffect(() => {
        const fetchExhibitionDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/exhibition/${id}`);
                setExhibition(response.data.exhibition);
            } catch (error) {
                console.error('載入展覽詳細資料失敗', error);
            }
        };
        fetchExhibitionDetail();
    }, [id]);
    useEffect(() => {
        const fetchRecommendedExhibitions = async () => {
            if (!exhibition) return;
            try {
                // 根據 is_submission 動態選擇路由
                const recommendedUrl = exhibition.is_submission
                    ? `http://localhost:8000/creator/${id}/recommended`
                    : `http://localhost:8000/exhibition/${id}/recommended`;

                console.log('嘗試載入推薦展覽:', recommendedUrl);
                console.log('展覽狀態:', exhibition.is_submission);

                const response = await axios.get(recommendedUrl);
                console.log('推薦展覽載入成功:', response.data);
                // 根據當前展覽狀態確定推薦展覽的跳轉路由
                const processedRecommendations = response.data.map(recExhibition => ({
                    ...recExhibition,
                    detailUrl: recExhibition.is_submission
                        ? `/creator/${recExhibition.id}`
                        : `/exhibition/${recExhibition.id}`
                }));
                setRecommendedExhibitions(processedRecommendations);
            } catch (error) {
                console.error('載入推薦展覽失敗:', error);

                if (error.response) {
                    // 伺服器回應的錯誤
                    console.error('伺服器回應錯誤:', error.response);
                    if (error.response.status === 301) {
                        // 處理重新導向
                        const redirectUrl = error.response.data.redirectUrl;
                        console.log('重新導向至:', redirectUrl);
                        window.location.href = redirectUrl;
                        return;
                    }
                } else if (error.request) {
                    // 請求已發出，但無回應
                    console.error('無回應的請求:', error.request);
                } else {
                    // 設置請求時發生的錯誤
                    console.error('設置請求時的錯誤:', error.message);
                }
            }
        };
        // 當 exhibition 載入後再載入推薦展覽
        if (exhibition) {
            fetchRecommendedExhibitions();
        }
    }, [exhibition, id]);





    // 渲染邏輯
    if (!exhibition) {
        return <div>載入中...</div>;
    }

    return (
        <section className={style.flex}>
            <div className={style.recommandList}>
                <div className={style.recommand}>
                    <h4>推薦展覽</h4>
                </div>
                <div className={style.listBox}>
                    {recommendedExhibitions.map((exhibition) => (
                        <ExhibitionCard
                            key={exhibition.id}
                            {...exhibition}
                            status={determineExhibitionStatus(exhibition)}
                            daysLeft={calculateDaysLeft(exhibition)}
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
                            window.location.href = '/exhibition';
                        }
                    } catch (error) {
                        console.error('返回上一頁出錯:', error);
                        // 備用方案
                        window.location.href = '/exhibition';
                    }
                }}>
                    &#60;&ensp;回上頁
                </Link>
            </div>
        </section>
    );
}

// 輔助函數：判斷展覽狀態
function determineExhibitionStatus(exhibition) {
    const now = new Date();
    const startDate = new Date(exhibition.start_date);
    const endDate = new Date(exhibition.end_date);

    if (now < startDate) return 'soon';
    if (now > endDate) return 'ended';
    return 'ongoing';
}

// 輔助函數：計算剩餘天數
function calculateDaysLeft(exhibition) {
    const now = new Date();
    const startDate = new Date(exhibition.start_date);
    const endDate = new Date(exhibition.end_date);

    if (now < startDate) {
        // 展覽即將開始
        const days = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
        return days;
    }

    if (now > endDate) {
        return '';
    }

    // 展覽進行中
    const days = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return days;
}

function ExhiPage() {
    return (
        <>
            <HeaderVer2 />
            <ExhiSection /> 
            <ReadMore />
            <Footer />
        </>
    )
}

export default ExhiPage;