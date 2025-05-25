import { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./css/ExhiAct.module.css"

// 展覽卡片元件
const ExhibitionCard = (props) => {
  // 如果 props 為 null，渲染一個空白佔位卡片
  if (!props.id) {
    return (
      <div className={style.exhibitionCard + ' ' + style.exhibitionCardPlaceholder}>
        {/* 空白佔位 */}
      </div>
    );
  }
  const {
    image_square,
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
      <a href={'/exhibition/' + id}>
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
                    <p className={style.date}>
                      {new Date(start_date).getMonth() + 1}/{new Date(start_date).getDate()}
                    </p>
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
                    <p className={style.date}>
                      {new Date(end_date).getMonth() + 1}/{new Date(end_date).getDate()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
      <div className={style.cardText}>
        <a href={'/exhibition/' + id}>
          <h2>{title}</h2>
        </a>
        <p>{venue}</p>
        <div
          className={`${style.status} ${status === 'soon' ? style.soon : status === 'ended' ? style.end : ''}`}
        >
          {status === 'ongoing' && '正在進行'}
          {status === 'soon' && '即將開始'}
          {status === 'ended' && '已結束'}
          {daysLeft && <span>{daysLeft} days left</span>}
        </div>
      </div>
    </div>
  );
};

// 分頁元件
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div className={style.pagination}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? style.active : ''}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

// 主要展覽列表元件
const ExhibitionList = ({ results }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const exhibitionsPerPage = 12;

  // 從後端取得資料後，處理 展覽狀態與剩餘天數 的判斷
  const judgeExhibitions = (data) => {
    const today = new Date();
    return data.map(item => {
      const start = new Date(item.start_date)
      const end = new Date(item.end_date)

      let status = '';    /* 預設展覽狀態 */
      let daysLeft = null /* 預設剩餘天數 */

      if (today < start) {
        status = 'soon';
        const diff = start - today;
        daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
      } else if (today >= start && today <= end) {
        status = "ongoing";
        const diff = end - today;
        daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
      } else {
        status = 'ended';
      }

      return {
        ...item, status, daysLeft
      }
    })
  }
  const processedResults = judgeExhibitions(results);
  const totalPages = Math.ceil(processedResults.length / exhibitionsPerPage);

  const getExhibitionsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * exhibitionsPerPage;
    const endIndex = startIndex + exhibitionsPerPage;

    const pageExhibitions = processedResults.slice(startIndex, endIndex);
    const filledExhibitions = [...pageExhibitions];

    while (filledExhibitions.length < exhibitionsPerPage) {
      filledExhibitions.push({ id: null });
    }

    return filledExhibitions;
  };

  return (
    <div className={style.exhibitionContainer}>
      <div className={style.mainContent}>
        <div className={style.listBox}>
          {getExhibitionsForCurrentPage().map((exhibition, index) => (
            <ExhibitionCard
              key={exhibition.id || `placeholder-${index}`}
              {...exhibition}
            />
          ))}
        </div>
      </div>
      {results.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

// 主要應用程式元件
const ExhiAct = ({ results }) => {
  const [loading, setLoading] = useState(true);
  const fetchExhibitions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/Exhibitionfalse");
      if (response.data && response.data.length > 0) {
        console.log("🎯 資料獲取成功", response.data);
      } else {
        console.warn("⚠️ 查無資料");
      }
    } catch (error) {
      console.error("❌ API 呼叫失敗：", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExhibitions()
  }, []);

  return (
    <div className={style.exhibitionApp}>
      <div className={style.exhibitionContainer}>
        {loading ? (
          <p>資料加載中...</p>
        ) : results && results.length > 0 ? (
          <ExhibitionList results={results} />
        ) : (
          <p>目前查無資料</p>
        )}
      </div>
    </div>
  );
};
 
export default ExhiAct;
