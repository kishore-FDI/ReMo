"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import { useUser } from "@clerk/nextjs";
import Layout from "@/components/Hero/Layout";

const App = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const shapes = [
    { color: "#2DD4BF", rotation: 0 }, // teal-400
    { color: "#14B8A6", rotation: 120 }, // teal-500
    { color: "#0D9488", rotation: 240 }, // teal-600
  ];

  useEffect(() => {
    // if (isLoaded && !isSignedIn) {
    //   router.push("/login");
    // }

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

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

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
  }, [isLoaded, isSignedIn, router]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    });
  };

  const handleGetStarted = () => {
    router.push("/home");
  };

  if (!isLoaded) {
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
  if (!isSignedIn) {
    return (
      <div
        className='relative min-h-screen overflow-x-hidden bg-[#202731]'
        onMouseMove={handleMouseMove}
      >
        <div ref={containerRef} className='fixed inset-0 z-0' />

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

        <div className='relative z-10'>
          <motion.nav className='fixed top-0 z-50 w-full bg-[#202731]/80 backdrop-blur-sm'>
            <div className='mx-auto flex h-20 max-w-7xl items-center justify-between px-4'>
              <motion.div className='text-4xl font-bold text-white'>
                Re<span className='text-teal-400'>Mo</span>
              </motion.div>
              <div className='flex items-center space-x-6'>
                <a
                  href='#features'
                  className='text-gray-400 hover:text-teal-400'
                >
                  Features
                </a>
                <a href='#about' className='text-gray-400 hover:text-teal-400'>
                  About
                </a>
              </div>
            </div>
          </motion.nav>

          <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                solution.
              </p>
              <motion.a
                href='/home'
                className='group relative overflow-hidden rounded-full bg-teal-400 px-8 py-4 font-medium text-[#202731]'
              >
                Get Started
              </motion.a>
            </motion.div>
          </div>

          <footer className='p-4 text-center text-white'>
            @All rights reserved, 2025
          </footer>
        </div>
      </div>
    );
  } else {
    return <Layout user={user} />;
  }
};

export default App;
