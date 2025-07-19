'use client'

import { useEffect, useRef, useState, FormEvent } from "react"
import ablyClient from "@/lib/ably"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Send, Smile } from "lucide-react"
import type { Message as AblyMessage } from "ably"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react"
import { useTheme } from "next-themes"

const channelName = "radio-chat"

const colorPool = [
  "text-cyan-400", "text-fuchsia-400", "text-lime-400",
  "text-orange-400", "text-indigo-400", "text-rose-400"
];

export default function Chat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<AblyMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userColors, setUserColors] = useState<Record<string, string>>({});
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const channel = ablyClient.channels.get(channelName);

    const assignColor = (clientId: string) => {
      setUserColors(prev => {
        if (prev[clientId] || !clientId) return prev;
        const colorIndex = Object.keys(prev).length % colorPool.length;
        return { ...prev, [clientId]: colorPool[colorIndex] };
      });
    };

    const handleNewMessage = (msg: AblyMessage) => {
      if (msg.clientId) assignColor(msg.clientId);
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };
    
    const setupChannel = async () => {
      await channel.attach();
      const historyPage = await channel.history({ limit: 50 });
      const validHistory = historyPage.items.filter(msg => msg.clientId);
      validHistory.forEach(msg => assignColor(msg.clientId!));
      setMessages(validHistory.reverse());
      channel.subscribe('chat-message', handleNewMessage);
    };
    setupChannel();

    return () => {
      channel.unsubscribe('chat-message', handleNewMessage);
    }
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const channel = ablyClient.channels.get(channelName);
    await channel.publish({
      name: "chat-message",
      data: {
        userId: session?.user?.id ?? null,
        userNick: session?.user?.nick || session?.user?.name || "Anônimo",
        userImage: session?.user?.image || null,
        text: newMessage.trim(),
      }
    });
    setNewMessage("");
    setShowEmojiPicker(false);
  }

  return (
    <Card className="h-[95%] flex flex-col bg-background">
      <CardHeader>
        {/* ÍCONE DE "AO VIVO" DE VOLTA */}
        <CardTitle className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
          Chat Ao Vivo
        </CardTitle>
      </CardHeader>

      {/* ÁREA DE MENSAGENS COM ALTURA E SCROLL */}
      <CardContent className="flex-grow h-0 overflow-y-auto pr-4">
        <div className="flex flex-col gap-2">
          {messages.map((msg) => {
            if (!msg.clientId || !msg.data) return null;
            const isMyMessage = msg.clientId === ablyClient.auth.clientId;
            const userColor = userColors[msg.clientId] || "text-foreground";
            const isAnonymous = !msg.data.userId;
            const displayName = isAnonymous ? `${msg.data.userNick}#${msg.clientId.slice(0, 4)}` : msg.data.userNick;

            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={msg.data.userImage ?? undefined} />
                  <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`p-3 rounded-lg max-w-xs ${isMyMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {!isMyMessage && <p className={`text-xs font-bold ${isAnonymous ? 'text-muted-foreground italic' : userColor}`}>{displayName}</p>}
                  <p className="text-sm break-words">{msg.data.text}</p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="relative">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Digite sua mensagem..." />
          <Button type="button" variant="ghost" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><Smile /></Button>
          <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
        </form>
        {showEmojiPicker && (
          <div className="absolute bottom-14 right-0 z-10">
            <EmojiPicker 
              theme={theme === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT}
              onEmojiClick={(emojiObject) => setNewMessage(prev => prev + emojiObject.emoji)} 
              lazyLoadEmojis={true}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}