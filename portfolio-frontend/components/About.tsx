import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Globe, Zap } from 'lucide-react';

const HighlightCard: React.FC<{ icon: React.ReactNode; title: string; description: string; index: number }> = ({ 
  icon, 
  title, 
  description, 
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl p-4 flex flex-col items-center text-center"
    >
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
        {icon}
      </div>
      <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
      <p className="text-blue-100/70 text-xs">{description}</p>
    </motion.div>
  );
};

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Main Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 h-full flex flex-col justify-center">
              <p className="text-lg text-blue-100 leading-relaxed mb-6">
                I'm a <span className="text-blue-300 font-semibold">Full-Stack and Mobile Developer</span> with experience in Vue.js, Laravel, and React Native, with a focus on <span className="text-purple-300 font-semibold">Machine Learning, Data Science, and AI</span>.
              </p>
              <p className="text-lg text-blue-100 leading-relaxed mb-6">
                I build clean, scalable applications and explore intelligent systems that enhance real-world software. Always learning, improving, and building.
              </p>
              <p className="text-lg text-blue-100 font-medium italic border-l-4 border-purple-400 pl-4">
                "Building scalable apps and intelligent solutions."
              </p>
            </div>
          </motion.div>

          {/* Right Column - Highlights Grid */}
          <div className="grid grid-cols-2 gap-4">
            <HighlightCard
              icon={<Code size={32} />}
              title="Clean Code"
              description="Scalable & Maintainable"
              index={0}
            />
            <HighlightCard
              icon={<Cpu size={32} />}
              title="AI Integration"
              description="Intelligent Solutions"
              index={1}
            />
            <HighlightCard
              icon={<Globe size={32} />}
              title="Web & Mobile"
              description="Cross-Platform Dev"
              index={2}
            />
            <HighlightCard
              icon={<Zap size={32} />}
              title="Fast Performance"
              description="Optimized Solutions"
              index={3}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
