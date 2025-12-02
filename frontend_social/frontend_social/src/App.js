import './App.css';
import Messages from './component/Messages/Messages';
import Login from './component/Login/Login';

import BlockChat from './component/Blockchat/Blockchat';
import SignUp from './component/SignUp/SignUp';  // Path to your SignUp component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import
import 'font-awesome/css/font-awesome.min.css';
import SearchPage from './component/Search/Search';
import Profile from './component/Profile/Profile';
import ProfileView from './component/Profile/Profile_view';
import Noti from './component/Noti/Noti';
import Manage_web from './component/Admin/Manage_web';
import Manage_post from './component/Admin/Manage_post/Manage_post';
import Manage_user from './component/Admin/Manage_user/Manage_user';
import Manage_progress from './component/Admin/Manage_progress/Manage_progress';
import Edit_user from './component/Admin/Manage_user/Edit_user';
import Edit_profile from './component/Edit_profile/Edit_profile';
import Manage_Progress from './component/Admin/Manage_progress/Manage_progress';
import Contact from './component/Navbar/Contact';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import FullScreenLoading from './component/Loading/FullScreenLoading';
import { WebSocketProvider } from './context/WebSocketContext';
import ChatPage from './component/ChatPage/ChatPage';
function AppContent() {
  const { loading } = useAuth(); // Lấy trạng thái loading từ AuthContext

  return (
    <>
      {loading && <FullScreenLoading />} {/* Hiển thị overlay khi loading */}
      <div className="container mt-2">

        <Router>

          <Routes>
            <Route path="/" element={<Login />} /> {/* This will display the Login page at the root URL */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/Blockchat" element={<BlockChat />} />
            <Route path="/messages" element={<ChatPage />} />
            <Route path="/search_page" element={<SearchPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/noti" element={<Noti />} />
            <Route path="/profile_view/:username" element={<ProfileView />} />
            <Route path="/Manage_web" element={<Manage_web />} />
            <Route path="/Manage_post" element={<Manage_post />} />
            <Route path="/Manage_user" element={<Manage_user />} />
            <Route path="/Manage_progress" element={<Manage_progress />} />
            <Route path="/Edit_user/:username" element={<Edit_user />} />
            <Route path="/Edit_profile" element={<Edit_profile />} />
            <Route path='/progress' element={<Manage_Progress />} />
            <Route path='/contact' element={<Contact />} />

          </Routes>
        </Router>
      </div>
      <ToastContainer />
    </>
  );
}

function App() {


  return (

    <AuthProvider>
      <WebSocketProvider>
        <AppContent />
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
