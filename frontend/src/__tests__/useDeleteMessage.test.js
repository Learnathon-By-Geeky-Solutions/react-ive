import { deleteMessageApi } from '../hooks/useDeleteMessage';
import { BACKEND_URL } from '../utils/servicesData';

// Mock the servicesData module
jest.mock('../utils/servicesData', () => ({
  BACKEND_URL: 'https://react-ive.onrender.com', // Mock BACKEND_URL for test consistency
}));

// Mock fetch
global.fetch = jest.fn();

describe('deleteMessageApi', () => {
  const messageId = '123';
  const mockSuccessResponse = { success: true, message: 'Message deleted' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully delete a message and return the response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockSuccessResponse),
    });

    const result = await deleteMessageApi(messageId);

    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/messages/delete/${messageId}`,
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

    await expect(deleteMessageApi(messageId)).rejects.toThrow('Error deleting message');

    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/messages/delete/${messageId}`,
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
    await expect(deleteMessageApi(messageId)).rejects.toThrow('Error deleting message');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting message:', networkError);
    consoleErrorSpy.mockRestore();

    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/messages/delete/${messageId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });
});