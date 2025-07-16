'use client'

import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

// Este componente vai "proteger" as páginas
export default function AuthGate({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Se a sessão está carregada e o usuário está autenticado...
        if (status === 'authenticated') {
            // ... e o nick dele é nulo E ele não está na página de onboarding...
            if (!session.user.nick && pathname !== '/onboarding') {
                // ...então o redirecionamos para a página de onboarding.
                router.push('/onboarding')
            }
        }
    }, [session, status, router, pathname])

    // Se a sessão ainda está carregando, podemos mostrar um loading global
    if (status === 'loading') {
        return <div>Carregando sessão...</div>
    }

    return <>{children}</>
}