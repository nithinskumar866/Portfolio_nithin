import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaArrowUp } from "react-icons/fa";
import { userInfo, navLinks } from "../constants";

const Footer = () => {
const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050510] border-t border-white/5">
      {/* Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="#hero" className="inline-block mb-6">
              <span className="text-3xl font-bold gradient-text">NS</span>
            </a>
            <p className="text-gray-500 mb-6 max-w-xs">
              AI & Data Science enthusiast building intelligent solutions and creating impactful digital experiences.
            </p>
            <div className="flex gap-3">
              <motion.a
                href={userInfo.links.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
              >
                <FaGithub />
              </motion.a>
              <motion.a
                href={userInfo.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-sky-500/50 hover:bg-sky-500/10 transition-all duration-300"
              >
                <FaTwitter />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-gray-500 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-purple-500 transition-colors duration-300" />
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              {["Web Development", "Machine Learning", "Data Analysis", "AI Integration", "Consulting"].map((service) => (
                <li key={service}>
                  <a
                    href="#contact"
                    className="text-gray-500 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-purple-500 transition-colors duration-300" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Get In Touch</h4>
            <div className="space-y-4">
              <a
                href={`mailto:${userInfo.email}`}
                className="block text-gray-500 hover:text-purple-400 transition-colors duration-300"
              >
                {userInfo.email}
              </a>
              <p className="text-gray-500">{userInfo.location}</p>
              <a
                href={`mailto:${userInfo.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Let's Talk
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} {userInfo.name}. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                Built with <FaHeart className="text-red-500 animate-pulse" /> using React
              </span>
            </div>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
            >
              Back to Top
              <FaArrowUp />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;