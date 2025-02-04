import { motion } from "framer-motion";
import React from "react";
import { Calendar, FileText, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const QuickLinks = () => {
  const links = [
    { icon: Calendar, label: "Academic Calendar", href: "https://drive.google.com/file/d/1yYKlN_WktRy2SQYdSaAr-8R42w3wGnTs/view?usp=sharing" },
    { icon: User, label: "Academic Portal", href: "https://www.academics.mnnit.ac.in/new" },
    { icon: FileText, label: "LAN Information", href: "/" },
    { icon: Phone, label: "Resource Hub", href: "/" },
    { icon: User, label: "Contacts", href: "/" },
  ];

  return (
    <div className="py-12 bg-gray-900/1">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols- lg:grid-cols-5 gap-8"
        >
          {links.map((link, index) => (
            <Link 
              key={link.label}
              to={link.href}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.25 }}
                className="flex flex-col items-center justify-center p-7 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 hover:border-pink-500/50 transition-all group"
              >
                <link.icon className="h-8 w-8 text-pink-500 mb-3 group-hover:text-pink-400" />
                <span className="text-base font-medium md:font-large text-gray-300 group-hover:text-white">
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
