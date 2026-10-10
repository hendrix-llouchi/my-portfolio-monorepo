import { Experience, Project, Skill } from './types';

export const PROFILE_INFO = {
  name: "Henry Cobbinah",
  firstName: "Henry",
  lastName: "Cobbinah",
  headline: "Software Engineer | Full-Stack & Mobile Dev",
  subHeadline: "Machine Learning • Data Science • AI",
  shortBio: "Building scalable web and mobile applications, clean data pipelines, and intelligent AI-powered solutions.",
  aboutParagraphs: [
    "I'm Henry Cobbinah, a software engineer working across full-stack web, mobile, and machine learning — with real-world experience in React, TypeScript, Vue.js, Laravel, and React Native.",
    "I care about software that's fast, honest, and built to last: clean frontends, intelligent backends, and AI that actually ships. Always learning, improving, and building."
  ],
  quote: "Building scalable apps and intelligent solutions."
};

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    company: "Npontu Technologies Limited",
    role: "Full Stack Developer",
    period: "Nov 2025 — May 2026",
    type: "Internship",
    location: "Greater Accra Region, Ghana · On-site",
    description: "Full-stack web and mobile development with Vue.js, Laravel, and React Native — APIs, databases, and production-ready features shipped with cross-functional teams."
  },
  {
    id: 2,
    company: "AngloGold Ashanti Iduapriem Mine",
    role: "Backend Developer",
    period: "Oct 2025 — Nov 2025",
    type: "Internship",
    location: "Tarkwa, Western Region, Ghana · On-site",
    description: "Backend APIs for data collection and device communication; real-time fleet and fatigue monitoring with sensor-data pipelines built alongside hardware and AI teams."
  },
  {
    id: 3,
    company: "Excelerate",
    role: "AI Forensic Advisory",
    period: "May 2025 — Jun 2025",
    type: "Internship",
    location: "Dubai, UAE · Remote",
    description: "Identified AI integration opportunities in forensic accounting; built implementation strategies and drove AI initiatives with internal teams."
  },
  {
    id: 4,
    company: "Go2Cod",
    role: "Data Science",
    period: "Oct 2024 — Nov 2024",
    type: "Internship",
    location: "Addis Ababa, Ethiopia · Remote",
    description: "Cleaned and visualized customer data with Pandas and Seaborn; built a churn prediction model with logistic regression, documented end-to-end in Jupyter."
  },
  {
    id: 5,
    company: "ERA AXIS",
    role: "LinkedIn Optimization & Research Intern",
    period: "2023",
    type: "Internship",
    description: "Market research and professional profile optimization to boost visibility, engagement, and reach."
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "FarmLink",
    description: "A mobile-first agricultural logistics and B2B marketplace connecting farmers directly with buyers — delivery tracking and dashboards included.",
    tech_stack: ["Vue.js", "B2B Marketplace", "Logistics"],
    repo_link: "https://github.com/hendrix-llouchi/FarmLink",
    demo_link: null,
    year: "2026"
  },
  {
    id: 2,
    title: "Valkyire",
    description: "A web tool that scans GitHub repos for vulnerable packages and insecure code, with AI-generated plain-English explanations and fixes.",
    tech_stack: ["C#", "AI Code Analysis"],
    repo_link: "https://github.com/hendrix-llouchi/Valkyire",
    demo_link: null,
    year: "2026"
  },
  {
    id: 3,
    title: "VisionLM",
    description: "A method-agnostic image analysis pipeline built for the GDSS Hackathon — automating Item Master Database cataloging with VLMs and OCR.",
    tech_stack: ["Python", "VLM", "OCR"],
    repo_link: "https://github.com/hendrix-llouchi/Vision-LM",
    demo_link: null,
    year: "2026"
  },
  {
    id: 4,
    title: "voltsnbits",
    description: "An editorial, conversion-focused marketing site for Volts&Bits — technical mentorship for final-year engineering and CS students.",
    tech_stack: ["React", "Vite", "Tailwind"],
    repo_link: "https://github.com/hendrix-llouchi/voltsnbits",
    demo_link: null,
    year: "2026"
  }
];

export const SKILLS: Skill[] = [
  { id: 1, name: "React", category: "Frontend", proficiency: 90 },
  { id: 2, name: "TypeScript", category: "Languages", proficiency: 88 },
  { id: 3, name: "Vue.js", category: "Frontend", proficiency: 88 },
  { id: 4, name: "Laravel", category: "Backend", proficiency: 85 },
  { id: 5, name: "React Native", category: "Mobile", proficiency: 82 },
  { id: 6, name: "Python", category: "Backend / AI", proficiency: 92 },
  { id: 7, name: "MySQL", category: "Database", proficiency: 85 },
  { id: 8, name: "Git", category: "Tools", proficiency: 90 },
];

export const CONTACT_INFO = {
  email: "henricobb2@gmail.com",
  phone: ["0537256750", "0508588389"],
  linkedin: "https://linkedin.com/in/henry-cobbinah",
  github: "https://github.com/henrycobbinah",
  location: "Greater Accra Region, Ghana"
};
