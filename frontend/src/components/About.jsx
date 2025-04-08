import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gray-50 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(#611bf8 0.5px, transparent 0.5px), radial-gradient(#611bf8 0.5px, #f9fafb 0.5px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
            opacity: 0.05,
          }}
        ></div>
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Section title with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            About Us
          </h2>

          {/* Animated HR divider */}
          <motion.hr
            className="border-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mt-4"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 224, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ maxWidth: "224px" }}
          />
        </motion.div>

        {/* Content with two columns for larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left column with illustration */}
          <motion.div
            className="md:col-span-5 flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-200 to-indigo-100 opacity-50 blur-lg"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-lg">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                  whileInView={{
                    opacity: [0, 1],
                    rotateY: [5, 0],
                    filter: ["blur(4px)", "blur(0px)"],
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                >
                  <img
                    src="../img2.jpeg"
                    alt="Job connections illustration"
                    className="w-full h-auto rounded"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right column with text content */}
          <motion.div
            className="md:col-span-7"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At DU Tutors, we believe in simplifying the way tuition opportunities are shared and accessed within 
              the Dhaka University community. Our platform connects students in need of tuition with capable DU tutors 
              in a seamless and reliable way.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Whether you're looking for the right tutor or a meaningful teaching opportunity, DU TuitionLink makes the 
              process smooth, efficient, and student-focused.
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border-l-4 border-purple-600">
              <p className="text-lg font-medium text-gray-800">
              We are committed to creating a trusted space where learning and teaching go hand in hand, helping DU students 
              grow—both academically and professionally.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-4xl font-bold text-purple-600 mb-2">15K+</p>
            <p className="text-gray-600">Active Job Seekers</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-4xl font-bold text-purple-600 mb-2">5K+</p>
            <p className="text-gray-600">Companies</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-4xl font-bold text-purple-600 mb-2">98%</p>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
