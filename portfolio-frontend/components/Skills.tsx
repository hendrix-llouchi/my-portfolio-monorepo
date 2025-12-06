import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Code2, Database, BrainCircuit, Layout, Terminal, ShieldCheck, Globe, Smartphone, Cloud, Server } from 'lucide-react';
import { Skill } from '../types';

// Icon mapping for skills based on category and name
const getSkillIcon = (skillName: string, category: string) => {
  const name = skillName.toLowerCase();
  
  // Specific skill mappings
  if (name.includes('react')) {
    return <Code2 className="w-12 h-12" />;
  }
  if (name.includes('vue')) {
    return <Code2 className="w-12 h-12" />;
  }
  if (name.includes('angular')) {
    return <Code2 className="w-12 h-12" />;
  }
  if (name.includes('laravel')) {
    return <Server className="w-12 h-12" />;
  }
  if (name.includes('django')) {
    return <Server className="w-12 h-12" />;
  }
  if (name.includes('express')) {
    return <Server className="w-12 h-12" />;
  }
  if (name.includes('mysql') || name.includes('postgres') || name.includes('mongo') || name.includes('database')) {
    return <Database className="w-12 h-12" />;
  }
  if (name.includes('machine learning') || name.includes('ml') || name.includes('ai') || name.includes('artificial intelligence')) {
    return <BrainCircuit className="w-12 h-12" />;
  }
  if (name.includes('mobile') || name.includes('react native') || name.includes('flutter')) {
    return <Smartphone className="w-12 h-12" />;
  }
  if (name.includes('cloud') || name.includes('aws') || name.includes('azure')) {
    return <Cloud className="w-12 h-12" />;
  }
  if (name.includes('security') || name.includes('cyber')) {
    return <ShieldCheck className="w-12 h-12" />;
  }
  if (name.includes('tailwind') || name.includes('css')) {
    return <Layout className="w-12 h-12" />;
  }
  if (name.includes('git') || name.includes('github')) {
    return <Terminal className="w-12 h-12" />;
  }
  if (name.includes('python')) {
    return <Code2 className="w-12 h-12" />;
  }
  if (name.includes('javascript') || name.includes('typescript') || name.includes('js')) {
    return <Code2 className="w-12 h-12" />;
  }
  
  // Category-based fallback
  switch (category.toLowerCase()) {
    case 'frontend':
      return <Layout className="w-12 h-12" />;
    case 'backend':
      return <Server className="w-12 h-12" />;
    case 'data/ai':
      return <BrainCircuit className="w-12 h-12" />;
    case 'tools':
      return <Terminal className="w-12 h-12" />;
    default:
      return <Code2 className="w-12 h-12" />;
  }
};

// Color mapping for specific skills
const getSkillColor = (skillName: string, category: string) => {
  const name = skillName.toLowerCase();
  
  // Specific skill color mappings
  if (name.includes('laravel')) {
    return 'text-red-500'; // Laravel = Red
  }
  if (name.includes('react')) {
    return 'text-blue-500'; // React = Blue
  }
  if (name.includes('vue')) {
    return 'text-green-500'; // Vue = Green
  }
  if (name.includes('angular')) {
    return 'text-red-600'; // Angular = Red
  }
  if (name.includes('javascript') || name.includes('js')) {
    return 'text-yellow-400'; // JavaScript = Yellow
  }
  if (name.includes('typescript')) {
    return 'text-blue-600'; // TypeScript = Dark Blue
  }
  if (name.includes('python')) {
    return 'text-blue-400'; // Python = Light Blue
  }
  if (name.includes('tailwind') || name.includes('css')) {
    return 'text-cyan-400'; // Tailwind = Cyan
  }
  if (name.includes('mysql')) {
    return 'text-blue-600'; // MySQL = Blue
  }
  if (name.includes('postgres')) {
    return 'text-blue-700'; // PostgreSQL = Dark Blue
  }
  if (name.includes('mongo')) {
    return 'text-green-600'; // MongoDB = Green
  }
  if (name.includes('django')) {
    return 'text-green-700'; // Django = Dark Green
  }
  if (name.includes('express')) {
    return 'text-gray-400'; // Express = Gray
  }
  if (name.includes('machine learning') || name.includes('ml')) {
    return 'text-purple-500'; // ML = Purple
  }
  if (name.includes('ai') || name.includes('artificial intelligence')) {
    return 'text-pink-500'; // AI = Pink
  }
  if (name.includes('react native')) {
    return 'text-cyan-500'; // React Native = Cyan
  }
  if (name.includes('flutter')) {
    return 'text-blue-400'; // Flutter = Blue
  }
  if (name.includes('git') || name.includes('github')) {
    return 'text-orange-500'; // Git = Orange
  }
  if (name.includes('aws')) {
    return 'text-orange-400'; // AWS = Orange
  }
  if (name.includes('azure')) {
    return 'text-blue-500'; // Azure = Blue
  }
  if (name.includes('security') || name.includes('cyber')) {
    return 'text-red-600'; // Security = Red
  }
  if (name.includes('data science')) {
    return 'text-purple-400'; // Data Science = Purple
  }
  
  // Category-based fallback
  switch (category.toLowerCase()) {
    case 'frontend':
      return 'text-blue-400';
    case 'backend':
      return 'text-green-400';
    case 'data/ai':
      return 'text-purple-400';
    case 'tools':
      return 'text-yellow-400';
    default:
      return 'text-blue-400';
  }
};

const SkillCard: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  const IconComponent = getSkillIcon(skill.name, skill.category);
  const iconColor = getSkillColor(skill.name, skill.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.2)" }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 flex flex-col items-center justify-center aspect-square cursor-pointer transition-all"
    >
      <div className={`${iconColor} mb-4`}>
        {IconComponent}
      </div>
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
          throw new Error(`Failed to fetch skills: ${response.statusText}`);
        }

        const data = await response.json();
        setSkills(data);
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
