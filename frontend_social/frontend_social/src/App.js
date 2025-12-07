import './App.css';
import Login from './component/Login/Login';

import SignUp from './component/SignUp/SignUp';  // Path to your SignUp component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import
import 'font-awesome/css/font-awesome.min.css';
import SearchPage from './component/Search/SearchPage';
import ProfilePage from './component/Profile/ProfilePage';
import NotificationPage from './component/Notification/NotificationPage';
import Manage_web from './component/Admin/Manage_web';
import Manage_post from './component/Admin/ManagePost/Manage_post';
import ManageUser from './component/Admin/ManageUser/ManageUser';
import EditProfile from './component/EditProfile/EditProfile';
import Manage_Progress from './component/Admin/ManageProgress/Manage_progress';
import Contact from './component/Navbar/Contact';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import FullScreenLoading from './component/Loading/FullScreenLoading';
import { WebSocketProvider } from './context/WebSocketContext';
import ChatPage from './component/ChatPage/ChatPage';
import HomePage from './component/HomePage/HomePage';
import PostDetail from './component/PostDetail/PostDetail';
import MiniChatManager from './component/MiniChat/MiniChatManager';
import { MiniChatProvider } from './context/MiniChatContext';
import Statistics from './component/Admin/Statistic/Statistics';
import { ChatRealtimeProvider } from './context/ChatRealtimeContext';
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
            <Route path="/Blockchat" element={<HomePage />} />
            <Route path="/messages" element={<ChatPage />} />
            <Route path="/search_page" element={<SearchPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/noti" element={<NotificationPage />} />
            <Route path="/Manage_web" element={<Manage_web />} />
            <Route path="/Manage_post" element={<Manage_post />} />
            <Route path="/Manage_user" element={<ManageUser />} />
            <Route path="/Manage_progress" element={<Statistics />} />
            <Route path="/Edit_profile" element={<EditProfile />} />
            <Route path='/progress' element={<Manage_Progress />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/post/:postId' element={<PostDetail />} />

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
        <ChatRealtimeProvider>
          <MiniChatProvider>
            <AppContent />
            <MiniChatManager />
          </MiniChatProvider>
        </ChatRealtimeProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
