import { createRoot } from 'react-dom/client';
     import { BrowserRouter as Router } from 'react-router-dom';
     import './index.css';
     import App from './App.jsx';
     import { AuthProvider } from './context/AuthContext.jsx';
     import { SocketContextProvider } from './context/SocketContext.jsx';
     import { GoogleOAuthProvider } from '@react-oauth/google';

     createRoot(document.getElementById('root')).render(
       <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
         <Router>
           <AuthProvider>
             <SocketContextProvider>
               <App />
             </SocketContextProvider>
           </AuthProvider>
         </Router>
       </GoogleOAuthProvider>
     );