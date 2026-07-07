import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { usePointerContext } from './PointerContext';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const InteractiveCanvas = () => {
  const { mouseX, mouseY } = usePointerContext();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  
  const handlePointerMove = (e: React.PointerEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const newRipple = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
    setRipples(prev => [...prev.slice(-4), newRipple]); // keep max 5 ripples
  };

  return (
    <div 
      className="absolute inset-0 z-50 pointer-events-auto"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      style={{ touchAction: 'none' }}
    >
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="absolute rounded-full border border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.8)] pointer-events-none"
            style={{ left: r.x, top: r.y, x: '-50%', y: '-50%' }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 150, height: 150, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onAnimationComplete={() => setRipples(prev => prev.filter(p => p.id !== r.id))}
          />
        ))}
      </AnimatePresence>
      
      {/* Subtle bloom cursor follower */}
      <motion.div 
        className="absolute w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-[50px] mix-blend-screen"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
    </div>
  );
};
