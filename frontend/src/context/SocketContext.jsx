import { createContext, useContext, useEffect, useState, useMemo } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import PropTypes from "prop-types";

const SocketContext = createContext({ socket: null, onlineUsers: [] });

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    let newSocket;

    if (user) {
      newSocket = io("http://localhost:3500", {
        query: { userId: user.userId },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      setSocket(null);
    };
  }, [user]); 

  const contextValue = useMemo(() => ({ socket, onlineUsers }), [socket, onlineUsers]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

SocketContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};