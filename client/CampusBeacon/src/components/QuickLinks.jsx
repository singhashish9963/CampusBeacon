import { motion } from "framer-motion";
import React from "react";
import { Calendar, FileText, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const QuickLinks = () => {
  const links = [
    { icon: Calendar, label: "Academic Calendar", href: "/academic-calendar" },
    { icon: User, label: "Academic Portal", href: "/academic-portal" },
    { icon: FileText, label: "LAN", href: "/lan" },
    { icon: Phone, label: "Contacts", href: "/contacts" },
  ];

  return (
    <div className="py-12 bg-gray-900/1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {links.map((link, index) => (
            <Link 
              key={link.label}
              to={link.href}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 hover:border-pink-500/40 transition-all group"
              >
                <link.icon className="h-8 w-8 text-pink-500 mb-3 group-hover:text-pink-400" />
                <span className="text-base font-medium text-gray-300 group-hover:text-white">
                  {link.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default QuickLinks;
