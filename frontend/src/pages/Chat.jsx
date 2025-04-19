import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import useGetConversations from "../hooks/useGetConversations";
import useConversation from "../zustand/useConversation";
import useGetMessages from "../hooks/useGetMessages";
import useSendMessage from "../hooks/useSendMessage";
import useListenMessages from "../hooks/useListenMessages";
import { FaEllipsisV, FaTrashAlt, FaPaperPlane, FaComment, FaSearch, FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import {Paperclip, X} from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const inputRef = useRef();
  const [file,setFile] = useState(null);
  const { loading, conversations } = useGetConversations();
  const { selectedConversation, setSelectedConversation, deleteMessage } = useConversation();
  const { messages: fetchedMessages, loading: messagesLoading } = useGetMessages();
  // Local state for messages to ensure only message bubbles are re-rendered
  const [localMessages, setLocalMessages] = useState([]);
  const { sendMessage, loading: sending } = useSendMessage();
  useListenMessages(); // Real-time message listening
  const [newMessage, setNewMessage] = useState("");
  const [openMenuConversationId, setOpenMenuConversationId] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [timestampMessageId, setTimestampMessageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);

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

    // Add event listener when menu is open
    if (openMenuConversationId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuConversationId]);

  const handleSendMessage = () => {
    sendMessage(newMessage, file);
    setNewMessage("");
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleKeySendMessage = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    // Check if user is a company using correct property
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
  
      // If the current conversation was deleted, reset the selected conversation
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
      // Update only the local messages state to re-render just the message bubbles
      setLocalMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };
  
  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const messagesEndRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100)
  }, [localMessages]); // Changed from messages to localMessages

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user initial for avatar
  const getUserInitial = (name) => {
    return name ? name[0].toUpperCase() : '?';
  };

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
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                </div>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div 
                  key={conv._id} 
                  className="relative group"
                  ref={openMenuConversationId === conv._id ? menuRef : null}
                >
                  <div
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center
                      ${selectedConversation?._id === conv._id 
                        ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md" 
                        : "bg-white text-gray-800 hover:bg-gray-50"}
                    `}
                    onClick={() => setSelectedConversation(conv)}
                    onKeyDown={(e) => {
                      if(e.key==='Enter' || e.key===" ") {
                        setSelectedConversation(conv);
                      }
                    }}
                    role="button"
                  >
                    {/* Avatar circle */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                      ${selectedConversation?._id === conv._id 
                        ? "bg-white/20 text-white" 
                        : "bg-indigo-100 text-indigo-700"}
                    `}>
                      {getUserInitial(conv.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium truncate">{conv.name}</span>
                        
                        {/* 3-Dot Menu for Conversation - Show only for companies */}
                        {user?.userType === 'Company' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent selecting conversation
                              setOpenMenuConversationId(openMenuConversationId === conv._id ? null : conv._id);
                            }}
                            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaEllipsisV size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {openMenuConversationId === conv._id && user?.userType === 'Company' && (
                    <div className="absolute right-0 top-full mt-1 z-10">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        <button
                          onClick={() => handleDeleteConversation(conv._id)}
                          className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                        >
                          <FaTrashAlt className="mr-2" size={14} /> 
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No conversations found
              </div>
            )}
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
          {selectedConversation ? (
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

              {/* Messages Container - Using localMessages instead of messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    </div>
                  </div>
                ) : localMessages.length > 0 ? (
                  localMessages.map((msg, index) => {
                    // Check if this is the first message or the sender has changed
                    const showSenderName = 
                      index === 0 || 
                      localMessages[index - 1].senderId !== msg.senderId;
                      
                    // Check if this is the last message for this sender
                    const isLastMessageForSender = 
                      index === localMessages.length - 1 || 
                      localMessages[index + 1].senderId !== msg.senderId;
                    
                    // Is this the user's message
                    const isUserMessage = msg.senderId === user.userId;
                    
                    // Determine message type (file-only, text-only, or both)
                    const hasContent = msg.content && msg.content !== "null" && msg.content !== null;
                    const hasFile = msg.fileUrl || (msg.fileType && msg.fileUrl);
                    const messageType = hasContent && hasFile ? 'combined' : hasFile ? 'file-only' : 'text-only';
                    
                    // Get file name from fileUrl or use default
                    const fileName = hasFile ? 
                      (msg.fileUrl?.split('/').pop() || 'File') : 
                      '';
                      
                    return (
                      <div
                        key={index}
                        className={`flex w-full flex-col ${isUserMessage ? "items-end" : "items-start"}`}
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
                          {isUserMessage && hoveredMessageId === msg._id && (
                            <div 
                              className={`
                                absolute top-0 z-10 h-full flex items-center
                                ${isUserMessage ? 'left-[-40px] w-[40px] justify-start' : 'right-[-40px] w-[40px] justify-end'}
                              `}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent timestamp toggle
                                  handleDeleteMessage(msg._id);
                                }}
                                className="p-2 text-red-500 hover:text-red-700 bg-white bg-opacity-90 rounded-full shadow-sm"
                              >
                                <FaTrashAlt size={14} />
                              </button>
                            </div>
                          )}
                          
                          {/* Message content - MODIFIED TO HANDLE DIFFERENT MESSAGE TYPES */}
                          <div
                              className={`
                                py-2 px-4 rounded-2xl max-w-md w-fit break-words cursor-pointer shadow-sm
                                ${isUserMessage
                                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white" 
                                  : "bg-white text-gray-800"}
                              `}
                              onClick={() => setTimestampMessageId(
                                timestampMessageId === msg._id ? null : msg._id
                              )}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setTimestampMessageId(
                                    timestampMessageId === msg._id ? null : msg._id
                                  );
                                }
                              }}
                              tabIndex={0} // Makes the div focusable
                              role="button" // Indicates the element is a button for screen readers
                            >
                            <div className="w-full" ref={index === localMessages.length - 1 ? messagesEndRef : null}>
                              {/* Show different content based on message type */}
                              {messageType === 'file-only' && (
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
                                  >
                                    <span>{fileName}</span>
                                  </a>
                                </div>
                              )}

                              {messageType === 'text-only' && (
                                <div>{msg.content}</div>
                              )}

                              {messageType === 'combined' && (
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
                                    >
                                      <span>{fileName}</span>
                                    </a>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {(isLastMessageForSender || timestampMessageId === msg._id) && (
                          <div className="text-xs text-gray-500 mt-1 px-2">
                            {formatTimestamp(msg.createdAt)}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Start the conversation!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-center">
                <input type="file"
                ref={inputRef}
                className="hidden"
                onChange={(e)=> setFile(e.target.files[0])}
                />
                <button onClick={()=>inputRef.current.click()} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200" title="Attach File">
                  <Paperclip className="size-5 text-gray-700" />
                </button>
                {file && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      onClick={()=> {setFile(null); inputRef.current.value=null}}
                      className="text-gray-500 hover:text-red-500"
                      title="Remove file"
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
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyDown={handleKeySendMessage}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending}
                  className="
                    ml-4 px-5 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-full 
                    hover:shadow-lg transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <FaPaperPlane className="mr-2" />
                  <span>{sending ? "Sending..." : "Send"}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center p-8 rounded-lg bg-white shadow-sm border border-gray-100 max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-100">
                  <FaComment className="text-4xl text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a conversation</h3>
                <p className="text-gray-500">Select a conversation from the sidebar to begin chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;