import plantDiseaseImage from '../assets/plant-disease.png';
import omvistaImage from '../assets/omvista.png';
import kickresumeImage from '../assets/kickresume.png';
import kickcrazeImage from '../assets/kickcraze.png';

// ============================================================
// portfolioData.js — Centralized configuration for SAMPRIT's Portfolio
// All external links, personal info, and content in one place.
// Update this file to change any content across the entire site.
// ============================================================

export const personalInfo = {
  name: "SAMPRIT MANDAL",
  firstName: "SAMPRIT",
  brandName: "SAMPRIT",
  title: "Next Gen AI/ML Innovator & Full Stack Developer",
  location: "Kolkata, India",
  phone: "+91-8910856627",
  emails: {
    primary: "Samprit.code@gmail.com",
    secondary: "",
  },
  summary:
    "Full Stack Developer and 3rd-year CSE (AI & ML) student passionate about Machine Learning, Deep Learning, and Web3 — building responsive, high-performance web applications and scalable backends with React, Node.js, and cutting-edge technologies.",
  resumeUrl: "Samprit_Resume.pdf",
};

export const socialLinks = {
  github: "https://github.com/ByteHacker01010101",
  linkedin: "https://www.linkedin.com/in/samprit-mandal-a339b9287/",
  website: "https://sampritdev.vercel.app/",
  instagram: null,
  tiktok: null,
  discord: null,
};

export const heroContent = {
  greeting: "Hi, I'm SAMPRIT",
  titleHighlight: "Next Gen AI/ML Innovator",
  rotatingTitles: [
    "Next Gen AI/ML Innovator",
    "AI/ML Enthusiast",
    "MERN Developer",
    "Web3 Explorer",
    "Open Source Contributor",
  ],
  subtitle:
    "I build responsive, high-performance interfaces and scalable backends — blending clean engineering with elegant design.",
  ctaPrimary: { text: "View My Work", href: "#projects" },
  ctaSecondary: {
    text: "Contact Me",
    href: "#contact",
  },
  ctaResume: { text: "View Resume", href: "Samprit_Resume.pdf" },
};

export const aboutContent = {
  heading: "Hello!",
  bio: `Hi, my name is <span class="text-slate-900 text-xl font-black mx-1 tracking-wide uppercase">SAMPRIT</span>. I'm a full-stack developer and AI/ML enthusiast who cares about building clear, useful, and refined digital products.`,
  techStack: ["React.js", "Node.js", "Python", "AI / ML"],
};

export const skillsContent = {
  badge: "MY PROCESS",
  heading: "How I Build",
  description:
    "From a simple idea to a polished digital experience — I combine development, design, and creative thinking at every stage.",
  cards: [
    {
      number: "01",
      title: "Understand",
      text: "I start by understanding the idea, the problem, and what the final experience should achieve. I break the idea into clear goals before writing code.",
      keywords: ["Idea", "Goals", "Requirements"],
      icon: "understand",
    },
    {
      number: "02",
      title: "Design",
      text: "I shape the experience before building it — thinking about layout, visual hierarchy, interactions, and responsive behavior. I use tools like Figma to explore and refine the interface.",
      keywords: ["UI/UX", "Figma", "Layout", "Interaction"],
      icon: "design",
    },
    {
      number: "03",
      title: "Build",
      text: "I turn the design into a real product using modern web technologies. I focus on clean structure, responsive interfaces, reusable components, and solving problems along the way.",
      keywords: ["Frontend", "Backend", "Components", "Code"],
      icon: "build",
    },
    {
      number: "04",
      title: "Refine",
      text: "After the first version works, I test, improve, polish the details, and make the experience feel smoother. I care about performance, responsiveness, animations, and the small details that make a product feel complete.",
      keywords: ["Testing", "Performance", "Animation", "Polish"],
      icon: "refine",
    },
  ],
};

// Brand New Technical Skills Data
export const technicalSkills = {
  categories: [
    {
      title: "Programming Languages",
      skills: [
        { name: "C++", level: 85 },
        { name: "Python", level: 90 },
        { name: "JavaScript", level: 92 },
        { name: "TypeScript", level: 85 },
        { name: "SQL", level: 82 }
      ]
    },
    {
      title: "Frontend",
      skills: [
        { name: "React.js", level: 92 },
        { name: "Next.js", level: 86 },
        { name: "Redux", level: 82 },
        { name: "Tailwind CSS", level: 88 },
        { name: "D3.js", level: 78 },
        { name: "HTML", level: 95 },
        { name: "CSS", level: 92 }
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Express.js", level: 88 },
        { name: "Flask", level: 80 },
        { name: "FastAPI", level: 82 },
        { name: "REST APIs", level: 90 }
      ]
    },
    {
      title: "Databases",
      skills: [
        { name: "MongoDB", level: 88 },
        { name: "PostgreSQL", level: 82 },
        { name: "MySQL", level: 84 },
        { name: "Firebase", level: 85 }
      ]
    },
    {
      title: "AI / ML",
      skills: [
        { name: "PyTorch", level: 85 },
        { name: "TensorFlow", level: 82 },
        { name: "OpenCV", level: 80 },
        { name: "Scikit-learn", level: 82 },
        { name: "RAG", level: 78 },
        { name: "Computer Vision", level: 80 }
      ]
    },
    {
      title: "Tools & Cloud",
      skills: [
        { name: "Git & GitHub", level: 90 },
        { name: "Docker", level: 82 },
        { name: "AWS", level: 78 },
        { name: "CI/CD", level: 78 },
        { name: "VS Code", level: 95 },
        { name: "Postman", level: 85 }
      ]
    },
    {
      title: "Computer Science Concepts",
      skills: [
        { name: "Data Structures", level: 90 },
        { name: "Algorithms", level: 86 },
        { name: "DBMS", level: 84 },
        { name: "OOP", level: 90 },
        { name: "Software Engineering", level: 85 }
      ]
    }
  ]
};

