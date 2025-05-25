// 投稿表單
import React, { useRef } from 'react';
import style from "./css/submit.module.css"
import ImageUploader from './ImageUploader';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

let lab = style.lab
let inp = style.inp
let h_1 = style.h_1

function BasicInfo() {
    return ( 
        <div className={style.wrapper}>
            <div className={style.content}>
                <p className={h_1}>基本資料</p>
                <label htmlFor="name" className={lab}>
                    暱稱:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id='name' className={inp} name='nickname' />
                </label><br />
                <label htmlFor="email" className={lab}>
                    聯絡信箱:<input type="email" id='email' className={inp} name='contact_email' />
                </label><br />
                <label htmlFor="tel" className={lab}>
                    連絡電話:<input type="tel" id='tel' className={inp} name='contact_phone' />
                </label><br />
                <label htmlFor="about_me" className={style.labtext}>
                    自我介紹:<textarea id='about_me' className={style.inptext} name='about_me' />
                </label><br />
            </div>
        </div>
    )
}
function ExhibitionDetails({ hasTicket, setHasTicket, onImagesSelect }) {
    const priceRef = React.useRef(null);
    const quantityRef = React.useRef(null);
    const clearTicketInputs = () => {
        if (priceRef.current) priceRef.current.value = "";
        if (quantityRef.current) quantityRef.current.value = "";
    };
    return (
        <div className={style.wrapper}>
            <div className={style.content}>
                <p className={h_1}>展覽資訊</p>
                <label htmlFor="showName" className={lab}>展覽名稱:<input type="text" id='showName' className={inp} name='title' /></label><br />
                <div htmlFor="" className={lab} style={{ display: 'flex', alignItems: 'center', gap: "30px" }}>
                    是否售票:
                    <label htmlFor="yes">
                        <input type="radio" id='yes' name='has_ticket' value="true" checked={hasTicket === "true"}
                            onChange={() => setHasTicket("true")} />是</label>
                    {hasTicket === "true" && (
                        <>
                            <label htmlFor="ntd">金額(新台幣):&nbsp;&nbsp;
                                <input type="text" id='ntd' name='ticket_price' ref={priceRef} />
                            </label>
                            <label htmlFor="quantity">數量:&nbsp;&nbsp;
                                <input type="text" id='quantity' name='ticket_remaining' ref={quantityRef} />
                            </label>
                        </>
                    )}
                    <label htmlFor="no"><input type="radio" id='no' name='has_ticket' value="false" checked={hasTicket === "false"}
                        onChange={() => { setHasTicket("false"); clearTicketInputs(); }} />否</label>
                </div> <br />
                <label htmlFor="place" className={lab}>展出地點:<input type="text" id='place' className={inp} name='address' /></label><br />
                <label htmlFor="" className={style.labImg}  >圖片:<ImageUploader onImagesSelect={onImagesSelect} /></label><br />
                <div htmlFor="" className={lab}>
                    <label htmlFor="startDate">展期起始日:&nbsp;&nbsp;&nbsp;&nbsp;<input type="date" id='startDate' className={style.inpDate} name='start_date' /></label>
                    <label htmlFor="endDate">展期結束日:&nbsp;&nbsp;&nbsp;&nbsp;<input type="date" id='endDate' className={style.inpDate} name='end_date' /></label>
                </div><br />
                <div htmlFor="" className={lab}>
                    <label htmlFor="openTime">每日開放時間:<input type="time" id='openTime' className={style.inpDate} name='open_time' /></label>
                    <label htmlFor="closeTime">每日結束時間:<input type="time" id='closeTime' className={style.inpDate} name='close_time' /></label>
                </div><br />
                <label htmlFor="description" className={style.labtext}>展覽描述:<textarea id='description' className={style.inptext} name='description' /></label><br />
                <label htmlFor="note" className={lab}>備註:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id='note' className={inp} name='remark' /></label><br />
            </div>
        </div>
    )
}
function Categories({ onSubmitPost }) {
    let [category, setData] = React.useState([])
    React.useEffect(() => {
        async function categoryData(params) {
            try {
                let res = await axios.get("http://localhost:8000/user/Category")
                setData(res.data)
            } catch (error) {
                console.log("無法讀取資料庫");
            }
        }
        categoryData()
    }, [])
    // const handleSaveDraft = () => {
    //     console.log("已儲存草稿！");
    //     // 這裡可以加上 API 呼叫、狀態更新等
    //     alert("已儲存草稿")
    // };
    return (
        <>
            <div className={style.wrapper}>
                <div className={style.content}>
                    <p className={h_1}>分類與標籤</p>
                    <div className={style.labCategoryWrapper}>
                        <p>分類:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <div className={style.labCategory}>
                            {category.map((ele, index) => {
                                return (
                                    <label htmlFor={ele.id} key={index}><input type="checkbox" id={ele.id} name='otherall' value={ele.id} />{ele.name}</label>
                                )
                            })}
                        </div>
                    </div><br />
                    <label htmlFor="other" className={lab}>
                        其他類別:<input type="text" id='other' className={inp} name='other_category' />
                    </label><br />
                    <div style={{ display: 'flex' }}>
                        {/* <button className={style.saveDraftButton} onClick={handleSaveDraft} type="button">儲存草稿</button> */}
                        <button className={style.submitPostButton} onClick={onSubmitPost} type="button">送出投稿</button>
                    </div>
                </div>
            </div>
        </>
    )
}


