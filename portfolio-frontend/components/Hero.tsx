import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface Profile {
  name: string;
  headline: string;
  sub_headline: string | null;
  short_bio: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  linkedin: string | null;
  github: string | null;
  status_text: string;
}

const Hero: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (apiUrl) {
          const response = await fetch(`${apiUrl}/profile?t=${Date.now()}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            cache: 'no-cache',
          });

          if (response.ok) {
            const data = await response.json();
            setProfile(data);
            if (data.avatar_url) {
              let url = data.avatar_url;
              if (!url.startsWith('http')) {
                const baseUrl = apiUrl.replace('/api', '');
                url = `${baseUrl}/${url}`;
              }
              url = url.includes('?') 
                ? `${url.split('?')[0]}?t=${Date.now()}`
                : `${url}?t=${Date.now()}`;
              setAvatarUrl(url);
              setHasError(false);
            } else {
              setAvatarUrl(null);
            }
          } else {
            setAvatarUrl(null);
          }
        } else {
          setAvatarUrl(null);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setAvatarUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    const interval = setInterval(() => {
      fetchProfile();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleError = () => {
    setHasError(true);
    setAvatarUrl(null);
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
              {avatarUrl ? (
                <img 
                  key={`avatar-${profile?.avatar_url || ''}-${Date.now()}`}
                  src={avatarUrl} 
                  alt={profile?.name || "Profile"}
                  onError={handleError} 
                  onLoad={() => setHasError(false)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-5xl md:text-6xl font-bold">
                  {profile?.name 
                    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'HC'}
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
            {profile ? (
              <>
                {profile.name.split(' ')[0]}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  {profile.name.split(' ').slice(1).join(' ')}
                </span>
              </>
            ) : (
              <>
                Henry <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">Cobbinah</span>
              </>
            )}
          </h1>

          <h2 className="text-xl md:text-2xl text-blue-100 mb-4 font-normal leading-relaxed">
            {profile?.headline || 'Software Engineer | Full-Stack & Mobile Dev'}
            {profile?.sub_headline && (
              <>
                <br />
                <span className="text-blue-200 font-medium">{profile.sub_headline}</span>
              </>
            )}
            {!profile?.sub_headline && (
              <>
                <br />
                <span className="text-blue-200 font-medium">Machine Learning • Data Science • AI</span>
              </>
            )}
          </h2>

          <p className="text-blue-100/80 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            {profile?.short_bio || 'Building scalable apps and intelligent solutions.'}
          </p>
          <motion.a 
            href="#contact" 
            onClick={handleScrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
          >
            <Mail size={20} />
            Hire Me
          </motion.a>

          <div className="flex items-center justify-center gap-6 mt-10">
            <a 
              href={profile?.linkedin || CONTACT_INFO.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-100 hover:text-white transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href={profile?.github || CONTACT_INFO.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-100 hover:text-white transition-colors"
            >
              <Github size={24} />
            </a>
            {profile?.resume_url && (
              <a 
                href={profile.resume_url} 
                download
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-100 hover:text-white transition-colors"
                title="Download Resume/CV"
                onClick={(e) => {
                  const url = profile?.resume_url;
                  if (!url) return;
                  let downloadUrl = url;
                  if (!url.startsWith('http')) {
                    const apiUrl = import.meta.env.VITE_API_URL;
                    if (apiUrl) {
                      const baseUrl = apiUrl.replace('/api', '');
                      downloadUrl = `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
                    }
                  }
                  const urlParts = downloadUrl.split('/');
                  const filename = urlParts[urlParts.length - 1].split('?')[0] || 'resume.pdf';
                  e.preventDefault();
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = filename;
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <FileText size={24} />
              </a>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 text-blue-100/60"
        >
          <ChevronDown size={24} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
