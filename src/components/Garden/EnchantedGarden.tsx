import { motion, useReducedMotion } from 'framer-motion';
import { VolumetricRays } from '../Effects/VolumetricRays';
import { Finale } from '../UI/Finale';


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
