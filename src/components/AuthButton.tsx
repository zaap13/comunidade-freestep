'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/Dropdown"
import { Avatar } from "@/components/ui/Avatar"
import { LogIn, LogOut, User as UserIcon } from "lucide-react"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar
            src={session.user?.image}
            alt={session.user?.name}
            fallback={session.user?.name?.charAt(0).toUpperCase() ?? 'U'}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
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