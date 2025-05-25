import React, { useEffect, useState } from 'react';
import style from "./css/newsBlock.module.css";
import axios from 'axios';
import { motion } from "framer-motion";

function NewsBlock() {
    // 設定圖片基礎路徑
    const IMAGE_BASE_PATH = '/images/news/';

    const [newsBlock, setNewsBlock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState('/images/news/1/square.jpg'); // 預設使用第一個項目的方形圖
    const [showPreview, setShowPreview] = useState(true);

    useEffect(() => {
        // 獲取最新公告和演藝快訊
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/newsBlock');
                setNewsBlock(response.data);

                // 設置第一個項目的方形圖是預覽圖
                setPreviewImage(`${IMAGE_BASE_PATH}1/square.jpg`);
                setShowPreview(true);
            } catch (error) {
                console.error('錯誤:', error);
                setError('錯誤');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className={style.loading}>載入中...</div>;
    if (error) return <div className={style.error}>{error}</div>;

    // 滑鼠移入事件處理
    const handleMouseEnter = (index) => {
        // 索引從0開始,但資料夾從1開始,所以要加1
        const folderNumber = index + 1;

        // 確任資料夾編號在有效範圍內（因為只有20個資料夾）
        const MAX_FOLDER = 20; // 最多只有20個資料夾
        const validFolderNumber = Math.min(Math.max(folderNumber, 1), MAX_FOLDER);

        // 設置對應資料夾中的方形圖為預覽圖
        const imagePath = `${IMAGE_BASE_PATH}${validFolderNumber}/square.jpg`;
        setPreviewImage(imagePath);
        setShowPreview(true);
    };

    return (
        <div className={style.newsContainer}>
            <div id={style.newsTitle}>
                <motion.div
                    className={style.titleWrapper}
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <img id={style.newsTitleImg} src="/images/spolightNews.png" alt="演藝快訊標題" />
                </motion.div>
            </div>

            <div id={style.newsBox}>
                <img id={style.newsRectangle} src="/images/Rectangle 6.png" alt="背景矩形" />

                <ul className={style.newsList}>
                    {newsBlock.length > 0 ? (
                        newsBlock.map((item, index) => (
                            <li key={item.id || index}>

                                <a href={`/news/highlight/${item.id}`}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                >
                                    <span className={style.newsTitle}>
                                        {item.title}
                                    </span>
                                    <span className={style.newsDate}>{item.date}</span>
                                </a>
                            </li>
                        ))
                    ) : (
                        <li>目前沒有快訊</li>
                    )}
                </ul>

                <div id={style.previewBox}
                    style={{ display: showPreview ? 'block' : 'none' }}>
                    <img id={style.previewImg}
                        src={previewImage}
                        alt="預覽圖片"
                        onError={(e) => {
                            // 圖片載入失敗的話，會套用備用圖片
                            e.target.onerror = null;
                            e.target.src = '/images/news/1/square.jpg';
                        }}
                    />
                </div>

                <div id={style.moreArrow}>
                    <a href="/news">
                        <img src="/images/moreArrow.png" alt="更多新聞" />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default NewsBlock