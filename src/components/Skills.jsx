import React, { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "../constants";
import { FaCode, FaDatabase, FaChartLine, FaTools, FaPuzzlePiece } from "react-icons/fa";
import { SiPython, SiTensorflow, SiLangchain } from "react-icons/si";

const getIcon = (iconName) => {
  const icons = {
    py: <span className="text-blue-400"><SiPython size={28} /></span>,
    sql: <span className="text-blue-500"><FaDatabase size={28} /></span>,
    ml: <span className="text-purple-400"><SiTensorflow size={28} /></span>,
    vue: <span className="text-green-400"><FaCode size={28} /></span>,
    powerbi: <span className="text-yellow-500"><FaChartLine size={28} /></span>,
    django: <span className="text-green-600"><FaCode size={28} /></span>,
    java: <span className="text-red-500"><FaCode size={28} /></span>,
    git: <span className="text-orange-500"><FaTools size={28} /></span>,
    figma: <span className="text-pink-500"><FaPuzzlePiece size={28} /></span>,
    api: <span className="text-gray-400"><FaCode size={28} /></span>,
    js: <span className="text-yellow-400"><FaCode size={28} /></span>,
    firebase: <span className="text-orange-500"><FaDatabase size={28} /></span>,
    bootstrap: <span className="text-purple-500"><FaPuzzlePiece size={28} /></span>,
    langchain: <span className="text-cyan-400"><SiLangchain size={28} /></span>,
  };
  return icons[iconName] || <FaCode size={28} />;
};

const categories = [
  { id: "all", name: "All Skills", icon: <FaCode /> },
  { id: "Programming", name: "Programming", icon: <FaCode /> },
  { id: "Framework", name: "Frameworks", icon: <FaPuzzlePiece /> },
  { id: "AI/ML", name: "AI & ML", icon: <SiTensorflow /> },
  { id: "Database", name: "Database", icon: <FaDatabase /> },
  { id: "Visualization", name: "Visualization", icon: <FaChartLine /> },
  { id: "Tools", name: "Tools", icon: <FaTools /> },
  { id: "Design", name: "Design", icon: <FaPuzzlePiece /> },
];

const SkillCard = ({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
      
      <div className="relative glass p-6 rounded-2xl hover:border-purple-500/50 transition-all duration-300 cursor-default">
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-300">
            {getIcon(skill.icon)}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold gradient-text">{skill.level}%</span>
          </div>
        </div>

        {/* Skill Name */}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
          {skill.name}
        </h3>

        {/* Progress Bar */}
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </motion.div>
        </div>

        {/* Category Tag */}
        <div className="mt-4">
          <span className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-gray-500">
            {skill.category}
          </span>
        </div>

        {/* Hover Glow */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSkills = activeCategory === "all" 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="relative py-24 lg:py-32 overflow-hidden">
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
            Tech Arsenal
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            My <span className="gradient-text">Skills</span> & <br className="hidden md:block" />
            <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Technologies I work with to bring ideas to life
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {filteredSkills.map((skill, index) => (
            <SkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </div>

        {/* Skill Categories Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Programming", count: skills.filter(s => s.category === "Programming").length },
            { label: "Frameworks", count: skills.filter(s => s.category === "Framework").length },
            { label: "AI & ML", count: skills.filter(s => s.category === "AI/ML").length },
            { label: "Tools", count: skills.filter(s => s.category === "Tools" || s.category === "Design" || s.category === "Visualization").length },
          ].map((item, index) => (
            <div key={index} className="text-center p-6 glass rounded-2xl">
              <div className="text-4xl font-bold gradient-text mb-2">{item.count}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;