import { useState, useEffect, useRef } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Code2,
  Terminal,
  Trophy,
  Zap,
  Sun,
  Moon,
  Play,
  Pause,
} from "lucide-react";
import * as THREE from "three";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState([]);
  const [game3DActive, setGame3DActive] = useState(false);
  const [codingGameActive, setCodingGameActive] = useState(false);
  const [codingScore, setCodingScore] = useState(0);
  const [codingLevel, setCodingLevel] = useState(1);
  const [currentCode, setCurrentCode] = useState("");
  const [targetCode, setTargetCode] = useState("");
  const [codingTimeLeft, setCodingTimeLeft] = useState(60);
  const [codingGameStarted, setCodingGameStarted] = useState(false);
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [memoryScore, setMemoryScore] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryGameStarted, setMemoryGameStarted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const textMeshRef = useRef(null);
  const animationRef = useRef(null);

  // Mini game logic
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = ["home", "about", "skills", "projects", "game", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTargets((prev) => {
          const filtered = prev.filter((t) => Date.now() - t.id < 1500);
          return [
            ...filtered,
            {
              id: Date.now(),
              x: Math.random() * 75 + 5,
              y: Math.random() * 70 + 10,
            },
          ].slice(-5);
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setTargets([]);
    }
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
  };

  const hitTarget = (id) => {
    setScore((prev) => prev + 10);
    setTargets((prev) => prev.filter((t) => t.id !== id));
  };

  // Coding Game Logic
  const codeSnippets = [
    { code: "const x = 10;", level: 1 },
    { code: "function add(a, b) { return a + b; }", level: 1 },
    { code: "const arr = [1, 2, 3];", level: 1 },
    { code: "if (x > 5) { console.log('yes'); }", level: 2 },
    { code: "for (let i = 0; i < 10; i++) { }", level: 2 },
    { code: "const obj = { name: 'Taha', age: 25 };", level: 2 },
    { code: "array.map(item => item * 2)", level: 3 },
    { code: "async function fetchData() { await fetch(); }", level: 3 },
    { code: "const [state, setState] = useState(0);", level: 3 },
    { code: "Promise.all([p1, p2]).then(res => res)", level: 4 },
    { code: "export default function Component() { }", level: 4 },
  ];

  useEffect(() => {
    if (codingGameStarted && codingTimeLeft > 0) {
      const timer = setTimeout(() => setCodingTimeLeft(codingTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (codingTimeLeft === 0) {
      setCodingGameStarted(false);
    }
  }, [codingGameStarted, codingTimeLeft]);

  const startCodingGame = () => {
    setCodingGameStarted(true);
    setCodingScore(0);
    setCodingLevel(1);
    setCodingTimeLeft(60);
    setCurrentCode("");
    generateNewCode();
  };

  const generateNewCode = () => {
    const validSnippets = codeSnippets.filter(s => s.level === codingLevel);
    if (validSnippets.length > 0) {
      const snippet = validSnippets[Math.floor(Math.random() * validSnippets.length)];
      setTargetCode(snippet.code);
      setCurrentCode("");
    }
  };

  const checkCode = () => {
    if (currentCode.trim() === targetCode.trim()) {
      const points = codingLevel * 20;
      setCodingScore(prev => prev + points);
      if (codingScore >= codingLevel * 100 && codingLevel < 4) {
        setCodingLevel(prev => prev + 1);
      }
      generateNewCode();
    }
  };

  // Memory Game Logic
  const techIcons = ["⚛️", "🎨", "💾", "🔧", "🐍", "🌐", "📱", "💻"];
  
  const startMemoryGame = () => {
    const shuffled = [...techIcons, ...techIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, matched: false }));
    setMemoryCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryScore(0);
    setMemoryMoves(0);
    setMemoryGameStarted(true);
  };

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      
      if (memoryCards[first].icon === memoryCards[second].icon) {
        setMatchedCards(prev => [...prev, first, second]);
        setMemoryScore(prev => prev + 50);
        setFlippedCards([]);
        
        if (matchedCards.length + 2 === memoryCards.length) {
          setTimeout(() => setMemoryGameStarted(false), 1000);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 800);
      }
    }
  };

  // 3D Game Setup
  useEffect(() => {
    if (!game3DActive || !mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0x0a0a1a, 1);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Add starfield background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create 3D Text using shapes
    const createTextGeometry = () => {
      const textGroup = new THREE.Group();

      // Create simple box letters for "TAHA BOULHAK"
      const letterGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.3,
        shininess: 100,
      });

      const letters = [
        { x: -4, text: "T" },
        { x: -3, text: "A" },
        { x: -2, text: "H" },
        { x: -1, text: "A" },
        { x: 1, text: "B" },
        { x: 2, text: "O" },
        { x: 3, text: "U" },
        { x: 4, text: "L" },
      ];

      letters.forEach((letter, i) => {
        const mesh = new THREE.Mesh(letterGeometry, material.clone());
        mesh.position.x = letter.x * 0.7;
        mesh.userData.originalY = 0;
        mesh.userData.phase = i * 0.5;
        textGroup.add(mesh);
      });

      return textGroup;
    };

    const textMesh = createTextGeometry();
    scene.add(textMesh);
    textMeshRef.current = textMesh;

    camera.position.z = 8;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Animation
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Rotate and animate text
      if (textMeshRef.current) {
        textMeshRef.current.rotation.y += 0.005;
        textMeshRef.current.children.forEach((letter, i) => {
          letter.position.y =
            Math.sin(Date.now() * 0.002 + letter.userData.phase) * 0.3;
          letter.rotation.z = Math.sin(Date.now() * 0.001 + i) * 0.1;
        });
      }

      // Rotate particles
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Rotate starfield
      starField.rotation.y += 0.0002;
      starField.rotation.x += 0.0001;

      // Camera movement based on mouse
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [game3DActive]);

  const projects = [
    {
      title: "Zinara",
      desc: "Plateforme e-commerce complète avec système de paiement, gestion de produits et panier d'achat dynamique",
      tech: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
      github: "https://github.com/tahabk02/ZINARA-JEWELRY",
      featured: true,
    },
    {
      title: "SmartLabo",
      desc: "Application de gestion de laboratoire médical avec système de rendez-vous, résultats d'analyses et dashboard analytique",
      tech: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
      github: "https://github.com/tahabk02/smartlabo",
      featured: true,
    },
    {
      title: "Blog Touristique Maroc",
      desc: "Blog MERN Stack sur les lieux touristiques au Maroc avec système d'authentification et gestion de contenu",
      tech: ["MongoDB", "Express", "React", "Node.js"],
      github: "https://github.com/tahabk02/blog-touristique-maroc",
    },
    {
      title: "Gestion de Cabinet",
      desc: "Système de gestion complet pour cabinet médical avec interface responsive",
      tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      github: "https://github.com/tahabk02/project-gestion-du-cabinet",
    },
    {
      title: "Project Coursera",
      desc: "Projet de test et apprentissage des technologies web modernes",
      tech: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/tahabk02/Project-coursera",
    },
    {
      title: "My 5 Favorite Countries",
      desc: "Projet créatif présentant 5 pays favoris avec design interactif",
      tech: ["HTML", "CSS", "JavaScript"],
      github:
        "https://github.com/tahabk02/solicode-creative-minds-dw104-bp01-my-5-favorite-countries",
    },
  ];

  const skills = [
    {
      title: "Frontend",
      skills: [
        "React",
        "TypeScript",
        "Next.js",
        "HTML/CSS",
        "Tailwind CSS",
        "Bootstrap",
        "SCSS",
      ],
      icon: "🎨",
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express.js", "Python", "Flask", "PHP", "C"],
      icon: "⚙️",
    },
    {
      title: "Databases",
      skills: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "SQL"],
      icon: "💾",
    },
    {
      title: "DevOps & Tools",
      skills: ["Git", "Docker", "Vite", "Vercel", "npm", "Webpack"],
      icon: "🛠️",
    },
  ];

  const theme = {
    light: {
      bg: "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50",
      card: "bg-white/90",
      text: "text-slate-900",
      textSecondary: "text-slate-600",
      border: "border-cyan-200",
      nav: "bg-white/90",
      accent: "bg-cyan-500",
    },
    dark: {
      bg: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
      card: "bg-slate-900/70",
      text: "text-white",
      textSecondary: "text-slate-400",
      border: "border-cyan-500/20",
      nav: "bg-slate-950/90",
      accent: "bg-cyan-500",
    },
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-500 relative overflow-hidden`}
    >
      {/* Animated Universe Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Stars Layer 1 - Fast */}
        <div className="absolute inset-0 opacity-60">
          {[...Array(50)].map((_, i) => (
            <div
              key={`star1-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        {/* Stars Layer 2 - Medium */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(30)].map((_, i) => (
            <div
              key={`star2-${i}`}
              className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Shooting Stars */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="absolute h-0.5 w-20 bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${i * 8 + Math.random() * 5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>

        {/* Nebula Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-float-slow" />
        </div>

        {/* Moving Planets */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-full opacity-30 animate-orbit" />
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-25 animate-orbit-reverse" />
          <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-30 animate-orbit-slow" />
        </div>

        {/* Cosmic Dust */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(100)].map((_, i) => (
            <div
              key={`dust-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full ${currentTheme.nav} backdrop-blur-xl z-50 border-b ${currentTheme.border} transition-all duration-300 ${
          scrollY > 50 ? 'py-3 shadow-2xl' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <Terminal className="w-7 h-7 text-cyan-400 relative transform group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              TAHA BOULHAK
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a 
              href="#home" 
              className={`hover:text-cyan-400 transition-all relative group ${activeSection === 'home' ? 'text-cyan-400' : ''}`}
            >
              Accueil
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 transform origin-left transition-transform ${activeSection === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </a>
            <a 
              href="#about" 
              className={`hover:text-cyan-400 transition-all relative group ${activeSection === 'about' ? 'text-cyan-400' : ''}`}
            >
              À propos
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 transform origin-left transition-transform ${activeSection === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </a>
            <a 
              href="#skills" 
              className={`hover:text-cyan-400 transition-all relative group ${activeSection === 'skills' ? 'text-cyan-400' : ''}`}
            >
              Compétences
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 transform origin-left transition-transform ${activeSection === 'skills' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </a>
            <a
              href="#projects"
              className={`hover:text-cyan-400 transition-all relative group ${activeSection === 'projects' ? 'text-cyan-400' : ''}`}
            >
              Projets
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 transform origin-left transition-transform ${activeSection === 'projects' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </a>
            <a 
              href="#game" 
              className={`hover:text-cyan-400 transition-all relative group ${activeSection === 'game' ? 'text-cyan-400' : ''}`}
            >
              Jeux
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 transform origin-left transition-transform ${activeSection === 'game' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </a>
            <a
              href="#contact"
              className={`hover:text-cyan-400 transition-all relative group ${activeSection === 'contact' ? 'text-cyan-400' : ''}`}
            >
              Contact
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 transform origin-left transition-transform ${activeSection === 'contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all hover:scale-110 border border-cyan-500/30"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 blur-3xl opacity-50 animate-pulse group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-full p-8 border border-cyan-500/30 group-hover:border-cyan-500/60 transition-all">
                <Code2
                  className="w-28 h-28 text-cyan-400 relative"
                  style={{ 
                    animation: 'float 3s ease-in-out infinite',
                    filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.6))'
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <span className="px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-sm font-semibold text-cyan-400 inline-block backdrop-blur-xl">
              👋 Bienvenue sur mon portfolio
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="block mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent" 
                  style={{
                    backgroundSize: '200% auto',
                    animation: 'gradient 3s linear infinite'
                  }}>
              Taha Boulhak
            </span>
            <span className="block text-4xl md:text-5xl bg-gradient-to-r from-slate-400 to-slate-200 bg-clip-text text-transparent">
              Full Stack Developer
            </span>
          </h1>

          <p className={`text-xl md:text-2xl ${currentTheme.textSecondary} mb-12 font-light max-w-3xl mx-auto leading-relaxed`}>
            Passionné par la création d'expériences web exceptionnelles. 
            <br />
            Je transforme des idées complexes en solutions élégantes et performantes.
          </p>

          <div className="flex gap-6 justify-center mb-12 flex-wrap">
            <a
              href="https://github.com/tahabk02"
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-5 ${currentTheme.card} backdrop-blur-xl hover:bg-cyan-500/10 border-2 ${currentTheme.border} hover:border-cyan-500/60 rounded-2xl transition-all hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/30 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Github className="w-8 h-8 relative z-10" />
            </a>
            <a
              href="https://www.linkedin.com/in/taha-boulhak/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-5 ${currentTheme.card} backdrop-blur-xl hover:bg-blue-500/10 border-2 ${currentTheme.border} hover:border-blue-500/60 rounded-2xl transition-all hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/30 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Linkedin className="w-8 h-8 relative z-10" />
            </a>
            <a
              href="#contact"
              className={`group p-5 ${currentTheme.card} backdrop-blur-xl hover:bg-purple-500/10 border-2 ${currentTheme.border} hover:border-purple-500/60 rounded-2xl transition-all hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/30 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Mail className="w-8 h-8 relative z-10" />
            </a>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#projects"
              className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-semibold text-white hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105 text-lg relative overflow-hidden"
            >
              <span className="relative z-10">Voir mes projets</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="#contact"
              className={`px-10 py-5 ${currentTheme.card} backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-500 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/20 transition-all hover:scale-105 text-lg`}
            >
              Me contacter
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center p-2">
              <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-sm font-semibold text-cyan-400 inline-block backdrop-blur-xl mb-6">
              💡 Qui suis-je ?
            </span>
            <h2 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                À propos de moi
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div
              className={`${currentTheme.card} backdrop-blur-xl border-2 ${currentTheme.border} hover:border-cyan-500/50 rounded-3xl p-10 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all hover:scale-[1.02] group`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                  <Code2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold">Développeur Passionné</h3>
              </div>
              <p className={`text-lg ${currentTheme.textSecondary} leading-relaxed`}>
                Développeur Full Stack basé au Maroc avec une passion pour la création d'applications web modernes et performantes. J'allie créativité technique et innovation pour transformer des idées en solutions concrètes.
              </p>
            </div>

            <div
              className={`${currentTheme.card} backdrop-blur-xl border-2 ${currentTheme.border} hover:border-blue-500/50 rounded-3xl p-10 hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:scale-[1.02] group`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold">Innovation & Qualité</h3>
              </div>
              <p className={`text-lg ${currentTheme.textSecondary} leading-relaxed`}>
                Expert en React, Node.js et MongoDB, je privilégie les architectures scalables et les designs intuitifs. Mon approche intègre les dernières technologies pour créer des expériences utilisateur mémorables.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { number: "6+", label: "Projets Réalisés" },
              { number: "15+", label: "Technologies" },
              { number: "100%", label: "Dédication" },
              { number: "∞", label: "Créativité" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`${currentTheme.card} backdrop-blur-xl border ${currentTheme.border} rounded-2xl p-6 text-center hover:scale-105 transition-all hover:shadow-xl`}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className={`text-sm ${currentTheme.textSecondary}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm font-semibold text-purple-400 inline-block backdrop-blur-xl mb-6">
              🛠️ Ma Stack Technique
            </span>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Compétences & Technologies
              </span>
            </h2>
            <p className={`text-xl ${currentTheme.textSecondary} max-w-3xl mx-auto`}>
              Une expertise diversifiée pour créer des solutions complètes et performantes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((category, idx) => (
              <div
                key={idx}
                className={`group ${currentTheme.card} backdrop-blur-xl border-2 ${currentTheme.border} hover:border-cyan-500/50 rounded-3xl p-8 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.skills.map((skill, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-3 ${currentTheme.textSecondary} text-base transform transition-transform hover:translate-x-2`}
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full group-hover:animate-pulse"></div>
                        <span className="group-hover:text-cyan-400 transition-colors">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Mes Projets
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className={`group ${currentTheme.card} backdrop-blur border ${
                  currentTheme.border
                } rounded-2xl p-8 hover:border-cyan-400/50 transition-all hover:shadow-2xl hover:scale-105 ${
                  project.featured
                    ? "lg:col-span-1 ring-2 ring-cyan-400/30"
                    : ""
                }`}
              >
                {project.featured && (
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full">
                      ⭐ PROJET PHARE
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-8 h-8 text-cyan-400" />
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                </div>
                <p className={`${currentTheme.textSecondary} mb-6 text-lg`}>
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-sm text-cyan-400 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                >
                  <Github className="w-5 h-5" />
                  Voir sur GitHub
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="game" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Espace Jeux Interactifs
            </span>
          </h2>

          {/* Coding Speed Challenge */}
          <div
            className={`${currentTheme.card} backdrop-blur border ${currentTheme.border} rounded-2xl p-8 mb-12 hover:shadow-2xl transition-all`}
          >
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Code2 className="w-8 h-8 text-cyan-400" />
              Code Speed Challenge
            </h3>
            <p className={`${currentTheme.textSecondary} mb-6 text-lg`}>
              Testez votre vitesse de frappe en reproduisant des extraits de code ! 
              Progressez à travers 4 niveaux de difficulté.
            </p>
            
            <div className="flex gap-6 mb-6">
              <div className={`flex-1 p-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} rounded-xl`}>
                <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Score</p>
                <p className="text-3xl font-bold text-cyan-400">{codingScore}</p>
              </div>
              <div className={`flex-1 p-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} rounded-xl`}>
                <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Niveau</p>
                <p className="text-3xl font-bold text-blue-400">{codingLevel}/4</p>
              </div>
              {codingGameStarted && (
                <div className={`flex-1 p-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} rounded-xl`}>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Temps</p>
                  <p className="text-3xl font-bold text-purple-400">{codingTimeLeft}s</p>
                </div>
              )}
            </div>

            {!codingGameStarted ? (
              <button
                onClick={startCodingGame}
                className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105 text-lg"
              >
                Commencer le Challenge
              </button>
            ) : (
              <div>
                <div className={`p-6 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} rounded-xl mb-4 border-2 border-cyan-500/30`}>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-2`}>Code à reproduire :</p>
                  <code className="text-cyan-400 font-mono text-lg block bg-slate-950 p-4 rounded">{targetCode}</code>
                </div>
                <textarea
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      checkCode();
                    }
                  }}
                  placeholder="Tapez le code ici... (Ctrl+Enter pour valider)"
                  className={`w-full p-4 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} rounded-xl border-2 border-cyan-500/30 font-mono text-lg mb-4 focus:outline-none focus:border-cyan-500`}
                  rows="3"
                />
                <button
                  onClick={checkCode}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold text-white hover:shadow-xl hover:scale-105 transition-all"
                >
                  Valider (Ctrl+Enter)
                </button>
              </div>
            )}

            {!codingGameStarted && codingScore > 0 && (
              <div className="mt-6 text-center p-6 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <p className="text-2xl">
                  Score final : <span className="text-cyan-400 font-bold text-3xl">{codingScore}</span> points
                  <br />
                  <span className="text-lg">Niveau atteint : {codingLevel}/4</span>
                </p>
              </div>
            )}
          </div>

          {/* Memory Game */}
          <div
            className={`${currentTheme.card} backdrop-blur border ${currentTheme.border} rounded-2xl p-8 mb-12 hover:shadow-2xl transition-all`}
          >
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Terminal className="w-8 h-8 text-cyan-400" />
              Memory Tech Challenge
            </h3>
            <p className={`${currentTheme.textSecondary} mb-6 text-lg`}>
              Testez votre mémoire avec les icônes des technologies ! 
              Trouvez toutes les paires en un minimum de coups.
            </p>
            
            <div className="flex gap-6 mb-6">
              <div className={`flex-1 p-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} rounded-xl`}>
                <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Score</p>
                <p className="text-3xl font-bold text-cyan-400">{memoryScore}</p>
              </div>
              <div className={`flex-1 p-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} rounded-xl`}>
                <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Coups</p>
                <p className="text-3xl font-bold text-purple-400">{memoryMoves}</p>
              </div>
              <div className={`flex-1 p-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} rounded-xl`}>
                <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Paires</p>
                <p className="text-3xl font-bold text-blue-400">{matchedCards.length / 2}/8</p>
              </div>
            </div>

            {!memoryGameStarted ? (
              <div>
                <button
                  onClick={startMemoryGame}
                  className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 text-lg mb-4"
                >
                  Commencer le Memory
                </button>
                {memoryScore > 0 && (
                  <div className="text-center p-6 bg-purple-500/10 rounded-xl border border-purple-500/30">
                    <p className="text-2xl">
                      Partie terminée ! Score : <span className="text-purple-400 font-bold text-3xl">{memoryScore}</span>
                      <br />
                      <span className="text-lg">En {memoryMoves} coups</span>
                      {memoryMoves <= 12 && <span className="block mt-2 text-green-400">🏆 Mémoire exceptionnelle !</span>}
                      {memoryMoves > 12 && memoryMoves <= 20 && <span className="block mt-2 text-blue-400">👍 Bien joué !</span>}
                      {memoryMoves > 20 && <span className="block mt-2 text-purple-400">💪 Continue à t'entraîner !</span>}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {memoryCards.map((card, index) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square rounded-xl text-5xl flex items-center justify-center transition-all transform hover:scale-105 ${
                      flippedCards.includes(index) || matchedCards.includes(index)
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 rotate-0'
                        : `${darkMode ? 'bg-slate-900' : 'bg-slate-200'} hover:bg-purple-500/20`
                    } border-2 ${
                      matchedCards.includes(index)
                        ? 'border-green-400'
                        : 'border-purple-500/30'
                    }`}
                  >
                    {flippedCards.includes(index) || matchedCards.includes(index) ? card.icon : '?'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3D Game */}
          <div
            className={`${currentTheme.card} backdrop-blur border ${currentTheme.border} rounded-2xl p-8 mb-12 hover:shadow-2xl transition-all`}
          >
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-cyan-400" />
              Expérience 3D Interactive
            </h3>
            <p className={`${currentTheme.textSecondary} mb-6 text-lg`}>
              Plongez dans un univers 3D avec des effets visuels époustouflants !
              Déplacez votre souris pour contrôler la caméra et observer les animations.
            </p>
            <button
              onClick={() => setGame3DActive(!game3DActive)}
              className="mb-6 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105 flex items-center gap-2"
            >
              {game3DActive ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {game3DActive ? "Arrêter" : "Lancer"} l'expérience 3D
            </button>
            {game3DActive && (
              <div
                ref={mountRef}
                className="w-full h-96 rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
              />
            )}
          </div>

          {/* Click Challenge Game - Enhanced */}
          <div
            className={`${currentTheme.card} backdrop-blur border ${currentTheme.border} rounded-2xl p-8 hover:shadow-2xl transition-all`}
          >
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-cyan-400" />
              Réflexes Challenge
            </h3>
            <p className={`${currentTheme.textSecondary} mb-6 text-lg`}>
              Testez vos réflexes ! Cliquez sur les cibles avant qu'elles ne disparaissent.
              Plus vous êtes rapide, plus vous gagnez de points !
            </p>
            <div className="flex justify-between items-center mb-8">
              <div className={`p-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} rounded-xl flex-1 mr-4`}>
                <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Score</p>
                <p className="text-3xl font-bold text-cyan-400">{score}</p>
              </div>
              {isPlaying && (
                <div className={`p-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} rounded-xl flex-1`}>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Temps restant</p>
                  <p className="text-3xl font-bold text-blue-400">{timeLeft}s</p>
                </div>
              )}
            </div>

            <div
              className={`relative ${
                darkMode ? "bg-slate-900" : "bg-slate-100"
              } rounded-xl h-96 mb-6 overflow-hidden border-2 border-cyan-500/30`}
            >
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                  <button
                    onClick={startGame}
                    className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105 text-lg"
                  >
                    Commencer le Challenge
                  </button>
                </div>
              )}
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={() => hitTarget(target.id)}
                  className="absolute w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full hover:from-cyan-300 hover:to-blue-400 transition-all animate-pulse shadow-lg shadow-cyan-500/50 hover:scale-110"
                  style={{ left: `${target.x}%`, top: `${target.y}%` }}
                >
                  <span className="text-2xl">🎯</span>
                </button>
              ))}
            </div>

            {!isPlaying && score > 0 && (
              <div className="text-center p-6 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <p className="text-2xl">
                  Score final : <span className="text-cyan-400 font-bold text-3xl">{score}</span> points
                  {score >= 200 && <span className="block mt-2 text-green-400">🏆 Excellent !</span>}
                  {score >= 100 && score < 200 && <span className="block mt-2 text-blue-400">👍 Bien joué !</span>}
                  {score < 100 && <span className="block mt-2 text-purple-400">💪 Continue comme ça !</span>}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-12">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Contactez-moi
            </span>
          </h2>
          <p className={`text-2xl ${currentTheme.textSecondary} mb-12`}>
            Prêt à collaborer sur votre prochain projet ? N'hésitez pas à me
            contacter !
          </p>
          <div className="flex gap-6 justify-center">
            <a
              href="https://github.com/tahabk02"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-8 py-4 ${currentTheme.card} backdrop-blur hover:bg-cyan-500/20 border ${currentTheme.border} rounded-xl transition-all hover:scale-105 hover:shadow-xl text-lg font-semibold`}
            >
              <Github className="w-6 h-6" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/taha-boulhak/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-8 py-4 ${currentTheme.card} backdrop-blur hover:bg-cyan-500/20 border ${currentTheme.border} rounded-xl transition-all hover:scale-105 hover:shadow-xl text-lg font-semibold`}
            >
              <Linkedin className="w-6 h-6" />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 px-6 border-t ${currentTheme.border} text-center ${currentTheme.textSecondary}`}
      >
        <p className="text-lg">
          © 2025 Taha Boulhak • Full Stack Developer • Fait avec ❤️ et React
        </p>
      </footer>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
          100% { transform: translateX(300px) translateY(300px) rotate(-45deg); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 40px) scale(1.1); }
          66% { transform: translate(40px, -40px) scale(0.9); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.05); }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        
        @keyframes orbit-reverse {
          0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          100% { transform: rotate(-360deg) translateX(120px) rotate(360deg); }
        }
        
        @keyframes orbit-slow {
          0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          50% { transform: translateY(-100px) translateX(50px); }
        }
        
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        
        .animate-shooting-star {
          animation: shooting-star linear infinite;
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 30s ease-in-out infinite;
        }
        
        .animate-orbit {
          animation: orbit 40s linear infinite;
        }
        
        .animate-orbit-reverse {
          animation: orbit-reverse 50s linear infinite;
        }
        
        .animate-orbit-slow {
          animation: orbit-slow 60s linear infinite;
        }
        
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
      `}</style>
    </div>
  );
}

export default App;