import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard'; // Assuming PostCard is imported from your code
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const LatestJobPosts = () => {
  const [latestJobs, setLatestJobs] = useState([]);
  const {user} = useAuth();
  // Define animation variants
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
  const userType = user?.userType;


  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const response = await fetch('http://localhost:3500/post/getAllPosts');
        const data = await response.json();
        let filteredData = data;
        
        // If current user is a Company, filter to show only their own job posts
        if (userType === 'guardian') {
          filteredData = data.filter(job => job.user.name === user.name);
        }
        const latest = filteredData.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6);
        if (response.ok) {
          setLatestJobs(latest);
        } else {
          console.error('Error fetching latest job posts:', data.error);
        }
      } catch (error) {
        console.error('Error fetching job posts:', error);
      }
    };

    fetchLatestJobs();
  }, [user, userType]);

  return (
    <section className="container mx-auto py-12">
      <motion.h2
        className="text-3xl font-semibold text-center mb-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Latest Tution Posts
      </motion.h2>

      {/* Stunning HR line */}
      <motion.hr
        initial={{ width: "0%" }}
        animate={{ width: "19%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="border-t-2 border-purple-600 mx-auto mb-8"
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {latestJobs.length > 0 ? (
          latestJobs.map((job) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
            >
              <PostCard
                title={job.name}
                userId={job.userId._id}
                location={job.location}
                position={job.position}
                companyName={job.userId.name}
                salaryRange={job.salary}
                experience={job.experience}
                skills={job.skills.map((skill) => skill.skill.name).join(', ')||""}
                jobPostId={job._id}
                deadline={job.deadline}
              />
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No latest job posts available.</p>
        )}
      </motion.div>

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
      >
        <Link to="/posts" className="bg-[rgb(97,27,248)] text-white py-3 px-6 rounded-lg hover:bg-[rgb(62,7,181)] transition-colors">
          See More
        </Link>
      </motion.div>
    </section>
  );
};

export default LatestJobPosts;
