import { Experience, Project, Skill } from './types';

export const PROFILE_INFO = {
  name: "Henry Cobbinah",
  firstName: "Henry",
  lastName: "Cobbinah",
  headline: "Software Engineer | Full-Stack & Mobile Dev",
  subHeadline: "Machine Learning • Data Science • AI",
  shortBio: "Building scalable web and mobile applications, clean data pipelines, and intelligent AI-powered solutions.",
  aboutParagraphs: [
    "I'm a Full-Stack and Mobile Developer with extensive experience in React, TypeScript, Vue.js, Laravel, and React Native, with a strong passion for Machine Learning, Data Science, and AI.",
    "I focus on creating high-performance, responsive software systems that seamlessly combine intuitive frontends with intelligent backends. Always learning, improving, and building."
  ],
  quote: "Building scalable apps and intelligent solutions."
};

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    company: "Npontu Technologies Limited",
    role: "Full-Stack Developer Intern",
    period: "2024",
    type: "Internship",
    description: "Developed and maintained web applications using Vue.js and Laravel, ensuring scalable architecture, clean API integration, and responsive design.",
    technologies: ["Vue.js", "Laravel", "MySQL", "Tailwind CSS", "REST APIs"]
  },
  {
    id: 2,
    company: "Anglogold",
    role: "Backend Developer Intern",
    period: "2023 - 2024",
    type: "Internship",
    description: "Focused on server-side logic, database management, and API optimization for enterprise-level mining software systems.",
    technologies: ["PHP", "Laravel", "SQL", "Database Optimization"]
  },
  {
    id: 3,
    company: "Go2Cod",
    role: "Data Science Intern",
    period: "2023",
    type: "Internship",
    description: "Analyzed complex datasets, built predictive models, and implemented machine learning workflows to derive actionable business insights.",
    technologies: ["Python", "Pandas", "Scikit-Learn", "Machine Learning"]
  },
  {
    id: 4,
    company: "ERA AXIS",
    role: "LinkedIn Optimization & Research Intern",
    period: "2023",
    type: "Internship",
    description: "Conducted market research and optimized professional profiles to enhance visibility, engagement, and reach.",
    technologies: ["Research", "Market Analytics", "Growth Strategy"]
  },
  {
    id: 5,
    company: "CODTECH",
    role: "Cybersecurity & Ethical Hacking Intern",
    period: "2022 - 2023",
    type: "Internship",
    description: "Explored vulnerability assessments, network defense mechanisms, and security protocols to fortify web applications against potential threats.",
    technologies: ["Vulnerability Assessment", "Network Defense", "Linux"]
  }
];

export const SKILLS: Skill[] = [
  { id: 1, name: "React", category: "Frontend", proficiency: 90 },
  { id: 2, name: "TypeScript", category: "Languages", proficiency: 88 },
  { id: 3, name: "HTML", category: "Frontend", proficiency: 95 },
  { id: 4, name: "CSS", category: "Frontend", proficiency: 95 },
  { id: 5, name: "Python", category: "Backend / AI", proficiency: 92 },
  { id: 6, name: "Laravel", category: "Backend", proficiency: 85 },
  { id: 7, name: "MySQL", category: "Database", proficiency: 85 },
  { id: 8, name: "Git", category: "Tools", proficiency: 90 },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Customer Churn Prediction",
    description: "A machine learning pipeline designed to predict customer attrition rates with high accuracy, enabling proactive retention interventions.",
    tech_stack: ["Python", "Scikit-Learn", "Pandas", "Jupyter"],
    repo_link: "https://github.com/henrycobbinah",
    demo_link: null
  },
  {
    id: 2,
    title: "Streamlit Data App",
    description: "Interactive data visualization dashboard for exploratory data analysis, dynamic charting, and statistical modeling.",
    tech_stack: ["Python", "Streamlit", "Plotly", "NumPy"],
    repo_link: "https://github.com/henrycobbinah",
    demo_link: null
  },
  {
    id: 3,
    title: "EducAid AI Quiz Generator",
    description: "An AI-powered application that generates dynamic educational quizzes and study materials from source text to supercharge revision.",
    tech_stack: ["OpenAI API", "Laravel", "Vue.js", "Tailwind CSS"],
    repo_link: "https://github.com/henrycobbinah",
    demo_link: null
  },
  {
    id: 4,
    title: "Data Cleaning Pipeline",
    description: "Automated data transformation scripts for cleaning, validating, and preprocessing messy unstructured datasets for analysis.",
    tech_stack: ["Python", "Pandas", "NumPy", "Data Preprocessing"],
    repo_link: "https://github.com/henrycobbinah",
    demo_link: null
  }
];

export const CONTACT_INFO = {
  email: "henricobb2@gmail.com",
  phone: ["0537256750", "0508588389"],
  linkedin: "https://linkedin.com/in/henry-cobbinah",
  github: "https://github.com/henrycobbinah",
  location: "Greater Accra Region, Ghana"
};