// Brand New Content Creation Data
export const contentCreation = {
  badge: "CREATIVE SIDE",
  heading: "Beyond Code",
  description: "I don't only build digital experiences — I also care about design, motion, visuals, and the details that give an idea its identity.",
  categories: [
    {
      title: "UI/UX Design",
      description: "I enjoy designing clean, modern interfaces where visual hierarchy, usability, and interaction work together. I use design to turn ideas into clear and engaging digital experiences.",
      practice: "DESIGN PRACTICE",
      tools: ["Figma", "UI/UX", "Visual Design"],
      icon: "design"
    },
    {
      title: "Motion & Animation",
      description: "I explore motion and animation to make digital experiences feel more alive. I enjoy working with transitions, timing, visual rhythm, and animated interactions.",
      practice: "MOTION PRACTICE",
      tools: ["After Effects", "Motion Design", "Animation", "Visual Effects"],
      icon: "motion"
    },
    {
      title: "Creative Editing",
      description: "Visual editing is another part of my creative workflow. I enjoy experimenting with composition, transitions, effects, and visual storytelling to give content a stronger identity.",
      practice: "EDITING PRACTICE",
      tools: ["Photoshop", "After Effects", "Creative Editing", "Visual Composition"],
      icon: "editing"
    },
    {
      title: "3D & Visualization",
      description: "I also explore 3D modeling, rendering, and visualization, combining technical thinking with visual creativity to build detailed and expressive scenes.",
      practice: "3D PRACTICE",
      tools: ["3D Modeling", "Rendering", "Visualization"],
      icon: "three-dimensional"
    },
    {
      title: "Code × Design",
      description: "I like working at the intersection of development and visual design — building functional products while paying attention to the interaction, motion, and details that make them feel polished.",
      practice: "MY APPROACH",
      tools: ["Web Development", "UI/UX", "Animation", "Creative Problem Solving"],
      icon: "code-design"
    }
  ]
};

// Beyond Code journey data
export const leadershipList = [
  {
    category: "EDUCATION",
    title: "Computer Science",
    description: "I'm pursuing B.Tech in Computer Science & Engineering (AI & ML) at Techno Bengal Institute of Technology, Kolkata, building a strong foundation in programming, problem solving, algorithms, data structures, databases, and software development.",
    label: "TECHNO BENGAL INSTITUTE OF TECHNOLOGY",
    motif: "brackets"
  },
  {
    category: "BUILDING",
    title: "Personal Projects",
    description: "I learn by building. My personal projects give me a space to experiment with ideas, improve my development skills, and turn concepts into real digital experiences.",
    label: "BUILD • LEARN • IMPROVE",
    link: "#projects",
    motif: "layers"
  },
  {
    category: "WORK",
    title: "Freelance Developer",
    description: "Working on real development tasks has helped me improve how I approach problems, implement features, fix issues, and turn requirements into working solutions.",
    label: "WEB DEVELOPMENT",
    motif: "cursor"
  },
  {
    category: "CREATIVE",
    title: "UI/UX & Visual Design",
    description: "I enjoy exploring UI/UX, visual composition, and interface design. I like turning ideas into clean, intuitive experiences where design and functionality work together.",
    tools: ["Figma", "UI/UX", "Visual Design"],
    motif: "layout"
  },
  {
    category: "MOTION",
    title: "Creative Editing & Motion",
    description: "I also explore creative editing, motion, transitions, and visual storytelling. It gives me another way to experiment with timing, composition, and interaction.",
    areas: ["After Effects", "Photoshop", "Motion", "Visual Editing"],
    motif: "motion"
  },
  {
    category: "EXPLORATION",
    title: "3D & Visualization",
    description: "I explore 3D modeling, rendering, and visualization as another part of my creative side, combining technical thinking with visual experimentation.",
    areas: ["3D Modeling", "Rendering", "Visualization"],
    motif: "cube"
  },
  {
    category: "GROWTH",
    title: "Always Learning",
    description: "I continuously explore new technologies, development techniques, design ideas, and creative tools. Learning, experimenting, and building are a constant part of my journey.",
    label: "LEARN → EXPERIMENT → BUILD",
    motif: "orbit"
  }
];

