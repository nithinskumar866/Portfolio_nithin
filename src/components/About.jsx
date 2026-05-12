import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaBrain, FaChartLine, FaHeart, FaEnvelope, FaMapMarkerAlt, FaCode, FaDatabase, FaRobot } from "react-icons/fa";
import { userInfo, achievements } from "../constants";

const About = () => {
  const highlights = [
    { icon: <FaRocket />, title: "Innovative", desc: "Building cutting-edge solutions with modern tech" },
    { icon: <FaBrain />, title: "AI-Driven", desc: "Leveraging ML & AI for intelligent applications" },
    { icon: <FaChartLine />, title: "Data-Focused", desc: "Transforming data into actionable insights" },
    { icon: <FaHeart />, title: "Passionate", desc: "Love for coding and continuous learning" },
  ];

  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
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
            className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-mono uppercase tracking-widest mb-6"
          >
            About Me
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Turning <span className="gradient-text">Data</span> Into <br className="hidden md:block" />
            <span className="gradient-text">Intelligence</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Exploring the intersection of AI, data science, and modern development
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Profile & Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Profile Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative glass p-8 rounded-3xl">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white">
                      NS
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#0a0a0f]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{userInfo.name}</h3>
                    <p className="text-purple-400 font-mono text-sm">{userInfo.role}</p>
                    <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                      <FaMapMarkerAlt className="text-purple-400" />
                      {userInfo.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    {userInfo.description}
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    I specialize in building intelligent systems that bridge the gap between complex algorithms and real-world applications. From blockchain solutions to NLP-powered AI, I'm constantly pushing boundaries.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
                  <a
                    href={`mailto:${userInfo.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    <FaEnvelope />
                    Email Me
                  </a>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {userInfo.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-4 glass rounded-2xl hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Highlights & Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Highlights */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <FaCode className="text-purple-400" />
                </span>
                What I Bring
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group p-5 glass rounded-2xl hover:border-purple-500/30 transition-all duration-300 cursor-default"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all duration-300">
                      <span className="text-2xl text-purple-400">{item.icon}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tech Stack Icons */}
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <FaDatabase className="text-cyan-400" />
                </span>
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Python", "Machine Learning", "Django", "Vue.js", "JavaScript", "SQL", "LangChain", "Firebase", "Power BI", "Git"].map((tech, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:border-purple-500/50 hover:text-purple-400 transition-all duration-300"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <FaRobot className="text-yellow-400" />
                </span>
                Key Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 glass rounded-xl hover:border-yellow-500/30 transition-all duration-300"
                  >
                    <span className="text-2xl">{achievement.split(' ')[0]}</span>
                    <p className="text-gray-400 text-sm">{achievement.substring(achievement.indexOf(' ') + 1)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;