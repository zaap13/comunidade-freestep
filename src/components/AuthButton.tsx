'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogIn, LogOut, User as UserIcon } from "lucide-react"
import Link from "next/link"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
  }

  if (session?.user) {
    const displayName = session.user.nick || session.user.name;
    const fallbackLetter = displayName?.charAt(0).toUpperCase() || "U";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session.user.image ?? undefined} alt={displayName ?? "Avatar"} />
              <AvatarFallback>{fallbackLetter}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center w-full cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
             <div className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={() => signIn("google")}>
      <LogIn className="mr-2 h-4 w-4" />
      Login
    </Button>
  )
}