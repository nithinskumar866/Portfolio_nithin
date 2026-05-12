export const navLinks = [
  { id: "about", title: "About" },
  { id: "skills", title: "Skills" },
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
  { id: "certificates", title: "Certificates" },
  { id: "contact", title: "Contact" },
];

export const userInfo = {
  name: "Nithin S",
  role: "AI & Data Science Enthusiast",
  tagline: "Building intelligent solutions through data",
  description: "A versatile developer passionate about AI, Machine Learning, and creating impactful digital experiences. I transform complex problems into elegant solutions.",
  email: "nithinsofficial86@gmail.com",
  phone: "9025149983",
  location: "Coimbatore, India",
  links: {
    leetcode: "https://leetcode.com/u/nithinsofficial86/",
    linkedin: "https://linkedin.com/in/nithin-s-52292b278",
    github: "https://github.com/nithinskumar866",
    resume: "https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPQRsT123456789/view",
  },
  stats: [
    { label: "Projects", value: "15+" },
    { label: "Certifications", value: "12+" },
    { label: "Internships", value: "3" },
  ],
};

export const skills = [
  { name: "Python", icon: "py", level: 95, category: "Programming" },
  { name: "Machine Learning", icon: "ml", level: 90, category: "AI/ML" },
  { name: "SQL", icon: "sql", level: 85, category: "Database" },
  { name: "JavaScript", icon: "js", level: 80, category: "Programming" },
  { name: "Vue.js", icon: "vue", level: 78, category: "Framework" },
  { name: "Django", icon: "django", level: 85, category: "Framework" },
  { name: "Power BI", icon: "powerbi", level: 82, category: "Visualization" },
  { name: "LangChain", icon: "langchain", level: 75, category: "AI/ML" },
  { name: "Java", icon: "java", level: 70, category: "Programming" },
  { name: "Git", icon: "git", level: 88, category: "Tools" },
  { name: "Firebase", icon: "firebase", level: 75, category: "Backend" },
  { name: "Figma", icon: "figma", level: 72, category: "Design" },
];

export const experiences = [
  {
    title: "Blockchain Developer Intern",
    company: "VOIS (Vodafone - Idea)",
    duration: "Jan 2025 - Mar 2025",
    location: "Remote",
    description: "Developed a decentralized land registry system using Ethereum smart contracts. Implemented Solidity-based contracts to automate land registration with immutability and fraud prevention.",
    technologies: ["Solidity", "Ethereum", "Web3.js", "React"],
  },
  {
    title: "AI Engineer Intern",
    company: "CodeClause",
    duration: "Jan 2025 - Feb 2025",
    location: "Remote",
    description: "Built a Personality Prediction Model using NLP to analyze CVs and predict personality traits with 93% accuracy using spaCy and scikit-learn.",
    technologies: ["Python", "spaCy", "scikit-learn", "NLP"],
  },
  {
    title: "Machine Learning Intern",
    company: "Rius Technology",
    duration: "Aug 2023 - Oct 2023",
    location: "Bangalore",
    description: "Developed ML models for predicting couples' depression rates post-marriage achieving 98% accuracy through feature engineering and ensemble methods.",
    technologies: ["Python", "TensorFlow", "Pandas", "Scikit-learn"],
  },
];

export const projects = [
  {
    title: "Investo - Investor Matching Platform",
    description: "Full-stack Django application that matches investors with entrepreneurs based on interests, with real-time messaging and dashboard analytics.",
    tags: ["Django", "Python", "WebSocket", "PostgreSQL"],
    link: "https://github.com/nithinskumar866/investo",
    demo: "https://investo-demo.vercel.app",
    featured: true,
  },
  {
    title: "AI Homework System (LangChain)",
    description: "AI-powered system that analyzes tutors' notes and textbook content to automatically generate homework assignments with smart prompting.",
    tags: ["LangChain", "OpenAI", "Python", "FastAPI"],
    link: "https://github.com/nithinskumar866/ai-homework",
    demo: "https://ai-homework.vercel.app",
    featured: true,
  },
  {
    title: "Linkbery - Course Aggregator",
    description: "Unified platform scraping courses from Coursera, Udemy, and more, with Firebase backend for dynamic content and category filtering.",
    tags: ["JavaScript", "Firebase", "Web Scraping", "React"],
    link: "https://github.com/nithinskumar866/linkbery",
    demo: "https://linkbery.vercel.app",
    featured: false,
  },
  {
    title: "ML Model Repository",
    description: "Comprehensive collection of 15 ML models covering classification, regression, clustering, and dimensionality reduction with hyperparameter tuning.",
    tags: ["Python", "Scikit-learn", "Pandas", "NumPy"],
    link: "https://github.com/nithinskumar866/ml-models",
    demo: null,
    featured: false,
  },
  {
    title: "Portfolio Website",
    description: "Modern portfolio showcasing projects and skills with authentication, project management, and interactive 3D elements.",
    tags: ["Vue.js", "Django REST", "Three.js", "PostgreSQL"],
    link: "https://github.com/nithinskumar866/portfolio",
    demo: null,
    featured: false,
  },
];

export const certificates = [
  {
    name: "Professional Data Scientist (Power BI)",
    issuer: "DataCamp",
    date: "2024",
    credentialId: "DC-PDS-2024-1234",
    url: "https://www.datacamp.com/certificate/professional-data-scientist-powerbi",
  },
  {
    name: "IBM AI Engineering Professional",
    issuer: "IBM",
    date: "2024",
    credentialId: "IBM-AI-ENG-2024-5678",
    url: "https://www.ibm.com/certify/professional-certificates/ai-engineering",
  },
  {
    name: "Complete JavaScript & React",
    issuer: "Udemy",
    date: "2024",
    credentialId: "UD-JS-2024-9012",
    url: "https://www.udemy.com/certificate/uc-javascript-react",
  },
  {
    name: "Associate Data Scientist",
    issuer: "DataCamp",
    date: "2024",
    credentialId: "DC-ADS-2024-3456",
    url: "https://www.datacamp.com/certificate/associate-data-scientist",
  },
  {
    name: "Java DSA Mastery",
    issuer: "Udemy",
    date: "2023",
    credentialId: "UD-DSA-2023-7890",
    url: "https://www.udemy.com/certificate/uc-java-dsa",
  },
  {
    name: "Django Full Stack Web Development",
    issuer: "Udemy",
    date: "2023",
    credentialId: "UD-DJ-2023-2345",
    url: "https://www.udemy.com/certificate/uc-django-full-stack",
  },
  {
    name: "Zero to Hero in LangChain",
    issuer: "Udemy",
    date: "2024",
    credentialId: "UD-LC-2024-6789",
    url: "https://www.udemy.com/certificate/uc-langchain-zero-to-hero",
  },
  {
    name: "Data Scientist Professional",
    issuer: "DataCamp",
    date: "2024",
    credentialId: "DC-DSP-2024-0123",
    url: "https://www.datacamp.com/certificate/data-scientist-professional",
  },
];

export const achievements = [
  "🏆 Achieved 98% accuracy in ML model for depression prediction",
  "📜 Developed decentralized land registry on Ethereum blockchain",
  "🤖 Built NLP model with 93% personality prediction accuracy",
  "💻 Completed 12+ professional certifications in AI/ML & Development",
];