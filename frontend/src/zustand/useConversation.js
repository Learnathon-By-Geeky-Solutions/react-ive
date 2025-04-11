import { create } from 'zustand';

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    messages: [],
    setMessages: (messages) => set({messages}),
    deleteMessage: (messageId) => set((state) => ({
        messages: state.messages.filter(message => message._id !== messageId)
    })),
}))

export default useConversation;