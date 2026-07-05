import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Finale = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show finale text after 15 seconds inside the enchanted garden
    const t = setTimeout(() => setShow(true), 15000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 4, ease: "easeInOut" }}
    >
      <div className="text-center bg-white/10 backdrop-blur-sm px-12 py-8 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        <motion.h2 
          className="font-garamond text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] tracking-wider"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: 'linear-gradient(90deg, #fff, #fce4ec, #fff)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🌸 Made with Love 🌸
        </motion.h2>
      </div>
    </motion.div>
  );
};
