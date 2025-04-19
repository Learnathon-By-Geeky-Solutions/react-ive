import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LatestTuitionPosts = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loading: authLoading } = useAuth();

  // Define animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2, delayChildren: 0.4 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  useEffect(() => {
    if (authLoading) return; // Wait for auth to resolve

    const fetchLatestPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3500/post/getAllPosts');
        const data = await response.json();

        if (!response.ok) {
          console.error('Error fetching posts:', data.error);
          setLatestPosts([]);
          return;
        }

        const latest = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setLatestPosts(latest);
      } catch (error) {
        console.error('Fetch error:', error);
        setLatestPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPosts();
  }, [authLoading]);

  return (
    <section className="container mx-auto py-12">
      <motion.h2
        className="text-3xl font-semibold text-center mb-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Latest Tuition Posts
      </motion.h2>

      <motion.hr
        initial={{ width: '0%' }}
        animate={{ width: '19%' }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="border-t-2 border-purple-600 mx-auto mb-8"
      />

      {isLoading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <motion.div key={post._id} variants={itemVariants}>
                <PostCard
                  title={post.name}
                  userId={post.userId._id}
                  location={post.location}
                  position={post.classtype}
                  companyName={post.userId.name}
                  salaryRange={post.salary}
                  experience={post.experience}
                  skills={post.subject.map((subject) => subject.name).join(', ') || ''}
                  jobPostId={post._id}
                  deadline={post.deadline}
                  medium={post.medium}
                  days={post.days}
                  duration={post.duration}
                  studentNum={post.studentNum}
                  gender={post.gender}
                  time={post.time}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500">No latest tuition posts available.</p>
          )}
        </motion.div>
      )}

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
      >
        <Link
          to="/posts"
          className="bg-[rgb(97,27,248)] text-white py-3 px-6 rounded-lg hover:bg-[rgb(62,7,181)] transition-colors"
        >
          See More
        </Link>
      </motion.div>
    </section>
  );
};

export default LatestTuitionPosts;