import React from 'react';
import { motion } from 'framer-motion';
import { Experience as ExperienceType } from '../types';
import { EXPERIENCES } from '../constants';

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
        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
          <h3 className="text-xl font-bold text-white pr-4">
            {experience.role}
          </h3>
          {experience.period && (
            <span className="text-blue-100/70 text-sm whitespace-nowrap bg-white/5 px-3 py-1 rounded-full border border-white/10">
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
  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experience</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mb-4" />
          <p className="text-blue-100 max-w-2xl mx-auto">
            Practical industry internships and technical roles across software development, data science, and cybersecurity.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-[7px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-400 via-blue-400 to-transparent" />
          {EXPERIENCES.map((exp, index) => (
            <ExperienceCard key={exp.id || index} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
