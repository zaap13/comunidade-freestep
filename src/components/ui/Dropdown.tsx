'use client'
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

// --- Nenhuma alteração nas primeiras partes ---
interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DropdownContext = createContext<DropdownContextType | null>(null);
function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownMenu');
  }
  return context;
}
export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}
export function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = useDropdown();

  // Agora, o Trigger é ele mesmo um botão. Simples e direto.
  return (
    <button
      type="button"
      onClick={() => setIsOpen(prev => !prev)}
      className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-full"
    >
      {children}
    </button>
  );
}
export function DropdownMenuContent({ children, className }: { children: React.ReactNode, className?: string }) {
  const { isOpen } = useDropdown();
  if (!isOpen) return null;
  return (
    <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-card border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${className}`}>
      <div className="py-1" role="menu" aria-orientation="vertical">
        {children}
      </div>
    </div>
  );
}

// --- AQUI ESTÁ A CORREÇÃO ---
// Definimos que as props do nosso item são todas as props de um <button> normal
type DropdownMenuItemProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function DropdownMenuItem({ children, className, ...props }: DropdownMenuItemProps) {
  const { setIsOpen } = useDropdown();

  return (
    <button
      {...props} // Passamos todas as props (incluindo onClick) para o botão
      onClick={(e) => {
        // Se um onClick foi passado, nós o executamos
        if (props.onClick) {
          props.onClick(e);
        }
        // E então sempre fechamos o menu
        setIsOpen(false);
      }}
      className={`text-foreground block w-full text-left px-4 py-2 text-sm hover:bg-accent ${className}`}
      role="menuitem"
    >
      {children}
    </button>
  );
}

// --- Nenhuma alteração nas partes finais ---
export function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 py-2 text-sm text-muted-foreground ${className}`}>{children}</div>;
}
export function DropdownMenuSeparator() {
  return <hr className="border-border my-1" />;
}