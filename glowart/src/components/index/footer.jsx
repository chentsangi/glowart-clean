import React from 'react';
import style from './css/footer.module.css';

function Footer() {
    const handleEmailClick = (e) => {
        e.preventDefault();
        const email = 'chentsangi@icloud.com';
        const subject = '來自掘光網站的詢問';
        const body = '您好，我想詢問關於...';
        
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.open(gmailUrl, '_blank');
    };

    return (
        <>
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
                    <a href="/"><img src="/images/LOGO.png" alt="Footer Logo" /></a>
                </div>
            </footer>

            <div className={style.copyrightBar}>
                <div className={style.copyrightText}>Copyright©2025  掘光・GLOW ART</div>
            </div>
        </>
    );
}

export default Footer;