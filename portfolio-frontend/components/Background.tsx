import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Background: React.FC = () => {
  const [screenHeight, setScreenHeight] = useState(1000);

  useEffect(() => {
    setScreenHeight(window.innerHeight);
    const handleResize = () => setScreenHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bubbles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 12 + 4) * 16,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.2 + 0.1,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
    horizontalDuration: Math.random() * 8 + 6,
    horizontalAmplitude: Math.random() * 40 + 20,
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2A2A72] via-[#1e3a8a] to-[#009FFD]" />
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-white/30 via-blue-300/20 to-blue-500/30 blur-xl"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            opacity: bubble.opacity,
          }}
          animate={{
            y: [0, -(screenHeight + bubble.size)],
            x: [
              -bubble.horizontalAmplitude / 2,
              bubble.horizontalAmplitude / 2,
              -bubble.horizontalAmplitude / 2,
            ],
          }}
          transition={{
            y: {
              duration: bubble.duration,
              repeat: Infinity,
              ease: "linear",
              delay: bubble.delay,
            },
            x: {
              duration: bubble.horizontalDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bubble.delay,
            },
          }}
        />
      ))}
    </div>
  );
};

export default Background;

