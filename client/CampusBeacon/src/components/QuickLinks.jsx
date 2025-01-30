import { motion } from "framer-motion";
import React from "react";
import { Calendar, FileText, User, Phone } from "lucide-react";

const QuickLinks = () => {
  // Define the links array with href
  const links = [
    { icon: Calendar, label: "Academic Calendar", href: "/academic-calendar" },
    { icon: User, label: "Academic Portal", href: "/academic-portal" },
    { icon: FileText, label: "LAN", href: "/lan" },
    { icon: Phone, label: "Contacts", href: "/contacts" },
  ];

  return (
    <div className="py-24 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {links.map((link, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center space-y-4 p-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 hover:border-pink-500/40 transition-all"
            >
              <a href={link.href}>
                <link.icon className="h-10 w-10 text-pink-500" />
                <span className="text-lg text-gray-300">{link.label}</span>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default QuickLinks;
