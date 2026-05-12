import React from "react";
import { motion } from "framer-motion";
import { certificates } from "../constants";
import { FaAward, FaExternalLinkAlt, FaCheckCircle, FaGraduationCap } from "react-icons/fa";

const CertificateCard = ({ cert, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600/50 to-orange-500/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      
      <div className="relative glass p-6 rounded-2xl hover:border-yellow-500/30 transition-all duration-300">
        {/* Badge */}
        <div className="absolute -top-3 -right-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <FaAward className="text-white" size={18} />
          </div>
        </div>

        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <FaGraduationCap className="text-yellow-400 text-2xl" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
          {cert.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500">
            {cert.issuer}
          </span>
          <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500">
            {cert.date}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <FaCheckCircle className="text-green-400" />
          <span>Verified</span>
          <span className="mx-1">•</span>
          <span className="font-mono text-xs">ID: {cert.credentialId}</span>
        </div>

        {/* Link */}
        <a
          href={cert.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
        >
          View Certificate
          <FaExternalLinkAlt size={12} />
        </a>
      </div>
    </motion.div>
  );
};

const Certificates = () => {
  return (
    <section id="certificates" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/5 to-transparent" />
      
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
            className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-mono uppercase tracking-widest mb-6"
          >
            Accomplishments
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Professional <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Credentials that validate my expertise and commitment to learning
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certificates.map((cert, index) => (
            <CertificateCard key={index} cert={cert} index={index} />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "8+", label: "Certifications" },
            { value: "4+", label: "Platforms" },
            { value: "2023-24", label: "Period" },
            { value: "100%", label: "Verified" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 glass rounded-2xl group hover:border-yellow-500/30 transition-all duration-300">
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 mb-4">Want to verify my credentials?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.datacamp.com/profile/nithinsofficial86"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 hover:border-yellow-500/50 transition-all duration-300"
            >
              <FaAward className="text-yellow-400" />
              DataCamp Profile
            </a>
            <a
              href="https://www.linkedin.com/in/nithin-s-52292b278"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300"
            >
              <FaGraduationCap className="text-blue-400" />
              LinkedIn Certifications
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certificates;