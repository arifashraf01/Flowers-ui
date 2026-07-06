import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface CentralFlowerProps {
  onBloomComplete: () => void;
}

const SPECIES = ['rose', 'daisy', 'tulip', 'lily'] as const;
const SPECIES_CONFIG = {
  rose: { petals: 12, innerPetals: 8, path: "M 0 0 C -20 -30, -30 -70, 0 -100 C 30 -70, 20 -30, 0 0 Z", innerPath: "M 0 0 C -15 -20, -20 -50, 0 -70 C 20 -50, 15 -20, 0 0 Z" },
  daisy: { petals: 16, innerPetals: 0, path: "M 0 0 C -10 -20, -15 -70, 0 -90 C 15 -70, 10 -20, 0 0 Z", innerPath: "" },
  tulip: { petals: 6, innerPetals: 3, path: "M 0 0 C -15 -40, -25 -80, 0 -110 C 25 -80, 15 -40, 0 0 Z", innerPath: "M 0 0 C -10 -30, -15 -60, 0 -80 C 15 -60, 10 -30, 0 0 Z" },
  lily: { petals: 6, innerPetals: 6, path: "M 0 0 C -30 -40, -40 -80, 0 -120 C 40 -80, 30 -40, 0 0 Z", innerPath: "M 0 0 C -20 -30, -25 -60, 0 -90 C 25 -60, 20 -30, 0 0 Z" }
};

const PALETTES = [
  { p1: '#f48fb1', p2: '#fce4ec', i1: '#f06292', i2: '#fff' }, // Pink
  { p1: '#ce93d8', p2: '#f3e5f5', i1: '#ba68c8', i2: '#fff' }, // Purple
  { p1: '#90caf9', p2: '#e3f2fd', i1: '#64b5f6', i2: '#fff' }, // Blue
  { p1: '#ffcc80', p2: '#fff3e0', i1: '#ffb74d', i2: '#fff' }, // Orange
  { p1: '#ffab91', p2: '#fbe9e7', i1: '#ff8a65', i2: '#fff' }, // Peach
  { p1: '#e57373', p2: '#ffebee', i1: '#f44336', i2: '#fff' }  // Red
];

export const CentralFlower = ({ onBloomComplete }: CentralFlowerProps) => {
  const [phase, setPhase] = useState<'seed' | 'growing' | 'blooming' | 'done'>('seed');

  useEffect(() => {
    const seedTimer = setTimeout(() => setPhase('growing'), 1500); 
    const growTimer = setTimeout(() => setPhase('blooming'), 4000); 
    const bloomTimer = setTimeout(() => {
      setPhase('done');
      onBloomComplete();
    }, 7000); 

    return () => {
      clearTimeout(seedTimer);
      clearTimeout(growTimer);
      clearTimeout(bloomTimer);
    };
  }, [onBloomComplete]);

  const flowers = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const species = SPECIES[Math.floor(Math.random() * SPECIES.length)];
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      return {
        id: i,
        left: `${(i / 14) * 90 + 5}%`,
        scale: 0.25 + Math.random() * 0.35,
        flip: Math.random() > 0.5 ? 1 : -1,
        species,
        palette
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {flowers.map((flower) => (
        <FlowerInstance key={flower.id} phase={phase} flower={flower} />
      ))}
    </div>
  );
};

