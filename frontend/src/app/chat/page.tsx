"use client";

import ChatSidebar from "@/components/ChatSidebar";
import Loading from "@/components/Loading";
import { CHAT_SERVICE, useAppData, User } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import MessageInput from "@/components/MessageInput";

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}
const ChatPage = () => {
  const {
    isAuth,
    loading,
    logoutUser,
    chats,
    user: loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(
    null
  );
  const router = useRouter();
  const handleLogout = () => logoutUser();

  const fetchChat = useCallback(async () => {
  const token = Cookies.get("token");
  try {
    const { data } = await axios.get(
      `${CHAT_SERVICE}/api/v1/message/${selectedUser}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessages(data.messages);
    setUser(data.user);
    await fetchChats();
  } catch (error) {
    console.log(error);
    toast.error("Failed to load messages");
  }
}, [selectedUser, fetchChats]);

  async function createChat(u: User) {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${CHAT_SERVICE}/api/v1/chat/new`,
        {
          userId: loggedInUser?._id,
          otherUserId: u._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedUser(data.chatId);
      setShowAllUser(false);
      await fetchChats();
    } catch {
      toast.error("Failed to start chat");
    }
  }

  const handleMessageSend = async(e: FormEvent, imageFile?: File | null) =>{
    e.preventDefault();

    if (!message.trim() && !imageFile) return;

    if (!selectedUser) return;

    // TODO: socket setup

    const token = Cookies.get("token");

    try {
       const formData = new FormData();

      formData.append("chatId", selectedUser);

      if (message.trim()) {
        formData.append("text", message);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.post(
        `${CHAT_SERVICE}/api/v1/message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessages((prev) => {
        const currentMessages = prev || [];
        const messageExists = currentMessages.some(
          (msg) => msg._id === data.message._id
        );

        if (!messageExists) {
          return [...currentMessages, data.message];
        }
        return currentMessages;
      });

      setMessage("");

      const displayText = imageFile ? "📷 image" : message;

    } catch {
      toast.error("Failed to send message");
    }
  }

  const handleTyping = (value:string)=>{
    setMessage(value);

    if(!selectedUser) return;

    // TODO: socket setup
  }

  useEffect(() => {
    if (selectedUser) {
      fetchChat();
    }
  }, [selectedUser, fetchChat]);

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  if (loading) return <Loading />;
  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUser}
        setShowAllUsers={setShowAllUser}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={handleLogout}
        createChat={createChat}
        //   onlineUsers,
      />
      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10">
        <ChatHeader
          user={user}
          setSidebarOpen={setSidebarOpen}
          isTyping={isTyping}
        />

        <ChatMessages
          selectedUser={selectedUser}
          messages={messages}
          loggedInUser={loggedInUser}
        />

        <MessageInput
        selectedUser={selectedUser}
        message={message}
        setMessage={handleTyping}
        handleMessageSend={handleMessageSend}
        />
      </div>
    </div>
  );
};
export default ChatPage;