function Submit() {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const [hasTicket, setHasTicket] = React.useState(null);
    const [images, setImages] = React.useState([]);

    const submitPost = async () => {
        const form = formRef.current;
        const formData = new FormData(form); // ✅ 這裡用 FormData 包整個表單

        // 處理 otherall，避免變成 JSON 字串
        const otherall = formData.getAll('otherall');
        formData.delete('otherall'); // 先刪掉原本的

        // ✅ 把多選的值一個一個重新加入 FormData
        otherall.forEach((item) => {
            formData.append('otherall', item);
        });

        // ✅ 這裡把圖片資料也加入 FormData
        if (images.length >= 2) {
            // 第一張長方形圖片
            formData.append('image_long', images[0], images[0].name);
            // 第二張方形圖片
            formData.append('image_square', images[1], images[1].name);
        } else {
            alert("請上傳長方形和方形兩張圖片");
            return;
        }

        // 這個檢查只是做資料驗證，不會影響圖片的上傳
        const fieldLabels = {
            nickname: '暱稱',
            contact_email: '聯絡信箱',
            contact_phone: '連絡電話',
            title: '展覽名稱',
            has_ticket: '是否售票',
            ticket_price: '售票金額',
            ticket_remaining: '票券數量',
            address: '展出地點',
            start_date: '展期起始日',
            end_date: '展期結束日',
            open_time: '每日開放時間',
            close_time: '每日結束時間',
            description: '展覽描述',
            remark: '備註',
            other_category: '其他類別',
            otherall: '分類標籤',
            about_me: "自我介紹"
        };

        for (const [key, value] of Object.entries(Object.fromEntries(formData.entries()))) {
            if (Array.isArray(value)) continue;
            if ((key === 'ticket_price' || key === 'ticket_remaining') && formData.get('has_ticket') !== "true") {
                continue;
            }
            if (key === 'other_category' || key === 'remark' || key === "ticket_remaining") { continue }
            // ✅ 修正部分：先確認是字串型態再做 trim()
            if (typeof value === 'string' && value.trim() === "") {
                alert(`請填寫${fieldLabels[key]}`);
                return;
            }
        }
        if (!formData.get('has_ticket')) {
            alert("請選擇 是否售票");
            return;
        }
        try {
            await axios.post("http://localhost:8000/submit/submit", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'  //  設定 multipart/form-data
                },
            });
            alert("送出成功");
            navigate("/user/submissions");
        } catch (error) {
            console.error("送出失敗", error);
        }
    };
    return (
        <form ref={formRef}>
            <BasicInfo />
            <ExhibitionDetails
                hasTicket={hasTicket}
                setHasTicket={setHasTicket}
                onImagesSelect={setImages} //  設定圖片陣列
            />
            <Categories onSubmitPost={submitPost} />
        </form>
    );
}
export default Submit;
