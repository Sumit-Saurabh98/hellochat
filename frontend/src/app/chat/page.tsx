"use client"

import Loading from "@/components/Loading";
import { useAppData } from "@/context/AppContext"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const {isAuth, loading} = useAppData();
  const router = useRouter();

  useEffect(() => {
    if(!isAuth && !loading){
      router.push("/login")
    }
  }, [isAuth, router, loading])

  if(loading) return <Loading />
  return (
    <div>ChatPage</div>
  )
}
export default ChatPage