// Brand New Internships Data
export const internshipsList = [
  {
    organization: "Etailled Digital Services Private Limited",
    role: "Frontend Developer",
    duration: "Oct 2025 – Mar 2026 · Remote",
    skills: ["React Components", "UI / UX Implementation", "Web Performance", "Team Collaboration"],
    tech: ["React", "JavaScript", "CSS", "HTML", "Figma", "Git / GitHub"],
    badge: "Internship",
  },
  {
    organization: "Independent",
    role: "Personal Projects",
    duration: "2023 - Present",
    skills: ["Full Stack Development", "AI/ML Integration", "Frontend Development", "Problem Solving"],
    tech: ["React", "Node.js", "Python", "MongoDB", "Tailwind CSS"],
    badge: "Personal",
  },
  {
    organization: "Open Source",
    role: "Open Source Contributor",
    duration: "2024 - Present",
    skills: ["DSA Practice", "Code Quality", "Documentation", "Community Collaboration"],
    tech: ["Git", "GitHub", "C++", "Python"],
    badge: "Open Source",
  }
];

// Brand New Soft Skills Data
export const softSkillsList = [
  { name: "Leadership", icon: "leadership", desc: "Guiding teams, managing tasks, and driving project completion with shared vision." },
  { name: "Public Speaking", icon: "speaking", desc: "Confident stage presence, anchoring summits, and delivering articulate technical ideas." },
  { name: "Team Collaboration", icon: "collaboration", desc: "Collaborating across fields, building racing carts, and engineering code in sync." },
  { name: "Communication", icon: "communication", desc: "Clear, concise, and structured interactions in both business and technical contexts." },
  { name: "Problem Solving", icon: "problem-solving", desc: "Breaking down complex engineering tasks into clean, logical, and modular pieces." },
  { name: "Adaptability", icon: "adaptability", desc: "Quick to pick up new frameworks like FastAPI, Spring Boot, or automation tools like n8n." },
  { name: "Creativity", icon: "creativity", desc: "Blending cinematic aesthetics with software structure to build premium experiences." },
  { name: "Time Management", icon: "time", desc: "Balancing B.Tech studies, event hosting, and developing robust software platforms." }
];

export const projects = [
  {
    id: "plant-disease",
    number: "01",
    badge: "AI Research",
    title: "Plant Disease Detection (QCNN)",
    description:
      "A novel Quantum Convolutional Neural Network (QCNN) with Squeeze-and-Excitation blocks for plant disease detection using hyperspectral imaging — achieving 92% accuracy across multi-class disease classification and uncovering stress patterns invisible to traditional RGB imaging.",
    techTags: ["Python", "PyTorch", "Qiskit", "OpenCV"],
    image: plantDiseaseImage,
    links: {
      github: null,
      demo: null,
    },
    isFlagship: false,
  },
  {
    id: "omvista",
    number: "02",
    badge: "Heritage Tourism",
    title: "OmVista — Sikkim Heritage Tour",
    description:
      "OmVista is a digital heritage-tourism experience for exploring Sikkim — its culture, monasteries, and scenic destinations — through a clean, immersive interface. (Update this description with your project details.)",
    techTags: ["React", "JavaScript", "CSS3"],
    image: omvistaImage,
    links: {
      github: null,
      demo: null,
    },
    isFlagship: false,
  },
  {
    id: "kickresume",
    number: "03",
    badge: "Smart Resume Builder",
    title: "kickResume",
    description:
      "A full-stack resume builder with 10+ customizable templates, real-time preview, one-click PDF export, drag-and-drop editing, auto-save, and ATS-friendly parsing to optimize resume content for applicant tracking systems.",
    techTags: ["React", "Node.js", "TypeScript", "Express", "MongoDB"],
    image: kickresumeImage,
    links: {
      github: "https://github.com/ByteHacker01010101/Resume-builder",
      demo: "https://kickresume.vercel.app/",
    },
    isFlagship: true,
  },
  {
    id: "kickcraze",
    number: "04",
    badge: "E-Commerce",
    title: "KickCraze",
    description:
      "KickCraze is a modern commerce experience built around sneaker culture — combining product discovery with a clean, bold storefront interface. (Update this description with your project details.)",
    techTags: ["React", "JavaScript", "CSS3"],
    image: kickcrazeImage,
    links: {
      github: null,
      demo: null,
    },
    isFlagship: false,
  },
];

export const certificates = {
  featured: [],
  viewAllUrl: null,
};

export const education = {
  degree: "B.Tech – Computer Science & Engineering (AI & ML)",
  institution: "Techno Bengal Institute of Technology, Kolkata",
  cgpa: "",
  graduation: "2027",
  twelfth: "",
  tenth: "",
};

export const footerContent = {
  taglines: [
    "Full Stack Development & AI/ML",
    "React · Node.js · Python",
    "Scalable Web Applications",
  ],
  credential: "B.Tech CSE (AI & ML)",
  copyright: `© ${new Date().getFullYear()} SAMPRIT | Built with React`,
};

// EmailJS Configuration
// Will read directly from environment variables in Vite (starting with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
