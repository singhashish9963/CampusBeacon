import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  UserCheck,
  Scale,
  Server,
  Globe,
} from "lucide-react";

const PrivacyPolicy = () => {
  const policies = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Data Security",
      description:
        "We employ industry-standard encryption and security measures to protect your personal information.",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Data Collection",
      description:
        "We collect only essential information needed to provide our services and enhance your campus experience.",
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "User Rights",
      description:
        "You have full control over your data with rights to access, modify, or delete your information.",
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "Data Storage",
      description:
        "Your data is stored securely on encrypted servers with regular backups and monitoring.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-black to-black/80" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-500 opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0.5,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-block mb-4"
            >
              <Shield className="w-16 h-16 text-blue-400 mx-auto" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Your privacy is our top priority. Learn how we protect and handle
              your data.
            </p>
          </div>

          {/* Key Privacy Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-blue-900/30 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-blue-400 mb-4"
                >
                  {policy.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {policy.title}
                </h3>
                <p className="text-blue-200">{policy.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Policy Sections */}
          <div className="space-y-12">
            <PolicySection
              title="Information We Collect"
              content="We collect information that you provide directly to us, including but not limited to your name, email address, and student ID. We also automatically collect certain information about your device when you use our platform."
            />

            <PolicySection
              title="How We Use Your Information"
              content="We use the information we collect to provide and improve our services, communicate with you, and ensure platform security. Your data helps us personalize your campus experience and deliver relevant features."
            />

            <PolicySection
              title="Information Sharing"
              content="We do not sell your personal information. We may share your information with third parties only as necessary to provide our services or as required by law."
            />

            <PolicySection
              title="Data Retention"
              content="We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time."
            />

            <PolicySection
              title="Your Rights"
              content="You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data."
            />

            <PolicySection
              title="Updates to This Policy"
              content="We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page."
            />
          </div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center text-blue-200"
          >
            Last updated: February 15, 2025
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const PolicySection = ({ title, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-blue-900/20 backdrop-blur-xl rounded-xl p-8 border border-blue-500/10"
  >
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    <p className="text-blue-200 leading-relaxed">{content}</p>
  </motion.div>
);

export default PrivacyPolicy;
