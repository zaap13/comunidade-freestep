'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import Chat from "./Chat";

export default function MobileChatToggle() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <MessageCircle className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Chat Ao Vivo</SheetTitle>
                </SheetHeader>
                {/* Colocamos nosso componente de Chat existente aqui dentro */}
                <div className="flex-grow">
                    <Chat />
                </div>
            </SheetContent>
        </Sheet>
    )
}