import { Experience, Project, Skill } from './types';
import { 
  Code2, 
  Database, 
  BrainCircuit, 
  Layout, 
  Terminal, 
  ShieldCheck, 
  GraduationCap
} from 'lucide-react';

export const EXPERIENCES: Experience[] = [
  {
    company: "Npontu Technologies Limited",
    role: "Full-Stack Developer Intern",
    type: "Internship",
    description: "Developed and maintained web applications using Vue.js and Laravel, ensuring scalable architecture and responsive design."
  },
  {
    company: "Anglogold",
    role: "Backend Developer Intern",
    type: "Internship",
    description: "Focused on server-side logic, database management, and API optimization for enterprise-level mining software systems."
  },
  {
    company: "Go2Cod",
    role: "Data Science Intern",
    type: "Internship",
    description: "Analyzed complex datasets and built predictive models to derive actionable business insights."
  },
  {
    company: "ERA AXIS",
    role: "LinkedIn Optimization & Research Intern",
    type: "Internship",
    description: "Conducted market research and optimized professional profiles to enhance visibility and engagement."
  },
  {
    company: "CODTECH",
    role: "Cybersecurity & Ethical Hacking Intern",
    type: "Internship",
    description: "Explored vulnerability assessments and security protocols to fortify applications against potential threats."
  }
];

export const EDUCATION_PROJECTS: Experience[] = [
    {
        company: "EducAid",
        role: "AI Quiz Generator",
        type: "Project",
        description: "A school project utilizing Artificial Intelligence to generate dynamic quizzes for students, enhancing the learning process."
    }
];

export const SKILLS: Skill[] = [
  { name: "Vue.js", category: "Frontend", level: 90 },
  { name: "React Native", category: "Frontend", level: 85 },
  { name: "React", category: "Frontend", level: 85 },
  { name: "Tailwind CSS", category: "Frontend", level: 95 },
  { name: "Laravel", category: "Backend", level: 88 },
  { name: "Python", category: "Backend", level: 92 },
  { name: "MySQL", category: "Backend", level: 85 },
  { name: "Machine Learning", category: "Data/AI", level: 80 },
  { name: "Data Science", category: "Data/AI", level: 82 },
  { name: "Git", category: "Tools", level: 90 },
];

export const PROJECTS: Project[] = [
  {
    title: "Customer Churn Prediction",
    description: "A machine learning model designed to predict customer attrition rates, allowing businesses to take proactive retention measures.",
    techStack: ["Python", "Scikit-Learn", "Pandas", "Jupyter"]
  },
  {
    title: "Streamlit Data App",
    description: "Interactive web application for data visualization and exploratory data analysis built with Streamlit.",
    techStack: ["Python", "Streamlit", "Plotly"]
  },
  {
    title: "EducAid AI Quiz Generator",
    description: "An AI-powered platform that automatically generates educational quizzes from source text to aid student revision.",
    techStack: ["OpenAI API", "Laravel", "Vue.js"]
  },
  {
    title: "Data Cleaning Pipeline",
    description: "Automated scripts for cleaning and preprocessing messy datasets for analysis readiness.",
    techStack: ["Python", "Pandas", "NumPy"]
  }
];

export const CONTACT_INFO = {
  email: "henricobb2@gmail.com",
  phone: ["0537256750", "0508588389"],
  linkedin: "https://linkedin.com/in/henry-cobbinah",
  github: "https://github.com/henrycobbinah", // Assumed based on naming convention
  location: "Greater Accra Region, Ghana"
};