import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import PostCard from "./PostCard";
import { useAuth } from "../context/AuthContext";

// Animation variants for reuse
const animationVariants = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } },
  },
  item: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  },
  hr: {
    initial: { width: "0%" },
    animate: { width: "19%" },
    transition: { duration: 1, ease: "easeInOut" },
  },
};

// Utility to transform post data for PostCard
const transformPostData = (post) => ({
  jobDetails: {
    title: post.name,
    location: post.location,
    medium: post.medium,
    salaryRange: `${post.salary}`,
    experience: `${post.experience} years`,
    classType: post.classtype,
    studentNum: post.studentNum,
    subjects:
      post.subject && post.subject.length > 0
        ? post.subject.map((sub) => sub.name).join(", ")
        : "No subjects listed",
    gender: post.gender,
    deadline: post.deadline,
    jobPostId: post._id,
  },
  schedule: {
    days: post.days,
    time: post.time,
    duration: `${post.duration} hour(s)`,
  },
  userInfo: {
    guardianName: post.userId.name,
    userId: post.userId._id,
  },
});

// PostList subcomponent
const PostList = ({ posts, isLoading }) => {
  if (isLoading) {
    return <p className="text-center text-gray-500">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p className="text-center text-gray-500">No latest tuition posts available.</p>;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={animationVariants.container}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post) => (
        <motion.div key={post._id} variants={animationVariants.item}>
          <PostCard {...transformPostData(post)} />
        </motion.div>
      ))}
    </motion.div>
  );
};

PostList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      location: PropTypes.string,
      userId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
      }),
      medium: PropTypes.string,
      salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      subject: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ),
      classtype: PropTypes.string,
      days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      studentNum: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      gender: PropTypes.string,
      deadline: PropTypes.string,
      time: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ).isRequired,
};

// Service for fetching posts
const fetchLatestPosts = async () => {
  try {
    const response = await fetch("http://localhost:3500/post/getAllPosts");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch latest posts.");
    }

    return data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error(error.message || "An error occurred while fetching posts.");
    return [];
  }
};

// Main component
const LatestTuitionPosts = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const loadPosts = async () => {
      setIsLoading(true);
      const posts = await fetchLatestPosts();
      setLatestPosts(posts);
      setIsLoading(false);
    };

    loadPosts();
  }, [authLoading]);

  return (
    <section className="container mx-auto py-12">
      <motion.h2
        className="text-3xl font-semibold text-center mb-4"
        variants={animationVariants.item}
        initial="hidden"
        animate="visible"
      >
        Latest Tuition Posts
      </motion.h2>

      <motion.hr
        className="border-t-2 border-purple-600 mx-auto mb-8"
        {...animationVariants.hr}
      />

      <PostList posts={latestPosts} isLoading={isLoading} />

      <motion.div
        className="text-center mt-12"
        variants={animationVariants.item}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
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