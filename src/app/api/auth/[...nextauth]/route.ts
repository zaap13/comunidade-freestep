// Arquivo: src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/../auth"; // Importa os handlers do nosso novo arquivo
export const { GET, POST } = handlers;