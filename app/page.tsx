"use client"

import { FloatingChat, Message } from "@/components/floating-chat";
import { useState } from "react";
import { Headphones } from 'lucide-react'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', content: "Hello! How can I assist you today?", isUser: false }
  ])

  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = { id: Date.now().toString(), content: message, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const response = `You said: "${message}". This is a mock response.`
      const botMessage: Message = { id: (Date.now() + 1).toString(), content: response, isUser: false }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error getting API response:', error)
      const errorMessage: Message = { id: (Date.now() + 1).toString(), content: "Sorry, I couldn't process your request.", isUser: false }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }
  return (
    <div className="h-[100svh] w-full flex justify-center items-center bg-gradient-to-b from-violet-900 via-violet-500 to-red-800">
      <p className="text-white font-bold text-3xl text-center">Welcome to my project
        <br/>
        <span>Where I am showcaseing an chat bot package</span>
      </p>
      <FloatingChat
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        title="Customer Support"
        placeholder="Ask a question..."
        themeColor="bg-orange-500"
        chatIcon={<Headphones className="h-6 w-6" />}
      />
    </div>
  );
}
