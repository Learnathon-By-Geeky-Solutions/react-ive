import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ApplyPage from './pages/Apply';
import Applications from './pages/Applications';
import Profile from './pages/StudentProfile';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute >
            <Home />  
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/posts/apply/:id" element={<ApplyPage />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/chats" element={<Chat />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth/success" element={<div>Processing...</div>} />
      </Routes>
    </div>
  );
};

export default App;