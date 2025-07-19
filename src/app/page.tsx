'use client'

import DanceFloor from "@/components/DanceFloor";
import RadioPlayer from "@/components/RadioPlayer";
import Chat from "@/components/Chat";
import { useRadio } from "@/hooks/useRadio";
import { useState } from "react";

export default function Home() {
  const { radioState } = useRadio();
  const [isRadioOn, setIsRadioOn] = useState(false);

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-8">
      
      <main className="md:col-span-2 flex flex-col gap-8">
        
        <div className="flex justify-center items-center p-4 rounded-lg bg-card">
          <RadioPlayer 
            radioState={radioState} 
            isRadioOn={isRadioOn}
            setIsRadioOn={setIsRadioOn}
          />
        </div>

        <DanceFloor 
          radioState={radioState}
          isRadioOn={isRadioOn}
        />
      </main>

      <aside className="hidden md:flex md:col-span-1">
        <Chat />
      </aside>
      
    </div>
  );
}