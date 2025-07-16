import RadioPlayer from "@/components/RadioPlayer";
import Chat from "@/components/Chat";
import DanceFloor from "@/components/DanceFloor";

export default function Home() {
  return (
    // Usaremos uma grade que no mobile é 1 coluna, e em telas médias (md) vira 3 colunas
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-8">

      {/* Conteúdo Principal (Ocupa 2 de 3 colunas no desktop) */}
      <main className="md:col-span-2 flex flex-col gap-8">

        {/* DJ Booth */}
        <div className="text-center p-8 border border-dashed border-primary/50 rounded-lg flex justify-center items-center">
          <RadioPlayer />
        </div>

        <div className="relative mt-8 text-center p-8 md:p-16 border border-dashed border-secondary/50 rounded-lg min-h-[500px] shadow-[var(--shadow-glow-secondary)]">
          <DanceFloor />
        </div>

      </main>

      {/* Sidebar do Chat (Ocupa 1 de 3 colunas no desktop) */}
      <aside className="hidden md:flex md:col-span-1">
        <Chat />
      </aside>

    </div>
  );
}