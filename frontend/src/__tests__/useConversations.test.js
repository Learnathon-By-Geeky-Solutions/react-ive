import { act } from 'react-dom/test-utils';
import useConversation from '../zustand/useConversation';

describe('useConversation Store', () => {
  const mockConversation = { _id: 'conv123', name: 'Test Conversation' };
  const mockMessages = [
    { _id: 'msg1', text: 'Hello', conversationId: 'conv123' },
    { _id: 'msg2', text: 'Hi', conversationId: 'conv123' },
  ];

  beforeEach(() => {
    act(() => {
      useConversation.setState({
        selectedConversation: null,
        messages: [],
      });
    });
  });

  it('should initialize with correct initial state', () => {
    const state = useConversation.getState();
    expect(state.selectedConversation).toBeNull();
    expect(state.messages).toEqual([]);
    expect(typeof state.setSelectedConversation).toBe('function');
    expect(typeof state.setMessages).toBe('function');
    expect(typeof state.deleteMessage).toBe('function');
  });

  it('should set selectedConversation', () => {
    act(() => {
      useConversation.getState().setSelectedConversation(mockConversation);
    });
    const state = useConversation.getState();
    expect(state.selectedConversation).toEqual(mockConversation);
    expect(state.messages).toEqual([]); // Ensure messages unchanged
  });

  it('should set messages', () => {
    act(() => {
      useConversation.getState().setMessages(mockMessages);
    });
    const state = useConversation.getState();
    expect(state.messages).toEqual(mockMessages);
    expect(state.selectedConversation).toBeNull(); // Ensure selectedConversation unchanged
  });

  it('should delete a message by id', () => {
    act(() => {
      useConversation.getState().setMessages(mockMessages);
      useConversation.getState().deleteMessage('msg1');
    });
    const state = useConversation.getState();
    expect(state.messages).toEqual([{ _id: 'msg2', text: 'Hi', conversationId: 'conv123' }]);
    expect(state.selectedConversation).toBeNull(); // Ensure selectedConversation unchanged
  });

  it('should not modify messages if message id does not exist', () => {
    act(() => {
      useConversation.getState().setMessages(mockMessages);
      useConversation.getState().deleteMessage('nonexistent');
    });
    const state = useConversation.getState();
    expect(state.messages).toEqual(mockMessages); // Messages unchanged
  });

  it('should create a new state object on updates', () => {
    const initialState = useConversation.getState();

    act(() => {
      useConversation.getState().setSelectedConversation(mockConversation);
    });
    const newState = useConversation.getState();
    expect(newState).not.toBe(initialState); // New state object
    expect(newState.selectedConversation).toEqual(mockConversation);

    act(() => {
      useConversation.getState().setMessages(mockMessages);
    });
    const stateAfterMessages = useConversation.getState();
    expect(stateAfterMessages).not.toBe(newState); // New state object
    expect(stateAfterMessages.messages).toEqual(mockMessages);

    act(() => {
      useConversation.getState().deleteMessage('msg1');
    });
    const stateAfterDelete = useConversation.getState();
    expect(stateAfterDelete).not.toBe(stateAfterMessages); // New state object
    expect(stateAfterDelete.messages).toEqual([{ _id: 'msg2', text: 'Hi', conversationId: 'conv123' }]);
  });
});
