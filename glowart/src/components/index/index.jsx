import ExhiHallMap from "./exhiHallMap"
import Footer from "./footer"
import Header from "./header"
import ImageSlider from "./imageSlider"
import NewsBlock from "./newsBlock"
import SlideIn from "./slideIn"


// 首頁：大圖輪播 + 快訊 + 地圖
function Index() {
  return (
    <div>
      <Header />
      <SlideIn />
      <ImageSlider />
      <NewsBlock />
      <ExhiHallMap />
      <Footer />
    </div>
  )
}
export default Index

