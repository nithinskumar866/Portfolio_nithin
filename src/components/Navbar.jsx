import React, { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import { navLinks, userInfo } from "../constants";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map((link) => document.getElementById(link.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-purple-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("hero");
            }}
            className="relative group"
          >
            <span className="text-2xl font-bold gradient-text tracking-tight">
              NS
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  activeSection === link.id
                    ? "text-purple-400 bg-purple-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.title}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* Social Links & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a
                href={userInfo.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                title="GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a
                href={userInfo.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                title="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
            <a
              href={`mailto:${userInfo.email}`}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            mobileMenuOpen ? "max-h-[500px] mt-4" : "max-h-0"
          }`}
        >
          <div className="bg-[#0a0a0f]/98 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeSection === link.id
                    ? "text-purple-400 bg-purple-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {activeSection === link.id && (
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                )}
                {link.title}
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-white/5">
              <div className="flex items-center justify-center gap-4 mb-4">
                <a
                  href={userInfo.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 transition-all duration-300"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href={userInfo.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 transition-all duration-300"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href={userInfo.links.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-yellow-500/50 transition-all duration-300"
                >
                  <FaCode size={20} />
                </a>
              </div>
              <a
                href={`mailto:${userInfo.email}`}
                className="block w-full text-center px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                Hire Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;