import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketContextProvider } from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </AuthProvider>
  </Router>
);