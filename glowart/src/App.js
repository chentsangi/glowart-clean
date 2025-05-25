import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Newsall from './components/news/newsall.jsx'
import AnnouncementInside from "./components/news/announcementInside.jsx"
import AboutUs from './components/about/aboutUs.jsx'
import Index from "./components/index/index.jsx";
import axios from "axios";
import Regulations from './components/terms/regulations.jsx';
import Contribute from "./components/submit/contribute.jsx";
import MemberLayout from "./components/user/MemberLayout.jsx"
import Gallerymap from "./components/map/gallerymap.jsx"
import Exhibition from "./components/exhibition/exhibition.jsx"
import ContributeCC from "./components/creator/ContributeCC.jsx"
import CreatorPage from './components/creator_page/creatorPage.jsx';
import ExhiPage from './components/exhibition_page/exhiPage.jsx';
import Tick from './components/tickets/tick.jsx';

//Outlet
import Favorites from './components/user/Outlet/Favorites.jsx'
import SubmissionHistory from './components/user/Outlet/SubmissionHistory.jsx'
import OrderHistory from './components/user/Outlet/OrderHistory.jsx'
import TicketHistory from "./components/user/Outlet/LikedHistory.jsx"
import MemberDashboard from './components/user/Outlet/MemberDashboard.jsx'
import AuthGuard from "./components/AuthGuar.jsx";
import NewsPage from "./components/highlight/newsPage.jsx"
function App() {
  axios.defaults.withCredentials = true;
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/news' element={<Newsall />} />
        <Route path='/news/highlight/:id' element={<NewsPage />} />
        <Route path='/news/announcement/:id' element={<AnnouncementInside />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/map' element={<Gallerymap />} />
        <Route path='/exhibition' element={<Exhibition />} />
        <Route path='/exhibition/:id' element={<ExhiPage />} />
        <Route path='/creator' element={<ContributeCC />} />
        <Route path='/creator/:id' element={<CreatorPage />} />
        <Route path='/tickets' element={<Tick />} />

        


        <Route element={<AuthGuard />}>
          <Route path="/terms" element={<Regulations />} />
          <Route path="/terms/submit" element={<Contribute />} />
          <Route path="/user" element={<MemberLayout />}>
            <Route index element={<MemberDashboard />} />
            <Route path="tickets" element={<TicketHistory />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="submissions" element={<SubmissionHistory />} />
            <Route path="favorites" element={<Favorites />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
