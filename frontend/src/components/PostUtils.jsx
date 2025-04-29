import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { BACKEND_URL } from "../utils/servicesData";

// Transform post data for PostCard
export const transformPostData = (post) => ({
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
    duration: `${post.duration} mins`,
  },
  userInfo: {
    guardianName: post.userId.name,
    userId: post.userId._id,
  },
});

// Fetch all posts from API
export const fetchAllPosts = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/post/getAllPosts`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch posts.");
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error(error.message || "An error occurred while fetching posts.");
    return [];
  }
};

// Shared PropTypes for posts
export const postPropType = PropTypes.shape({
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
});