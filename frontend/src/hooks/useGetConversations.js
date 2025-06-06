import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {useAuth} from '../context/AuthContext'
import { BACKEND_URL } from "../utils/servicesData";
const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/conversation/getConversations/${user.userId}`);
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        
        setConversations(data.users);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      getConversations();
    }
  }, [user?.userId]);

  return { loading, conversations };
};

export default useGetConversations;
