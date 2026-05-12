import React, { useState } from "react";
import { motion } from "framer-motion";
import { projects } from "../constants";
import { FaGithub, FaExternalLinkAlt, FaStar, FaCode, FaRocket, FaDatabase } from "react-icons/fa";

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${project.featured ? 'opacity-20' : ''}`} />
      
      <div className={`relative glass rounded-3xl overflow-hidden h-full flex flex-col ${project.featured ? 'border-purple-500/30' : ''}`}>
        {/* Project Image/Gradient Header */}
        <div className="relative h-52 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${
            index % 3 === 0 
              ? 'from-purple-600/30 to-blue-600/30' 
              : index % 3 === 1 
              ? 'from-cyan-600/30 to-green-600/30'
              : 'from-orange-600/30 to-red-600/30'
          }`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ y: isHovered ? -10 : 0, scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
              className="text-8xl opacity-20 group-hover:opacity-40"
            >
              {index % 3 === 0 ? <FaRocket /> : index % 3 === 1 ? <FaCode /> : <FaDatabase />}
            </motion.div>
          </div>
          
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-full flex items-center gap-1">
                <FaStar /> Featured
              </span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-8">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: tagIndex * 0.05 }}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:border-purple-500/50 hover:text-purple-400 transition-colors duration-300"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
            >
              <FaGithub size={16} />
              Code
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl text-sm text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                <FaExternalLinkAlt size={14} />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState("all");
  
  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.featured);

  return (
    <section id="projects" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-mono uppercase tracking-widest mb-6"
          >
            My Work
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A selection of projects I've built to solve real-world problems
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
              filter === "all"
                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter("featured")}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
              filter === "featured"
                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50"
            }`}
          >
            <FaStar size={14} />
            Featured
          </button>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="https://github.com/nithinskumar866"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <FaGithub size={20} />
            View All Projects on GitHub
            <FaExternalLinkAlt size={14} />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "5+", label: "Live Projects" },
            { value: "15+", label: "ML Models" },
            { value: "3+", label: "Frameworks" },
            { value: "100%", label: "Passion" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 glass rounded-2xl group hover:border-purple-500/30 transition-all duration-300">
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;