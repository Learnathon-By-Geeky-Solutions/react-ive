export const deleteMessageApi = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:3500/messages/delete/${messageId}`, {
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