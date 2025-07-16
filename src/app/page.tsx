import RadioPlayer from "@/components/RadioPlayer";

export default function Home() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* DJ Booth com o Player da Rádio */}
      <div className="text-center p-8 border border-dashed border-primary/50 rounded-lg shadow-[var(--shadow-glow-primary)] flex justify-center">
        <RadioPlayer />
      </div>

      {/* Pista de Dança */}
      <div className="mt-8 text-center p-16 border border-dashed border-secondary/50 rounded-lg min-h-[400px] shadow-[var(--shadow-glow-secondary)]">
        <h2 className="text-2xl font-bold text-secondary">Pista de Dança</h2>
        <p className="text-muted-foreground">Em breve: A festa com os avatares dos usuários...</p>
      </div>
      
    </section>
  );
}