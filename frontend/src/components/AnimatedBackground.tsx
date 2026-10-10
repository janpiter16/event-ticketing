import React from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

export const AnimatedBackground: React.FC = () => {
  // Soft, colorful but low-contrast pastel colors
  const pastels = [
    'bg-rose-300', 'bg-pink-300', 'bg-fuchsia-300', 'bg-purple-300',
    'bg-violet-300', 'bg-indigo-300', 'bg-blue-300', 'bg-cyan-300',
    'bg-teal-300', 'bg-emerald-300', 'bg-amber-300', 'bg-orange-300'
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* 1. Dynamic Spotlights (Stage Lights) */}
      {[
        { left: '20%', color: 'rgba(244, 114, 182, 0.4)', duration: 6, rotateBase: -25, delay: 0 },
        { left: '50%', color: 'rgba(129, 140, 248, 0.4)', duration: 8, rotateBase: 0, delay: 2 },
        { left: '80%', color: 'rgba(45, 212, 191, 0.4)', duration: 7, rotateBase: 25, delay: 1 },
        { left: '35%', color: 'rgba(192, 132, 252, 0.3)', duration: 9, rotateBase: -10, delay: 3 },
        { left: '65%', color: 'rgba(251, 191, 36, 0.3)', duration: 10, rotateBase: 10, delay: 1.5 },
      ].map((spotlight, i) => (
        <motion.div
          key={`spotlight-${i}`}
          animate={{
            rotate: [spotlight.rotateBase - 15, spotlight.rotateBase + 15, spotlight.rotateBase - 15],
            opacity: [0.5, 0.9, 0.5]
          }}
          transition={{ duration: spotlight.duration, repeat: Infinity, ease: "easeInOut", delay: spotlight.delay }}
          className="absolute bottom-0 w-[50vw] h-[130vh] origin-bottom mix-blend-multiply"
          style={{
            left: spotlight.left,
            marginLeft: '-25vw', // Center the cone
            background: `linear-gradient(to top, ${spotlight.color}, transparent)`,
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
          }}
        />
      ))}

      {/* 2. Floating Confetti & Music Notes */}
      {[...Array(25)].map((_, i) => {
        const isNote = i % 5 === 0;
        const colorClass = pastels[i % pastels.length];
        return (
          <motion.div
            key={`confetti-${i}`}
            animate={{
              y: ['-10vh', '110vh'],
              x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 250],
              rotate: [0, 360],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 15
            }}
            className={`absolute ${isNote ? 'text-indigo-300' : `${colorClass} rounded-sm`}`}
            style={{
              left: `${Math.random() * 100}%`,
              width: isNote ? 'auto' : `${Math.random() * 12 + 6}px`,
              height: isNote ? 'auto' : `${Math.random() * 12 + 6}px`,
            }}
          >
            {isNote && <Music size={16 + Math.random() * 20} className="opacity-60" />}
          </motion.div>
        );
      })}

      {/* 3. Abstract Speakers (Left & Right) */}
      <div className="absolute bottom-0 left-0 w-20 md:w-32 h-56 md:h-72 bg-white/40 backdrop-blur-md rounded-tr-3xl border-r border-t border-white/60 flex flex-col items-center justify-around py-6 shadow-xl z-0">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.43, repeat: Infinity }} className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-slate-200/80 border border-slate-300 shadow-inner flex items-center justify-center">
           <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-slate-400/50" />
        </motion.div>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.43, repeat: Infinity, delay: 0.1 }} className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-slate-200/80 border border-slate-300 shadow-inner flex items-center justify-center">
           <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-400/50" />
        </motion.div>
      </div>

      <div className="absolute bottom-0 right-0 w-20 md:w-32 h-56 md:h-72 bg-white/40 backdrop-blur-md rounded-tl-3xl border-l border-t border-white/60 flex flex-col items-center justify-around py-6 shadow-xl z-0">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.43, repeat: Infinity, delay: 0.2 }} className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-slate-200/80 border border-slate-300 shadow-inner flex items-center justify-center">
           <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-slate-400/50" />
        </motion.div>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.43, repeat: Infinity, delay: 0.3 }} className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-slate-200/80 border border-slate-300 shadow-inner flex items-center justify-center">
           <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-400/50" />
        </motion.div>
      </div>

      {/* 4. The Jumping Crowd (Silhouettes at the bottom) */}
      <div className="absolute bottom-[-10px] left-[-5%] w-[110%] h-32 md:h-48 pointer-events-none opacity-60 z-0">
        {[...Array(35)].map((_, i) => {
          const leftPos = (i / 35) * 100;
          const isJumping = Math.random() > 0.1;
          const colorClass = pastels[i % pastels.length];
          const bounceDuration = 0.3 + Math.random() * 0.3;
          
          return (
            <motion.div
              key={`person-${i}`}
              animate={isJumping ? {
                y: [0, -15 - Math.random() * 25, 0],
              } : {
                y: [0, -5, 0]
              }}
              transition={{
                duration: bounceDuration,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random()
              }}
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: `${leftPos}%`, width: '40px' }}
            >
              {/* Left Arm */}
              {Math.random() > 0.3 && (
                <motion.div 
                  animate={{ rotate: [-25, 5, -25] }}
                  transition={{ duration: bounceDuration * 2, repeat: Infinity }}
                  className={`absolute top-6 -left-2 w-2.5 h-12 ${colorClass} rounded-full origin-bottom mix-blend-multiply`}
                  style={{ transform: 'rotate(-30deg)' }}
                />
              )}
              {/* Right Arm */}
              {Math.random() > 0.3 && (
                <motion.div 
                  animate={{ rotate: [25, -5, 25] }}
                  transition={{ duration: bounceDuration * 2, repeat: Infinity, delay: 0.1 }}
                  className={`absolute top-6 -right-2 w-2.5 h-12 ${colorClass} rounded-full origin-bottom mix-blend-multiply`}
                  style={{ transform: 'rotate(30deg)' }}
                />
              )}
              {/* Head */}
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${colorClass} mix-blend-multiply z-10`} />
              {/* Body */}
              <div className={`w-10 h-20 md:w-12 md:h-28 ${colorClass} mix-blend-multiply rounded-t-[20px] mt-1 z-10`} />
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
