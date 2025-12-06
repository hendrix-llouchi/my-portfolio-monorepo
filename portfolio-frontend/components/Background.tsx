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

  // Generate 18 floating bubbles with random properties
  const bubbles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 12 + 4) * 16, // w-16 to w-64 (64 to 256px)
    left: Math.random() * 100, // 0-100% horizontal position
    top: Math.random() * 100, // 0-100% vertical position
    opacity: Math.random() * 0.2 + 0.1, // 10-30% opacity
    duration: Math.random() * 10 + 15, // 15-25 seconds for upward drift
    delay: Math.random() * 5, // 0-5 seconds delay
    horizontalDuration: Math.random() * 8 + 6, // 6-14 seconds for side-to-side
    horizontalAmplitude: Math.random() * 40 + 20, // 20-60px side movement
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2A2A72] via-[#1e3a8a] to-[#009FFD]" />
      
      {/* Floating Bubbles */}
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

