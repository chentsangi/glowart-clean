//大輪播圖
import React, { useEffect, useState } from 'react';
import style from './css/slideIn.module.css';
import axios from 'axios';

function SlideIn() {
    const [Carousel, setCarousel] = useState([]); /* 儲存從後端拿到的展覽資料 */
    const [currentIndex, setCurrentIndex] = useState(0); /* 當前顯示的圖片索引 */
    const [fade, setFade] = useState(true); // 控制淡入淡出效果
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const takeCarouselData = async () => {
            try {
                const takeaxios = await axios.get(`http://localhost:8000/SlideIn`);
                console.log('API 返回數據:', takeaxios.data);
                
                if (takeaxios.data && takeaxios.data.length > 0) {
                    setCarousel(takeaxios.data.slice(0, 5)); // 限定最多五比
                } else {
                    console.warn('API 返回了空數據');
                    setError('沒有輪播數據');
                }
            } catch (error) {
                console.error('取得輪播失敗：', error);
                setError('獲取數據失敗');
                // 可以添加一些後備數據，以防 API 失敗
                setCarousel([{
                    id: 1,
                    title: '測試展覽',
                    venue: '測試場地',
                    start_date: new Date(),
                    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    carousel_img: 'https://via.placeholder.com/1200x400'
                }]);
            } finally {
                setIsLoading(false);
            }
        };
        takeCarouselData();
    }, []); 

    // 輪播與淡入淡出效果
    useEffect(() => {
        if (Carousel.length === 0) return;
        
        const fadeInterval = setInterval(() => {
            // 先淡出
            setFade(false);
            
            // 淡出後切換圖片
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % Carousel.length);
                // 然後淡入
                setFade(true);
            }, 500); // 500ms 後切換圖片並淡入
            
        }, 3000); // 每 3 秒切換一次
        
        return () => clearInterval(fadeInterval);
    }, [Carousel]);

    if (isLoading) {
        return <div className={style.loadingContainer}>載入輪播中...</div>;
    }

    if (Carousel.length === 0) {
        return <div className={style.errorContainer}>錯誤: {error || '無輪播數據'}</div>;
    }

    const current = Carousel[currentIndex];
    console.log('當前輪播項目:', current);

    // 處理圖片路徑
    const getImageUrl = (item) => {
        if (!item) return '/images/default.jpg';
        
        // 如果 carousel_img 是完整路徑
        if (item.carousel_img && typeof item.carousel_img === 'string') {
            if (item.carousel_img.startsWith('http') || item.carousel_img.startsWith('/')) {
                return item.carousel_img;
            } else {
                // 如果只是文件名，添加路徑前綴
                return `/${item.carousel_img}`;
            }
        }
        
        // 後備方案
        return '/images/default.jpg';
    };
    
    const imageUrl = getImageUrl(current);
    console.log('使用的圖片路徑:', imageUrl);

    return (
        <>
            <div className={style.container}>
                <div className={style.imageWrapper}>
                    <div
                        className={`${style.image} ${fade ? style.fadeIn : style.fadeOut}`}
                        style={{
                            backgroundImage: `url(${imageUrl})`, // 使用處理後的圖片路徑
                        }}
                    ></div>
                    <a href='/' onClick={(e)=>{e.preventDefault()}} className={style.overlay}>
                        <div className={style.contentContainer}>
                            <h1 className={style.exhibitionHeading}>{current.title}</h1>
                            <p className={style.exhibitionLocation}>{current.venue}</p>
                        </div>
                    </a>
                </div>
            </div>
        </>
    );
}

export default SlideIn;