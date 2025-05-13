import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import './App.css';

interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    link: string;
    type: 'web' | 'mobile' | 'desktop';
}

interface Skill {
    name: string;
    level: number;
    category: 'language' | 'framework' | 'tool';
}

const Portfolio = () => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'mobile' | 'desktop'>('all');
    const [typedText, setTypedText] = useState('');
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);
    const [activeProject, setActiveProject] = useState<number | null>(null);

    const texts = useMemo(
        () => ["Web Developer", "Mobile Developer", "Full-Stack Engineer", "UI/UX Enthusiast"],
        []
    );
    const projects: Project[] = [
        {
            id: 1,
            title: "E-Commerce Mobile App",
            description: "A cross-platform mobile application for e-commerce with real-time inventory management and payment integration.",
            image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            tags: ["React Native", "Firebase", "Redux", "Stripe"],
            link: "#",
            type: 'mobile'
        },
        {
            id: 2,
            title: "Healthcare Management System",
            description: "A comprehensive web-based healthcare management system for clinics with patient records and appointment scheduling.",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            tags: ["React", "Node.js", "MongoDB", "GraphQL"],
            link: "#",
            type: 'web'
        },
        {
            id: 3,
            title: "Desktop Productivity Suite",
            description: "A cross-platform desktop application for productivity with note-taking, task management, and calendar integration.",
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            tags: ["Electron", "TypeScript", "SQLite", "React"],
            link: "#",
            type: 'desktop'
        },
        {
            id: 4,
            title: "Fitness Tracking App",
            description: "Mobile application for fitness tracking with workout plans, progress analytics, and social features.",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            tags: ["Flutter", "Dart", "Firebase", "Google Fit API"],
            link: "#",
            type: 'mobile'
        },
        {
            id: 5,
            title: "AI-Powered Chat Platform",
            description: "Web-based chat application with AI moderation and smart reply suggestions.",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            tags: ["Vue.js", "Python", "TensorFlow", "WebSockets"],
            link: "#",
            type: 'web'
        },
        {
            id: 6,
            title: "Inventory Management System",
            description: "Desktop application for small business inventory management with barcode scanning.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            tags: [".NET", "C#", "SQL Server", "WPF"],
            link: "#",
            type: 'desktop'
        }
    ];

    const skills: Skill[] = [
        { name: "JavaScript/TypeScript", level: 95, category: 'language' },
        { name: "Python", level: 85, category: 'language' },
        { name: "Dart", level: 80, category: 'language' },
        { name: "Java/Kotlin", level: 75, category: 'language' },
        { name: "Swift", level: 70, category: 'language' },
        { name: "React/React Native", level: 90, category: 'framework' },
        { name: "Flutter", level: 85, category: 'framework' },
        { name: "Node.js", level: 88, category: 'framework' },
        { name: ".NET", level: 75, category: 'framework' },
        { name: "Vue.js", level: 80, category: 'framework' },
        { name: "Git", level: 90, category: 'tool' },
        { name: "Docker", level: 85, category: 'tool' },
        { name: "AWS", level: 80, category: 'tool' },
        { name: "Firebase", level: 85, category: 'tool' },
        { name: "CI/CD", level: 80, category: 'tool' }
    ];

    // Typing effect
    useEffect(() => {
        const type = () => {
            const currentText = texts[currentTextIndex];

            if (isDeleting) {
                setTypedText(currentText.substring(0, typedText.length - 1));
                setTypingSpeed(50);
            } else {
                setTypedText(currentText.substring(0, typedText.length + 1));
                setTypingSpeed(150);
            }

            if (!isDeleting && typedText === currentText) {
                setTimeout(() => setIsDeleting(true), 1000);
            } else if (isDeleting && typedText === '') {
                setIsDeleting(false);
                setCurrentTextIndex((currentTextIndex + 1) % texts.length);
                setTypingSpeed(500);
            }
        };

        const timer = setTimeout(type, typingSpeed);
        return () => clearTimeout(timer);
    }, [typedText, currentTextIndex, isDeleting, typingSpeed, texts]);

    // Scroll animations
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    // In-view animations
    const projectRef = useRef(null);
    const isProjectInView = useInView(projectRef, { once: true, amount: 0.1 });

    const skillRef = useRef(null);
    const isSkillInView = useInView(skillRef, { once: true, amount: 0.1 });

    const aboutRef = useRef(null);
    const isAboutInView = useInView(aboutRef, { once: true, amount: 0.1 });

    const contactRef = useRef(null);
    const isContactInView = useInView(contactRef, { once: true, amount: 0.1 });

  const ProgressBar = ({ skill }: { skill: Skill }) => (
    <div className="skill-item">
        <div className="skill-header">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-level">{skill.level}%</span>
        </div>
        <div className="progress-bar">
            <motion.div
                className="progress-fill"
                style={{ 
                    width: `${skill.level}%`,
                    backgroundColor: getSkillColor(skill.category)
                }}
            />
        </div>
    </div>
);

    const getSkillColor = (category: string) => {
        switch (category) {
            case 'language': return '#4f46e5';
            case 'framework': return '#10b981';
            case 'tool': return '#f59e0b';
            default: return '#6366f1';
        }
    };

    const getProjectTypeColor = (type: string) => {
        switch (type) {
            case 'web': return 'bg-blue-100 text-blue-800';
            case 'mobile': return 'bg-purple-100 text-purple-800';
            case 'desktop': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(project => project.type === activeFilter);

    return (
        <div className="portfolio-container" ref={ref}>
            {/* Floating Navigation */}
            <motion.div
                className={`floating-nav-container ${isNavExpanded ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            >
                <motion.button
                    className="floating-nav-toggle"
                    onClick={() => setIsNavExpanded(!isNavExpanded)}
                    aria-label="Toggle navigation"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isNavExpanded ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </motion.button>

                <motion.nav
                    className="floating-nav"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isNavExpanded ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <ul className="nav-links">
                        <li>
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a href="#home" className="nav-link" onClick={() => setIsNavExpanded(false)}>Home</a>
                            </motion.div>
                        </li>
                        <li>
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a href="#projects" className="nav-link" onClick={() => setIsNavExpanded(false)}>Projects</a>
                            </motion.div>
                        </li>
                        <li>
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a href="#skills" className="nav-link" onClick={() => setIsNavExpanded(false)}>Skills</a>
                            </motion.div>
                        </li>
                        <li>
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a href="#about" className="nav-link" onClick={() => setIsNavExpanded(false)}>About</a>
                            </motion.div>
                        </li>
                        <li>
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a href="#contact" className="nav-link" onClick={() => setIsNavExpanded(false)}>Contact</a>
                            </motion.div>
                        </li>
                    </ul>
                </motion.nav>
            </motion.div>

            {/* Hero Section */}
            <section id="home" className="hero-section">
                <motion.div
                    className="hero-bg"
                    style={{ y: yBg }}
                />
                <div className="hero-content">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="hero-title">
                            <motion.span
                                className="greeting"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                Hi, I'm
                            </motion.span>
                            <motion.span
                                className="name"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                Preet
                            </motion.span>
                        </h1>
                        <h2 className="hero-subtitle">
                            <span className="typing-text">{typedText}</span>
                            <span className="typing-cursor">|</span>
                        </h2>
                        <motion.p
                            className="hero-description"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            I build exceptional digital experiences across web, mobile, and desktop platforms.
                            Focused on clean code, intuitive interfaces, and scalable solutions.
                        </motion.p>
                        <motion.div
                            className="hero-buttons"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1 }}
                        >
                            <motion.a
                                href="#projects"
                                className="btn-primary"
                                whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(79, 70, 229, 0.3)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                View My Work
                                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="#contact"
                                className="btn-secondary"
                                whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(79, 70, 229, 0.1)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Contact Me
                                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </motion.a>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="hero-image"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="image-wrapper">
                            <motion.div
                                className="profile-image-placeholder"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            />
                            <motion.div
                                className="tech-bubble bubble-1"
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, 5, 0]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <span>React</span>
                            </motion.div>
                            <motion.div
                                className="tech-bubble bubble-2"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, -5, 0]
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    delay: 1,
                                    ease: "easeInOut"
                                }}
                            >
                                <span>Flutter</span>
                            </motion.div>
                            <motion.div
                                className="tech-bubble bubble-3"
                                animate={{
                                    y: [0, -25, 0],
                                    rotate: [0, 8, 0]
                                }}
                                transition={{
                                    duration: 7,
                                    repeat: Infinity,
                                    delay: 0.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <span>.NET</span>
                            </motion.div>
                            <motion.div
                                className="tech-bubble bubble-4"
                                animate={{
                                    y: [0, -18, 0],
                                    rotate: [0, -3, 0]
                                }}
                                transition={{
                                    duration: 6.5,
                                    repeat: Infinity,
                                    delay: 1.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <span>Node.js</span>
                            </motion.div>
                            <motion.div
                                className="tech-bubble bubble-5"
                                animate={{
                                    y: [0, -22, 0],
                                    rotate: [0, 7, 0]
                                }}
                                transition={{
                                    duration: 5.5,
                                    repeat: Infinity,
                                    delay: 0.8,
                                    ease: "easeInOut"
                                }}
                            >
                                <span>Angular</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    className="hero-scroll-indicator"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span>Scroll Down</span>
                    <svg className="scroll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7-7H3"></path>
                    </svg>
                </motion.div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="section projects-section" ref={projectRef}>
                <div className="section-container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isProjectInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title">My Projects</h2>
                        <p className="section-subtitle">A selection of my recent work across platforms</p>
                        <div className="project-filters">
                            <motion.button
                                onClick={() => setActiveFilter('all')}
                                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >All</motion.button>
                            <motion.button
                                className={`filter-btn ${activeFilter === 'mobile' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('mobile')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >Mobile</motion.button>
                            <motion.button
                                className={`filter-btn ${activeFilter === 'web' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('web')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >Web</motion.button>
                            <motion.button
                                className={`filter-btn ${activeFilter === 'desktop' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('desktop')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >Desktop</motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="projects-grid"
                        initial={{ opacity: 0 }}
                        animate={isProjectInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <AnimatePresence>
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    className="project-card"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={isProjectInView ? {
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: index * 0.1 }
                                    } : {}}
                                    whileHover={{ y: -10 }}
                                    onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
                                    layout
                                >
                                    <div className="project-image-container">
                                        <motion.img
                                            src={project.image}
                                            alt={project.title}
                                            className="project-image"
                                            loading="lazy"
                                            layoutId={`project-image-${project.id}`}
                                        />
                                        <div className={`project-type-badge ${getProjectTypeColor(project.type)}`}>
                                            {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                                        </div>
                                    </div>
                                    <div className="project-content">
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-description">{project.description}</p>
                                        <div className="project-tags">
                                            {project.tags.map((tag, index) => (
                                                <motion.span
                                                    key={index}
                                                    className="project-tag"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    {tag}
                                                </motion.span>
                                            ))}
                                        </div>
                                        <div className="project-actions">
                                            <motion.a
                                                href={project.link}
                                                className="project-link"
                                                whileHover={{ x: 5 }}
                                            >
                                                View Project
                                                <svg className="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                </svg>
                                            </motion.a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="section skills-section" ref={skillRef}>
                <div className="section-container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isSkillInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title">Technical Skills</h2>
                        <p className="section-subtitle">My toolkit for building exceptional software</p>
                    </motion.div>

                    <motion.div
                        className="skills-container"
                        initial={{ opacity: 0 }}
                        animate={isSkillInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            className="skills-category"
                            initial={{ opacity: 0, x: -50 }}
                            animate={isSkillInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="skills-category-title">
                                <svg className="category-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                </svg>
                                Languages
                            </h3>
                            <div className="skills-list">
                                {skills.filter(s => s.category === 'language').map((skill, index) => (
                                    <ProgressBar key={`lang-${index}`} skill={skill} />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="skills-category"
                            initial={{ opacity: 0, y: 50 }}
                            animate={isSkillInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="skills-category-title">
                                <svg className="category-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                                Frameworks
                            </h3>
                            <div className="skills-list">
                                {skills.filter(s => s.category === 'framework').map((skill, index) => (
                                    <ProgressBar key={`frame-${index}`} skill={skill} />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="skills-category"
                            initial={{ opacity: 0, x: 50 }}
                            animate={isSkillInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <h3 className="skills-category-title">
                                <svg className="category-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                Tools & Platforms
                            </h3>
                            <div className="skills-list">
                                {skills.filter(s => s.category === 'tool').map((skill, index) => (
                                    <ProgressBar key={`tool-${index}`} skill={skill} />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="section about-section" ref={aboutRef}>
                <div className="section-container">
                    <motion.div
                        className="about-content"
                        initial={{ opacity: 0 }}
                        animate={isAboutInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="about-text"
                            initial={{ opacity: 0, x: -50 }}
                            animate={isAboutInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="section-header">
                                <h2 className="section-title">About Me</h2>
                                <p className="section-subtitle">My journey in software development</p>
                            </div>

                            <div className="about-paragraphs">
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    I'm a passionate full-stack developer with 2+ years of experience building applications across web, mobile, and desktop platforms.
                                    My expertise spans the entire development lifecycle from concept to deployment.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    I specialize in creating cross-platform solutions that deliver seamless user experiences regardless of device.
                                    My background includes working with startups and enterprises to build scalable, maintainable software.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    What sets me apart is my ability to bridge the gap between technical implementation and business needs.
                                    I don't just write code—I solve problems and create value through technology.
                                </motion.p>
                            </div>

                            <motion.div
                                className="experience-stats"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <motion.div
                                    className="stat-item"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="stat-number">50+</div>
                                    <div className="stat-label">Projects Completed</div>
                                </motion.div>
                                <motion.div
                                    className="stat-item"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="stat-number">2</div>
                                    <div className="stat-label">Years Experience</div>
                                </motion.div>
                                <motion.div
                                    className="stat-item"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="stat-number">15+</div>
                                    <div className="stat-label">Technologies Mastered</div>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="about-timeline"
                            initial={{ opacity: 0, x: 50 }}
                            animate={isAboutInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <motion.div
                                className="timeline-item"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <div className="timeline-date">2021 - Present</div>
                                <div className="timeline-content">
                                    <h4 className="timeline-title">Senior Software Developer</h4>
                                    <p className="timeline-company">TechSolutions Inc.</p>
                                    <p className="timeline-description">
                                        Lead cross-platform development team building enterprise applications for Fortune 500 clients.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="timeline-item"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <div className="timeline-date">2018 - 2021</div>
                                <div className="timeline-content">
                                    <h4 className="timeline-title">Mobile App Developer</h4>
                                    <p className="timeline-company">Digital Innovations LLC</p>
                                    <p className="timeline-description">
                                        Developed and published 12+ mobile applications with over 1M combined downloads.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="timeline-item"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <div className="timeline-date">2015 - 2018</div>
                                <div className="timeline-content">
                                    <h4 className="timeline-title">Junior Web Developer</h4>
                                    <p className="timeline-company">WebCraft Studios</p>
                                    <p className="timeline-description">
                                        Built responsive web applications and e-commerce solutions for small businesses.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="section contact-section" ref={contactRef}>
                <div className="section-container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title">Get In Touch</h2>
                        <p className="section-subtitle">Have a project in mind or want to connect?</p>
                    </motion.div>

                    <motion.div
                        className="contact-content"
                        initial={{ opacity: 0 }}
                        animate={isContactInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            className="contact-form-container"
                            initial={{ opacity: 0, x: -50 }}
                            animate={isContactInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <form className="contact-form">
                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <label htmlFor="name" className="form-label">Your Name</label>
                                    <input type="text" id="name" className="form-input" placeholder="Preet" />
                                </motion.div>
                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input type="email" id="email" className="form-input" placeholder="brarpritam001@gmail.com" />
                                </motion.div>
                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <label htmlFor="subject" className="form-label">Subject</label>
                                    <input type="text" id="subject" className="form-input" placeholder="Project Inquiry" />
                                </motion.div>
                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea id="message" rows={5} className="form-input" placeholder="Tell me about your project..."></textarea>
                                </motion.div>
                                <motion.button
                                    type="submit"
                                    className="submit-btn"
                                    whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(79, 70, 229, 0.3)" }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    Send Message
                                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                </motion.button>
                            </form>
                        </motion.div>

                        <motion.div
                            className="contact-info-container"
                            initial={{ opacity: 0, x: 50 }}
                            animate={isContactInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="contact-info-card">
                                <h3 className="contact-info-title">Contact Information</h3>
                                <p className="contact-info-text">
                                    Feel free to reach out for project inquiries, collaboration opportunities, or just to say hello!
                                </p>

                                <div className="contact-methods">
                                    <motion.div
                                        className="contact-method"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                    >
                                        <div className="contact-icon">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <div className="contact-details">
                                            <h4 className="contact-method-title">Email</h4>
                                            <a href="mailto:brarpritam001@gmail.com.com" className="contact-method-value">brarpritam001@gmail.com</a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="contact-method"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                    >
                                        <div className="contact-icon">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                            </svg>
                                        </div>
                                        <div className="contact-details">
                                            <h4 className="contact-method-title">Phone</h4>
                                            <a href="tel:+918059366488" className="contact-method-value">+91 80593-66488</a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="contact-method"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.7 }}
                                    >
                                        <div className="contact-icon">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                        </div>
                                        <div className="contact-details">
                                            <h4 className="contact-method-title">Location</h4>
                                            <span className="contact-method-value">Haryana (Panipat)</span>
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div
                                    className="social-links"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isContactInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    <motion.a
                                        href="https://github.com/brarpritam001"
                                        className="social-link"
                                        aria-label="GitHub"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -5, scale: 1.1 }}
                                    >
                                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10.02 10.02 0 0022 12C22 6.477 17.523 2 12 2z"></path>
                                        </svg>
                                    </motion.a>
                                    <motion.a
                                        href="https://in.linkedin.com/"
                                        className="social-link"
                                        aria-label="LinkedIn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -5, scale: 1.1 }}
                                    >
                                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                                        </svg>
                                    </motion.a>
                                    <motion.a
                                        href="https://x.com/"
                                        className="social-link"
                                        aria-label="Twitter"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -5, scale: 1.1 }}
                                    >
                                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                                        </svg>
                                    </motion.a>
                                    <motion.a
                                        href="https://stackoverflow.com/"
                                        className="social-link"
                                        aria-label="Stack Overflow"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -5, scale: 1.1 }}
                                    >
                                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.189.451-2.07-10.478-2.187-.453 2.068zm1.359-5.056l9.705 4.53.903-1.95-9.706-4.53-.902 1.936v.014zm2.715-4.785l8.217 6.855 1.359-1.62-8.216-6.853-1.35 1.617-.01.003zM15.751 0l-1.746 1.294 6.405 8.604 1.746-1.294L15.749 0h.002z"></path>
                                        </svg>
                                    </motion.a>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h2 className="footer-logo">Preet</h2>
                            <p className="footer-tagline">Web & Mobile App Developer</p>
                        </div>

                        <div className="footer-links">
                            <div className="footer-link-group">
                                <h3 className="footer-link-title">Navigation</h3>
                                <ul className="footer-link-list">
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#home" className="footer-link">Home</a>
                                        </motion.div>
                                    </li>
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#projects" className="footer-link">Projects</a>
                                        </motion.div>
                                    </li>
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#skills" className="footer-link">Skills</a>
                                        </motion.div>
                                    </li>
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#about" className="footer-link">About</a>
                                        </motion.div>
                                    </li>
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#contact" className="footer-link">Contact</a>
                                        </motion.div>
                                    </li>
                                </ul>
                            </div>

                            <div className="footer-link-group">
                                <h3 className="footer-link-title">Services</h3>
                                <ul className="footer-link-list">
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#projects" className="footer-link">Mobile App Development</a>
                                        </motion.div>
                                    </li>
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#projects" className="footer-link">Web Development</a>
                                        </motion.div>
                                    </li>
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#projects" className="footer-link">Desktop Applications</a>
                                        </motion.div>
                                    </li>
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#projects" className="footer-link">UI/UX Design</a>
                                        </motion.div>
                                    </li>
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#projects" className="footer-link">Consulting</a>
                                        </motion.div>
                                    </li>
                                </ul>
                            </div>

                            <div className="footer-link-group">
                                <h3 className="footer-link-title">Legal</h3>
                                <ul className="footer-link-list">
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#" className="footer-link">Privacy Policy</a>
                                        </motion.div>
                                    </li>
                                    <li>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <a href="#" className="footer-link">Terms of Service</a>
                                        </motion.div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="copyright">
                            © {new Date().getFullYear()} Preet. All rights reserved.
                        </div>

                        <div className="footer-social-links">
                            <motion.a
                                href="https://github.com/brarpritam001"
                                className="social-link"
                                aria-label="GitHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -5, scale: 1.1 }}
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10.02 10.02 0 0022 12C22 6.477 17.523 2 12 2z"></path>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="https://in.linkedin.com/"
                                className="social-link"
                                aria-label="LinkedIn"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -5, scale: 1.1 }}
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="https://x.com/"
                                className="social-link"
                                aria-label="Twitter"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -5, scale: 1.1 }}
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                                </svg>
                            </motion.a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Portfolio;