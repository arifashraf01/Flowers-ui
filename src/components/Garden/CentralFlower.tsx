import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CentralFlowerProps {
  onBloomComplete: () => void;
}

export const CentralFlower = ({ onBloomComplete }: CentralFlowerProps) => {
  const [phase, setPhase] = useState<'seed' | 'growing' | 'blooming' | 'done'>('seed');

  useEffect(() => {
    const seedTimer = setTimeout(() => setPhase('growing'), 1500); // seed drops and splashes
    const growTimer = setTimeout(() => setPhase('blooming'), 4000); // stem and leaves grow
    const bloomTimer = setTimeout(() => {
      setPhase('done');
      onBloomComplete();
    }, 7000); // petals open and pollen releases

    return () => {
      clearTimeout(seedTimer);
      clearTimeout(growTimer);
      clearTimeout(bloomTimer);
    };
  }, [onBloomComplete]);

  // Petal generation for layer-by-layer unfolding
  const numPetals = 12;
  const petals = Array.from({ length: numPetals }).map((_, i) => {
    const angle = (i * 360) / numPetals;
    const delay = 0.1 * (i % 3); // Stagger petal opening slightly
    return (
      <motion.path
        key={i}
        d="M 0 0 C -20 -30, -30 -70, 0 -100 C 30 -70, 20 -30, 0 0 Z"
        fill="url(#petalGradient)"
        style={{ originX: '0px', originY: '0px' }}
        initial={{ scale: 0, rotate: angle - 10, opacity: 0 }}
        animate={phase === 'blooming' || phase === 'done' ? {
          scale: 1,
          rotate: angle,
          opacity: 0.9,
        } : {}}
        transition={{
          duration: 2,
          delay: delay,
          ease: [0.34, 1.56, 0.64, 1], // soft bounce
        }}
        className="drop-shadow-lg"
      />
    );
  });

  const numInnerPetals = 8;
  const innerPetals = Array.from({ length: numInnerPetals }).map((_, i) => {
    const angle = (i * 360) / numInnerPetals + 22.5;
    return (
      <motion.path
        key={`inner-${i}`}
        d="M 0 0 C -15 -20, -20 -50, 0 -70 C 20 -50, 15 -20, 0 0 Z"
        fill="url(#innerPetalGradient)"
        style={{ originX: '0px', originY: '0px' }}
        initial={{ scale: 0, rotate: angle - 15, opacity: 0 }}
        animate={phase === 'blooming' || phase === 'done' ? {
          scale: 1,
          rotate: angle,
          opacity: 1,
        } : {}}
        transition={{
          duration: 1.8,
          delay: 0.5 + 0.1 * (i % 2),
          ease: [0.34, 1.56, 0.64, 1],
        }}
      />
    );
  });

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center pointer-events-none">
      
      {/* Seed drop animation */}
      {phase === 'seed' && (
        <motion.div
          className="absolute bottom-0 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#fff]"
          initial={{ y: -500, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeIn" }}
        />
      )}

      {/* Ripple and dust on seed impact */}
      {(phase === 'growing' || phase === 'blooming') && (
        <motion.div
          className="absolute bottom-0 w-32 h-8 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}

      {/* Swaying container for the entire flower once grown */}
      <motion.div
        className="relative flex items-end justify-center origin-bottom"
        animate={phase === 'done' ? { rotate: [-2, 2, -2] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="400"
          height="600"
          viewBox="0 0 400 600"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7cb342" />
              <stop offset="50%" stopColor="#8bc34a" />
              <stop offset="100%" stopColor="#558b2f" />
            </linearGradient>
            <linearGradient id="petalGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f48fb1" />
              <stop offset="100%" stopColor="#fce4ec" />
            </linearGradient>
            <linearGradient id="innerPetalGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f06292" />
              <stop offset="100%" stopColor="#fff" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff59d" stopOpacity="1" />
              <stop offset="50%" stopColor="#fbc02d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f57f17" stopOpacity="0" />
            </radialGradient>
            <clipPath id="stemClip">
              <motion.rect
                x="0"
                y="0"
                width="400"
                height="600"
                initial={{ y: 600, height: 0 }}
                animate={phase !== 'seed' ? { y: 0, height: 600 } : {}}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </clipPath>
          </defs>

          {/* Stem wrapped in a swaying group during growth */}
          <motion.g
            clipPath="url(#stemClip)"
            animate={phase === 'growing' ? { rotate: [0, 3, -2, 0] } : {}}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            style={{ originX: '200px', originY: '600px' }}
          >
            {/* Organic varying thickness stem */}
            <path
              d="M 195 600 C 195 500, 180 400, 195 300 C 210 200, 195 150, 200 100 L 205 100 C 205 150, 220 200, 205 300 C 190 400, 205 500, 205 600 Z"
              fill="url(#stemGradient)"
              filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.1))"
            />
            
            {/* Leaves */}
            <motion.path
              d="M 190 450 C 120 440, 80 400, 90 350 C 130 370, 160 400, 190 430 Z"
              fill="url(#stemGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={phase !== 'seed' ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 1, duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ originX: '190px', originY: '450px' }}
            />
            <motion.path
              d="M 205 350 C 270 330, 310 280, 300 230 C 260 260, 230 300, 200 330 Z"
              fill="url(#stemGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={phase !== 'seed' ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 1.5, duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ originX: '205px', originY: '350px' }}
            />
          </motion.g>

          {/* Flower Head */}
          <g transform="translate(200, 100)">
            {petals}
            {innerPetals}
            
            {/* Glowing Center */}
            <motion.circle
              r="25"
              fill="url(#centerGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={phase === 'blooming' || phase === 'done' ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 1, duration: 2, ease: "easeOut" }}
            />
            
            <motion.circle
              r="15"
              fill="#fbc02d"
              initial={{ scale: 0 }}
              animate={phase === 'blooming' || phase === 'done' ? { scale: 1 } : {}}
              transition={{ delay: 1.2, duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* Pollen burst */}
            {(phase === 'blooming' || phase === 'done') && Array.from({ length: 20 }).map((_, i) => (
              <motion.circle
                key={`pollen-${i}`}
                r={Math.random() * 2 + 1}
                fill="#fff59d"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 150,
                  y: (Math.random() - 0.5) * 150 - 50,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  delay: 1.5 + Math.random(),
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 3 + Math.random() * 5
                }}
              />
            ))}
          </g>
        </svg>
      </motion.div>
    </div>
  );
};

export default CentralFlower;
