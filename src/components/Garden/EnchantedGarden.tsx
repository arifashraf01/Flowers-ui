import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

// --- Flower Species Definitions ---
const SPECIES = ['rose', 'tulip', 'daisy', 'cherry', 'lily', 'lavender', 'sunflower'] as const;
type Species = typeof SPECIES[number];

const RandomFlower = ({ species, delay, size, color1, color2, depth }: { species: Species, delay: number, size: number, color1: string, color2: string, depth: number }) => {
  const isBlurry = depth < 0.5; // background layer
  const filter = isBlurry ? 'blur(4px)' : 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))';
  const zIndex = Math.round(depth * 10);

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
      const xOffset = i % 2 === 0 ? -5 : 5;
      return (
        <motion.path
          key={i}
          d={path}
          fill={`url(#grad-${species}-${color1})`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: xOffset, y: yOffset }}
          transition={{ delay: delay + i * 0.1, duration: 1.5, ease: "easeOut" }}
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
        animate={{ scale: 1, rotate: angle, opacity: 0.9 }}
        transition={{ delay: delay + (i % 3) * 0.2, duration: 2, ease: [0.34, 1.56, 0.64, 1] }}
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

        {/* Stem */}
        <motion.path
          d="M 0 100 C 10 50, -10 -50, 0 -100"
          fill="none"
          stroke={`url(#stem-${species})`}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay, duration: 2, ease: "easeInOut" }}
        />

        {/* Flower Head */}
        <motion.g 
          y="-100"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: "easeInOut", delay: delay + 2 }}
        >
          {petals}
          {species !== 'lavender' && (
            <motion.circle
              r={size * 10}
              fill="#fff59d"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 1.5, duration: 1.5, ease: "easeOut" }}
            />
          )}
        </motion.g>
      </svg>
    </div>
  );
};

export const EnchantedGarden = () => {
  const shouldReduceMotion = useReducedMotion();

  // Generate random data once
  const flowerData = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const species = SPECIES[Math.floor(Math.random() * SPECIES.length)];
      const x = Math.random() * 120 - 10;
      const y = Math.random() * 40 + 60;
      const depth = Math.random() * 0.8 + 0.3;
      const size = Math.random() * 0.6 + 0.4;
      const delay = Math.random() * 6; // stagger blooms over 6 seconds
      
      const palettes = [
        { c1: '#f48fb1', c2: '#fce4ec' },
        { c1: '#ce93d8', c2: '#f3e5f5' },
        { c1: '#90caf9', c2: '#e3f2fd' },
        { c1: '#ffcc80', c2: '#fff3e0' },
        { c1: '#ffab91', c2: '#fbe9e7' },
        { c1: '#fff59d', c2: '#fffde7' }
      ];
      const palette = palettes[Math.floor(Math.random() * palettes.length)];

      return { id: i, species, x, y, depth, size, delay, ...palette };
    }).sort((a, b) => a.depth - b.depth);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full pointer-events-none origin-center"
      animate={shouldReduceMotion ? {} : {
        scale: [1, 1.05, 1],
        x: ['0%', '-1%', '1%', '0%'],
        y: ['0%', '1%', '-1%', '0%'],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Background blur overlay to give depth */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none z-0" />

      {/* Floating Petals */}
      {!shouldReduceMotion && Array.from({ length: 30 }).map((_, i) => (
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
            duration: Math.random() * 12 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 15,
          }}
        />
      ))}

      {/* Fireflies / Glowing Particles */}
      {!shouldReduceMotion && Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`fly-${i}`}
          className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full shadow-[0_0_10px_#ffeb3b] z-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 80 - 40, 0],
            y: [0, Math.random() * 80 - 40, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Butterflies */}
      {!shouldReduceMotion && Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`butterfly-${i}`}
          className="absolute w-4 h-4 z-40"
          style={{ left: '-5%', top: `${Math.random() * 50 + 20}%` }}
          animate={{
            x: ['0vw', '50vw', '110vw'],
            y: [0, Math.random() * -200 + 100, Math.random() * 200 - 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 20 + i * 5,
          }}
        >
          {/* Butterfly wings */}
          <motion.div 
            className="w-2 h-3 bg-blue-300 rounded-full origin-right absolute"
            animate={{ rotateY: [0, 60, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="w-2 h-3 bg-blue-300 rounded-full origin-left absolute left-2"
            animate={{ rotateY: [0, -60, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      ))}

      {/* Tiny Bees */}
      {!shouldReduceMotion && Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`bee-${i}`}
          className="absolute w-2 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.3)] z-40"
          style={{ left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 40 + 40}%` }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 10, -10, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        >
          <div className="absolute top-0 right-0 w-1 h-1 bg-black rounded-full" />
        </motion.div>
      ))}

      {/* Render Flowers */}
      {flowerData.map((f) => (
        <div key={f.id} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
          <RandomFlower 
            species={f.species} 
            delay={f.delay} 
            size={f.size} 
            color1={f.c1} 
            color2={f.c2} 
            depth={f.depth} 
          />
        </div>
      ))}
    </motion.div>
  );
};

export default EnchantedGarden;
