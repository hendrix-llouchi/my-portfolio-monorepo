import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { Skill } from '../types';
import { SKILLS } from '../constants';

const skillIcons: Record<string, string> = {
  "React": "/icons/react.png",
  "Laravel": "/icons/laravel.png",
  "TypeScript": "/icons/typescript.png",
  "Python": "/icons/python.png",
  "Git": "/icons/git.png",
  "MySQL": "/icons/mysql.png",
  "HTML": "/icons/html.png",
  "CSS": "/icons/css.png",
};

const getSkillIconPath = (skillName: string): string | null => {
  const normalizedName = skillName.trim();
  if (skillIcons[normalizedName]) {
    return skillIcons[normalizedName];
  }
  const lowerName = normalizedName.toLowerCase();
  for (const [key, value] of Object.entries(skillIcons)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  for (const [key, value] of Object.entries(skillIcons)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return value;
    }
  }
  return null;
};

const SkillCard: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  const iconPath = getSkillIconPath(skill.name);
  const [imageError, setImageError] = useState(false);
  const hasIcon = iconPath !== null && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 flex flex-col items-center justify-center aspect-square cursor-pointer transition-all shadow-lg shadow-black/10"
    >
      {hasIcon ? (
        <img
          src={iconPath!}
          alt={`${skill.name} icon`}
          className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg mb-4"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="text-blue-400 mb-4">
          <Code2 className="w-20 h-20 md:w-24 md:h-24" />
        </div>
      )}

      <h3 className="text-white font-medium text-center text-sm md:text-base">
        {skill.name}
      </h3>
      {skill.category && (
        <span className="text-xs text-blue-200/60 mt-1">
          {skill.category}
        </span>
      )}
    </motion.div>
  );
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Skills & Technologies</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mb-4" />
          <p className="text-blue-100 max-w-2xl mx-auto">
            Core technical proficiencies in frontend and mobile architectures, backend services, databases, and AI tooling.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {SKILLS.map((skill, index) => (
            <SkillCard key={skill.id || index} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
