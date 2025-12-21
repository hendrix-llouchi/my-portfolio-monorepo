import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2 } from 'lucide-react';
import { Experience as ExperienceType } from '../types';

const ExperienceCard: React.FC<{ experience: ExperienceType; index: number }> = ({ experience, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8"
    >
      <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-purple-400 border-4 border-[#2A2A72] z-10 shadow-lg shadow-purple-400/30" />
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6 hover:border-white/20 transition-colors duration-300">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white pr-4">
            {experience.role}
          </h3>
          {experience.period && (
            <span className="text-blue-100/70 text-sm whitespace-nowrap">
              {experience.period}
            </span>
          )}
        </div>

        <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-medium mb-3 text-lg">
          {experience.company}
        </h4>

        <p className="text-blue-100/70 mb-4 leading-relaxed">
          {experience.description}
        </p>

        {experience.technologies && experience.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs rounded-full bg-white/10 text-blue-100 border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error('API URL is not configured. Please set VITE_API_URL in your .env file.');
        }

        const response = await fetch(`${apiUrl}/experiences`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || errorData.error || `Failed to fetch experiences: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setExperiences(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError(err instanceof Error ? err.message : 'Failed to load experiences. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experience & Internships</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full" />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-400" size={48} />
            <span className="ml-4 text-blue-100">Loading experiences...</span>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto">
            <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-center">
              <p className="font-semibold mb-2">Error Loading Experiences</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && experiences.length > 0 && (
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400/30 via-purple-400/20 to-transparent" />
            <div className="relative">
              {experiences.map((experience, index) => (
                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && experiences.length === 0 && (
          <div className="text-center py-20">
            <p className="text-blue-100">No experiences found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
