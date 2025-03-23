"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import * as THREE from "three";

const App = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState(0);

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const shapes = [
    { color: "#2DD4BF", rotation: 0 }, // teal-400
    { color: "#14B8A6", rotation: 120 }, // teal-500
    { color: "#0D9488", rotation: 240 }, // teal-600
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    const container = containerRef.current;
    if (!container) return;

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create multiple geometric shapes
    const shapes: THREE.Mesh[] = [];
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.7, 0.2, 16, 100),
      new THREE.TetrahedronGeometry(1, 0),
    ];

    geometries.forEach((geometry, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: 0x2dd4bf,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (index - 1) * 3;
      mesh.position.y = Math.sin((index * Math.PI) / 3);
      shapes.push(mesh);
      scene.add(mesh);
    });

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.003 * (index + 1);
        shape.rotation.y += 0.005 * (index + 1);
        shape.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
      });
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container?.removeChild(renderer.domElement);
    };
  }, [status, router]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    });
  };

  const handleGetStarted = () => {
    router.push("/home");
  };

  if (status === "loading") {
    return (
      <div className='flex h-screen w-screen items-center justify-center bg-[#202731]'>
        <div className='relative'>
          <div className='h-16 w-16 animate-spin rounded-full border-4 border-teal-400 border-t-transparent'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='h-8 w-8 rounded-full bg-teal-400/20'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='relative min-h-screen overflow-x-hidden bg-[#202731]'
      onMouseMove={handleMouseMove}
    >
      {/* Three.js Container */}
      <div ref={containerRef} className='fixed inset-0 z-0' />

      {/* Interactive Background Shapes */}
      <div className='absolute inset-0 z-0 overflow-hidden'>
        {shapes.map((shape, index) => (
          <motion.div
            key={index}
            className='absolute'
            style={{
              width: "60vmax",
              height: "60vmax",
              borderRadius: "60vmax",
              background: shape.color,
              filter: "blur(80px)",
              opacity: 0.15,
              top: `${index * 40 - 20}%`,
              left: `${index * 30 - 20}%`,
            }}
            animate={{
              x: mousePosition.x * 20,
              y: mousePosition.y * 20,
              rotate: shape.rotation + mousePosition.x * 10,
            }}
            transition={{ type: "spring", damping: 20 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className='relative z-10'>
        {/* Navigation */}
        <motion.nav
          className='fixed top-0 z-50 w-full bg-[#202731]/80 backdrop-blur-sm'
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className='mx-auto flex h-20 max-w-7xl items-center justify-between px-4'>
            <motion.div
              className='text-4xl font-bold text-white'
              whileHover={{ scale: 1.05 }}
            >
              Re<span className='text-teal-400'>Mo</span>
            </motion.div>
            <div className='flex items-center space-x-6'>
              <a
                href='#features'
                className='text-gray-400 transition-colors hover:text-teal-400'
              >
                Features
              </a>
              <a
                href='#about'
                className='text-gray-400 transition-colors hover:text-teal-400'
              >
                About
              </a>
              {/* <motion.button
                className='rounded-full bg-teal-400 px-6 py-2 font-medium text-[#202731] transition-all'
                whileHover={{ scale: 1.05, backgroundColor: "#14B8A6" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button> */}
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='max-w-4xl'
          >
            <div className='mb-6 inline-block rounded-full bg-teal-400/10 px-4 py-2 text-sm text-teal-400'>
              The Future of Remote Work
            </div>
            <h1 className='mb-6 text-7xl font-bold tracking-tight text-white'>
              <span className='text-teal-400'>90%</span> Virtual Workspace
              <br />
              <span className='text-3xl font-normal text-gray-400'>
                Empowering teams to work seamlessly from anywhere
              </span>
            </h1>
            <p className='mb-8 text-xl text-gray-400'>
              Transform your workflow with our cutting-edge virtual workspace
              solution. Experience the power of seamless collaboration and
              enhanced productivity.
            </p>
            <div className='flex justify-center space-x-4'>
              <motion.a
                href='/home'
                className='group relative overflow-hidden rounded-full bg-teal-400 px-8 py-4 font-medium text-[#202731]'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <motion.div
                  className='absolute inset-0 bg-teal-500'
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "tween" }}
                />
              </motion.a>
              {/* <motion.button
                className='group relative overflow-hidden rounded-full border-2 border-teal-400 px-8 py-4 font-medium text-teal-400'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button> */}
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <section id='features' className='py-32'>
          <div className='mx-auto max-w-7xl px-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='mb-16 text-center'
            >
              <h2 className='mb-4 text-4xl font-bold text-white'>
                Why Choose ReMo?
              </h2>
              <p className='text-xl text-gray-400'>
                Experience the next generation of remote collaboration
              </p>
            </motion.div>
            <div className='grid gap-8 md:grid-cols-3'>
              {[
                {
                  title: "Real-time Collaboration",
                  description:
                    "Work together seamlessly with your team in real-time",
                  value: "90%",
                  color: "from-teal-400/20",
                },
                {
                  title: "Smart Automation",
                  description:
                    "Automate repetitive tasks and boost productivity",
                  value: "75%",
                  color: "from-teal-500/20",
                },
                {
                  title: "Advanced Analytics",
                  description:
                    "Track performance and make data-driven decisions",
                  value: "95%",
                  color: "from-teal-600/20",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className='group relative overflow-hidden rounded-2xl bg-gray-800/30 p-8 backdrop-blur-sm'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <div className='relative z-10'>
                    <h3 className='mb-2 text-2xl font-bold text-white'>
                      {feature.title}
                    </h3>
                    <p className='mb-4 text-gray-400'>{feature.description}</p>
                    <div className='text-5xl font-bold text-teal-400'>
                      {feature.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id='about' className='bg-gray-900/50 py-32'>
          <div className='mx-auto max-w-7xl px-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='grid items-center gap-16 md:grid-cols-2'
            >
              <div>
                <h2 className='mb-6 text-4xl font-bold text-white'>
                  Transform Your Workspace
                </h2>
                <p className='mb-8 text-lg text-gray-400'>
                  ReMo is more than just a virtual workspace - it's a complete
                  solution for modern teams. With our platform, you can:
                </p>
                <ul className='space-y-4'>
                  {[
                    "Collaborate in real-time with team members",
                    "Automate routine tasks and workflows",
                    "Track performance and productivity",
                    "Secure communication and data sharing",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className='flex items-center text-gray-400'
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className='mr-2 text-teal-400'>→</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className='relative h-96'>
                <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400/20 to-transparent' />
              </div>
            </motion.div>
          </div>
        </section>

        <footer className='p-4 text-center text-white'>
          @All the rights reserved , 2025
        </footer>
      </div>
    </div>
  );
};

export default App;
