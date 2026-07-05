import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import CentralFlower from './components/Garden/CentralFlower';

const Background = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-pastel-pink via-pastel-peach to-pastel-lavender">
      {/* Soft sunlight gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent opacity-80" />
      
      {/* Light fog / subtle clouds */}
      <motion.div 
        className="absolute inset-0 bg-white/20 blur-[100px]"
        animate={shouldReduceMotion ? {} : {
          x: ['-5%', '5%', '-5%'],
          y: ['-5%', '5%', '-5%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-pastel-cream/40 rounded-full blur-[120px]"
        animate={shouldReduceMotion ? {} : {
          x: ['0%', '10%', '0%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute top-[20%] -right-[10%] w-[50%] h-[70%] bg-pastel-pink/40 rounded-full blur-[120px]"
        animate={shouldReduceMotion ? {} : {
          x: ['0%', '-10%', '0%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

function App() {
  const [loaded, setLoaded] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [bloomComplete, setBloomComplete] = useState(false);

  useEffect(() => {
    // Initial load state
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setShowButton(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-gray-800 font-sans selection:bg-pastel-pink selection:text-gray-900">
      <Background />
      
      {/* Interactive Garden rendering underneath UI but above background */}
      <div className="absolute inset-0 z-10">
        {!showButton && (
          <CentralFlower onBloomComplete={() => setBloomComplete(true)} />
        )}
      </div>

      {/* UI Overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen pointer-events-none">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : -20 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white/90 drop-shadow-md tracking-wide mb-6">
            Flowers for Someone
          </h1>
          <p className="font-sans font-light text-lg md:text-xl text-gray-700/80 tracking-widest uppercase">
            A beautiful experience
          </p>
        </motion.div>

        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.9 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-[20vh] pointer-events-auto"
          >
            <button
              onClick={handleOpen}
              className="group relative px-8 py-4 bg-white/40 hover:bg-white/60 backdrop-blur-md border border-white/50 rounded-full text-gray-700 font-medium tracking-wide uppercase transition-all duration-500 overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg height="20" width="20" fill="currentColor" viewBox="0 0 24 24" className="group-hover:rotate-12 transition-transform duration-500">
                  <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
                </svg>
                Open
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
