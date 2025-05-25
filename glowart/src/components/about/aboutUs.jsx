import style from './css/aboutUs.module.css';
import { motion } from 'framer-motion';

function AboutUs() {
    const handleEmailClick = (e) => {
        e.preventDefault();
        const email = 'customer@glowart.com';
        const subject = '來自掘光網站的詢問';
        const body = '您好，我想詢問關於...';
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
    };

    return (
        <>
            <div id={style.aboutBgWrapper}>
                <div id={style.header}>
                    <div id={style.whiteStickLeft}></div>
                    <a href="/"><img src="/images/LOGO2.png" id={style.logoCircle} alt="Logo" /></a>
                    <div id={style.whiteStickRight}></div>
                    <div id={style.leftNavText}>
                        <div className={style.dropdown}>
                            <a href="/news" className={style.navLink}>最新消息</a>
                            <div className={style.dropdownContent}>
                                <a href="/news/highlight">演藝快訊</a>
                                <a href="/news/announcement">最新公告</a>
                            </div>
                        </div>
                        <a href="/map" className={style.navLink}>|藝廊地圖</a>
                        <div className={style.dropdown}>
                            <a href="/exhibition" className={style.navLink}>|展覽活動 </a>
                            <div className={style.dropdownContent}>
                                <a href="/exhibition">展覽資訊</a>
                                <a href="/creator">投稿藝廊</a>
                            </div>
                        </div>
                    </div>

                    <div id={style.rightNavText}>
                        <a href="/terms" className={style.navLink}>投稿專區</a>
                        <div className={style.dropdown}>
                            <a href="/tickets" className={style.navLink}>|藝感選品</a>
                            <div className={style.dropdownContent}>
                                <a href="/tickets">套票專區</a>
                            </div>
                        </div>
                        <a href="/user" className={style.navLink}>|會員專區</a>
                    </div>
                </div>

                <div id={style.aboutSectionWrapper}>
                    <div id={style.aboutHeightBox}>
                        <span>關於掘光 </span>
                        <span>GLOW ART</span><br />
                    </div>
                    <div id={style.secondAboutHeightBox}>
                        <span>Where Exhibitions Meet Creation</span><br />
                        <span>串聯展覽與創作，讓靈感被看見、讓藝術更容易被找到</span><br />
                        <span>不只是彙整資訊，也讓觀展與參展變得更簡單</span>
                    </div>
                    <div id={style.brownStick}></div>
                </div>
            </div>

            <div id={style.sinceWrapper}>
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                    viewport={{ once: true, amount: 1 }}
                >
                    <img src="/images/since2025.png" id={style.since2025} alt="Since 2025" />
                    <img src="/images/Rectangle 1.png" id={style.rectangle1} alt="Rectangle 1" />
                    <span className={style.firstContentText}>
                        <span id={style.inThe}>在 </span>
                        城市的各個角落，每天都有大大小小的展覽正在發生。然而，受限於資訊分散與查找不便，許多觀眾難以即時掌握展覽動態，創作者也缺乏合適的曝光空間。因此，我們希望建立一個清楚整合全台展演資訊的平台，讓使用者可以快速掌握展覽時間、地點與內容，同時提供創作者穩定的投稿與展示管道。
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
                    viewport={{ once: true, amount: 1 }}
                >
                    <span id={style.circleBall1}> Artist</span>
                    <span id={style.circleBall2}> Art Exhibition</span>
                    <span id={style.circleBall3}>Visitor</span>
                </motion.div>
            </div>

            <div id={style.rectanglesSection}>
                <img src="/images/Rectangle 2.png" id={style.rectangle2} alt="Rectangle 2" />
                <img src="/images/Rectangle 3.png" id={style.rectangle3} alt="Rectangle 3" />

                <motion.span
                    className={style.secondContentText}
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    viewport={{ once: true, amount: 1 }}
                >
                    <span id={style.inThe}>「掘光 GlowArt」</span>
                    <span id={style.textBox2}>因此誕生，作為一個聚焦於展覽與創作交流的數位平台。我們不只整合全台各地的展覽資訊，也提供創作者自由投稿的空間，讓更多潛藏的光芒得以被看見。平台設計著重於流暢的觀展體驗與創作者的作品呈現，讓每一次瀏覽、每一次點擊，都是一次與藝術對話的機會。我們相信，被看見是一切創作的起點，而掘光，正是那道將光引向創作本質的通道。</span>
                    <br /><br /><br />
                    <div className={style.miniExplain}>
                        <span>審核</span> | 將靈感轉為作品，無論媒材形式，都歡迎展現獨特視角與創作語言
                    </div>

                    <div className={style.miniExplain}>
                        <span>投稿</span> | 上傳作品與理念說明，建立專屬展頁，開啟與觀眾的第一段連結
                    </div>

                    <div className={style.miniExplain}>
                        <span>創作</span> | 團隊將進行內容審閱與確認，審核通過後即可正式上架於展覽平台
                    </div>
                </motion.span>
            </div>

            <div id={style.futureHope}>
                <img src="/images/Rectangle 5.png" id={style.rectangle5} alt="Rectangle 5" />
                <div className={style.futureHopeContentContainer}>
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        viewport={{ once: true, amount: 1 }}
                    >
                        <span className={style.thirdContentText}>
                            <span id={style.inThe}>在 </span>
                            未來，我們希望透過穩定的資料更新、持續優化的互動機制，以及與展演單位的合作，擴展掘光的深度與廣度。這不僅是一個展覽資訊平台，更是一個承載藝術信念與文化流動的載體。
                        </span>
                    </motion.div>
                </div>
            </div>

            <footer className={style.footerDiv}>
                <img src="/images/footerBg.png" alt="Footer Background" />

                <div className={style.footerContent}>
                    <div>展覽活動</div>
                    <a href="/exhibition" className={style.footerLink}>展覽資訊</a>
                    <a href="/creator" className={style.footerLink}>投稿藝廊</a>
                    <div>藝感選品</div>
                    <a href="/tickets" className={style.footerLink}>展覽套票</a>
                    <div>關於</div>
                    <a href="/about" className={style.footerLink}>關於掘光</a>
                    <a 
                        href="#/"
                        onClick={handleEmailClick}
                        className={style.footerLink}
                    >
                        聯絡我們
                    </a>
                    <a href="/" className={style.logoLink}>
                        <img src="/images/LOGO.png" alt="Footer Logo" />
                    </a>
                </div>
            </footer>
            <div className={style.copyrightBar}>
                <div className={style.copyrightText}>Copyright©2025 掘光  ・GLOW ART</div>
            </div>
        </>
    );
}

export default AboutUs;