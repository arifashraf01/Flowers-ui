import { useEffect, useState, Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import CentralFlower from './components/Garden/CentralFlower';
import { PointerProvider } from './components/Effects/PointerContext';
import { InteractiveCanvas } from './components/Effects/InteractiveCanvas';

// Lazy load the heavy enchanted garden component to optimize initial load
const EnchantedGarden = lazy(() => import('./components/Garden/EnchantedGarden'));

const Background = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#fbe9e7] via-[#f3e5f5] to-[#e3f2fd]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent opacity-90 mix-blend-screen" />
      
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.3)_0%,_transparent_70%)]"
        animate={shouldReduceMotion ? {} : { x: ['-2%', '2%', '-2%'], y: ['-2%', '2%', '-2%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,_rgba(255,253,231,0.5)_0%,_transparent_70%)] rounded-full mix-blend-screen"
        animate={shouldReduceMotion ? {} : { x: ['0%', '5%', '0%'] }}
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
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PointerProvider>
      <div className="relative min-h-screen w-full overflow-hidden text-gray-800 font-sans selection:bg-pastel-pink selection:text-gray-900 bg-[#fbe9e7]">
        <Background />
        
        {/* Fullscreen Interactive Canvas for touches/clicks */}
        {!showButton && <InteractiveCanvas />}
        
        <div className="absolute inset-0 z-10 pointer-events-none">
          {bloomComplete && (
            <Suspense fallback={null}>
              <EnchantedGarden />
            </Suspense>
          )}
          
          {!showButton && (
            <CentralFlower onBloomComplete={() => setBloomComplete(true)} />
          )}
        </div>

        {/* UI Overlay */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : -30 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white/90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] tracking-wide mb-6">
              Flowers for Someone
            </h1>
            <p className="font-sans font-light text-lg md:text-xl text-gray-700/80 tracking-widest uppercase">
              A premium experience
            </p>
          </motion.div>

          {showButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.95 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-32 pointer-events-auto"
            >
              <button
                onClick={() => setShowButton(false)}
                className="group relative px-10 py-5 bg-white/50 hover:bg-white/80 backdrop-blur-xl border border-white/60 rounded-full text-gray-800 font-medium tracking-widest uppercase transition-all duration-500 overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_15px_40px_0_rgba(31,38,135,0.2)] hover:-translate-y-2 active:translate-y-0 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3 font-garamond text-xl">
                  <svg height="24" width="24" fill="currentColor" viewBox="0 0 24 24" className="group-hover:rotate-45 transition-transform duration-700 ease-out">
                    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
                  </svg>
                  Reveal Magic
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </PointerProvider>
  );
}

export default App;
