'use client'

import { FormEvent, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Send } from "lucide-react"

interface Message {
  user: string
  text: string
}

const initialMessages: Message[] = [
  { user: "DJ Zaap", text: "Bem-vindos à FreeStep Rádio!" },
  { user: "Dancer01", text: "Qual a boa de hoje?" },
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return
    setMessages([...messages, { user: "Você", text: newMessage }])
    setNewMessage("")
  }

  return (
    <Card className="h-full flex flex-col bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
          Chat Ao Vivo
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pr-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div key={index}>
              <span className="font-bold text-primary text-sm">{msg.user}</span>
              <p className="text-sm text-foreground/80 break-words">{msg.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}