import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Code2 } from 'lucide-react';
import { Skill } from '../types';

// Icon map for 3D skill icons
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

// Helper function to get icon path (case-insensitive with fallback)
const getSkillIconPath = (skillName: string): string | null => {
  // Trim and normalize the skill name
  const normalizedName = skillName.trim();
  
  // Exact match first
  if (skillIcons[normalizedName]) {
    return skillIcons[normalizedName];
  }
  
  // Case-insensitive match
  const lowerName = normalizedName.toLowerCase();
  for (const [key, value] of Object.entries(skillIcons)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  
  // Partial match (e.g., "Laravel" matches "Laravel Framework")
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
      whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.2)" }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 flex flex-col items-center justify-center aspect-square cursor-pointer transition-all"
    >
      {hasIcon ? (
        <img
          src={iconPath!}
          alt={`${skill.name} icon`}
          className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg mb-4"
          onError={(e) => {
            console.error(`Failed to load icon for ${skill.name}:`, iconPath);
            setImageError(true);
          }}
        />
      ) : (
        <div className="text-blue-400 mb-4">
          <Code2 className="w-24 h-24 md:w-28 md:h-28" />
        </div>
      )}

      <h3 className="text-white font-medium text-center text-sm md:text-base">
        {skill.name}
      </h3>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error('API URL is not configured. Please set VITE_API_URL in your .env file.');
        }

        const response = await fetch(`${apiUrl}/skills`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || errorData.error || `Failed to fetch skills: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setSkills(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError(err instanceof Error ? err.message : 'Failed to load skills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Skills</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full" />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-400" size={48} />
            <span className="ml-4 text-blue-100">Loading skills...</span>
          </div>
        )}

        {error && (
          <div className="max-w-7xl mx-auto">
            <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-center">
              <p className="font-semibold mb-2">Error Loading Skills</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && skills.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto">
            {skills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </div>
        )}

        {!loading && !error && skills.length === 0 && (
          <div className="text-center py-20">
            <p className="text-blue-100">No skills found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
