import { BACKEND_URL } from "../utils/servicesData";

export const deleteConversationApi = async (conversationId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/conversation/delete/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Error deleting conversation');
    }
  };