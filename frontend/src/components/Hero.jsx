import { Link } from 'react-router-dom';
import { delay, motion } from 'framer-motion';

const Hero = () => {
  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: 'easeInOut' ,delay: 0.1} }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: 'easeInOut' , delay: 0.1} }
  };

  return (
    <section className="container mx-auto py-12 flex flex-col md:flex-row items-center justify-between">
      <motion.div
        className="md:w-1/2"
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-bold mb-4">
        Your Trusted Platform to Find DU Tutors & Tuitions
        </h2>
        <p className="mb-6 text-gray-600">
          DUTutors connects Tutor seekers (Guardians / Students) with DU Students quickly and easily. It’s a platform designed to make finding tuition or hiring tutors simple and straightforward. Whether you're looking for tutoring or hiring, DUTutors helps you get it done.
        </p>
        <Link
          to="/posts"
          className="bg-customm text-white py-3 px-6 rounded-md hover:bg-[rgba(62,7,181,1)]"
        >
          Explore Tuition Posts
        </Link>
      </motion.div>
      <motion.div
        className="md:w-1/3"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
      >
        <img
          src="./imageHome.jpg"
          alt="Tuition Post"
          className="rounded-md shadow-md"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
