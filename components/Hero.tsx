import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import { CONTACT_INFO, PROFILE_INFO } from '../constants';
import avatarImg from '../henry.jpg';

const Hero: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 pb-10 overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
            <div className="relative w-full h-full rounded-full border-4 border-white/30 overflow-hidden shadow-2xl shadow-white/20">
              {!imgError ? (
                <img 
                  src={avatarImg} 
                  alt={PROFILE_INFO.name}
                  onError={() => setImgError(true)} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-5xl md:text-6xl font-bold">
                  HC
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-white">
            {PROFILE_INFO.firstName}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
              {PROFILE_INFO.lastName}
            </span>
          </h1>

          <h2 className="text-xl md:text-2xl text-blue-100 mb-4 font-normal leading-relaxed">
            {PROFILE_INFO.headline}
            <br />
            <span className="text-blue-200 font-medium">{PROFILE_INFO.subHeadline}</span>
          </h2>

          <p className="text-blue-100/80 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            {PROFILE_INFO.shortBio}
          </p>

          <motion.a 
            href="#contact" 
            onClick={handleScrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all cursor-pointer"
          >
            <Mail size={20} />
            Hire Me
          </motion.a>

          <div className="flex items-center justify-center gap-6 mt-10">
            <a 
              href={CONTACT_INFO.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-100 hover:text-white transition-colors"
              aria-label="LinkedIn profile"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href={CONTACT_INFO.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-100 hover:text-white transition-colors"
              aria-label="GitHub profile"
            >
              <Github size={24} />
            </a>
            <a 
              href={`mailto:${CONTACT_INFO.email}`} 
              className="text-blue-100 hover:text-white transition-colors"
              aria-label="Direct Email"
            >
              <Mail size={24} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
