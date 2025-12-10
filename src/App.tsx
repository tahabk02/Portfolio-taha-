import { useState, useEffect, useRef, useCallback } from "react";
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
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Cpu,
  Brain,
  Target,
  Home,
  User,
  Briefcase,
  Gamepad2,
  Phone,
} from "lucide-react";
import * as THREE from "three";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState([]);
  const [game3DActive, setGame3DActive] = useState(false);
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [particleCount, setParticleCount] = useState(0);
  const [transitionActive, setTransitionActive] = useState(false);
  const [transitionType, setTransitionType] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);
  const [sectionHistory, setSectionHistory] = useState(["home"]);
  const mountRef = useRef(null);

  // 3D Refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const textMeshRef = useRef(null);
  const particlesMeshRef = useRef(null);
  const starFieldRef = useRef(null);
  const animationRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const transitionGroupRef = useRef(null);
  const warpTunnelRef = useRef(null);
  const portalRef = useRef(null);
  const cubeRef = useRef(null);

  // Sections configuration
  const sections = [
    {
      id: "home",
      name: "Accueil",
      icon: Home,
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "about",
      name: "À propos",
      icon: User,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "skills",
      name: "Compétences",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "projects",
      name: "Projets",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "game",
      name: "Jeux",
      icon: Gamepad2,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "contact",
      name: "Contact",
      icon: Phone,
      color: "from-indigo-500 to-purple-500",
    },
  ];

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setParticleCount(window.innerWidth < 768 ? 150 : 300);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  // Switch between sections with 3D effects
  const switchSection = (newSection) => {
    if (isSwitching || activeSection === newSection) return;

    setIsSwitching(true);

    // Add to history
    setSectionHistory((prev) => [...prev, newSection].slice(-3));

    // Trigger 3D transition
    if (game3DActive) {
      trigger3DTransition(newSection);
    } else {
      trigger2DTransition(newSection);
    }

    // Scroll to section after delay
    setTimeout(() => {
      scrollToSection(newSection);
      setActiveSection(newSection);
      setTimeout(() => setIsSwitching(false), 500);
    }, 1000);
  };

  // 2D Transition effects
  const trigger2DTransition = (newSection) => {
    setTransitionActive(true);
    const transitions = ["slide", "fade", "zoom", "flip"];
    const randomTransition =
      transitions[Math.floor(Math.random() * transitions.length)];
    setTransitionType(randomTransition);

    // Add transition class to body
    document.body.classList.add(`transition-${randomTransition}`);

    setTimeout(() => {
      setTransitionActive(false);
      document.body.classList.remove(`transition-${randomTransition}`);
    }, 1000);
  };

  // 3D Transition effects
  const trigger3DTransition = (newSection) => {
    if (!sceneRef.current) return;

    setTransitionActive(true);
    const transitions = ["cube", "sphere", "torus", "ring"];
    const randomTransition =
      transitions[Math.floor(Math.random() * transitions.length)];
    setTransitionType(randomTransition);

    switch (randomTransition) {
      case "cube":
        createCubeTransition(newSection);
        break;
      case "sphere":
        createSphereTransition(newSection);
        break;
      case "torus":
        createTorusTransition(newSection);
        break;
      case "ring":
        createRingTransition(newSection);
        break;
    }

    setTimeout(() => {
      setTransitionActive(false);
    }, 2000);
  };

  // 3D Cube Transition
  const createCubeTransition = (section) => {
    if (!sceneRef.current) return;

    // Create rotating cube
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x004444,
      shininess: 100,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    cube.userData = { rotationSpeed: 0.05 };
    sceneRef.current.add(cube);
    cubeRef.current = cube;

    // Add inner particles
    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.userData = { speed: 0.02 };
    sceneRef.current.add(particles);

    // Animate cube transition
    const animateCube = () => {
      if (cubeRef.current) {
        cubeRef.current.rotation.x += cubeRef.current.userData.rotationSpeed;
        cubeRef.current.rotation.y +=
          cubeRef.current.userData.rotationSpeed * 1.3;
        cubeRef.current.rotation.z +=
          cubeRef.current.userData.rotationSpeed * 0.7;

        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.2;
        cubeRef.current.scale.set(scale, scale, scale);
      }

      if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
      }
    };

    // Cleanup
    setTimeout(() => {
      if (sceneRef.current) {
        sceneRef.current.remove(cube);
        sceneRef.current.remove(particles);
      }
      cubeRef.current = null;
    }, 2000);

    return animateCube;
  };

  // 3D Sphere Transition
  const createSphereTransition = (section) => {
    if (!sceneRef.current) return;

    // Create sphere
    const geometry = new THREE.SphereGeometry(3, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      emissive: 0x440044,
      shininess: 100,
      transparent: true,
      opacity: 0.6,
      wireframe: true,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    sphere.userData = { rotationSpeed: 0.03 };
    sceneRef.current.add(sphere);

    // Add orbiting particles
    const particleCount = 100;
    const particlesGroup = new THREE.Group();

    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
      });

      const particle = new THREE.Mesh(particleGeometry, particleMaterial);

      const radius = 4;
      const angle = (i / particleCount) * Math.PI * 2;
      const height = Math.sin(angle * 3) * 1.5;

      particle.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      particle.userData = {
        originalPosition: particle.position.clone(),
        speed: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      };

      particlesGroup.add(particle);
    }

    sceneRef.current.add(particlesGroup);

    // Animate sphere transition
    const animateSphere = () => {
      sphere.rotation.x += sphere.userData.rotationSpeed;
      sphere.rotation.y += sphere.userData.rotationSpeed * 1.2;

      particlesGroup.rotation.y += 0.005;
      particlesGroup.children.forEach((particle, i) => {
        const time = Date.now() * 0.001;
        const userData = particle.userData;

        particle.position.x =
          userData.originalPosition.x +
          Math.sin(time * userData.speed + userData.phase) * 0.5;
        particle.position.y =
          userData.originalPosition.y +
          Math.cos(time * userData.speed * 1.3 + userData.phase) * 0.3;
        particle.position.z =
          userData.originalPosition.z +
          Math.sin(time * userData.speed * 0.7 + userData.phase) * 0.5;
      });
    };

    // Cleanup
    setTimeout(() => {
      if (sceneRef.current) {
        sceneRef.current.remove(sphere);
        sceneRef.current.remove(particlesGroup);
      }
    }, 2000);

    return animateSphere;
  };

  // 3D Torus Transition
  const createTorusTransition = (section) => {
    if (!sceneRef.current) return;

    // Create torus
    const geometry = new THREE.TorusGeometry(3, 1, 16, 100);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      emissive: 0x444400,
      shininess: 100,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    });

    const torus = new THREE.Mesh(geometry, material);
    torus.position.set(0, 0, 0);
    torus.rotation.x = Math.PI / 2;
    torus.userData = { rotationSpeed: 0.02 };
    sceneRef.current.add(torus);

    // Add rotating rings
    const ringCount = 8;
    const ringsGroup = new THREE.Group();

    for (let i = 0; i < ringCount; i++) {
      const ringGeometry = new THREE.RingGeometry(
        2 + i * 0.3,
        2.3 + i * 0.3,
        32
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4 - i * 0.05,
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.z = (i - ringCount / 2) * 0.5;
      ring.userData = {
        speed: 0.01 + i * 0.005,
        phase: i * 0.5,
      };
      ringsGroup.add(ring);
    }

    sceneRef.current.add(ringsGroup);

    // Animate torus transition
    const animateTorus = () => {
      torus.rotation.y += torus.userData.rotationSpeed;
      torus.rotation.z += torus.userData.rotationSpeed * 0.5;

      ringsGroup.rotation.y += 0.01;
      ringsGroup.children.forEach((ring, i) => {
        ring.rotation.z += ring.userData.speed;
        const scale =
          1 + Math.sin(Date.now() * 0.001 + ring.userData.phase) * 0.1;
        ring.scale.set(scale, scale, scale);
      });
    };

    // Cleanup
    setTimeout(() => {
      if (sceneRef.current) {
        sceneRef.current.remove(torus);
        sceneRef.current.remove(ringsGroup);
      }
    }, 2000);

    return animateTorus;
  };

  // 3D Ring Transition
  const createRingTransition = (section) => {
    if (!sceneRef.current) return;

    // Create main ring
    const geometry = new THREE.RingGeometry(2, 4, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });

    const ring = new THREE.Mesh(geometry, material);
    ring.position.set(0, 0, 0);
    ring.rotation.x = Math.PI / 2;
    ring.userData = { rotationSpeed: 0.03 };
    sceneRef.current.add(ring);

    // Add orbiting particles
    const particleCount = 50;
    const particles = new THREE.Group();

    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.9,
      });

      const particle = new THREE.Mesh(particleGeometry, particleMaterial);

      const radius = 3;
      const angle = (i / particleCount) * Math.PI * 2;
      const height = Math.cos(angle * 2) * 0.5;

      particle.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      particles.add(particle);
    }

    sceneRef.current.add(particles);

    // Animate ring transition
    const animateRing = () => {
      ring.rotation.y += ring.userData.rotationSpeed;
      ring.rotation.z += ring.userData.rotationSpeed * 0.7;

      particles.rotation.y += 0.02;
      particles.children.forEach((particle, i) => {
        const time = Date.now() * 0.001;
        particle.position.y = Math.cos(time * 2 + i * 0.1) * 0.5;
      });
    };

    // Cleanup
    setTimeout(() => {
      if (sceneRef.current) {
        sceneRef.current.remove(ring);
        sceneRef.current.remove(particles);
      }
    }, 2000);

    return animateRing;
  };

  // Close mobile menu when clicking on a link
  const handleNavClick = (section) => {
    switchSection(section);
    setMobileMenuOpen(false);
  };

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sectionsList = sections.map((s) => s.id);
      const current = sectionsList.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current && current !== activeSection && !isSwitching) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, isSwitching, sections]);

  // Click Challenge Game
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
          const filtered = prev.filter((t) => Date.now() - t.id < 1200);
          return [
            ...filtered,
            {
              id: Date.now(),
              x: Math.random() * (isMobile ? 60 : 75) + 5,
              y: Math.random() * (isMobile ? 50 : 70) + 10,
              type: Math.random() > 0.7 ? "special" : "normal",
            },
          ].slice(-6);
        });
      }, 600);
      return () => clearInterval(interval);
    } else {
      setTargets([]);
    }
  }, [isPlaying, isMobile]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
  };

  const hitTarget = (id, type) => {
    const points = type === "special" ? 25 : 10;
    setScore((prev) => prev + points);
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
      const timer = setTimeout(
        () => setCodingTimeLeft(codingTimeLeft - 1),
        1000
      );
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
    const validSnippets = codeSnippets.filter((s) => s.level === codingLevel);
    if (validSnippets.length > 0) {
      const snippet =
        validSnippets[Math.floor(Math.random() * validSnippets.length)];
      setTargetCode(snippet.code);
      setCurrentCode("");
    }
  };

  const checkCode = () => {
    if (currentCode.trim() === targetCode.trim()) {
      const points = codingLevel * 25;
      setCodingScore((prev) => prev + points);
      if (codingScore >= codingLevel * 100 && codingLevel < 4) {
        setCodingLevel((prev) => prev + 1);
      }
      generateNewCode();
    }
  };

  // Memory Game Logic
  const techIcons = ["⚛️", "🎨", "💾", "🔧", "🐍", "🌐", "📱", "💻"];

  const startMemoryGame = () => {
    const cardCount = isMobile ? 6 : 8;
    const selectedIcons = techIcons.slice(0, cardCount / 2);
    const shuffled = [...selectedIcons, ...selectedIcons]
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
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((prev) => prev + 1);
      const [first, second] = newFlipped;

      if (memoryCards[first].icon === memoryCards[second].icon) {
        setMatchedCards((prev) => [...prev, first, second]);
        setMemoryScore((prev) => prev + 60);
        setFlippedCards([]);

        if (matchedCards.length + 2 === memoryCards.length) {
          setTimeout(() => setMemoryGameStarted(false), 1000);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 700);
      }
    }
  };

  // Enhanced 3D Scene with Matrix-style effects
  const createMatrixField = useCallback((scene) => {
    const charCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(charCount * 3);
    const colors = new Float32Array(charCount * 3);
    const speeds = new Float32Array(charCount);

    for (let i = 0; i < charCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      colors[i * 3] = 0;
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
      colors[i * 3 + 2] = 0;

      speeds[i] = 0.5 + Math.random() * 2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.userData = { speeds };

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const matrixField = new THREE.Points(geometry, material);
    matrixField.userData = { speeds };
    scene.add(matrixField);
    return matrixField;
  }, []);

  const createHexagonField = useCallback((scene) => {
    const hexagonGroup = new THREE.Group();
    const hexCount = 500;
    const geometry = new THREE.CircleGeometry(0.02, 6);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });

    for (let i = 0; i < hexCount; i++) {
      const hex = new THREE.Mesh(geometry, material.clone());
      hex.position.x = (Math.random() - 0.5) * 40;
      hex.position.y = (Math.random() - 0.5) * 40;
      hex.position.z = (Math.random() - 0.5) * 40;
      hex.rotation.x = Math.random() * Math.PI;
      hex.rotation.y = Math.random() * Math.PI;
      hex.userData = {
        speed: 0.001 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
      };
      hexagonGroup.add(hex);
    }

    scene.add(hexagonGroup);
    return hexagonGroup;
  }, []);

  const createWireframeGlobe = useCallback((scene) => {
    const globeGroup = new THREE.Group();
    const radius = 3;
    const segments = 32;

    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const globe = new THREE.Mesh(geometry, material);
    globeGroup.add(globe);

    // Add orbiting rings
    const ringCount = 5;
    for (let i = 0; i < ringCount; i++) {
      const ringGeometry = new THREE.RingGeometry(
        radius + 0.1 + i * 0.5,
        radius + 0.2 + i * 0.5,
        64
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x404040,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.z = (i * Math.PI) / ringCount;
      globeGroup.add(ring);
    }

    scene.add(globeGroup);
    return globeGroup;
  }, []);

  const createNeonText = useCallback((scene) => {
    const textGroup = new THREE.Group();
    const letters = ["T", "A", "H", "A"];

    letters.forEach((letter, i) => {
      // Create cube instead of text for simplicity
      const geometry = new THREE.BoxGeometry(0.5, 1, 0.2);
      const material = new THREE.MeshPhongMaterial({
        color: 0x808080,
        emissive: 0x404040,
        emissiveIntensity: 0.5,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = i * 1.2 - (letters.length * 1.2) / 2;
      mesh.position.y = Math.sin(i) * 0.3;
      mesh.userData = {
        originalY: mesh.position.y,
        phase: i * 0.5,
      };
      textGroup.add(mesh);
    });

    scene.add(textGroup);
    return textGroup;
  }, []);

  const setupLights = useCallback((scene) => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x808080, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x606060, 0.5, 100);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.3, 50, Math.PI / 4, 1);
    spotLight.position.set(0, 10, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    return [ambientLight, directionalLight, pointLight, spotLight];
  }, []);

  const handleMouseMove = useCallback((event) => {
    mousePositionRef.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
  }, []);

  const animate = useCallback(() => {
    animationRef.current = requestAnimationFrame(animate);

    if (sceneRef.current && cameraRef.current && rendererRef.current) {
      const time = Date.now() * 0.001;

      // Animate matrix field
      if (starFieldRef.current?.geometry) {
        const positions =
          starFieldRef.current.geometry.attributes.position.array;
        const speeds = starFieldRef.current.userData.speeds;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] -= speeds[i / 3] * 0.05;
          if (positions[i + 1] < -50) {
            positions[i + 1] = 50;
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
          }
        }
        starFieldRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Animate hexagon field
      if (particlesMeshRef.current) {
        particlesMeshRef.current.children.forEach((hex, i) => {
          const userData = hex.userData;
          hex.rotation.x += userData.speed;
          hex.rotation.y += userData.speed * 0.7;
          hex.position.y = Math.sin(time + userData.phase) * 0.1;
        });
      }

      // Animate text
      if (textMeshRef.current) {
        textMeshRef.current.rotation.y = time * 0.3;
        textMeshRef.current.children.forEach((letter, i) => {
          const userData = letter.userData;
          letter.position.y =
            userData.originalY + Math.sin(time * 1.5 + userData.phase) * 0.2;
          letter.rotation.x = Math.sin(time * 0.8 + i) * 0.2;
          letter.material.emissiveIntensity =
            0.5 + Math.sin(time * 2 + i) * 0.3;
        });
      }

      // Animate wireframe globe
      if (cameraRef.current) {
        cameraRef.current.rotation.y += 0.002;
      }

      // Camera movement based on mouse
      if (cameraRef.current) {
        cameraRef.current.position.x +=
          (mousePositionRef.current.x * 5 - cameraRef.current.position.x) *
          0.03;
        cameraRef.current.position.y +=
          (mousePositionRef.current.y * 5 - cameraRef.current.position.y) *
          0.03;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  const init3DScene = useCallback(() => {
    if (!mountRef.current) return;

    // Clean up previous scene if exists
    if (rendererRef.current) {
      rendererRef.current.dispose();
      sceneRef.current = null;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    mountRef.current.appendChild(renderer.domElement);

    // Store references
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Create scene elements
    starFieldRef.current = createMatrixField(scene);
    particlesMeshRef.current = createHexagonField(scene);
    textMeshRef.current = createNeonText(scene);
    createWireframeGlobe(scene);
    setupLights(scene);

    // Add event listener for mouse movement
    window.addEventListener("mousemove", handleMouseMove);

    // Start animation
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;

      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    createMatrixField,
    createHexagonField,
    createNeonText,
    createWireframeGlobe,
    setupLights,
    handleMouseMove,
    animate,
  ]);

  const cleanup3DScene = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    window.removeEventListener("mousemove", handleMouseMove);

    if (mountRef.current && rendererRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // Clear all refs
    sceneRef.current = null;
    cameraRef.current = null;
    textMeshRef.current = null;
    particlesMeshRef.current = null;
    starFieldRef.current = null;
    transitionGroupRef.current = null;
    warpTunnelRef.current = null;
    portalRef.current = null;
    cubeRef.current = null;
  }, [handleMouseMove]);

  // 3D Game Effect
  useEffect(() => {
    if (game3DActive) {
      const cleanupResize = init3DScene();
      return () => {
        if (cleanupResize) cleanupResize();
        cleanup3DScene();
      };
    } else {
      cleanup3DScene();
    }
  }, [game3DActive, init3DScene, cleanup3DScene]);

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
      bg: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200",
      card: "bg-white/95 backdrop-blur-xl",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-300",
      nav: "bg-white/95 backdrop-blur-xl",
      accent: "bg-gray-800",
      gradient: "from-gray-800 via-gray-900 to-black",
    },
    dark: {
      bg: "bg-gradient-to-br from-black via-gray-900 to-gray-950",
      card: "bg-gray-900/80 backdrop-blur-xl",
      text: "text-gray-100",
      textSecondary: "text-gray-400",
      border: "border-gray-800",
      nav: "bg-gray-950/95 backdrop-blur-xl",
      accent: "bg-gray-700",
      gradient: "from-gray-700 via-gray-800 to-gray-900",
    },
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-500 relative overflow-hidden`}
    >
      {/* Matrix-style Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Binary Rain Effect */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={`binary-${i}`}
              className="absolute text-green-500/10 font-mono text-xs animate-matrix"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 15}s`,
                opacity: 0.3 + Math.random() * 0.3,
              }}
            >
              {Math.random() > 0.5 ? "1" : "0"}
            </div>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, rgba(100, 100, 100, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(100, 100, 100, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Pulsing Orbs */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-gray-600/10 to-gray-700/10 animate-pulse"
              style={{
                width: `${20 + Math.random() * 100}px`,
                height: `${20 + Math.random() * 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                filter: "blur(40px)",
              }}
            />
          ))}
        </div>

        {/* Scan Lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent animate-scan" />

        {/* Digital Noise */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 3D Transition Overlay */}
      {transitionActive && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl md:text-6xl font-bold text-white mb-4 animate-bounce">
              {transitionType.toUpperCase()}
            </div>
            <div className="text-xl text-gray-300 animate-pulse">
              Navigation vers{" "}
              {sections.find((s) => s.id === activeSection)?.name}
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation Panel */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div
          className={`${currentTheme.card} backdrop-blur-xl rounded-2xl p-3 border ${currentTheme.border} shadow-2xl`}
        >
          <div className="flex flex-col gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => switchSection(section.id)}
                className={`relative p-3 rounded-xl transition-all duration-300 group ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white scale-110`
                    : `${currentTheme.card} hover:scale-105`
                }`}
                disabled={isSwitching}
              >
                <div className="relative z-10">
                  <section.icon className="w-5 h-5" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div
                  className={`absolute -left-12 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg ${currentTheme.card} border ${currentTheme.border} text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                >
                  {section.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section Switch Controls (Mobile) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 lg:hidden">
        <div
          className={`${currentTheme.card} backdrop-blur-xl rounded-full p-2 border ${currentTheme.border} shadow-2xl`}
        >
          <div className="flex gap-2">
            {sections.slice(0, 4).map((section) => (
              <button
                key={section.id}
                onClick={() => switchSection(section.id)}
                className={`p-3 rounded-full transition-all duration-300 ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white scale-110`
                    : `${currentTheme.card} hover:scale-105`
                }`}
                disabled={isSwitching}
              >
                <section.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav
          className={`fixed top-0 w-full ${currentTheme.nav} z-50 border-b ${
            currentTheme.border
          } transition-all duration-300 ${
            scrollY > 50 ? "py-3 shadow-2xl" : "py-4"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-600 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <Terminal className="w-7 h-7 text-gray-300 relative transform group-hover:rotate-12 transition-transform" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent">
                TAHA BOULHAK
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => switchSection(section.id)}
                  className={`relative px-4 py-2 rounded-xl transition-all duration-300 group ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                      : `${currentTheme.card} hover:bg-gray-800/50`
                  } ${isSwitching ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isSwitching}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <section.icon className="w-4 h-4" />
                    {section.name}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
                </button>
              ))}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 transition-all hover:scale-110 border border-gray-700"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 transition-all border border-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div
              className={`md:hidden ${currentTheme.nav} border-t ${currentTheme.border} backdrop-blur-xl`}
            >
              <div className="px-4 py-6 space-y-3">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      switchSection(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.color} text-white`
                        : "hover:bg-gray-800"
                    } ${isSwitching ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isSwitching}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>{section.name}</span>
                  </button>
                ))}
                <div className="pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 transition-all border border-gray-700 flex items-center justify-center gap-2"
                  >
                    {darkMode ? (
                      <>
                        <Sun className="w-5 h-5 text-gray-300" />
                        <span>Mode Clair</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5 text-gray-700" />
                        <span>Mode Sombre</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section
          id="home"
          className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 pb-20"
        >
          <div className="max-w-6xl text-center">
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 blur-3xl opacity-50 animate-pulse group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-full p-6 sm:p-8 border border-gray-700 group-hover:border-gray-600 transition-all animate-float">
                  <Cpu
                    className="w-20 h-20 sm:w-28 sm:h-28 text-gray-300 relative"
                    style={{
                      filter: "drop-shadow(0 0 20px rgba(100, 100, 100, 0.6))",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span className="px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-gray-700 to-gray-900 border border-gray-700 rounded-full font-semibold text-gray-300 inline-block backdrop-blur-xl animate-glow">
                <Sparkles className="w-4 h-4 inline mr-2" />
                DEVELOPPEUR FULL STACK
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-tight">
              <span
                className="block mb-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent"
                style={{
                  backgroundSize: "200% auto",
                  animation: "gradient 3s linear infinite",
                }}
              >
                TAHA BOULHAK
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">
                ARCHITECTE DE SOLUTIONS NUMÉRIQUES
              </span>
            </h1>

            <p
              className={`text-lg sm:text-xl md:text-2xl ${currentTheme.textSecondary} mb-8 sm:mb-12 font-light max-w-3xl mx-auto leading-relaxed px-4`}
            >
              Je conçois et développe des applications web performantes avec une
              approche minimaliste et efficace. Chaque ligne de code a un
              objectif précis.
            </p>

            <div className="flex gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 flex-wrap px-4">
              {[
                {
                  icon: Github,
                  href: "https://github.com/tahabk02",
                  color: "gray",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/taha-boulhak/",
                  color: "gray",
                },
                { icon: Mail, href: "#contact", color: "gray" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`group p-4 sm:p-5 ${currentTheme.card} hover:bg-gray-800 border-2 ${currentTheme.border} hover:border-gray-600 rounded-2xl transition-all hover:scale-110 hover:shadow-2xl hover:shadow-gray-500/20 relative overflow-hidden animate-bounce-slow`}
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 via-gray-700/10 to-gray-700/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <social.icon className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" />
                </a>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap px-4">
              <button
                onClick={() => switchSection("projects")}
                className="group px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl font-semibold text-gray-100 hover:shadow-2xl hover:shadow-gray-500/30 transition-all hover:scale-105 text-base sm:text-lg relative overflow-hidden text-center animate-pulse-slow"
                disabled={isSwitching}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  EXPLORER LES PROJETS
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => switchSection("contact")}
                className={`px-6 sm:px-10 py-4 sm:py-5 ${currentTheme.card} backdrop-blur-xl border-2 border-gray-700 hover:border-gray-600 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-gray-500/10 transition-all hover:scale-105 text-base sm:text-lg text-center`}
                disabled={isSwitching}
              >
                ME CONTACTER
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 sm:py-32 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-20">
              <span className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-700 to-pink-900 border border-purple-700 rounded-full text-xs sm:text-sm font-semibold text-purple-300 inline-block backdrop-blur-xl mb-4 sm:mb-6 animate-glow">
                <Brain className="w-4 h-4 inline mr-2" />
                PHILOSOPHIE TECHNIQUE
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-300 to-pink-500 bg-clip-text text-transparent">
                  À PROPOS
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div
                className={`${currentTheme.card} border-2 ${currentTheme.border} hover:border-purple-600 rounded-3xl p-6 sm:p-8 md:p-10 hover:shadow-2xl hover:shadow-purple-500/10 transition-all hover:scale-[1.02] group animate-slide-up`}
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-700 to-pink-900 rounded-2xl group-hover:scale-110 transition-transform">
                    <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">EXPERTISE</h3>
                </div>
                <p
                  className={`text-base sm:text-lg ${currentTheme.textSecondary} leading-relaxed`}
                >
                  Spécialiste des architectures MERN et JAMStack. Je privilégie
                  des solutions scalables avec une attention particulière aux
                  performances et à la maintenabilité du code.
                </p>
              </div>

              <div
                className={`${currentTheme.card} border-2 ${currentTheme.border} hover:border-pink-600 rounded-3xl p-6 sm:p-8 md:p-10 hover:shadow-2xl hover:shadow-pink-500/10 transition-all hover:scale-[1.02] group animate-slide-up`}
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-pink-800 to-purple-950 rounded-2xl group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-pink-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">INNOVATION</h3>
                </div>
                <p
                  className={`text-base sm:text-lg ${currentTheme.textSecondary} leading-relaxed`}
                >
                  Adoption proactive des dernières technologies tout en
                  garantissant la stabilité des systèmes. Automatisation et
                  optimisation au cœur de chaque projet.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {[
                { number: "6+", label: "Projets", icon: "🚀" },
                { number: "15+", label: "Technos", icon: "⚡" },
                { number: "100%", label: "Qualité", icon: "🎯" },
                { number: "24/7", label: "Disponibilité", icon: "🔄" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`${currentTheme.card} border ${currentTheme.border} rounded-2xl p-4 sm:p-6 text-center hover:scale-105 transition-all hover:shadow-xl animate-slide-up`}
                  style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div
                    className={`text-xs sm:text-sm ${currentTheme.textSecondary}`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 sm:py-32 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-20">
              <span className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-700 to-emerald-900 border border-green-700 rounded-full text-xs sm:text-sm font-semibold text-green-300 inline-block backdrop-blur-xl mb-4 sm:mb-6 animate-glow">
                <Cpu className="w-4 h-4 inline mr-2" />
                STACK TECHNIQUE
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent">
                  COMPÉTENCES
                </span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {skills.map((category, idx) => (
                <div
                  key={idx}
                  className={`group ${currentTheme.card} border-2 ${currentTheme.border} hover:border-green-600 rounded-3xl p-6 sm:p-8 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-green-500/10 relative overflow-hidden animate-slide-up`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/5 to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10">
                    <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent">
                      {category.title}
                    </h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {category.skills.map((skill, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-3 ${currentTheme.textSecondary} text-sm sm:text-base transform transition-transform hover:translate-x-2`}
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full group-hover:animate-pulse"></div>
                          <span className="group-hover:text-green-300 transition-colors">
                            {skill}
                          </span>
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
        <section id="projects" className="py-20 sm:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-center">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent">
                PROJETS
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  className={`group ${currentTheme.card} backdrop-blur border ${
                    currentTheme.border
                  } rounded-2xl p-6 sm:p-8 hover:border-yellow-600 transition-all hover:shadow-2xl hover:scale-105 animate-slide-up ${
                    project.featured
                      ? "lg:col-span-1 ring-2 ring-yellow-600/30"
                      : ""
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {project.featured && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-700 to-orange-900 text-yellow-100 text-xs font-bold rounded-full">
                        ⭐ PROJET PHARE
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                    <h3 className="text-xl sm:text-2xl font-bold">
                      {project.title}
                    </h3>
                  </div>
                  <p
                    className={`${currentTheme.textSecondary} mb-4 sm:mb-6 text-base sm:text-lg`}
                  >
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800 border border-gray-700 rounded-full text-xs sm:text-sm text-gray-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-yellow-300 hover:text-yellow-200 transition-colors font-semibold text-sm sm:text-base group"
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    CODE SOURCE
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section id="game" className="py-20 sm:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-center">
              <span className="bg-gradient-to-r from-red-300 to-pink-500 bg-clip-text text-transparent">
                CHALLENGES
              </span>
            </h2>

            {/* Coding Game */}
            <div
              className={`${currentTheme.card} border ${currentTheme.border} rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 hover:shadow-2xl transition-all animate-slide-up`}
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                CODING CHALLENGE
              </h3>
              <p
                className={`${currentTheme.textSecondary} mb-4 sm:mb-6 text-base sm:text-lg`}
              >
                Testez votre vitesse de frappe en reproduisant des extraits de
                code JavaScript. Progressez à travers 4 niveaux de difficulté.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
                <div
                  className={`flex-1 p-4 ${
                    darkMode ? "bg-gray-900" : "bg-gray-100"
                  } rounded-xl border border-gray-700`}
                >
                  <p
                    className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}
                  >
                    SCORE
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-300">
                    {codingScore}
                  </p>
                </div>
                <div
                  className={`flex-1 p-4 ${
                    darkMode ? "bg-gray-900" : "bg-gray-100"
                  } rounded-xl border border-gray-700`}
                >
                  <p
                    className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}
                  >
                    NIVEAU
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-400">
                    {codingLevel}/4
                  </p>
                </div>
                {codingGameStarted && (
                  <div
                    className={`flex-1 p-4 ${
                      darkMode ? "bg-gray-900" : "bg-gray-100"
                    } rounded-xl border border-gray-700`}
                  >
                    <p
                      className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}
                    >
                      TEMPS
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-500">
                      {codingTimeLeft}s
                    </p>
                  </div>
                )}
              </div>

              {!codingGameStarted ? (
                <button
                  onClick={startCodingGame}
                  className="w-full py-4 sm:py-5 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl font-semibold text-gray-100 hover:shadow-2xl hover:shadow-gray-500/30 transition-all hover:scale-105 text-base sm:text-lg animate-pulse-slow"
                >
                  COMMENCER LE CHALLENGE
                </button>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <p
                      className={`text-sm sm:text-base ${currentTheme.textSecondary} mb-2`}
                    >
                      Code à taper :
                    </p>
                    <div
                      className={`p-3 sm:p-4 font-mono text-sm sm:text-base ${
                        darkMode ? "bg-gray-900" : "bg-gray-100"
                      } rounded-lg border border-gray-700 text-green-400`}
                    >
                      {targetCode}
                    </div>
                  </div>
                  <div>
                    <p
                      className={`text-sm sm:text-base ${currentTheme.textSecondary} mb-2`}
                    >
                      Votre saisie :
                    </p>
                    <textarea
                      value={currentCode}
                      onChange={(e) => setCurrentCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && checkCode()}
                      className={`w-full p-3 sm:p-4 font-mono text-sm sm:text-base ${
                        darkMode ? "bg-gray-900" : "bg-gray-100"
                      } rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-none ${
                        currentTheme.text
                      }`}
                      rows={2}
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={checkCode}
                      className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-700 to-emerald-900 rounded-xl font-semibold text-green-100 hover:shadow-2xl hover:shadow-green-500/30 transition-all hover:scale-105"
                    >
                      VALIDER (Enter)
                    </button>
                    <button
                      onClick={startCodingGame}
                      className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl font-semibold text-gray-100 hover:shadow-2xl hover:shadow-gray-500/30 transition-all hover:scale-105"
                    >
                      RECOMMENCER
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Click Challenge Game */}
            <div
              className={`${currentTheme.card} border ${currentTheme.border} rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 hover:shadow-2xl transition-all animate-slide-up`}
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                CLICK CHALLENGE
              </h3>
              <p
                className={`${currentTheme.textSecondary} mb-4 sm:mb-6 text-base sm:text-lg`}
              >
                Cliquez sur les cibles qui apparaissent pour marquer des points.
                Les cibles spéciales valent 25 points !
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
                <div
                  className={`flex-1 p-4 ${
                    darkMode ? "bg-gray-900" : "bg-gray-100"
                  } rounded-xl border border-gray-700`}
                >
                  <p
                    className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}
                  >
                    SCORE
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-300">
                    {score}
                  </p>
                </div>
                <div
                  className={`flex-1 p-4 ${
                    darkMode ? "bg-gray-900" : "bg-gray-100"
                  } rounded-xl border border-gray-700`}
                >
                  <p
                    className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}
                  >
                    TEMPS
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-400">
                    {timeLeft}s
                  </p>
                </div>
              </div>

              <div className="relative h-[400px] sm:h-[500px] mb-4 sm:mb-6 border border-gray-800 rounded-xl overflow-hidden">
                {targets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => hitTarget(target.id, target.type)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
                      target.type === "special"
                        ? "w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-orange-600 border-2 border-yellow-400 shadow-lg shadow-yellow-500/50"
                        : "w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-gray-500"
                    } rounded-full animate-pulse-slow`}
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                    }}
                  >
                    {target.type === "special" && (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl animate-spin-slow">
                        ⭐
                      </div>
                    )}
                  </button>
                ))}

                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <button
                      onClick={startGame}
                      className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl font-semibold text-gray-100 hover:shadow-2xl hover:shadow-gray-500/30 transition-all hover:scale-105 text-lg sm:text-xl flex items-center gap-3"
                    >
                      <Play className="w-6 h-6" />
                      {score > 0 ? "REJOUER" : "COMMENCER"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Memory Game */}
            <div
              className={`${currentTheme.card} border ${currentTheme.border} rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition-all animate-slide-up`}
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                MEMORY TECH
              </h3>
              <p
                className={`${currentTheme.textSecondary} mb-4 sm:mb-6 text-base sm:text-lg`}
              >
                Retrouvez les paires d'icônes technologiques. Améliorez votre
                mémoire tout en découvrant des technologies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
                <div
                  className={`flex-1 p-4 ${
                    darkMode ? "bg-gray-900" : "bg-gray-100"
                  } rounded-xl border border-gray-700`}
                >
                  <p
                    className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}
                  >
                    SCORE
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-300">
                    {memoryScore}
                  </p>
                </div>
                <div
                  className={`flex-1 p-4 ${
                    darkMode ? "bg-gray-900" : "bg-gray-100"
                  } rounded-xl border border-gray-700`}
                >
                  <p
                    className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}
                  >
                    COUPS
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-400">
                    {memoryMoves}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
                {memoryCards.map((card, index) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square flex items-center justify-center text-3xl sm:text-4xl rounded-xl transition-all duration-300 ${
                      flippedCards.includes(index) ||
                      matchedCards.includes(index)
                        ? "bg-gradient-to-br from-gray-600 to-gray-800 scale-95"
                        : "bg-gradient-to-br from-gray-700 to-gray-900 hover:scale-105 hover:shadow-lg"
                    } ${isSwitching ? "cursor-not-allowed" : ""}`}
                    disabled={isSwitching}
                  >
                    {flippedCards.includes(index) ||
                    matchedCards.includes(index)
                      ? card.icon
                      : "❓"}
                  </button>
                ))}
              </div>

              <button
                onClick={startMemoryGame}
                className="w-full py-4 sm:py-5 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl font-semibold text-gray-100 hover:shadow-2xl hover:shadow-gray-500/30 transition-all hover:scale-105 text-base sm:text-lg"
              >
                {memoryGameStarted ? "REDÉMARRER" : "COMMENCER LE JEU"}
              </button>
            </div>

            {/* 3D Toggle */}
            <div className="text-center mt-12 sm:mt-16">
              <button
                onClick={() => setGame3DActive(!game3DActive)}
                className="group px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-gray-700 to-gray-900 border-2 border-gray-700 hover:border-gray-600 rounded-2xl font-semibold text-gray-100 hover:shadow-2xl hover:shadow-gray-500/30 transition-all hover:scale-105 text-lg sm:text-xl flex items-center gap-3 mx-auto"
              >
                {game3DActive ? (
                  <>
                    <Terminal className="w-6 h-6 group-hover:rotate-180 transition-transform" />
                    DÉSACTIVER LE MODE 3D
                  </>
                ) : (
                  <>
                    <Terminal className="w-6 h-6 group-hover:rotate-180 transition-transform" />
                    ACTIVER LE MODE 3D
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 sm:py-32 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12 sm:mb-20">
              <span className="px-4 sm:px-6 py-2 bg-gradient-to-r from-indigo-700 to-purple-900 border border-indigo-700 rounded-full text-xs sm:text-sm font-semibold text-indigo-300 inline-block backdrop-blur-xl mb-4 sm:mb-6 animate-glow">
                <Phone className="w-4 h-4 inline mr-2" />
                CONTACT
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-300 to-purple-500 bg-clip-text text-transparent">
                  TRAVAILLONS ENSEMBLE
                </span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  content: "tahaboulhak202@gmail.com",
                  href: "mailto:tahaboulhak202@gmail.com",
                },
                {
                  icon: Github,
                  title: "GitHub",
                  content: "@tahabk02",
                  href: "https://github.com/tahabk02",
                },
                {
                  icon: Linkedin,
                  title: "LinkedIn",
                  content: "Taha Boulhak",
                  href: "https://www.linkedin.com/in/taha-boulhak/",
                },
                {
                  icon: Terminal,
                  title: "Disponibilité",
                  content: "Immédiate",
                  href: "#contact",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`group ${currentTheme.card} border-2 ${currentTheme.border} hover:border-indigo-600 rounded-3xl p-6 sm:p-8 text-center hover:scale-105 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 animate-slide-up`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="inline-flex p-3 sm:p-4 bg-gradient-to-br from-indigo-700 to-purple-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p
                    className={`text-base sm:text-lg ${currentTheme.textSecondary} group-hover:text-indigo-300 transition-colors`}
                  >
                    {item.content}
                  </p>
                </a>
              ))}
            </div>

            <div
              className={`${currentTheme.card} border-2 ${currentTheme.border} rounded-3xl p-6 sm:p-8 md:p-12 text-center hover:shadow-2xl transition-all animate-slide-up`}
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-indigo-300 to-purple-500 bg-clip-text text-transparent">
                  UN PROJET EN TÊTE ?
                </span>
              </h3>
              <p
                className={`text-lg sm:text-xl ${currentTheme.textSecondary} mb-6 sm:mb-8 leading-relaxed`}
              >
                Que ce soit pour une collaboration, un projet freelance ou
                simplement échanger sur les dernières technologies, n'hésitez
                pas à me contacter.
              </p>
              <a
                href="mailto:tahaboulhak202@gmail.com"
                className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-indigo-700 to-purple-900 rounded-2xl font-semibold text-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:scale-105 text-lg sm:text-xl group"
              >
                <Mail className="w-6 h-6 group-hover:animate-bounce" />
                ENVOYER UN MESSAGE
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <p
              className={`text-sm sm:text-base ${currentTheme.textSecondary} mb-6`}
            >
              Développé avec React, Three.js et une passion pour l'innovation.
              Design et code par Taha Boulhak.
            </p>
            <p className={`text-xs sm:text-sm ${currentTheme.textSecondary}`}>
              © {new Date().getFullYear()} Taha Boulhak. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>

      {/* 3D Canvas Container */}
      {game3DActive && (
        <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes matrix {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes scan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100vh;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes glow {
          0%,
          100% {
            opacity: 1;
            box-shadow: 0 0 20px rgba(100, 100, 100, 0.3);
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 40px rgba(100, 100, 100, 0.6);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-matrix {
          animation: matrix linear infinite;
        }

        .animate-scan {
          animation: scan 10s linear infinite;
          background-size: 100% 2px;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
