import React, { useState, useEffect } from 'react';
import style from './css/exhiHallMap.module.css';
import { motion } from "framer-motion";

const images = [
    {
        src: "https://khh.travel/image/50834/1920x1080",
        name: "高雄市立美術館",
        address: "高雄市鼓山區美術館路80號",
        time: "週二至週日 09:30–17:30",
        mapUrl: "https://www.google.com/maps/place/%E9%AB%98%E9%9B%84%E5%B8%82%E7%AB%8B%E7%BE%8E%E8%A1%93%E9%A4%A8/@22.656464,120.2838521,17z/data=!4m15!1m8!3m7!1s0x346e0451f86ac18b:0x765227e2cf31e679!2zODA06auY6ZuE5biC6byT5bGx5Y2A576O6KGT6aSo6LevODDomZ8!3b1!8m2!3d22.656464!4d120.286427!16s%2Fg%2F11bw3y742p!3m5!1s0x346e0451f1321009:0x4f90af4e670c3d1f!8m2!3d22.6566968!4d120.2865511!16zL20vMGNqOG04?entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D"
    },
    {
        src: "https://www.tnam.museum/images/filesys/images/ch/about_us/bldg_2_1.jpg",
        name: "臺南市立美術館二館",
        address: "臺南市中西區南門路37號",
        time: "週二至週日 10:00 -18:00",
        mapUrl: "https://www.google.com/maps/place/%E8%87%BA%E5%8D%97%E5%B8%82%E7%BE%8E%E8%A1%93%E9%A4%A8%E4%BA%8C%E9%A4%A8/@22.990375,120.1989736,18z/data=!3m1!5s0x346e767cd05eaaa9:0x84ab9839a7696b68!4m10!1m2!2m1!1z6Ie65Y2X5biC56uL576O6KGT6aSo!3m6!1s0x346e767cc3b11bed:0xae220201100c4e66!8m2!3d22.990375!4d120.2013554!15sChXoh7rljZfluILnq4vnvo7ooZPppKhaGSIX6Ie65Y2XIOW4gueriyDnvo7ooZPppKiSAQphcnRfbXVzZXVtqgFcEAEqGyIX6Ie65Y2XIOW4gueriyDnvo7ooZPppKgoRTIeEAEiGoiLz5Q54p0tlHKsAjiNGf7R_v74hQGb6r1AMhsQAiIX6Ie65Y2XIOW4gueriyDnvo7ooZPppKjgAQA!16s%2Fg%2F11h9rdcq2s?entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D"
    },
    {
        src: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Taipei_Fine_Arts_Museum_and_China_Eastern_aircraft_20120628.jpg",
        name: "臺北市立美術館",
        address: "臺北市中山區中山北路三段181號",
        time: "週二至週日 09:30–17:30",
        mapUrl: "https://www.google.com/maps/place/%E8%87%BA%E5%8C%97%E5%B8%82%E7%AB%8B%E7%BE%8E%E8%A1%93%E9%A4%A8/@25.0724166,121.5222353,17z/data=!3m2!4b1!5s0x3442a94e11ca2d91:0x6e04afe002f50784!4m6!3m5!1s0x3442a951fdd9f7f9:0x7a40c3880c03a171!8m2!3d25.0724118!4d121.5248102!16s%2Fm%2F02pv6ft?entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D"
    },
    {
        src: "https://image.cdn-eztravel.com.tw/_rgsubmd1ISVLJwheexftJfCq6j9ysU-rQTR8m-M0uw/g:ce/aHR0cHM6Ly92YWNhdGlvbi5jZG4tZXp0cmF2ZWwuY29tLnR3L3BvaS90dy9UUEUvTmF0aW9uYWwgUGFsYWNlIE11c2V1bS9zaHV0dGVyc3RvY2tfMzYzOTAyMzU0LmpwZw.jpg",
        name: "國立故宮博物院",
        address: "臺北市士林區至善路二段221號",
        time: "週一至週日 09:00–17:00",
        mapUrl: "https://www.google.com/maps/place/%E5%9C%8B%E7%AB%8B%E6%95%85%E5%AE%AE%E5%8D%9A%E7%89%A9%E9%99%A2/@25.1023602,121.5459176,17z/data=!3m2!4b1!5s0x3442ac3b2ddb9a43:0x7a84c798191dd2cf!4m6!3m5!1s0x3442ac3acd404a7d:0x5d6d7018397a09c1!8m2!3d25.1023554!4d121.5484925!16zL20vMGhod2w?entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D"
    },
    {
        src: "https://www.swcoast-nsa.gov.tw/image/36479/1024x768",
        name: "國立故宮博物院南部院區",
        address: "嘉義縣太保市故宮大道888號",
        time: "週二至週日 09:00–17:00",
        mapUrl: "https://www.google.com/maps/place/%E5%9C%8B%E7%AB%8B%E6%95%85%E5%AE%AE%E5%8D%9A%E7%89%A9%E9%99%A2%E5%8D%97%E9%83%A8%E9%99%A2%E5%8D%80/@23.4738232,120.2891116,16z/data=!3m1!4b1!4m6!3m5!1s0x346e9bd42bdda57b:0x69196ae48b15b8cb!8m2!3d23.4731294!4d120.2927165!16s%2Fg%2F155sww75?entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D"
    },
    {
        src: "https://www.taiwan.net.tw/att/1/big_scenic_spots/pic_450_8.jpg",
        name: "國立臺灣美術館",
        address: "臺中市西區五權西路一段2號",
        time: "週二至週日 09:30–17:30",
        mapUrl: "https://www.google.com/maps/place/%E5%9C%8B%E7%AB%8B%E8%87%BA%E7%81%A3%E7%BE%8E%E8%A1%93%E9%A4%A8/@24.1411913,120.6607382,17z/data=!3m2!4b1!5s0x34693da0dcbd01fd:0x92004bb977c9e7ca!4m6!3m5!1s0x34693da636e451c9:0xb87dd5a0ca6c290e!8m2!3d24.1411864!4d120.6633131!16s%2Fm%2F0w348qg?entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D"
    },
];

