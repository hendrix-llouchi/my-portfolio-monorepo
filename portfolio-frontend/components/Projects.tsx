import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Loader2 } from 'lucide-react';
import { Project } from '../types';

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-white/20 transition-all duration-300 flex flex-col"
    >
      {/* Image Area (Top Half) */}
      <div className="h-48 w-full relative overflow-hidden">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <div className="text-white/30 text-6xl font-bold">
              {project.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Content Area (Bottom Half) */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-blue-100/70 text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack.map((tech) => (
            <span 
              key={tech} 
              className="text-xs px-2 py-1 rounded-full bg-white/10 text-blue-100 border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links Footer */}
        <div className="flex gap-4 pt-4 border-t border-white/10">
          {project.demo_link && (
            <a 
              href={project.demo_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm"
              aria-label="View demo"
            >
              <ExternalLink size={16} />
              <span>Demo</span>
            </a>
          )}
          {project.repo_link && (
            <a 
              href={project.repo_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm"
              aria-label="View repository"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          )}
          {!project.demo_link && !project.repo_link && (
            <span className="text-blue-100/50 text-sm italic">No links available</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error('API URL is not configured. Please set VITE_API_URL in your .env file.');
        }

        const response = await fetch(`${apiUrl}/projects`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Projects</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            A selection of projects demonstrating capabilities in full-stack development, data science pipelines, and AI integration.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-400" size={48} />
            <span className="ml-4 text-blue-100">Loading projects...</span>
          </div>
        )}

        {error && (
          <div className="max-w-7xl mx-auto">
            <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-center">
              <p className="font-semibold mb-2">Error Loading Projects</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-blue-100">No projects found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