const FlowerInstance = ({ phase, flower }: { phase: string, flower: any }) => {
  const config = SPECIES_CONFIG[flower.species as keyof typeof SPECIES_CONFIG];
  
  const petals = Array.from({ length: config.petals }).map((_, i) => {
    const angle = (i * 360) / config.petals;
    const delay = 0.1 * (i % 3); 
    return (
      <motion.path
        key={`p-${i}`}
        d={config.path}
        fill={`url(#petalGrad-${flower.id})`}
        style={{ originX: '0px', originY: '0px' }}
        initial={{ scale: 0, rotate: angle - 10, opacity: 0 }}
        animate={phase === 'blooming' || phase === 'done' ? {
          scale: 1, rotate: angle, opacity: 0.95,
        } : {}}
        transition={{ duration: 2, delay: delay, ease: [0.34, 1.56, 0.64, 1] }}
      />
    );
  });

  const innerPetals = Array.from({ length: config.innerPetals }).map((_, i) => {
    const angle = (i * 360) / config.innerPetals + (180 / config.innerPetals);
    return (
      <motion.path
        key={`i-${i}`}
        d={config.innerPath}
        fill={`url(#innerGrad-${flower.id})`}
        style={{ originX: '0px', originY: '0px' }}
        initial={{ scale: 0, rotate: angle - 15, opacity: 0 }}
        animate={phase === 'blooming' || phase === 'done' ? {
          scale: 1, rotate: angle, opacity: 1,
        } : {}}
        transition={{ duration: 1.8, delay: 0.5 + 0.1 * (i % 2), ease: [0.34, 1.56, 0.64, 1] }}
      />
    );
  });

  return (
    <div 
      className="absolute bottom-0 flex items-end justify-center pointer-events-none origin-bottom"
      style={{ left: flower.left, transform: `translateX(-50%) scale(${flower.scale * flower.flip}, ${flower.scale})` }}
    >
      {phase === 'seed' && (
        <motion.div
          className="absolute bottom-0 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#fff]"
          initial={{ y: -500, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeIn" }}
        />
      )}

      {(phase === 'growing' || phase === 'blooming') && (
        <motion.div
          className="absolute bottom-0 w-32 h-8 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white/30"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}

      <motion.div
        className="relative flex items-end justify-center origin-bottom"
        animate={phase === 'done' ? { rotate: [-2, 2, -2] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="400" height="600" viewBox="0 0 400 600" className="overflow-visible">
          <defs>
            <linearGradient id={`stemGradient-${flower.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7cb342" />
              <stop offset="50%" stopColor="#8bc34a" />
              <stop offset="100%" stopColor="#558b2f" />
            </linearGradient>
            <linearGradient id={`petalGrad-${flower.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={flower.palette.p1} />
              <stop offset="100%" stopColor={flower.palette.p2} />
            </linearGradient>
            <linearGradient id={`innerGrad-${flower.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={flower.palette.i1} />
              <stop offset="100%" stopColor={flower.palette.i2} />
            </linearGradient>
            <radialGradient id={`centerGlow-${flower.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff59d" stopOpacity="1" />
              <stop offset="50%" stopColor="#fbc02d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f57f17" stopOpacity="0" />
            </radialGradient>
            <clipPath id={`stemClip-${flower.id}`}>
              <motion.rect
                x="0" y="0" width="400" height="600"
                initial={{ y: 600, height: 0 }}
                animate={phase !== 'seed' ? { y: 0, height: 600 } : {}}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </clipPath>
          </defs>

          <motion.g
            clipPath={`url(#stemClip-${flower.id})`}
            animate={phase === 'growing' ? { rotate: [0, 3, -2, 0] } : {}}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            style={{ originX: '200px', originY: '600px' }}
          >
            <path
              d="M 195 600 C 195 500, 180 400, 195 300 C 210 200, 195 150, 200 100 L 205 100 C 205 150, 220 200, 205 300 C 190 400, 205 500, 205 600 Z"
              fill={`url(#stemGradient-${flower.id})`}
            />
            <motion.path
              d="M 190 450 C 120 440, 80 400, 90 350 C 130 370, 160 400, 190 430 Z"
              fill={`url(#stemGradient-${flower.id})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={phase !== 'seed' ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 1, duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ originX: '190px', originY: '450px' }}
            />
            <motion.path
              d="M 205 350 C 270 330, 310 280, 300 230 C 260 260, 230 300, 200 330 Z"
              fill={`url(#stemGradient-${flower.id})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={phase !== 'seed' ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 1.5, duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ originX: '205px', originY: '350px' }}
            />
          </motion.g>

          <g transform="translate(200, 100)">
            {petals}
            {innerPetals}
            
            <motion.circle
              r="25" fill={`url(#centerGlow-${flower.id})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={phase === 'blooming' || phase === 'done' ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 1, duration: 2, ease: "easeOut" }}
            />
            
            <motion.circle
              r="15" fill="#fbc02d"
              initial={{ scale: 0 }}
              animate={phase === 'blooming' || phase === 'done' ? { scale: 1 } : {}}
              transition={{ delay: 1.2, duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};

export default CentralFlower;
