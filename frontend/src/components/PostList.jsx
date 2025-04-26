import PropTypes from "prop-types";
import { motion } from "framer-motion";
import PostCard from "./PostCard";
import { transformPostData } from "./PostUtils";

// Animation variants
const animationVariants = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } },
  },
  item: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  },
};

const PostList = ({ posts, isLoading, resetFilters, animate = false }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p className="text-xl">No tuition postings found.</p>
        {resetFilters && (
          <button
            onClick={resetFilters}
            className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-all duration-300"
          >
            View All Tuitions
          </button>
        )}
      </div>
    );
  }

  const Container = animate ? motion.div : 'div';
  const Item = animate ? motion.div : 'div';
  const containerProps = animate
    ? {
        variants: animationVariants.container,
        initial: "hidden",
        animate: "visible",
      }
    : {};
  const itemProps = animate ? { variants: animationVariants.item } : {};

  return (
    <Container
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      {...containerProps}
    >
      {posts.map((post) => (
        <Item key={post._id} {...itemProps}>
          <PostCard {...transformPostData(post)} />
        </Item>
      ))}
    </Container>
  );
};

PostList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // Will be overridden by postPropType
  resetFilters: PropTypes.func,
  animate: PropTypes.bool,
};

export default PostList;