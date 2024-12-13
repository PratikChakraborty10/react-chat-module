'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send } from 'lucide-react'

export interface Message {
  id: string
  content: string
  isUser: boolean
}

interface FloatingChatProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isTyping?: boolean
  chatIcon?: React.ReactNode
  title?: string
  placeholder?: string
  sendButtonAriaLabel?: string
  closeButtonAriaLabel?: string
  isOpen?: boolean
  onToggleOpen?: () => void
  className?: string
  themeColor?: string
}

export function FloatingChat({
  messages,
  onSendMessage,
  isTyping = false,
  chatIcon = <MessageCircle className="h-6 w-6" />,
  title = "Chat",
  placeholder = "Type your message...",
  sendButtonAriaLabel = "Send message",
  closeButtonAriaLabel = "Close chat",
  isOpen: controlledIsOpen,
  onToggleOpen,
  className = "",
  themeColor = "bg-primary"
}: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledIsOpen !== undefined && onToggleOpen !== undefined
  const showChat = isControlled ? controlledIsOpen : isOpen

  const toggleChat = () => {
    setIsAnimating(true)
    if (isControlled) {
      onToggleOpen()
    } else {
      setIsOpen(!isOpen)
    }
  }

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return
    onSendMessage(inputMessage)
    setInputMessage('')
  }

  return (
    <>
      {(!showChat || isAnimating) && (
        <Button
          className={`fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg transition-all duration-300 ease-in-out ${themeColor} ${
            showChat ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          onClick={toggleChat}
          aria-label="Open chat"
        >
          {chatIcon}
        </Button>
      )}
      {(showChat || isAnimating) && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-in-out
            ${showChat ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            md:bottom-4 md:right-4 md:w-96 md:max-w-[calc(100vw-2rem)] md:max-h-[calc(100vh-2rem)]
            bottom-0 left-0 right-0 top-0 w-full h-full md:h-auto md:top-auto md:left-auto`}
        >
          <Card 
            className={`flex flex-col shadow-xl h-full md:h-[36rem] ${className}`}
          >
            <CardHeader className={`flex-shrink-0 border-0 rounded-tl-xl rounded-tr-xl flex flex-row items-center justify-between p-4 ${themeColor}`}>
              <h2 className="text-xl font-bold text-primary-foreground">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground"
                onClick={toggleChat}
                aria-label={closeButtonAriaLabel}
              >
                <X className="h-6 w-6" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-4">
              <ScrollArea className="h-full pr-4" style={{ maxHeight: 'calc(100% - 2rem)' }} ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span
                        className={`inline-block p-2 rounded-lg max-w-[80%] ${
                          message.isUser
                            ? `${themeColor} text-primary-foreground`
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {message.content}
                      </span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <span className="inline-block p-2 rounded-lg bg-secondary text-secondary-foreground">
                        Typing...
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex-shrink-0 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex w-full space-x-2"
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={placeholder}
                  className="flex-grow"
                />
                <Button type="submit" size="icon" aria-label={sendButtonAriaLabel} className={themeColor}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}

