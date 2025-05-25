import React from 'react';
import style from './css/terms.module.css';
function Terms() {
    const [isChecked, setChecked] = React.useState(false)
    function zh(text) {
        return <span className={style.zh}>{text}</span>
    }
    function en(text) {
        return <span className={style.en}>{text}</span>
    }
    function next() {
        if (!isChecked) {
            alert("請勾選確認框")
            return
        }
        window.location.href = "/terms/submit"
    } 
    return (
        <>
            <div className={style.center}>
                <div className={style.textBlock}>
                    <h1 className={style.title}><img src="/images/icons/img.png" alt="" className={style.miniImg}/>圖片格式</h1>
                    <ul className={style.termsUl}>
                        <li className={style.termsLi}>
                            {zh("圖像請提供 JPG、PNG 檔，建議解析度為 1080px 以上。")}
                            {en("Please upload JPG or PNG images with at least 1080px resolution.")}
                        </li>
                        <li className={style.termsLi}>
                            {zh("每件大小不得超過 100MB。")}
                            {en("Each file must be under 100MB.")}
                        </li>
                        <li className={style.termsLi}>
                            {zh("請務必上傳兩張宣傳圖片(一張長形,一張方形)")}
                            {en("You must upload one rectangular and one square promotional image.")}
                        </li>
                    </ul>
                    <h1 className={style.title}><img src="/images/icons/img2.png" alt="" className={style.miniImg}/><span>展示</span></h1>
                    <ul className={style.termsUl}>
                        <li className={style.termsLi}>
                            {zh("通過審核後，展覽將公開並可被收藏、按讚與分享。")}
                            {en("Approved submissions will be publicly displayed and can be saved, liked, and shared.")}
                        </li>
                        <li className={style.termsLi}>
                            {zh("您可於會員中心管理已投稿展覽、查看互動紀錄。")}
                            {en("Manage your submissions and view interactions in your profile.")}
                        </li>
                    </ul>
                    <h1 className={style.title}><img src="/images/icons/img3.png" alt="" className={style.miniImg}/><span>展覽資訊填寫</span></h1>
                    <ul className={style.termsUl}>
                        <li className={style.termsLi}>
                            {zh("投稿表格填寫越詳細，越有助於加快審核進度。")}
                            {en("The more detailed your submission form is, the faster the review process will be.")}
                        </li>
                        <li className={style.termsLi}>
                            {zh("建議補充創作理念／靈感背景，能提升作品理解度與共鳴。")}
                            {en("Include your creative concept to enhance viewer engagement.")}
                        </li>
                        <li className={style.termsLi}>
                            {zh("可自行填寫想加入標籤（Tags），如：#插畫、#概念設計。")}
                            {en("Add tags (e.g. #illustration, #conceptDesign). Displayed after review.")}
                        </li>
                    </ul >
                    <h1 className={style.title}><img src="/images/icons/img4.png" alt="" className={style.miniImg}/><span>內容與著作權</span></h1>
                    <ul className={style.termsUl}>
                        <li className={style.termsLi}>
                            {zh("僅接受原創作品，請勿投稿他人作品或侵權內容。")}
                            {en("Only original works are accepted. Do not submit copied or infringing content.")}
                        </li>
                        <li className={style.termsLi}>
                            {zh("嚴禁含有暴力、歧視、仇恨或色情內容。")}
                            {en("Submissions with violence, hate, or explicit content will be rejected.")}
                        </li>
                        <li className={style.termsLi}>
                            {zh("投稿即表示您同意授權平台展示與宣傳使用。")}
                            {en("By submitting, you allow the platform to display and promote your work.")}
                        </li>
                    </ul>
                    <h1 className={style.title}><img src="/images/icons/img5.png" alt="" className={style.miniImg}/><span>其他提醒</span></h1>
                    <ul className={style.termsUl}>
                        <li className={style.termsLi}>
                            {zh("如有特殊需求，請額外填寫於備註裡。")}
                            {en("If you have any special requirements, please specify them in the notes section.")}
                        </li>
                        <li className={style.termsLi}>
                            {zh("當有任何爭議或問題時，平台保有最終決定權。")}
                            {en("The platform reserves the right to make the final decision in case of any disputes or issues.")}
                        </li>
                    </ul>
                    
                </div>
                <div className={style.btnWrapper}>
                        <label htmlFor="agree" style={{ display: "flex", gap: "10px" }}>
                            <input type="checkbox" id='agree' checked={isChecked} onChange={(e) => setChecked(e.target.checked)} className={style.inputNext}/>
                            <pre className={style.agreeText}>{`我已閱讀並同意以上投稿說明內容
I agree to the submission guidelines.`}</pre>
                        </label>
                        <button className={style.nextBtn} onClick={next} type="button">下一步</button>
                    </div>
            </div>
        </>
    )
}


export default Terms;