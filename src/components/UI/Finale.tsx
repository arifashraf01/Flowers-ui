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
        <motion.button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-white/20 hover:bg-white/40 border border-white/50 rounded-full text-white tracking-widest uppercase transition-all duration-300 pointer-events-auto shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Restart
        </motion.button>
      </div>
    </motion.div>
  );
};
