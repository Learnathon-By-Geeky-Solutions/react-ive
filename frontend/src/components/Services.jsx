import { Link, useNavigate } from 'react-router-dom';
import { servicesData } from '../utils/servicesData.js';
import { motion } from 'framer-motion';

const Services = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2, delayChildren: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <section className="container mx-auto py-12">
      <motion.h2 
        className="text-3xl font-semibold text-center mb-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        Services
      </motion.h2>

      {/* Stunning HR line with animation on view */}
      <motion.hr
        initial={{ width: "0%" }}
        whileInView={{ width: "19%" }} // Set the final width when in view
        transition={{ duration: 1, ease: "easeInOut" }}
        className="border-t-2 border-purple-600 mx-auto mb-8"
        viewport={{ once: true }} // Animation triggers only once when in view
      />
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"  // Animation will trigger when the container comes into the viewport
        viewport={{ once: false, amount: 0.2 }} // Start the animation when 20% of the container is in view
      >
        {servicesData.map((service, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-md shadow-md border border-gray-200 flex flex-col items-center text-center relative group"
            variants={itemVariants}
            onClick={()=>navigate(service.link)}
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            {/* <Link
              to={service.link}
              className="bg-customm text-white py-2 px-4 rounded-md hover:bg-[rgba(62,7,181,1)]"
            >
              Explore
            </Link> */}
            <div className="w-[20%] h-1 bg-purple-600 mt-4 transition-all duration-300 ease-in-out group-hover:w-[30%]"></div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Services;
