import { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./css/ExhiCard.module.css"

// 投稿卡片元件
const ExhibitionCard = (props) => {
  // 如果 props 為 null，渲染一個空白佔位卡片
  if (!props.id) {
    return (
      <div className={style.exhibitionCard + " " + style.exhibitionCardPlaceholder}>
        {/* 空白佔位 */}
      </div>
    );
  }

  const {
    image_square,
    start_date,
    end_date,
    title,
    venue,
    status,
    daysLeft,
    id
  } = props;

  return (
    <div className={style.exhibitionCard}>
      <a href={'/creator/' + id}>
        <div className={style.cardImageContainer}>
          <img className={style.cardImage} src={image_square} alt={title} />
          <div className={style.overlay}>
            <div className={style.dateGroup}>
              {/* 開始日期 */}
              <div className={style.dateBlock}>
                <div className={style.textMask}>
                  <div className={style.textBox + " " + style.slideUp}>
                    <p className={style.year}>{new Date(start_date).getFullYear()}</p>
                  </div>
                </div>
                <div className={style.textMask}>
                  <div className={style.textBox + " " + style.slideDown}>
                    <p className={style.date}>{new Date(start_date).getMonth() + 1}/{new Date(start_date).getDate()}</p>
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
                  <div className={style.textBox + " " + style.slideUp}>
                    <p className={style.year}>{new Date(end_date).getFullYear()}</p>
                  </div>
                </div>
                <div className={style.textMask}>
                  <div className={style.textBox + " " + style.slideDown}>
                    <p className={style.date}>{new Date(end_date).getMonth() + 1}/{new Date(end_date).getDate()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
      <div className={style.cardText}>
        <a href={'/creator/' + id}><h2>{title}</h2></a>
        <p>{venue}</p>
        <div className={`${style.status} ${status === 'soon' ? style.soon : status === 'ended' ? style.end : ''}`}>
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

// 主要投稿列表元件
const ExhibitionList = ({ results }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const exhibitionsPerPage = 12;

  const judgeExhibitions = (data) => {
    const today = new Date();
    return data.map(item => {
      const start = new Date(item.start_date);
      const end = new Date(item.end_date);

      let status = '';
      let daysLeft = null;

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

      return { ...item, status, daysLeft };
    });
  };
  const processedResults = judgeExhibitions(results);
  const totalPages = Math.ceil(processedResults.length / exhibitionsPerPage);

  const getExhibitionsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * exhibitionsPerPage;
    const endIndex = startIndex + exhibitionsPerPage;
    const pageExhibitions = processedResults.slice(startIndex, endIndex);
    while (pageExhibitions.length < exhibitionsPerPage) {
      pageExhibitions.push({ id: null });
    }
    return pageExhibitions;
  };

  return (
    <div className={style.exhibitionContainer}>
      <div className={style.mainContent}>
        <div className={style.listBox}>
          {getExhibitionsForCurrentPage().map((exhibition, index) => (
            <ExhibitionCard key={exhibition.id || `placeholder-${index}`} {...exhibition} />
          ))}
        </div>
      </div>
      {results.length > 0 && (
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

// 主要應用程式元件
const ExhiCard = ({ results }) => {
  const [loading, setLoading] = useState(true);

  const fetchExhibitions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/Exhibition");
      console.log("🎯 資料獲取成功", response.data);
    } catch (error) {
      console.error("❌ API 呼叫失敗：", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  return (
    <div className={style.exhibitionApp}>
      {loading ? <p>資料加載中...</p> : (
        results && results.length > 0 ? (
          <ExhibitionList results={results} />
        ) : (
          <p>目前查無資料</p>
        )
      )}
    </div>
  ); 
};

export default ExhiCard;
