import React from "react";
import { motion } from "framer-motion";
import { experiences } from "../constants";
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaLaptopCode } from "react-icons/fa";

const TimelineItem = ({ experience, index, isLast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative flex flex-col md:flex-row gap-8 ${
        index % 2 === 0 ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Timeline Line & Dot */}
      <div className="flex flex-row md:flex-col items-center md:w-1/2 md:pr-12">
        {!isLast && (
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-transparent transform -translate-x-1/2" />
        )}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
          className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
        >
          <FaBriefcase className="text-white" size={20} />
        </motion.div>
        {isLast && (
          <div className="absolute left-1/2 top-16 w-0.5 h-8 bg-gradient-to-b from-purple-500 to-transparent transform -translate-x-1/2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 md:w-1/2 md:pl-12">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="group relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/50 to-cyan-500/50 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          
          <div className="relative glass p-8 rounded-3xl hover:border-purple-500/50 transition-all duration-300">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 mb-1">
                  {experience.title}
                </h3>
                <p className="text-purple-400 font-semibold">{experience.company}</p>
              </div>
              {experience.featured && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-purple-400" />
                <span>{experience.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-cyan-400" />
                <span>{experience.location}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-6">
              {experience.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, techIndex) => (
                <motion.span
                  key={techIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:border-purple-500/50 hover:text-purple-400 transition-colors duration-300"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-mono uppercase tracking-widest mb-6"
          >
            Career Journey
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            My hands-on experience in building real-world applications
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-12 md:space-y-16">
          {experiences.map((experience, index) => (
            <TimelineItem
              key={index}
              experience={experience}
              index={index}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: <FaLaptopCode />, value: "3+", label: "Internships" },
            { icon: <FaBriefcase />, value: "6+", label: "Projects Built" },
            { icon: <FaCalendarAlt />, value: "1.5+", label: "Years Experience" },
            { icon: <FaMapMarkerAlt />, value: "2", label: "Locations" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 glass rounded-2xl group hover:border-cyan-500/30 transition-all duration-300">
              <div className="w-14 h-14 mx-auto rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all duration-300">
                <span className="text-2xl text-cyan-400">{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;