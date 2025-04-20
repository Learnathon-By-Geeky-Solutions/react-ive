import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import PostCard from "./PostCard";
import { useAuth } from "../context/AuthContext";

// Subcomponent for rendering posts
const PostList = ({ posts, isLoading }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p className="text-center text-gray-500">No latest tuition posts available.</p>;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } },
      }}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post) => (
        <motion.div key={post._id} variants={itemVariants}>
          <PostCard
            jobDetails={{
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
            }}
            schedule={{
              days: post.days,
              time: post.time,
              duration: `${post.duration} hour(s)`,
            }}
            userInfo={{
              guardianName: post.userId.name,
              userId: post.userId._id,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

// PropTypes for PostList
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

const LatestTuitionPosts = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const fetchLatestPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3500/post/getAllPosts");
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Failed to fetch latest posts.");
          setLatestPosts([]);
          return;
        }

        const latest = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setLatestPosts(latest);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("An error occurred while fetching posts.");
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
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Latest Tuition Posts
      </motion.h2>

      <motion.hr
        initial={{ width: "0%" }}
        animate={{ width: "19%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="border-t-2 border-purple-600 mx-auto mb-8"
      />

      <PostList posts={latestPosts} isLoading={isLoading} />

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
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