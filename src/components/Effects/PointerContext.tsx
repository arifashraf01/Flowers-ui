import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useMotionValue } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface PointerContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const PointerContext = createContext<PointerContextType | null>(null);

export const PointerProvider = ({ children }: { children: ReactNode }) => {
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  return (
    <PointerContext.Provider value={{ mouseX, mouseY }}>
      {children}
    </PointerContext.Provider>
  );
};

export const usePointerContext = () => {
  const context = useContext(PointerContext);
  if (!context) throw new Error("usePointerContext must be used within PointerProvider");
  return context;
};
