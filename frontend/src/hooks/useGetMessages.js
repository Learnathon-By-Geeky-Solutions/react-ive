import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {      
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3500/message/getMessages/${selectedConversation.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Sending senderId via Authorization
          },
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        console.log(data)
        setMessages(data);
      } catch (error) {
        console.error(error.message)
      } finally {
        setLoading(false);
      }
    };
    if(selectedConversation?.id) getMessages();
  }, [selectedConversation?.id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
