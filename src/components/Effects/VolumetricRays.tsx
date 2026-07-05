import { motion } from 'framer-motion';

export const VolumetricRays = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden mix-blend-screen opacity-40">
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] origin-top-left"
        animate={{ rotate: [-2, 2, -2], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: 'conic-gradient(from 120deg at 0% 0%, transparent 0deg, rgba(255,255,255,0.2) 20deg, transparent 40deg, rgba(255,255,255,0.1) 60deg, transparent 80deg)'
        }}
      />
      <motion.div 
        className="absolute top-[-20%] right-[-10%] w-[120%] h-[120%] origin-top-right"
        animate={{ rotate: [2, -2, 2], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          background: 'conic-gradient(from 220deg at 100% 0%, transparent 0deg, rgba(255,240,200,0.15) 15deg, transparent 30deg, rgba(255,250,220,0.1) 50deg, transparent 70deg)'
        }}
      />
    </div>
  );
};
