import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaDownload, FaArrowRight, FaPlay } from "react-icons/fa";
import { userInfo } from "../constants";

const TypewriterText = ({ texts, speed = 100 }) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, speed]);

  return (
    <span className="gradient-text">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const FloatingOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 ${color}`}
    style={{ width: size, height: size, top, left }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Orbs */}
      <FloatingOrb color="bg-purple-600" size="400px" top="10%" left="-10%" delay={0} />
      <FloatingOrb color="bg-cyan-500" size="300px" top="60%" right="-5%" delay={2} />
      <FloatingOrb color="bg-blue-600" size="200px" bottom="20%" left="20%" delay={4} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-gray-400">Available for opportunities</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
        >
          <span className="text-white">Hi, I'm </span>
          <br className="sm:hidden" />
          <span className="gradient-text">{userInfo.name}</span>
        </motion.h1>

        {/* Typewriter Role */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 h-12"
        >
          <TypewriterText
            texts={[
              "AI & Data Science Enthusiast",
              "Full Stack Developer",
              "Machine Learning Engineer",
              "Problem Solver"
            ]}
            speed={80}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {userInfo.description}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          {userInfo.stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl font-bold gradient-text mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button
            onClick={() => scrollToSection("projects")}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className="group px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
          >
            <FaPlay className="text-xs" />
            Let's Talk
          </button>

          <a
            href={userInfo.links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
          >
            <FaDownload />
            Resume
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <a
            href={userInfo.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 hover:-translate-y-1 transition-all duration-300"
          >
            <FaGithub size={24} />
          </a>
          <a
            href={userInfo.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 hover:-translate-y-1 transition-all duration-300"
          >
            <FaLinkedin size={24} />
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-purple-500 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;