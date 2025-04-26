import { BACKEND_URL } from "../utils/servicesData";

export const deleteMessageApi = async (messageId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/messages/delete/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Error deleting message');
    }
  };