import React from "react";
import { motion } from "framer-motion";
import {
  Scale,
  FileCheck,
  AlertCircle,
  Shield,
  Users,
  Ban,
  CheckCircle,
  XCircle,
} from "lucide-react";

const TermsOfService = () => {
  const keyPoints = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Agreement to Terms",
      description:
        "By accessing our platform, you agree to be bound by these terms.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy Protection",
      description:
        "Your use of our service is also governed by our Privacy Policy.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User Conduct",
      description: "Users must follow community guidelines and respect others.",
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Liability",
      description:
        "Understanding our liability limitations and your responsibilities.",
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
              <Scale className="w-16 h-16 text-blue-400 mx-auto" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Please read these terms carefully before using CampusBeacon.
            </p>
          </div>

          {/* Key Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {keyPoints.map((point, index) => (
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
                  {point.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {point.title}
                </h3>
                <p className="text-blue-200">{point.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Terms Sections */}
          <div className="space-y-12">
            <TermsSection
              title="1. Acceptance of Terms"
              content="By accessing and using CampusBeacon, you accept and agree to be bound by the terms and provision of this agreement."
            />

            <TermsSection
              title="2. User Registration"
              content="Users must provide accurate, current, and complete information during the registration process and update such information to keep it accurate."
            />

            <TermsSection
              title="3. User Conduct"
              content="Users agree not to engage in any activity that interferes with or disrupts the Services or servers and networks connected to the Services."
            />

            <TermsSection
              title="4. Intellectual Property"
              content="The Service and its original content, features, and functionality are owned by CampusBeacon and are protected by international copyright, trademark, and other intellectual property laws."
            />

            <TermsSection
              title="5. Termination"
              content="We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever."
            />

            <TermsSection
              title="6. Limitations of Liability"
              content="In no event shall CampusBeacon, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages."
            />

            <TermsSection
              title="7. Changes to Terms"
              content="We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page."
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

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions or Concerns?
            </h2>
            <p className="text-blue-200">
              Please contact us at{" "}
              <a
                href="mailto:support@campusbeacon.com"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                support@campusbeacon.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const TermsSection = ({ title, content }) => (
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

export default TermsOfService;
