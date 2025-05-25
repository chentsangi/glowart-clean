import style from './css/arrow.module.css'
import { motion } from "framer-motion"; // 導入 motion

function Arrow() {
    return (
        <>
            <motion.div
                id={style.arrowBox1}
                initial={{ opacity: 0, x: 0 }} // 從右側開始
                whileInView={{ opacity: 1, x: 100 }} // 移動到原始位置
                transition={{ duration: 1, delay: 0.5 }} // 1秒動畫，延遲0.5秒
                viewport={{ once: true, amount: 0.01, margin: "100px 0px 0px 0px" }} // 確保即使只有很小部分可見也會觸發
            >
                <img
                    src="/images/Artist Submission arrow.png"
                    alt="投稿專區箭頭"
                    id={style.arrowBoxImg1}
                />
            </motion.div>
        </>
    )
}

export default Arrow