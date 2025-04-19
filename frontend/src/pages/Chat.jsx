import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import useGetConversations from "../hooks/useGetConversations";
import useConversation from "../zustand/useConversation";
import useGetMessages from "../hooks/useGetMessages";
import useSendMessage from "../hooks/useSendMessage";
import useListenMessages from "../hooks/useListenMessages";
import { FaEllipsisV, FaTrashAlt, FaPaperPlane, FaComment, FaSearch, FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { Paperclip, X } from 'lucide-react';

const Chat = () => {
  // Auth and conversation hooks
  const { user } = useAuth();
  const { loading, conversations } = useGetConversations();
  const { selectedConversation, setSelectedConversation, deleteMessage } = useConversation();
  const { messages: fetchedMessages, loading: messagesLoading } = useGetMessages();
  const { sendMessage, loading: sending } = useSendMessage();
  useListenMessages(); // Real-time message listening

  // Refs
  const inputRef = useRef();
  const messagesEndRef = useRef();
  const menuRef = useRef(null);

  // UI state
  const [localMessages, setLocalMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [openMenuConversationId, setOpenMenuConversationId] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [timestampMessageId, setTimestampMessageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync local messages state with fetched messages
  useEffect(() => {
    if (fetchedMessages) {
      setLocalMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  // Add event listener to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuConversationId(null);
      }
    };

    if (openMenuConversationId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [localMessages]);

  // Message handling functions
  const handleSendMessage = async () => {
    if ((!newMessage || newMessage.trim() === '') && !file) return;
    
    await sendMessage(newMessage, file);
    setNewMessage("");
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleKeySendMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (user?.userType !== 'Company') {
      alert("Only companies can delete conversations");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3500/conversation/delete/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }
  
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Error deleting conversation');
    }
  };
  
  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:3500/message/deleteMessage/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
  
      deleteMessage(messageId);
      setLocalMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };
  
  // Utility functions
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUserInitial = (name) => {
    return name ? name[0].toUpperCase() : '?';
  };

  // Calculate if send button should be disabled
  const isSendButtonDisabled = sending || (!newMessage.trim() && !file);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render component functions
  const renderConversationList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
          </div>
        </div>
      );
    }

    if (filteredConversations.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No conversations found
        </div>
      );
    }

    return filteredConversations.map((conv) => {
      const isSelected = selectedConversation?._id === conv._id;
      const isMenuOpen = openMenuConversationId === conv._id;
      const isCompanyUser = user?.userType === 'Company';
      
      // Conversation button classes - extracted from ternary
      const buttonClasses = `
        p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center w-full text-left
        ${isSelected
          ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md" 
          : "bg-white text-gray-800 hover:bg-gray-50"}
      `;

      // Avatar circle classes - extracted from ternary
      const avatarClasses = `
        w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
        ${isSelected
          ? "bg-white/20 text-white" 
          : "bg-indigo-100 text-indigo-700"}
      `;

      return (
        <div 
          key={conv._id} 
          className="relative group"
          ref={isMenuOpen ? menuRef : null}
        >
          <button
            className={buttonClasses}
            onClick={() => setSelectedConversation(conv)}
            aria-label={`Select conversation with ${conv.name}`}
            aria-selected={isSelected}
          >
            {/* Avatar circle */}
            <div className={avatarClasses}>
              {getUserInitial(conv.name)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">{conv.name}</span>
              </div>
            </div>
          </button>
          
          {/* 3-Dot Menu for Conversation - Show only for companies */}
          {isCompanyUser && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent selecting conversation
                setOpenMenuConversationId(isMenuOpen ? null : conv._id);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-2"
              aria-label="Open conversation menu"
              aria-expanded={isMenuOpen}
            >
              <FaEllipsisV size={14} />
            </button>
          )}

          {isMenuOpen && isCompanyUser && (
            <div className="absolute right-0 top-full mt-1 z-10">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => handleDeleteConversation(conv._id)}
                  className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                  aria-label={`Delete conversation with ${conv.name}`}
                >
                  <FaTrashAlt className="mr-2" size={14} /> 
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderMessageContent = (messageType, msg, fileName) => {
    switch (messageType) {
      case 'file-only':
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <Paperclip className="size-4" />
            </div>
            <a 
              href={`http://localhost:3500/apply/downloadCV/${msg.fileUrl}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:underline"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Download file: ${fileName}`}
            >
              <span>{fileName}</span>
            </a>
          </div>
        );
      
      case 'text-only':
        return <div>{msg.content}</div>;
      
      case 'combined':
        return (
          <>
            <div className="mb-2">{msg.content}</div>
            <div className="flex items-center gap-2 pt-2 border-t border-white/20">
              <div className="p-1 bg-white bg-opacity-20 rounded-full">
                <Paperclip className="size-3" />
              </div>
              <a 
                href={msg.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm hover:underline"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Download file: ${fileName}`}
              >
                <span>{fileName}</span>
              </a>
            </div>
          </>
        );
      
      default:
        return <div>{msg.content}</div>;
    }
  };

  const renderMessages = () => {
    if (messagesLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
          </div>
        </div>
      );
    }
    
    if (localMessages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start the conversation!</p>
          </div>
        </div>
      );
    }
    
    return localMessages.map((msg, index) => {
      // Message display logic
      const showSenderName = 
        index === 0 || 
        localMessages[index - 1].senderId !== msg.senderId;
        
      const isLastMessageForSender = 
        index === localMessages.length - 1 || 
        localMessages[index + 1].senderId !== msg.senderId;
      
      const isUserMessage = msg.senderId === user.userId;
      const isTimeVisible = isLastMessageForSender || timestampMessageId === msg._id;
      const isMessageHovered = hoveredMessageId === msg._id;
      const isLastMessage = index === localMessages.length - 1;
      
      // Message type determination
      const hasContent = msg.content && msg.content !== "null" && msg.content !== null;
      const hasFile = msg.fileUrl || (msg.fileType && msg.fileUrl);
      const messageType = hasContent && hasFile ? 'combined' : hasFile ? 'file-only' : 'text-only';
      
      const fileName = hasFile ? (msg.fileUrl?.split('/').pop() || 'File') : '';
      
      // Message alignment classes
      const alignmentClasses = isUserMessage ? "items-end" : "items-start";
      
      // Message bubble styling
      const bubbleClasses = `
        py-2 px-4 rounded-2xl max-w-md w-fit break-words shadow-sm text-left
        ${isUserMessage
          ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white" 
          : "bg-white text-gray-800"}
      `;
      
      // Delete button position classes
      const deleteButtonPositionClasses = isUserMessage 
        ? 'left-[-40px] w-[40px] justify-start'
        : 'right-[-40px] w-[40px] justify-end';
        
      return (
        <div
          key={msg._id}
          className={`flex w-full flex-col ${alignmentClasses}`}
        >
          {showSenderName && (
            <div className="text-xs text-gray-500 mb-1 px-2">
              {isUserMessage ? 'You' : msg.senderName}
            </div>
          )}
          
          {/* Message bubble with extended click area for trash */}
          <div 
            className="relative group"
            onMouseEnter={() => setHoveredMessageId(msg._id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            {/* Trash can button with extended clickable area */}
            {isUserMessage && isMessageHovered && (
              <div 
                className={`
                  absolute top-0 z-10 h-full flex items-center
                  ${deleteButtonPositionClasses}
                `}
              >
                <button
                  onClick={() => handleDeleteMessage(msg._id)}
                  className="p-2 text-red-500 hover:text-red-700 bg-white bg-opacity-90 rounded-full shadow-sm"
                  aria-label={`Delete message`}
                >
                  <FaTrashAlt size={14} />
                </button>
              </div>
            )}
            
            {/* Message content - Using a proper button element for accessibility */}
            <button
              className={bubbleClasses}
              onClick={() => setTimestampMessageId(
                timestampMessageId === msg._id ? null : msg._id
              )}
              aria-pressed={timestampMessageId === msg._id}
              aria-label={`Toggle timestamp for message ${hasContent ? `: ${msg.content?.substring(0, 20)}...` : ''}`}
            >
              <div className="w-full" ref={isLastMessage ? messagesEndRef : null}>
                {renderMessageContent(messageType, msg, fileName)}
              </div>
            </button>
          </div>
          
          {isTimeVisible && (
            <div className="text-xs text-gray-500 mt-1 px-2">
              {formatTimestamp(msg.createdAt)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderChatWindow = () => {
    if (!selectedConversation) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center p-8 rounded-lg bg-white shadow-sm border border-gray-100 max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-100">
              <FaComment className="text-4xl text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a conversation</h3>
            <p className="text-gray-500">Select a conversation from the sidebar to begin chatting</p>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 py-3 px-6 flex items-center shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white mr-3">
              {getUserInitial(selectedConversation.name)}
            </div>
            <div>
              <h3 className="font-semibold">{selectedConversation.name}</h3>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
          {renderMessages()}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center">
          <input 
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
            aria-label="Attach file"
          />
          <button 
            onClick={() => inputRef.current.click()} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200" 
            aria-label="Attach File"
          >
            <Paperclip className="size-5 text-gray-700" />
          </button>
          {file && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md ml-2">
              <span className="text-sm text-gray-700 truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={() => {setFile(null); inputRef.current.value=null}}
                className="text-gray-500 hover:text-red-500"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 py-3 px-4 mx-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyDown={handleKeySendMessage}
            aria-label="Message text"
          />
          <button
            onClick={handleSendMessage}
            disabled={isSendButtonDisabled}
            className="
              px-5 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-full 
              hover:shadow-lg transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            aria-label="Send message"
          >
            <FaPaperPlane className="mr-2" />
            <span>{sending ? "Sending..." : "Send"}</span>
          </button>
        </div>
      </>
    );
  };

  // Main render
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar at the top */}
      <div className="w-full shadow-sm z-10">
        <Navbar />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar: Conversation List */}
        <div className="w-1/4 bg-white shadow-md flex flex-col border-r border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <FaComment className="mr-2" />
              Conversations
            </h2>
          </div>
          
          {/* Search box */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label="Search conversations"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {renderConversationList()}
          </div>
          
          {/* User section */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white mr-3">
                <FaUser />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.username || "User"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-3/4 flex flex-col">
          {renderChatWindow()}
        </div>
      </div>
    </div>
  );
};

export default Chat;