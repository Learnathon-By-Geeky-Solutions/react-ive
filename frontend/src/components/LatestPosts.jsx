import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostList from "./PostList";
import PropTypes from "prop-types";
import { fetchAllPosts, postPropType } from "./PostUtils";

// Animation variants for title and hr
const animationVariants = {
  title: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  },
  hr: {
    initial: { width: "0%" },
    animate: { width: "19%" },
    transition: { duration: 1, ease: "easeInOut" },
  },
  button: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } },
  },
};

const LatestTuitionPosts = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const loadPosts = async () => {
      setIsLoading(true);
      const posts = await fetchAllPosts();
      const latest = posts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setLatestPosts(latest);
      setIsLoading(false);
    };

    loadPosts();
  }, [authLoading]);

  return (
    <section className="container mx-auto py-12">
      <motion.h2
        className="text-3xl font-semibold text-center mb-4"
        variants={animationVariants.title}
        initial="hidden"
        animate="visible"
      >
        Latest Tuition Posts
      </motion.h2>

      <motion.hr
        className="border-t-2 border-[#3F7CAD] mx-auto mb-8"
        {...animationVariants.hr}
      />

      <PostList posts={latestPosts} isLoading={isLoading} animate={true} />

      <motion.div
        className="text-center mt-12"
        variants={animationVariants.button}
        initial="hidden"
        animate="visible"
      >
        <Link
          to="/posts"
          className="bg-[#3F7CAD] text-white py-3 px-6 rounded-lg hover:bg-[#3F7CAA] transition-colors"
        >
          See More
        </Link>
      </motion.div>
    </section>
  );
};

LatestTuitionPosts.propTypes = {
  posts: PropTypes.arrayOf(postPropType),
};

export default LatestTuitionPosts;