function ExhiHallMap() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const moveSlide = (direction) => {
        setCurrentIndex((currentIndex + direction + images.length) % images.length);
    };

    useEffect(() => {
        const items = document.querySelectorAll(`.${style.item}`);
        items.forEach((item, index) => {
            item.className = style.item;

            const relativeIndex = (index - currentIndex + images.length) % images.length;
            if (relativeIndex === 0) {
                item.classList.add(style.center);
            } else if (relativeIndex === 1) {
                item.classList.add(style.right);
            } else if (relativeIndex === images.length - 1) {
                item.classList.add(style.left);
            } else if (relativeIndex < images.length / 2) {
                item.classList.add(style.outRight);
            } else {
                item.classList.add(style.outLeft);
            }
        });
    }, [currentIndex]);

    return (
        <>
            {/* 標題區塊，獨立於輪播之外 */}
            <motion.div
                className={style.mapTitleContainer}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                viewport={{ once: true, amount: 0.7 }}
            >
                <img className={style.mapTitleImg} src="/images/mapOfGalleries.png" alt="藝廊地圖標題" />
            </motion.div>

            {/* 輪播和信息卡區塊 */}
            <div className={style.allView}>
                <div className={style.carouselWrapper}>
                    <div className={style.carousel}>
                        {images.map((imgData, index) => (
                            <div className={style.item} key={index}>
                                <a href={imgData.mapUrl} target="_blank" rel="noopener noreferrer">
                                    <img src={imgData.src} alt={imgData.name} />
                                </a>
                            </div>
                        ))}
                    </div>
                    <p className={style.prev} onClick={(e) => { e.preventDefault(); moveSlide(-1); }}>❮</p>
                    <p className={style.next} onClick={(e) => { e.preventDefault(); moveSlide(1); }}>❯</p>
                </div>

                <div className={style.infoCard}>
                    <ul>
                        <li>{images[currentIndex].name}</li>
                        <li>{images[currentIndex].address}</li>
                        <li>{images[currentIndex].time}</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default ExhiHallMap;