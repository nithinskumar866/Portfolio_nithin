import React, { useState } from "react";
import { motion } from "framer-motion";
import { userInfo } from "../constants";
import { FaEnvelope, FaPhone, FaMapMarker, FaGithub, FaLinkedin, FaTwitter, FaPaperPlane, FaCheckCircle, FaArrowRight } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: userInfo.email,
      link: `mailto:${userInfo.email}`,
      color: "purple",
    },
    {
      icon: <FaPhone />,
      label: "Phone",
      value: userInfo.phone,
      link: `tel:+91${userInfo.phone}`,
      color: "cyan",
    },
    {
      icon: <FaMapMarker />,
      label: "Location",
      value: userInfo.location,
      link: "#",
      color: "green",
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub />,
      label: "GitHub",
      url: userInfo.links.github,
      color: "hover:text-white hover:border-gray-500 hover:bg-gray-500/10",
    },
    {
      icon: <FaLinkedin />,
      label: "LinkedIn",
      url: userInfo.links.linkedin,
      color: "hover:text-blue-400 hover:border-blue-500 hover:bg-blue-500/10",
    },
    {
      icon: <FaTwitter />,
      label: "Twitter",
      url: "#",
      color: "hover:text-sky-400 hover:border-sky-500 hover:bg-sky-500/10",
    },
  ];

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
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
            Get In Touch
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'm just one message away!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="group flex items-center gap-6 p-6 glass rounded-2xl hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl ${
                    info.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                    info.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-green-500/20 text-green-400'
                  } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{info.label}</p>
                    <p className="text-white font-semibold">{info.value}</p>
                  </div>
                  <FaArrowRight className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-2 transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-6">Connect on Social</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 transition-all duration-300 ${social.color}`}
                  >
                    <span className="text-xl">{social.icon}</span>
                    {social.label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-4">Quick Response</h3>
              <p className="text-gray-400 mb-4">
                I typically respond within 24 hours. For urgent matters, feel free to reach out directly via email or phone.
              </p>
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                Usually responds within 24 hours
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl blur opacity-20" />
              
              <div className="relative glass p-8 md:p-10 rounded-3xl">
                <h3 className="text-2xl font-bold text-white mb-8">Send a Message</h3>
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                      <FaCheckCircle className="text-green-400 text-4xl" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                    <p className="text-gray-400">Thanks for reaching out. I'll get back to you soon!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Your Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Subject</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                        placeholder="Project Collaboration"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
                        placeholder="Tell me about your project..."
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;