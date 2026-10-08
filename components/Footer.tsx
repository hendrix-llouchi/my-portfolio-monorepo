import React, { useState, useEffect } from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface Profile {
  name: string;
  linkedin: string | null;
  github: string | null;
}

const Footer: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (apiUrl) {
          const response = await fetch(`${apiUrl}/profile`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setProfile(data);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/20 py-12 relative">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-6">
          {profile?.name || 'Henry Cobbinah'}
        </h3>
        
        <div className="flex justify-center gap-6 mb-8">
            <a 
              href={profile?.linkedin || CONTACT_INFO.linkedin} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-blue-100 hover:bg-white/20 hover:text-white transition-all"
            >
                <Linkedin size={20} />
            </a>
            <a 
              href={profile?.github || CONTACT_INFO.github} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-blue-100 hover:bg-white/20 hover:text-white transition-all"
            >
                <Github size={20} />
            </a>
            <a 
              href={`mailto:${CONTACT_INFO.email}`} 
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-blue-100 hover:bg-white/20 hover:text-white transition-all"
            >
                <Mail size={20} />
            </a>
        </div>

        <p className="text-blue-100/70 text-sm">
          © {new Date().getFullYear()} Henry Cobbinah. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;