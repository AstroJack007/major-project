import { useChat } from "../store/useChat";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuth } from "../store/useAuth";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getmessages, isMessagesLoading, selectedUser } = useChat();
  const { authUser, isLoading: authLoading } = useAuth();
  const messageEndRef = useRef(null);

  // Debug auth state
  useEffect(() => {
    console.log("Auth state:", {
      authUser,
      messages: messages?.map(m => ({
        senderId: m.senderId,
        isAuthUser: String(m.senderId) === String(authUser?._id)
      }))
    });
  }, [authUser, messages]);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser?._id && authUser) {
      getmessages(selectedUser._id);
    }
  }, [selectedUser?._id, getmessages, authUser]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show loading state
  if (authLoading || !authUser || isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const getAuthUserId = () => {
    if (!authUser) return null;
    // Handle both auth response structures
    return typeof authUser._id === 'string' ? authUser._id : authUser.message?._id;
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto"> 
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message, idx) => {
          const authId = getAuthUserId();
          const isUserMessage = String(message.senderId) === String(authId);
          
          return (
            <div
              key={message._id}
              className={`chat ${isUserMessage ? "chat-end" : "chat-start"}`}
              ref={idx === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isUserMessage
                        ? authUser.profilepic || "/avatar.png"
                        : selectedUser.profilepic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;