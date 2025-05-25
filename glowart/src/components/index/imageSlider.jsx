import React, { useState, useEffect } from 'react';
import style from "./css/imageSlider.module.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion"; // 導入 Framer Motion 替代 AOS

function ImageSlider() {

    const [exhibitionsTop, setExhibitionsTop] = useState([]);
    const [exhibitionsBottom, setExhibitionsBottom] = useState([]);

    // 格式化讚數
    const formatLikes = (count) => {
        return count >= 1000 ? "1000+" : count;
    };

    const takeImageSliderData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/ImageSlider');

            // 按讚數降序排序
            const sortedExhibitions = response.data.sort((a, b) => b.like_count - a.like_count);

            // 分成上下兩組
            const top5 = sortedExhibitions.slice(0, 5);
            const bottom5 = sortedExhibitions.slice(5, 10);

            setExhibitionsTop(top5.map((exhi, index) => ({
                ...exhi,
                top: `TOP ${index + 1}`
            })));

            setExhibitionsBottom(bottom5.map((exhi, index) => ({
                ...exhi,
                top: `TOP ${index + 6}`
            })));

        } catch (error) {
            console.error("展覽資料載入失敗", error);
        }
    };

    useEffect(() => {
        const initSlider = () => {
            const htmlCollection = document.getElementsByClassName(style.imageSlider);
            const sliders = Array.from(htmlCollection);
            sliders.forEach(slider => {
                const track = slider.querySelector(`.${style.imageSliderTrack}`);
                const isLeft = slider.classList.contains('directionLeft');
                const speed = 0.5; // 調整速度
                let paused = false;

                // 確保內容已經渲染
                const images = track.querySelectorAll('img');
                if (images.length > 0) {
                    track.innerHTML += track.innerHTML; // 複製內容以無縫播放
                }

                let loadedCount = 0;
                images.forEach(img => {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === images.length) startSlider();
                    };
                    if (img.complete) img.onload();
                });

                function startSlider() {
                    const totalWidth = track.scrollWidth / 2;
                    let pos = isLeft ? 0 : -totalWidth;

                    slider.addEventListener('mouseenter', () => paused = true);
                    slider.addEventListener('mouseleave', () => paused = false);

                    function animate() {
                        if (!paused) {
                            pos += isLeft ? -speed : speed;
                            if (isLeft && Math.abs(pos) >= totalWidth) pos = 0;
                            else if (!isLeft && pos >= 0) pos = -totalWidth;
                            track.style.transform = `translateX(${pos}px)`;
                        }
                        requestAnimationFrame(animate);
                    }

                    animate();
                }

                // 如果已經有圖片，直接啟動
                if (images.length > 0) {
                    startSlider();
                }
            });
        };

        // 先載入數據
        takeImageSliderData().then(() => {
            // 確保 DOM 渲染後初始化
            setTimeout(initSlider, 100);
        });
    }, []);

    function renderImageCardsTop() {
        return exhibitionsTop.map((exhi, index) => (
            <div className={style.imageCard} key={exhi.id}>
                <Link to={'/exhibition/' + exhi.id} target="_blank">
                    <div className={style.imageWrapper}>
                        <img src={exhi.image_square} alt={`展覽圖${index + 1}`} />
                        <div className={style.overlay}>
                            <div className={style.overlayContent}>
                                <img src="images/愛心_小.png" alt="heart" />
                                <span>{formatLikes(exhi.like_count)}</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.caption}>
                        <h3>{exhi.top}</h3>
                        <h4>{exhi.title}</h4>
                    </div>
                </Link>
            </div>
        ));
    }

    function renderImageCardsBottom() {
        return exhibitionsBottom.map((exhi, index) => (
            <div className={style.imageCard} key={exhi.id}>
                <Link to={'/exhibition/' + exhi.id} target="_blank" >
                    <div className={style.imageWrapper}>
                        <img src={exhi.image_square} alt={`展覽圖${index + 6}`} />
                        <div className={style.overlay}>
                            <div className={style.overlayContent}>
                                <img src="images/愛心_小.png" alt="heart" />
                                <span>{formatLikes(exhi.like_count)}</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.caption}>
                        <h3>{exhi.top}</h3>
                        <h4>{exhi.title}</h4>
                    </div>
                </Link>
            </div>
        ));
    }

    return (
        <>
            <div className={style.sliderContainer}>
                <div id={style.sliderTitle}>
                    <motion.div
                        className={style.titleWrapper}
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay:6, ease: "easeInOut" }}
                        viewport={{ once: true, amount: 0.6, offset: -200 }}
                    >
                        <img id={style.sliderTitleImg} src="/images/inTheSpolight.png" alt="熱門展覽標題" />
                    </motion.div>
                </div>

                {/* 上層（左往右） */}
                <div className={`${style.imageSlider} directionLeft`} id="sliderTop">
                    <div className={style.imageSliderTrack} id="slider-track-top">
                        {renderImageCardsTop()}
                    </div>
                </div>

                {/* 下層（右往左） */}
                <div className={`${style.imageSlider} directionRight`} id="sliderBottom">
                    <div className={style.imageSliderTrack} id="slider-track-bottom">
                        {renderImageCardsBottom()}
                    </div>
                </div>

                <div id={style.moreArrow}>
                    <a href="/exhibition">
                        <img src="/images/moreArrow.png" alt="更多展演" />
                    </a>
                </div>
            </div>
        </>
    );
}

export default ImageSlider;