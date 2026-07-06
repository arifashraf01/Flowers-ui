import { motion, useReducedMotion, useTransform } from 'framer-motion';
import { useMemo } from 'react';
import { usePointerContext } from '../Effects/PointerContext';
import { VolumetricRays } from '../Effects/VolumetricRays';
import { Finale } from '../UI/Finale';

const SPECIES = ['rose', 'tulip', 'daisy', 'cherry', 'lily', 'lavender', 'sunflower'] as const;
type Species = typeof SPECIES[number];

const RandomFlower = ({ species, delay, size, color1, color2, depth }: { species: Species, delay: number, size: number, color1: string, color2: string, depth: number }) => {
  const isBlurry = depth < 0.5;
  const filter = isBlurry ? 'blur(5px)' : 'drop-shadow(0px 8px 12px rgba(0,0,0,0.25))';
  const zIndex = Math.round(depth * 10);
  
  const { mouseX } = usePointerContext();
  
  // Calculate lean based on cursor X position. We map the screen width to a subtle rotation.
  const leanRotation = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-8, 8]);
  // We'll combine the default sway with the lean rotation. Since we can't easily add two separate transforms seamlessly in framer motion without a wrapper, we'll wrap the flower head.

  const getFlowerPath = () => {
    switch (species) {
      case 'rose': return "M 0 0 C -15 -20, -30 -40, 0 -50 C 30 -40, 15 -20, 0 0 Z";
      case 'tulip': return "M 0 0 C -10 -30, -20 -60, 0 -70 C 20 -60, 10 -30, 0 0 Z";
      case 'daisy': return "M 0 0 C -5 -15, -10 -30, 0 -40 C 10 -30, 5 -15, 0 0 Z";
      case 'cherry': return "M 0 0 C -20 -15, -25 -30, 0 -35 C 25 -30, 20 -15, 0 0 Z";
      case 'lily': return "M 0 0 C -20 -40, -40 -60, 0 -80 C 40 -60, 20 -40, 0 0 Z";
      case 'lavender': return "M 0 0 C -5 -10, -8 -20, 0 -30 C 8 -20, 5 -10, 0 0 Z";
      case 'sunflower': return "M 0 0 C -10 -20, -15 -40, 0 -50 C 15 -40, 10 -20, 0 0 Z";
      default: return "M 0 0 C -15 -20, -30 -40, 0 -50 C 30 -40, 15 -20, 0 0 Z";
    }
  };

  const numPetals = species === 'daisy' || species === 'sunflower' ? 12 : species === 'cherry' ? 5 : species === 'lavender' ? 16 : 6;
  const petals = Array.from({ length: numPetals }).map((_, i) => {
    const angle = (i * 360) / numPetals;
    const path = getFlowerPath();
    if (species === 'lavender') {
      const yOffset = -i * 5;
      const xOff = i % 2 === 0 ? -5 : 5;
      return (
        <motion.path
          key={i}
          d={path}
          fill={`url(#grad-${species}-${color1})`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: xOff, y: yOffset }}
          transition={{ delay: delay + i * 0.1, duration: 2, ease: "easeOut" }}
          style={{ originX: '0px', originY: '0px' }}
        />
      );
    }
    
    return (
      <motion.path
        key={i}
        d={path}
        fill={`url(#grad-${species}-${color1})`}
        initial={{ scale: 0, rotate: angle - 15, opacity: 0 }}
        animate={{ scale: 1, rotate: angle, opacity: 0.95 }}
        transition={{ delay: delay + (i % 3) * 0.2, duration: 2.5, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ originX: '0px', originY: '0px' }}
      />
    );
  });

  return (
    <div style={{ zIndex, filter, transform: `scale(${size * depth})` }} className="absolute flex items-end justify-center pointer-events-none origin-bottom">
      <svg width="200" height="300" viewBox="-100 -200 200 300" className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${species}-${color1}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
          <linearGradient id={`stem-${species}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7cb342" />
            <stop offset="100%" stopColor="#33691e" />
          </linearGradient>
        </defs>

        {/* Dynamic leaning wrapper */}
        <motion.g style={{ originX: '0px', originY: '100px', rotate: leanRotation }}>
          <motion.path
            d="M 0 100 C 10 50, -10 -50, 0 -100"
            fill="none"
            stroke={`url(#stem-${species})`}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay, duration: 2.5, ease: "easeInOut" }}
          />

          <motion.g 
            y="-100"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: "easeInOut", delay: delay + 2 }}
          >
            {/* Interactive hover wrapper to trigger extra bloom/sparkles natively via group hover if we used CSS, but since we are pointer-events-none on parent... actually we can just apply a CSS pulse to the center. */}
            <motion.g whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}>
              {petals}
              {species !== 'lavender' && (
                <motion.circle
                  r={size * 10}
                  fill="#fff59d"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 1.5, duration: 2, ease: "easeOut" }}
                />
              )}
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
};

const EnchantedGarden = () => {
  const shouldReduceMotion = useReducedMotion();

  // Removed flowerData to reduce lag, since CentralFlower handles flowers

  return (
    <>
      <VolumetricRays />
      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-none origin-center z-10"
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.05, 1],
          x: ['0%', '-1%', '1%', '0%'],
          y: ['0%', '1%', '-1%', '0%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-white/5 pointer-events-none z-0" />

        {/* Ambient floating particles */}
        {!shouldReduceMotion && Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute w-3 h-3 bg-pastel-pink/70 rounded-full blur-[1px] shadow-sm z-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              borderRadius: '50% 0 50% 50%',
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.random() * 300 - 150, Math.random() * 300 - 150],
              rotate: [0, 360, 720],
            }}
            transition={{
              duration: Math.random() * 12 + 12,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 15,
            }}
          />
        ))}

        {!shouldReduceMotion && Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`fly-${i}`}
            className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full shadow-[0_0_15px_#ffeb3b] z-20"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{ duration: Math.random() * 6 + 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 5 }}
          />
        ))}

        {/* Butterflies */}
        {!shouldReduceMotion && Array.from({ length: 2 }).map((_, i) => (
          <motion.div
            key={`butterfly-${i}`}
            className="absolute w-4 h-4 z-40"
            style={{ left: '-5%', top: `${Math.random() * 50 + 20}%` }}
            animate={{
              x: ['0vw', '50vw', '110vw'],
              y: [0, Math.random() * -200 + 100, Math.random() * 200 - 100],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 20 + i * 5 }}
          >
            <motion.div className="w-2 h-3 bg-blue-300 rounded-full origin-right absolute shadow-[0_0_10px_#90caf9]" animate={{ rotateY: [0, 60, 0] }} transition={{ duration: 0.2, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="w-2 h-3 bg-blue-300 rounded-full origin-left absolute left-2 shadow-[0_0_10px_#90caf9]" animate={{ rotateY: [0, -60, 0] }} transition={{ duration: 0.2, repeat: Infinity, ease: "easeInOut" }} />
          </motion.div>
        ))}


      </motion.div>

      <Finale />
    </>
  );
};

export default EnchantedGarden;
