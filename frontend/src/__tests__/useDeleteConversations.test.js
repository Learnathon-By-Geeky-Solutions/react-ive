import { deleteConversationApi } from '../hooks/useDeleteConversation';
import { BACKEND_URL } from '../utils/servicesData';

// Mock the servicesData module
jest.mock('../utils/servicesData', () => ({
  BACKEND_URL: 'https://react-ive.onrender.com', // Mock BACKEND_URL for test consistency
}));

// Mock fetch
global.fetch = jest.fn();

describe('deleteConversationApi', () => {
  const conversationId = '456';
  const mockSuccessResponse = { success: true, message: 'Conversation deleted' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully delete a conversation and return the response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockSuccessResponse),
    });

    const result = await deleteConversationApi(conversationId);

    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/conversation/delete/${conversationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    expect(result).toEqual(mockSuccessResponse);
  });

  it('should throw an error if the response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({}),
    });

    await expect(deleteConversationApi(conversationId)).rejects.toThrow('Error deleting conversation');

    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/conversation/delete/${conversationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('should throw an error on network failure', async () => {
    const networkError = new Error('Network error');
    global.fetch.mockRejectedValueOnce(networkError);

    // Test both the thrown error and console.error in one call
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await expect(deleteConversationApi(conversationId)).rejects.toThrow('Error deleting conversation');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting conversation:', networkError);
    consoleErrorSpy.mockRestore();

    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/conversation/delete/${conversationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });
});